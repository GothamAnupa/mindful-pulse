import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowClockwise, Coffee, X } from '@phosphor-icons/react';
import { useEnergyStore } from '../stores/energyStore';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../types';

interface FocusTimerProps {
  activeTaskId: string | null;
  onClose: () => void;
}

const getPresetForLevel = (level: string): number => {
  switch (level) {
    case 'energized': return 45;
    case 'focused': return 25;
    case 'steady': return 25;
    case 'tired': return 15;
    case 'struggling': return 15;
    default: return 25;
  }
};

export function FocusTimer({ activeTaskId, onClose }: FocusTimerProps) {
  const { level } = useEnergyStore();
  const { tasks, toggleTaskComplete } = useTaskStore();
  const [duration, setDuration] = useState(getPresetForLevel(level) * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const activeTask = tasks.find((t: Task) => t.id === activeTaskId);

  const progress = ((duration - timeLeft) / duration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    setIsComplete(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleComplete]);

  const toggleTimer = () => {
    if (isComplete) {
      if (activeTask) {
        toggleTaskComplete(activeTaskId!);
      }
      onClose();
      return;
    }
    setIsRunning(!isRunning);
    setIsPaused(false);
  };

  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setTimeLeft(duration);
  };

  const changeDuration = (newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getEnergyColor = () => {
    switch (level) {
      case 'energized': return '#6366F1';
      case 'focused': return '#8B5CF6';
      case 'steady': return '#06B6D4';
      case 'tired': return '#F59E0B';
      case 'struggling': return '#EC4899';
      default: return '#6366F1';
    }
  };

  const energyColor = getEnergyColor();

  if (!activeTaskId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--color-text)]">
          {activeTask?.title || 'Focus Session'}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 text-[var(--color-muted)]"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke={energyColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ filter: isRunning ? `drop-shadow(0 0 8px ${energyColor}40)` : 'none' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-bold text-[var(--color-text)]">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)] mt-1">
            {isComplete ? 'Complete!' : isRunning ? 'Focus time' : isPaused ? 'Paused' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-2 my-4">
        {[15, 25, 45].map((mins) => (
          <button
            key={mins}
            onClick={() => changeDuration(mins * 60)}
            disabled={isRunning}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${duration === mins * 60
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
              ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {mins} min
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
            ${isComplete
              ? 'bg-[var(--color-success)] text-white'
              : isRunning
                ? 'bg-amber-500 text-white'
                : 'bg-[var(--color-primary)] text-white'
            }
          `}
        >
          {isComplete ? (
            <>
              <Coffee size={20} />
              Take a break
            </>
          ) : isRunning ? (
            <>
              <Pause size={20} weight="fill" />
              Pause
            </>
          ) : (
            <>
              <Play size={20} weight="fill" />
              {isPaused ? 'Resume' : 'Start'}
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ArrowClockwise size={24} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-[var(--color-success)] font-medium">
              Great work! Time for a break.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
