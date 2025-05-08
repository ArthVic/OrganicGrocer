
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  phone: string | null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    if (user) {
      // Set up realtime subscription for profile updates
      const channel = supabase
        .channel(`profile-changes-${user.id}`)
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            setProfile(payload.new as Profile);
          })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      // Profile will update automatically via the realtime subscription
    } catch (err: any) {
      toast.error(`Error updating profile: ${err.message}`);
      console.error('Error updating profile:', err);
    }
  };

  return {
    profile,
    loading,
    updateProfile
  };
};
