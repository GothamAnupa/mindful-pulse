export type EnergyLevel = 'energized' | 'focused' | 'steady' | 'tired' | 'struggling';

export type TaskEnergy = 'high' | 'medium' | 'low';

export type Category = 'work' | 'personal' | 'health' | 'creative';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'custom';

export type ReminderTime = 'at-time' | '5min' | '15min' | '30min' | '1hour' | '1day';

export interface Reminder {
  id: string;
  taskId: string;
  time: Date;
  type: ReminderTime;
  notified: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  energyLevel: TaskEnergy;
  category: Category;
  dueDate?: Date;
  recurrence: Recurrence;
  notes?: string;
  subtasks: Subtask[];
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  snoozedUntil?: Date;
  reminderEnabled: boolean;
  reminderTime: ReminderTime;
}

export interface EnergyState {
  level: EnergyLevel;
  timestamp: Date;
  note?: string;
}

export interface Session {
  taskId: string;
  startTime: Date;
  duration: number;
  completed: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  taskReminders: boolean;
  habitReminders: boolean;
  dailyCheckIn: boolean;
  weeklyInsights: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface Settings {
  checkInFrequency: 'once' | 'twice' | 'manual';
  snoozeDuration: number;
  notificationStyle: 'encouraging' | 'neutral' | 'minimal';
  soundEnabled: boolean;
  defaultTimerDuration: number;
  notifications: NotificationPreferences;
}

export interface TaskBreakdown {
  original: string;
  subtasks: string[];
  suggestedEnergy: TaskEnergy;
  suggestedCategory: Category;
}
