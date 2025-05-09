
import { useState, useEffect } from 'react';
import { supabase, subscribeToTable } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MessageStatus = 'read' | 'unread';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
  replied: boolean;
}

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setMessages(data as ContactMessage[]);
      }
    } catch (err: any) {
      console.error('Error fetching contact messages:', err);
      setError(err.message);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Optimistically update the state
      setMessages(prev => prev.map(message => 
        message.id === id ? { ...message, status: 'read' as MessageStatus } : message
      ));
      
      toast.success('Message marked as read');
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      toast.error('Failed to update message status');
    }
  };

  // Send reply to message
  const sendReply = async (id: string, replyText: string) => {
    if (!replyText.trim()) {
      toast.error('Reply text cannot be empty');
      return;
    }
    
    try {
      // In a real app, you would send an email here
      // For now, just mark as replied in the database
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          replied: true,
          status: 'read' 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Optimistically update the state
      setMessages(prev => prev.map(message => 
        message.id === id ? { ...message, replied: true, status: 'read' as MessageStatus } : message
      ));
      
      toast.success('Reply sent successfully');
      return true;
    } catch (err: any) {
      console.error('Error sending reply:', err);
      toast.error('Failed to send reply');
      return false;
    }
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const unsubscribe = subscribeToTable('contact_messages', '*', (payload) => {
      console.log('Contact messages changed:', payload);
      fetchMessages();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    messages,
    loading,
    error,
    markAsRead,
    sendReply,
    formatDate,
    refreshMessages: fetchMessages
  };
};
