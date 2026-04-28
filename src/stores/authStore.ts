import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ 
          isAuthenticated: true, 
          user: userData as User,
          loading: false 
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.log('Auth check - showing login');
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        console.log('Login failed:', error?.message);
        return false;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ isAuthenticated: true, user: userData as User });
      return true;
    } catch (error) {
      console.log('Login error');
      return false;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });

      if (error || !data.user) {
        console.log('Signup failed:', error?.message);
        return false;
      }

      await supabase.from('users').insert({
        id: data.user.id,
        email,
        name
      });

      set({ 
        isAuthenticated: true, 
        user: { 
          id: data.user.id, 
          email, 
          name, 
          created_at: new Date().toISOString() 
        }
      });
      return true;
    } catch (error) {
      console.log('Signup error');
      return false;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null });
  }
}));