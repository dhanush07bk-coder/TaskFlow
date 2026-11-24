
import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL =
  'https://bbgunezhutmbtqhyviiz.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_PROJECT_URL && SUPABASE_ANON_KEY);
};

if (!SUPABASE_ANON_KEY) {
  console.error('TaskFlow: Supabase publishable key is missing.');
}

export const supabase = createClient(
  SUPABASE_PROJECT_URL,
  SUPABASE_ANON_KEY || 'missing-key'
);

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase publishable key is missing. Check .env.local.',
    };
  }

  try {
    const { error } = await supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return {
        success: false,
        message: `Supabase connection error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase!',
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'
        }`,
    };
  }
}
