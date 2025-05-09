
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = async (userId: string) => {
    try {
      setLoading(true);
      // Check if user has admin role in user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }

      // User is admin if we found a matching role
      setIsAdmin(!!data);
    } catch (err: any) {
      console.error('Error checking admin status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to create admin role for current user
  const createAdminRole = async () => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      // Add current user as admin for testing purposes
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: user.id,
          role: 'admin'
        });
        
      if (error) throw error;

      // After successful creation, update the admin status
      await checkAdminStatus(user.id);
      
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error creating admin role:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      
      if (currentUser) {
        checkAdminStatus(currentUser.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Initial auth check
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error('Error getting user:', error);
        setLoading(false);
        return;
      }

      if (data.user) {
        setUser(data.user);
        checkAdminStatus(data.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading, error, createAdminRole };
}
