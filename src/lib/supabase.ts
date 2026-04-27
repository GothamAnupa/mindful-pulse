import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upcpdbormlowaabbqdap.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3BkYm9ybWxvd2FhYmJxZGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNTY5NjYsImV4cCI6MjA2MzYzMTk2Nn0.Publishable_Key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}