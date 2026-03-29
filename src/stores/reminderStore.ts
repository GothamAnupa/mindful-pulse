import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Reminder, ReminderTime } from '../types';

interface ReminderStore {
  reminders: Reminder[];
  addReminder: (taskId: string, time: Date, type: ReminderTime) => void;
  removeReminder: (id: string) => void;
  removeRemindersForTask: (taskId: string) => void;
  markAsNotified: (id: string) => void;
  getRemindersForTask: (taskId: string) => Reminder[];
  getPendingReminders: () => Reminder[];
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],

      addReminder: (taskId, time, type) => {
        const reminder: Reminder = {
          id: crypto.randomUUID(),
          taskId,
          time,
          type,
          notified: false
        };
        set((state) => ({
          reminders: [...state.reminders, reminder]
        }));
      },

      removeReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id)
        }));
      },

      removeRemindersForTask: (taskId) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.taskId !== taskId)
        }));
      },

      markAsNotified: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, notified: true } : r
          )
        }));
      },

      getRemindersForTask: (taskId) => {
        return get().reminders.filter((r) => r.taskId === taskId);
      },

      getPendingReminders: () => {
        const now = new Date();
        return get().reminders.filter(
          (r) => !r.notified && new Date(r.time) <= now
        );
      }
    }),
    {
      name: 'pulse-reminders'
    }
  )
);

export function getReminderTimeLabel(type: ReminderTime): string {
  const labels: Record<ReminderTime, string> = {
    'at-time': 'At due time',
    '5min': '5 minutes before',
    '15min': '15 minutes before',
    '30min': '30 minutes before',
    '1hour': '1 hour before',
    '1day': '1 day before'
  };
  return labels[type];
}

export function calculateReminderDateTime(dueDate: Date, reminderType: ReminderTime): Date {
  const date = new Date(dueDate);
  
  switch (reminderType) {
    case 'at-time':
      return date;
    case '5min':
      date.setMinutes(date.getMinutes() - 5);
      break;
    case '15min':
      date.setMinutes(date.getMinutes() - 15);
      break;
    case '30min':
      date.setMinutes(date.getMinutes() - 30);
      break;
    case '1hour':
      date.setHours(date.getHours() - 1);
      break;
    case '1day':
      date.setDate(date.getDate() - 1);
      break;
  }
  
  return date;
}
