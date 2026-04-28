import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upcpdbormlowaabbqdap.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3BkYm9ybWxvd2FhYmJxZGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNTY5NjYsImV4cCI6MjA2MzYzMTk2Nn0.placeholder';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  useLocalStorage: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: true,
      useLocalStorage: true,

      checkAuth: async () => {
        const currentUser = localStorage.getItem('pulse_current_user');
        
        if (currentUser) {
          const user = JSON.parse(currentUser);
          set({ isAuthenticated: true, user, loading: false });
        } else {
          set({ loading: false });
        }
        
        // Try Supabase but don't fail if it doesn't work
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userData) {
              localStorage.setItem('pulse_current_user', JSON.stringify(userData));
              set({ isAuthenticated: true, user: userData as User, useLocalStorage: false });
            }
          }
        } catch (e) {
          console.log('Using local storage for auth');
        }
      },

      login: async (email: string, password: string) => {
        // Check local users first
        const storedUsers = JSON.parse(localStorage.getItem('pulse_users') || '[]');
        const foundUser = storedUsers.find((u: any) => u.email === email && u.password === btoa(password));
        
        if (foundUser) {
          const user = { id: foundUser.id, email: foundUser.email, name: foundUser.name, created_at: foundUser.createdAt };
          localStorage.setItem('pulse_current_user', JSON.stringify(user));
          set({ isAuthenticated: true, user, useLocalStorage: true });
          return true;
        }
        
        // Try Supabase
        try {
          const { data } = await supabase.auth.signInWithPassword({ email, password });
          if (data?.user) {
            const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).single();
            if (userData) {
              localStorage.setItem('pulse_current_user', JSON.stringify(userData));
              set({ isAuthenticated: true, user: userData as User, useLocalStorage: false });
              return true;
            }
          }
        } catch (e) {
          console.log('Supabase login failed, trying local');
        }
        
        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        // Check if user exists locally
        const storedUsers = JSON.parse(localStorage.getItem('pulse_users') || '[]');
        
        if (storedUsers.find((u: any) => u.email === email)) {
          return false;
        }
        
        // Create local user
        const newUser = {
          id: crypto.randomUUID(),
          email,
          password: btoa(password),
          name,
          createdAt: new Date().toISOString()
        };
        
        storedUsers.push(newUser);
        localStorage.setItem('pulse_users', JSON.stringify(storedUsers));
        
        const user = { id: newUser.id, email: newUser.email, name: newUser.name, created_at: newUser.createdAt };
        localStorage.setItem('pulse_current_user', JSON.stringify(user));
        
        set({ isAuthenticated: true, user, useLocalStorage: true });
        
        // Try Supabase but don't fail
        try {
          const { data: supabaseData } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
          if (supabaseData?.user) {
            await supabase.from('users').insert({ id: supabaseData.user.id, email, name });
            set({ useLocalStorage: false });
          }
        } catch (e) {
          console.log('Using local storage');
        }
        
        return true;
      },

      logout: () => {
        localStorage.removeItem('pulse_current_user');
        set({ isAuthenticated: false, user: null, useLocalStorage: true });
      }
    }),
    { name: 'pulse-auth' }
  )
);