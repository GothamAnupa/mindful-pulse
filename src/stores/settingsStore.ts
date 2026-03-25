import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsStore extends Settings {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  updateNotificationPreferences: (updates: Partial<Settings['notifications']>) => void;
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
      notifications: {
        enabled: false,
        taskReminders: true,
        habitReminders: true,
        dailyCheckIn: true,
        weeklyInsights: true,
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00'
      },

      openSettings: () => set({ isSettingsOpen: true }),
      closeSettings: () => set({ isSettingsOpen: false }),
      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),
      updateNotificationPreferences: (updates) => 
        set((state) => ({ 
          notifications: { ...state.notifications, ...updates } 
        }))
    }),
    {
      name: 'pulse-settings'
    }
  )
);
