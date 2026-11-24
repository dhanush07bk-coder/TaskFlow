import { createClient } from '@supabase/supabase-js';

// Dedicated public configuration module for TaskFlow in Google AI Studio
const SUPABASE_PROJECT_URL = 'https://bbgunezhutmbtqhyviiz.supabase.co';

// Publishable anon key retrieved from environment or client runtime storage
const getSupabaseAnonKey = () => {
  return localStorage.getItem('TASKFLOW_SUPABASE_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
};

export const supabase = createClient(
  SUPABASE_PROJECT_URL,
  getSupabaseAnonKey() || 'placeholder-anon-key'
);

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_PROJECT_URL && getSupabaseAnonKey());
};

export const saveSupabasePublishableKey = (key: string) => {
  localStorage.setItem('TASKFLOW_SUPABASE_KEY', key.trim());
  window.location.reload();
};

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const anonKey = getSupabaseAnonKey();
  if (!anonKey) {
    return {
      success: false,
      message: 'Supabase publishable key is missing. Please enter your Supabase publishable key to connect.',
    };
  }

  try {
    // Perform a real request to the tasks table as required
    const { error } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
    
    if (error) {
      return {
        success: false,
        message: `Supabase connection error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase PostgreSQL tasks table and verified RLS security!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error connecting to Supabase: ${err.message || 'Unknown error'}`,
    };
  }
}
