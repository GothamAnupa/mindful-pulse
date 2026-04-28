import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upcpdbormlowaabbqdap.supabase.co';

// This needs to be your real anon key from Supabase → Settings → API
// It should start with "eyJ..."
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseKey.startsWith('eyJ') && !supabaseKey.includes('placeholder');
};