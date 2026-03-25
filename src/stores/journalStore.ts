import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'struggling';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface JournalStore {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, content: string) => void;
  deleteEntry: (id: string) => void;
  getTodayEntry: () => JournalEntry | undefined;
  getEntriesByDate: (date: string) => JournalEntry[];
  getRecentEntries: (limit?: number) => JournalEntry[];
}

export const useJournalStore = create<JournalStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entryData) => {
        const newEntry: JournalEntry = {
          ...entryData,
          id: uuid(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      updateEntry: (id, content) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, content, updatedAt: new Date() }
              : entry
          )
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id)
        }));
      },

      getTodayEntry: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().entries.find((entry) => entry.date === today);
      },

      getEntriesByDate: (date) => {
        return get().entries.filter((entry) => entry.date === date);
      },

      getRecentEntries: (limit = 7) => {
        return get().entries.slice(0, limit);
      }
    }),
    {
      name: 'pulse-journal'
    }
  )
);
