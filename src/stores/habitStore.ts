import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetDays: number[]; // 0 = Sunday, 6 = Saturday
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ISO date strings
  createdAt: Date;
}

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt'>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitComplete: (id: string, date: string) => void;
  isHabitCompletedToday: (id: string) => boolean;
  getTodayProgress: () => { completed: number; total: number };
  getAllStreaks: () => { current: number; best: number };
}

const defaultHabits: Habit[] = [
  {
    id: uuid(),
    name: 'Morning Meditation',
    icon: '🧘',
    color: '#8B5CF6',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date()
  },
  {
    id: uuid(),
    name: 'Drink 8 Glasses of Water',
    icon: '💧',
    color: '#06B6D4',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date()
  },
  {
    id: uuid(),
    name: 'Exercise',
    icon: '🏃',
    color: '#10B981',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date()
  },
  {
    id: uuid(),
    name: 'Read for 30 minutes',
    icon: '📚',
    color: '#F59E0B',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    createdAt: new Date()
  }
];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: defaultHabits,

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: uuid(),
          streak: 0,
          bestStreak: 0,
          completedDates: [],
          createdAt: new Date()
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
      },

      deleteHabit: (id) => {
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
      },

      toggleHabitComplete: (id, date) => {
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;

            const isCompleted = habit.completedDates.includes(date);
            const newDates = isCompleted
              ? habit.completedDates.filter((d) => d !== date)
              : [...habit.completedDates, date];

            // Calculate streak
            let newStreak = habit.streak;
            if (!isCompleted) {
              newStreak = habit.streak + 1;
            } else {
              newStreak = Math.max(0, habit.streak - 1);
            }

            return {
              ...habit,
              completedDates: newDates,
              streak: newStreak,
              bestStreak: Math.max(habit.bestStreak, newStreak)
            };
          })
        }));
      },

      isHabitCompletedToday: (id) => {
        const today = new Date().toISOString().split('T')[0];
        const habit = get().habits.find((h) => h.id === id);
        return habit?.completedDates.includes(today) || false;
      },

      getTodayProgress: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const todayStr = today.toISOString().split('T')[0];

        const habits = get().habits.filter((h) => h.targetDays.includes(dayOfWeek));
        const completed = habits.filter((h) => h.completedDates.includes(todayStr)).length;

        return { completed, total: habits.length };
      },

      getAllStreaks: () => {
        const habits = get().habits;
        const currentStreaks = habits.map((h) => h.streak);
        const bestStreaks = habits.map((h) => h.bestStreak);

        return {
          current: Math.max(...currentStreaks, 0),
          best: Math.max(...bestStreaks, 0)
        };
      }
    }),
    {
      name: 'pulse-habits'
    }
  )
);
