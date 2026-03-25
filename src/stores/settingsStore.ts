import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsStore extends Settings {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      checkInFrequency: 'twice',
      snoozeDuration: 30,
      notificationStyle: 'encouraging',
      soundEnabled: true,
      defaultTimerDuration: 25,
      isSettingsOpen: false,

      openSettings: () => set({ isSettingsOpen: true }),
      closeSettings: () => set({ isSettingsOpen: false }),
      updateSettings: (updates) => set((state) => ({ ...state, ...updates }))
    }),
    {
      name: 'pulse-settings'
    }
  )
);
