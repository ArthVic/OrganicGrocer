import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase client configuration
const SUPABASE_URL = "https://qiapaaphtydefbxejtpd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYXBhYXBodHlkZWZieGVqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTczNzUsImV4cCI6MjA2MjAzMzM3NX0.3W-JY-DkWk77RUOgU6JOjxNzm6jBhEuvEA3BmCEN1D8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage
    }
  }
);

// Helper function to subscribe to real-time changes
export const subscribeToTable = <
  TableName extends keyof Database['public']['Tables']
>(
  tableName: TableName, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new?: Database['public']['Tables'][TableName]['Row'];
    old?: Partial<Database['public']['Tables'][TableName]['Row']>;
  }) => void
) => {
  const channel = supabase
    .channel(`table-changes-${tableName}`)
    .on(
      'postgres_changes' as any, // Temporary type assertion to bypass TS error
      { 
        event,
        schema: 'public',
        table: tableName
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
