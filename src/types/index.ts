export type EnergyLevel = 'energized' | 'focused' | 'steady' | 'tired' | 'struggling';

export type TaskEnergy = 'high' | 'medium' | 'low';

export type Category = 'work' | 'personal' | 'health' | 'creative';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'custom';

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

export interface Settings {
  checkInFrequency: 'once' | 'twice' | 'manual';
  snoozeDuration: number;
  notificationStyle: 'encouraging' | 'neutral' | 'minimal';
  soundEnabled: boolean;
  defaultTimerDuration: number;
}

export interface TaskBreakdown {
  original: string;
  subtasks: string[];
  suggestedEnergy: TaskEnergy;
  suggestedCategory: Category;
}
