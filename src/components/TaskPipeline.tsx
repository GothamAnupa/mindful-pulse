import { motion } from 'framer-motion';
import { Fire, Waves, Moon } from '@phosphor-icons/react';
import { AnimatePresence } from 'framer-motion';
import type { Task, TaskEnergy } from '../types';
import { TaskCard } from './TaskCard';

interface TaskPipelineProps {
  tasks: Task[];
  onStartTimer?: (taskId: string) => void;
}

const columns: { energy: TaskEnergy; icon: React.ReactNode; label: string; description: string; color: string }[] = [
  { 
    energy: 'high', 
    icon: <Fire size={20} weight="fill" />, 
    label: 'High Energy', 
    description: 'Deep work & creative blocks',
    color: 'text-red-500'
  },
  { 
    energy: 'medium', 
    icon: <Waves size={20} weight="fill" />, 
    label: 'Medium Energy', 
    description: 'Administrative & routine',
    color: 'text-amber-500'
  },
  { 
    energy: 'low', 
    icon: <Moon size={20} weight="fill" />, 
    label: 'Low Energy', 
    description: 'Quick wins & light tasks',
    color: 'text-emerald-500'
  }
];

export function TaskPipeline({ tasks, onStartTimer }: TaskPipelineProps) {
  const tasksByEnergy = {
    high: tasks.filter(t => t.energyLevel === 'high' && !t.completed),
    medium: tasks.filter(t => t.energyLevel === 'medium' && !t.completed),
    low: tasks.filter(t => t.energyLevel === 'low' && !t.completed)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div key={column.energy} className="flex flex-col">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className={column.color}>{column.icon}</span>
            <div>
              <h3 className="font-medium text-[var(--color-text)]">{column.label}</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">{column.description}</p>
            </div>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
              {tasksByEnergy[column.energy].length}
            </span>
          </div>

          <div className="space-y-3 min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {tasksByEnergy[column.energy].length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-[var(--color-text-secondary)]"
                >
                  <div className="text-4xl mb-2 opacity-30">{column.icon}</div>
                  <p className="text-sm">Nothing here yet</p>
                </motion.div>
              ) : (
                tasksByEnergy[column.energy].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStartTimer={onStartTimer}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
