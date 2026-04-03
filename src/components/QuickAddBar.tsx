import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperPlaneRight, Sparkle, X, Calendar, Bell, BellSlash } from '@phosphor-icons/react';
import type { TaskEnergy, Category, ReminderTime } from '../types';
import { useTaskStore } from '../stores/taskStore';
import { useReminderStore } from '../stores/reminderStore';
import { analyzeTask } from '../utils/aiSimulation';
import { v4 as uuid } from 'uuid';

interface QuickAddBarProps {
  defaultEnergy?: TaskEnergy;
  onTaskAdded?: () => void;
}

export function QuickAddBar({ defaultEnergy = 'medium', onTaskAdded }: QuickAddBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState<ReturnType<typeof analyzeTask> | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<TaskEnergy>(defaultEnergy);
  const [selectedCategory, setSelectedCategory] = useState<Category>('personal');
  const [dueDate, setDueDate] = useState<string>('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<ReminderTime>('30min');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTask, addSubtask } = useTaskStore();
  const { addReminder } = useReminderStore();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const analysis = analyzeTask(inputValue);
    
    if (analysis.subtasks.length > 1) {
      setBreakdown(analysis);
      setShowBreakdown(true);
      setSelectedEnergy(analysis.suggestedEnergy);
      setSelectedCategory(analysis.suggestedCategory);
    } else {
      createTask(inputValue);
    }
  };

  const createTask = (title: string, subtasks: string[] = []) => {
    const taskId = addTask({
      title,
      energyLevel: selectedEnergy,
      category: selectedCategory,
      recurrence: 'none',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminderEnabled,
      reminderTime
    });

    if (dueDate && reminderEnabled) {
      const reminderDateTime = new Date(dueDate);
      if (reminderTime === 'at-time') {
        // Keep as is
      } else if (reminderTime === '5min') {
        reminderDateTime.setMinutes(reminderDateTime.getMinutes() - 5);
      } else if (reminderTime === '15min') {
        reminderDateTime.setMinutes(reminderDateTime.getMinutes() - 15);
      } else if (reminderTime === '30min') {
        reminderDateTime.setMinutes(reminderDateTime.getMinutes() - 30);
      } else if (reminderTime === '1hour') {
        reminderDateTime.setHours(reminderDateTime.getHours() - 1);
      } else if (reminderTime === '1day') {
        reminderDateTime.setDate(reminderDateTime.getDate() - 1);
      }
      addReminder(taskId, reminderDateTime, reminderTime);
    }

    if (subtasks.length > 0) {
      subtasks.forEach((st, index) => {
        if (index === 0) {
          useTaskStore.getState().updateTask(taskId, {
            subtasks: [{ id: uuid(), title: st, completed: false }]
          });
        } else {
          addSubtask(taskId, st);
        }
      });
    }

    setInputValue('');
    setShowBreakdown(false);
    setBreakdown(null);
    setIsExpanded(false);
    setDueDate('');
    setReminderEnabled(false);
    onTaskAdded?.();
  };

  const handleBreakdownAccept = () => {
    if (breakdown) {
      createTask(breakdown.original, breakdown.subtasks);
    }
  };

  const handleBreakdownModify = () => {
    if (breakdown && breakdown.subtasks.length > 0) {
      const firstSubtask = breakdown.subtasks[0];
      createTask(firstSubtask, breakdown.subtasks.slice(1));
    }
  };

  const categories: { value: Category; label: string }[] = [
    { value: 'work', label: '💼 Work' },
    { value: 'personal', label: '🏠 Personal' },
    { value: 'health', label: '💚 Health' },
    { value: 'creative', label: '🎨 Creative' }
  ];

  const energyLevels: { value: TaskEnergy; label: string }[] = [
    { value: 'high', label: '🔥 High' },
    { value: 'medium', label: '🌊 Medium' },
    { value: 'low', label: '🌙 Low' }
  ];

  const reminderOptions: { value: ReminderTime; label: string }[] = [
    { value: 'at-time', label: 'At due time' },
    { value: '5min', label: '5 min before' },
    { value: '15min', label: '15 min before' },
    { value: '30min', label: '30 min before' },
    { value: '1hour', label: '1 hour before' },
    { value: '1day', label: '1 day before' }
  ];

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <>
      <motion.div
        layout
        className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-gray-200 shadow-lg transition-all duration-300 z-40"
      >
        <AnimatePresence>
          {showBreakdown && breakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-gray-100"
            >
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkle size={20} className="text-purple-500" />
                  <span className="font-medium text-sm text-gray-700">I can break this down for you</span>
                  <button
                    onClick={() => setShowBreakdown(false)}
                    className="ml-auto p-1 rounded-full hover:bg-white/50"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-2 mb-4">
                  {breakdown.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      {subtask}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedEnergy}
                    onChange={(e) => setSelectedEnergy(e.target.value as TaskEnergy)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white"
                  >
                    {energyLevels.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as Category)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleBreakdownAccept}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90"
                  >
                    Add all as one task
                  </button>
                  <button
                    onClick={handleBreakdownModify}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                  >
                    Add as separate tasks
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What do you need to do? (I'll help you break it down)"
              className={`
                w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200
                ${isExpanded
                  ? 'border-[var(--color-primary)] bg-white shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
                }
                focus:outline-none text-[var(--color-text)]
              `}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!inputValue.trim()}
              className={`
                absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg
                ${inputValue.trim()
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-400'
                }
                transition-colors duration-200
              `}
            >
              <PaperPlaneRight size={20} weight="fill" />
            </motion.button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 pt-4 pb-2">
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Energy needed</label>
                    <div className="flex gap-1">
                      {energyLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setSelectedEnergy(level.value)}
                          className={`
                            flex-1 py-1.5 text-xs rounded-lg transition-all
                            ${selectedEnergy === level.value
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                          `}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as Category)}
                      className="w-full py-1.5 px-2 text-xs rounded-lg border border-gray-200 bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
                      <Calendar size={12} className="inline mr-1" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={getTodayDateString()}
                      className="w-full py-1.5 px-2 text-xs rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                </div>

                {dueDate && (
                  <div className="flex items-center gap-3 pt-2 pb-3">
                    <button
                      type="button"
                      onClick={() => setReminderEnabled(!reminderEnabled)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all
                        ${reminderEnabled
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {reminderEnabled ? <Bell size={14} /> : <BellSlash size={14} />}
                      Reminder
                    </button>
                    {reminderEnabled && (
                      <select
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value as ReminderTime)}
                        className="py-1.5 px-2 text-xs rounded-lg border border-gray-200 bg-white"
                      >
                        {reminderOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </>
  );
}
