import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Calendar, Check, Clock } from '@phosphor-icons/react';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarView() {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTasks, setShowTasks] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, [currentDate]);

  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const getCompletedTasksForDate = (date: Date): number => {
    return getTasksForDate(date).filter(t => t.completed).length;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(today);
  };

  const isToday = (date: Date): boolean => {
    return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={24} className="text-white" />
            <h2 className="text-lg font-semibold text-white">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <CaretLeft size={16} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <CaretRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-white/70 py-2">
              {day}
            </div>
          ))}
          
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const tasksForDay = getTasksForDate(date);
            const completedCount = getCompletedTasksForDate(date);
            const hasTasks = tasksForDay.length > 0;
            const allCompleted = hasTasks && completedCount === tasksForDay.length;
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDate(date);
                  setShowTasks(true);
                }}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all
                  ${!isCurrentMonth ? 'text-white/40' : 'text-white'}
                  ${isToday(date) ? 'bg-white/30 ring-2 ring-white' : ''}
                  ${isSelected(date) ? 'bg-white/40' : 'hover:bg-white/20'}
                `}
              >
                <span className={`text-sm font-medium ${isCurrentMonth ? '' : 'opacity-30'}`}>
                  {date.getDate()}
                </span>
                {hasTasks && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {allCompleted ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                        {completedCount > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
                        )}
                      </>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showTasks && selectedDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <button
                  onClick={() => setShowTasks(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {selectedDateTasks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                  No tasks due on this day
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedDateTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        task.completed
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        task.completed
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-300 dark:border-gray-600'
                      }`}>
                        {task.completed && <Check size={14} weight="bold" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            task.energyLevel === 'high'
                              ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                              : task.energyLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {task.energyLevel}
                          </span>
                          {task.reminderEnabled && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              Reminder set
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
