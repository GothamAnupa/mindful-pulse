import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnergyLevel } from '../types';

interface EnergyStore {
  level: EnergyLevel;
  lastCheckIn: Date | null;
  checkInHistory: { level: EnergyLevel; timestamp: Date }[];
  setEnergy: (level: EnergyLevel) => void;
  checkIn: (level: EnergyLevel, note?: string) => void;
  shouldPromptCheckIn: () => boolean;
  snoozeCheckIn: () => void;
  snoozedUntil: Date | null;
}

export const useEnergyStore = create<EnergyStore>()(
  persist(
    (set, get) => ({
      level: 'focused',
      lastCheckIn: null,
      checkInHistory: [],
      snoozedUntil: null,

      setEnergy: (level) => set({ level }),

      checkIn: (level, _note?: string) => {
        const now = new Date();
        set((state) => ({
          level,
          lastCheckIn: now,
          checkInHistory: [
            ...state.checkInHistory.slice(-30),
            { level, timestamp: now }
          ],
          snoozedUntil: null
        }));
      },

      shouldPromptCheckIn: () => {
        const state = get();
        if (!state.lastCheckIn) return true;
        
        const now = new Date();
        const hoursSinceCheckIn = (now.getTime() - state.lastCheckIn.getTime()) / (1000 * 60 * 60);
        
        if (state.snoozedUntil && state.snoozedUntil > now) return false;
        
        if (hoursSinceCheckIn >= 4) return true;
        
        const currentHour = now.getHours();
        if (currentHour >= 14 && state.level === 'focused') return true;
        
        return false;
      },

      snoozeCheckIn: () => {
        const snoozeUntil = new Date(Date.now() + 30 * 60 * 1000);
        set({ snoozedUntil: snoozeUntil });
      }
    }),
    {
      name: 'pulse-energy',
      onRehydrateStorage: () => (state) => {
        if (state && !state.level) {
          state.level = 'focused';
        }
      }
    }
  )
);
