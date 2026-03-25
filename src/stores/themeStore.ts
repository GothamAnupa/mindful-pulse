import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: () => boolean;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'auto',

      setTheme: (theme) => set({ theme }),

      isDark: () => {
        const { theme } = get();
        if (theme === 'dark') return true;
        if (theme === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }),
    {
      name: 'pulse-theme'
    }
  )
);
