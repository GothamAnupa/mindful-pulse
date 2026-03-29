import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Task, TaskEnergy, Subtask, ReminderTime } from '../types';

interface NewTaskInput {
  title: string;
  energyLevel: TaskEnergy;
  category: 'work' | 'personal' | 'health' | 'creative';
  recurrence: 'none' | 'daily' | 'weekly' | 'custom';
  dueDate?: Date;
  notes?: string;
  subtasks?: Subtask[];
  reminderEnabled?: boolean;
  reminderTime?: ReminderTime;
}

interface TaskStore {
  tasks: Task[];
  initializeSampleTasks: () => void;
  addTask: (task: NewTaskInput) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  snoozeTask: (id: string, until: Date) => void;
  getTasksByEnergy: (energy: TaskEnergy) => Task[];
  getIncompleteTasks: () => Task[];
  getCompletedThisWeek: () => Task[];
  getCarriedForwardTasks: () => Task[];
  getBestProductivityTime: () => string;
  getAverageEnergy: () => string;
}

const sampleTasks: Task[] = [
  {
    id: uuid(),
    title: 'Review Q3 marketing report',
    energyLevel: 'high',
    category: 'work',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    recurrence: 'none',
    notes: 'Focus on conversion metrics and ROI',
    subtasks: [
      { id: uuid(), title: 'Compile performance data', completed: true },
      { id: uuid(), title: 'Analyze campaign results', completed: false },
      { id: uuid(), title: 'Draft summary for leadership', completed: false }
    ],
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reminderEnabled: true,
    reminderTime: '1hour'
  },
  {
    id: uuid(),
    title: 'Schedule dentist appointment',
    energyLevel: 'low',
    category: 'personal',
    recurrence: 'none',
    subtasks: [],
    completed: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reminderEnabled: false,
    reminderTime: '30min'
  },
  {
    id: uuid(),
    title: '30-minute yoga session',
    energyLevel: 'medium',
    category: 'health',
    recurrence: 'daily',
    subtasks: [],
    completed: true,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reminderEnabled: true,
    reminderTime: 'at-time'
  },
  {
    id: uuid(),
    title: 'Sketch new logo concepts',
    energyLevel: 'high',
    category: 'creative',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    recurrence: 'none',
    notes: 'Explore 3-4 different directions',
    subtasks: [
      { id: uuid(), title: 'Research competitor logos', completed: false },
      { id: uuid(), title: 'Brainstorm keywords', completed: false },
      { id: uuid(), title: 'Sketch rough drafts', completed: false }
    ],
    completed: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reminderEnabled: false,
    reminderTime: '30min'
  },
  {
    id: uuid(),
    title: 'Respond to pending emails',
    energyLevel: 'medium',
    category: 'work',
    recurrence: 'daily',
    subtasks: [],
    completed: false,
    createdAt: new Date(),
    reminderEnabled: false,
    reminderTime: '30min'
  },
  {
    id: uuid(),
    title: 'Plan weekend trip',
    energyLevel: 'low',
    category: 'personal',
    recurrence: 'none',
    subtasks: [
      { id: uuid(), title: 'Check weather forecast', completed: false },
      { id: uuid(), title: 'Research accommodation options', completed: false }
    ],
    completed: false,
    createdAt: new Date(),
    reminderEnabled: true,
    reminderTime: '1day'
  }
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: sampleTasks,

      initializeSampleTasks: () => {
        set({ tasks: sampleTasks });
      },

      addTask: (taskData) => {
        const id = uuid();
        const newTask: Task = {
          ...taskData,
          id,
          createdAt: new Date(),
          completed: false,
          subtasks: taskData.subtasks || [],
          reminderEnabled: taskData.reminderEnabled || false,
          reminderTime: taskData.reminderTime || '30min'
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return id;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }));
      },

      toggleTaskComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  completedAt: !task.completed ? new Date() : undefined
                }
              : task
          )
        }));
      },

      addSubtask: (taskId, title) => {
        const newSubtask: Subtask = { id: uuid(), title, completed: false };
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, subtasks: [...task.subtasks, newSubtask] }
              : task
          )
        }));
      },

      toggleSubtaskComplete: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((st) =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                  )
                }
              : task
          )
        }));
      },

      snoozeTask: (id, until) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, snoozedUntil: until } : task
          )
        }));
      },

      getTasksByEnergy: (energy) => {
        return get().tasks.filter(
          (task) => !task.completed && task.energyLevel === energy
        );
      },

      getIncompleteTasks: () => {
        return get().tasks.filter((task) => !task.completed);
      },

      getCompletedThisWeek: () => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return get().tasks.filter(
          (task) => task.completed && task.completedAt && task.completedAt > weekAgo
        );
      },

      getCarriedForwardTasks: () => {
        return get().tasks.filter((task) => {
          if (task.completed) return false;
          if (!task.dueDate) return false;
          return task.dueDate < new Date();
        });
      },

      getBestProductivityTime: () => {
        const history = JSON.parse(localStorage.getItem('pulse-energy') || '{}');
        const checkInHistory = history.state?.checkInHistory || [];
        
        const energyByHour: Record<number, { total: number; count: number }> = {};
        
        checkInHistory.forEach((entry: { level: string; timestamp: string }) => {
          const hour = new Date(entry.timestamp).getHours();
          const score =
            entry.level === 'energized' ? 5 :
            entry.level === 'focused' ? 4 :
            entry.level === 'steady' ? 3 :
            entry.level === 'tired' ? 2 : 1;
          
          if (!energyByHour[hour]) {
            energyByHour[hour] = { total: 0, count: 0 };
          }
          energyByHour[hour].total += score;
          energyByHour[hour].count += 1;
        });

        let bestHour = 9;
        let bestAvg = 0;
        
        Object.entries(energyByHour).forEach(([hour, data]) => {
          const avg = data.total / data.count;
          if (avg > bestAvg) {
            bestAvg = avg;
            bestHour = parseInt(hour);
          }
        });

        const timeStr = bestHour >= 12 ? `${bestHour - 12}pm` : `${bestHour}am`;
        return `${timeStr} (${checkInHistory.length} check-ins)`;
      },

      getAverageEnergy: () => {
        const history = JSON.parse(localStorage.getItem('pulse-energy') || '{}');
        const checkInHistory = history.state?.checkInHistory || [];
        
        if (checkInHistory.length === 0) return 'Steady';
        
        const recentHistory = checkInHistory.slice(-7);
        const energyScores = recentHistory.map((entry: { level: string }) =>
          entry.level === 'energized' ? 5 :
          entry.level === 'focused' ? 4 :
          entry.level === 'steady' ? 3 :
          entry.level === 'tired' ? 2 : 1
        );
        
        const avg = energyScores.reduce((a: number, b: number) => a + b, 0) / energyScores.length;
        
        if (avg >= 4.5) return 'Energized';
        if (avg >= 3.5) return 'Focused';
        if (avg >= 2.5) return 'Steady';
        if (avg >= 1.5) return 'Tired';
        return 'Struggling';
      }
    }),
    {
      name: 'pulse-tasks',
      onRehydrateStorage: () => (state) => {
        if (state && state.tasks.length === 0) {
          state.tasks = sampleTasks;
        }
      }
    }
  )
);
