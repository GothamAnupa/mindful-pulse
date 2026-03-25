import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  CaretDown,
  Clock,
  Calendar,
  DotsThree
} from '@phosphor-icons/react';
import type { Task, TaskEnergy } from '../types';
import { useTaskStore } from '../stores/taskStore';

interface TaskCardProps {
  task: Task;
  onStartTimer?: (taskId: string) => void;
  showConfetti?: boolean;
}

const energyColors: Record<TaskEnergy, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700'
};

const energyLabels: Record<TaskEnergy, string> = {
  high: '🔥 High',
  medium: '🌊 Medium',
  low: '🌙 Low'
};

const categoryColors: Record<string, string> = {
  work: 'bg-blue-100 text-blue-700',
  personal: 'bg-purple-100 text-purple-700',
  health: 'bg-green-100 text-green-700',
  creative: 'bg-pink-100 text-pink-700'
};

const categoryLabels: Record<string, string> = {
  work: '💼 Work',
  personal: '🏠 Personal',
  health: '💚 Health',
  creative: '🎨 Creative'
};

export function TaskCard({ task, onStartTimer }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { toggleTaskComplete, toggleSubtaskComplete, deleteTask } = useTaskStore();

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleComplete = () => {
    toggleTaskComplete(task.id);
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const due = new Date(date);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return { text: 'Overdue', urgent: true };
    if (diffHours < 24) return { text: `In ${Math.round(diffHours)}h`, urgent: false };
    
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return { text: 'Tomorrow', urgent: false };
    if (diffDays < 7) return { text: `In ${diffDays} days`, urgent: false };
    
    return { 
      text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      urgent: false 
    };
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className={`
          card p-4 cursor-pointer transition-all duration-200
          ${task.completed ? 'opacity-60' : 'hover:shadow-md hover:-translate-y-0.5'}
        `}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="flex items-start gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="mt-0.5 flex-shrink-0"
          >
            <AnimatePresence mode="wait">
              {task.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <CheckCircle size={24} weight="fill" className="text-[var(--color-success)]" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Circle size={24} className="text-[var(--color-muted)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-medium text-[var(--color-text)] ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              {!task.completed && (
                <span className={`energy-badge ${energyColors[task.energyLevel]}`}>
                  {energyLabels[task.energyLevel]}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`category-pill ${categoryColors[task.category]}`}>
                {categoryLabels[task.category]}
              </span>
              
              {dueInfo && !task.completed && (
                <span className={`flex items-center gap-1 text-xs ${dueInfo.urgent ? 'text-red-500' : 'text-[var(--color-text-secondary)]'}`}>
                  {dueInfo.urgent ? <Clock size={14} /> : <Calendar size={14} />}
                  {dueInfo.text}
                </span>
              )}

              {totalSubtasks > 0 && !task.completed && (
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!task.completed && onStartTimer && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onStartTimer(task.id);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-[var(--color-primary)]"
                title="Start timer"
              >
                <Clock size={18} />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-[var(--color-muted)]"
            >
              <DotsThree size={18} weight="bold" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`p-2 rounded-lg hover:bg-gray-100 text-[var(--color-muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <CaretDown size={18} />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {task.subtasks.length > 0 && (
                  <div className="space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleSubtaskComplete(task.id, subtask.id)}
                      >
                        {subtask.completed ? (
                          <CheckCircle size={18} weight="fill" className="text-[var(--color-success)]" />
                        ) : (
                          <Circle size={18} className="text-[var(--color-muted)]" />
                        )}
                        <span className={`text-sm ${subtask.completed ? 'line-through text-[var(--color-text-secondary)]' : ''}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {task.notes && (
                  <p className="text-sm text-[var(--color-text-secondary)] italic">
                    {task.notes}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  {onStartTimer && !task.completed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartTimer(task.id);
                      }}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                    >
                      Start Timer
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this task?')) {
                        deleteTask(task.id);
                      }
                    }}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                toggleTaskComplete(task.id);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              {task.completed ? 'Mark incomplete' : 'Mark complete'}
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this task?')) {
                  deleteTask(task.id);
                }
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
            >
              Delete task
            </button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
