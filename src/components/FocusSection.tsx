import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkle, Clock, Play, SkipForward } from '@phosphor-icons/react';
import type { Task } from '../types';
import { useEnergyStore } from '../stores/energyStore';
import { useTaskStore } from '../stores/taskStore';
import { getRecommendationReasoning } from '../utils/aiSimulation';

interface FocusSectionProps {
  onStartTimer: (taskId: string) => void;
}

export function FocusSection({ onStartTimer }: FocusSectionProps) {
  const { level } = useEnergyStore();
  const { tasks, snoozeTask } = useTaskStore();
  const [recommendedTasks, setRecommendedTasks] = useState<Task[]>([]);
  const [reasoning, setReasoning] = useState<string>('');

  useEffect(() => {
    const incomplete = tasks.filter((t: Task) => !t.completed);
    
    const sorted = [...incomplete].sort((a, b) => {
      const hour = new Date().getHours();
      
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      if (level === 'energized' || level === 'focused') {
        if (a.energyLevel === 'high' && b.energyLevel !== 'high') return -1;
        if (b.energyLevel === 'high' && a.energyLevel !== 'high') return 1;
      } else if (level === 'tired' || level === 'struggling') {
        if (a.energyLevel === 'low' && b.energyLevel !== 'low') return -1;
        if (b.energyLevel === 'low' && a.energyLevel !== 'low') return 1;
      }

      if (hour < 12) {
        if (a.energyLevel === 'high' && b.energyLevel !== 'high') return -1;
      } else if (hour > 14) {
        if (a.energyLevel === 'medium' && b.energyLevel === 'high') return -1;
      }

      return 0;
    });

    const topTasks = sorted.slice(0, 3);
    setRecommendedTasks(topTasks);
    
    if (topTasks.length > 0) {
      setReasoning(getRecommendationReasoning(topTasks[0]));
    }
  }, [tasks, level]);

  const getEstimatedTime = (task: Task): number => {
    const baseTime = task.energyLevel === 'high' ? 45 : task.energyLevel === 'medium' ? 25 : 15;
    const subtaskBonus = task.subtasks.length * 5;
    return baseTime + subtaskBonus;
  };

  const handleSnooze = (taskId: string) => {
    const snoozeUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);
    snoozeTask(taskId, snoozeUntil);
  };

  if (recommendedTasks.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">All clear!</h3>
        <p className="text-[var(--color-text-secondary)]">
          Your plate is clean. Add a task or enjoy the peace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkle size={24} className="text-[var(--color-primary)]" />
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Today's Focus</h2>
      </div>

      {recommendedTasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            card p-5 relative overflow-hidden
            ${index === 0 ? 'ring-2 ring-[var(--color-primary)]' : ''}
          `}
        >
          {index === 0 && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-medium rounded-bl-lg">
              Recommended
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--color-text)] text-lg">{task.title}</h3>
              
              {index === 0 && reasoning && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-2 italic">
                  "{reasoning}"
                </p>
              )}

              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                  <Clock size={16} />
                  Est. {getEstimatedTime(task)} min
                </span>
                
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${task.energyLevel === 'high' ? 'bg-red-100 text-red-700' : 
                    task.energyLevel === 'medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-emerald-100 text-emerald-700'}
                `}>
                  {task.energyLevel === 'high' ? '🔥 High energy' : 
                   task.energyLevel === 'medium' ? '🌊 Medium' : '🌙 Low energy'}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStartTimer(task.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <Play size={18} weight="fill" />
                  Start Timer
                </motion.button>
                
                <button
                  onClick={() => handleSnooze(task.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  <SkipForward size={18} />
                  Snooze
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
