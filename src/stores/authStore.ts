import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateName: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      login: async (email: string, password: string) => {
        if (!email || !password) return false;
        
        const storedUsers = JSON.parse(localStorage.getItem('pulse_users') || '[]');
        const foundUser = storedUsers.find((u: any) => u.email === email && u.password === btoa(password));
        
        if (foundUser) {
          set({ 
            isAuthenticated: true, 
            user: { 
              id: foundUser.id, 
              email: foundUser.email, 
              name: foundUser.name,
              createdAt: foundUser.createdAt
            } 
          });
          return true;
        }
        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        if (!email || !password || !name) return false;
        
        const storedUsers = JSON.parse(localStorage.getItem('pulse_users') || '[]');
        
        if (storedUsers.find((u: any) => u.email === email)) {
          return false;
        }
        
        const newUser = {
          id: crypto.randomUUID(),
          email,
          password: btoa(password),
          name,
          createdAt: new Date().toISOString()
        };
        
        storedUsers.push(newUser);
        localStorage.setItem('pulse_users', JSON.stringify(storedUsers));
        
        set({ 
          isAuthenticated: true, 
          user: { 
            id: newUser.id, 
            email: newUser.email, 
            name: newUser.name,
            createdAt: new Date(newUser.createdAt)
          } 
        });
        return true;
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      updateName: (name: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, name } });
          
          const storedUsers = JSON.parse(localStorage.getItem('pulse_users') || '[]');
          const updatedUsers = storedUsers.map((u: any) => 
            u.id === currentUser.id ? { ...u, name } : u
          );
          localStorage.setItem('pulse_users', JSON.stringify(updatedUsers));
        }
      }
    }),
    {
      name: 'pulse-auth'
    }
  )
);