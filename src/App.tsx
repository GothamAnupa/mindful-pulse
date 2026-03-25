import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { FocusSection } from './components/FocusSection';
import { TaskPipeline } from './components/TaskPipeline';
import { QuickAddBar } from './components/QuickAddBar';
import { FocusTimer } from './components/FocusTimer';
import { WeeklyInsights } from './components/WeeklyInsights';
import { CheckInModal } from './components/CheckInModal';
import { SettingsPanel } from './components/SettingsPanel';
import { Confetti } from './components/Confetti';
import { DailyShloka } from './components/DailyShloka';
import { MoodChatbot } from './components/MoodChatbot';
import { useEnergyStore } from './stores/energyStore';
import { useTaskStore } from './stores/taskStore';
import type { EnergyLevel, Task } from './types';

function App() {
  const { level, checkIn, shouldPromptCheckIn } = useEnergyStore();
  const { tasks, initializeSampleTasks } = useTaskStore();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (tasks.length === 0 && !isInitialized) {
      initializeSampleTasks();
      setIsInitialized(true);
    }
  }, [tasks, initializeSampleTasks, isInitialized]);

  useEffect(() => {
    if (shouldPromptCheckIn()) {
      const timer = setTimeout(() => {
        setShowCheckIn(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldPromptCheckIn]);

  useEffect(() => {
    document.body.className = `energy-${level}`;
  }, [level]);

  const handleEnergySelect = useCallback((newLevel: EnergyLevel) => {
    checkIn(newLevel);
  }, [checkIn]);

  const handleOpenCheckIn = useCallback(() => {
    setShowCheckIn(true);
  }, []);

  const handleStartTimer = useCallback((taskId: string) => {
    setActiveTimerTaskId(taskId);
  }, []);

  const handleCloseTimer = useCallback(() => {
    setActiveTimerTaskId(null);
  }, []);

  const incompleteTasks = tasks.filter((t: Task) => !t.completed);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--color-background, #F8FAFC)' }}>
      <Confetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <Header onOpenCheckIn={handleOpenCheckIn} />
      
      <main className="max-w-6xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FocusSection onStartTimer={handleStartTimer} />
            
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text, #1E293B)' }}>Task Pipeline</h2>
              <TaskPipeline 
                tasks={incompleteTasks} 
                onStartTimer={handleStartTimer}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <DailyShloka />
            <WeeklyInsights />
            
            {activeTimerTaskId && (
              <FocusTimer 
                activeTaskId={activeTimerTaskId} 
                onClose={handleCloseTimer}
              />
            )}

            <div className="card p-4">
              <h3 className="font-semibold text-[var(--color-text)] mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Total tasks</span>
                  <span className="font-medium text-[var(--color-text)]">{tasks.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Completed</span>
                  <span className="font-medium text-[var(--color-success)]">
                    {tasks.filter((t: Task) => t.completed).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">In progress</span>
                  <span className="font-medium text-[var(--color-text)]">{incompleteTasks.length}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Completion rate</span>
                  <span className="font-medium text-[var(--color-primary)]">
                    {tasks.length > 0 
                      ? Math.round((tasks.filter((t: Task) => t.completed).length / tasks.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${tasks.length > 0 
                        ? (tasks.filter((t: Task) => t.completed).length / tasks.length) * 100 
                        : 0}%` 
                    }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuickAddBar 
        defaultEnergy={level === 'energized' || level === 'focused' ? 'high' : level === 'tired' || level === 'struggling' ? 'low' : 'medium'}
      />

      <CheckInModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        onSelect={handleEnergySelect}
        currentLevel={level}
      />

      <SettingsPanel />
      
      <MoodChatbot />
    </div>
  );
}

export default App;
