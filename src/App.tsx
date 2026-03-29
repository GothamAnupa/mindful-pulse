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
import { HabitTracker } from './components/HabitTracker';
import { Journal } from './components/Journal';
import { CalendarView } from './components/CalendarView';
import { ListBullets, Target, BookOpen, Calendar } from '@phosphor-icons/react';
import { useEnergyStore } from './stores/energyStore';
import { useTaskStore } from './stores/taskStore';
import { useThemeStore } from './stores/themeStore';
import { useNotifications } from './hooks/useNotifications';
import type { EnergyLevel, Task } from './types';

type Tab = 'tasks' | 'habits' | 'journal' | 'calendar';

function App() {
  const { level, checkIn, shouldPromptCheckIn } = useEnergyStore();
  const { tasks, initializeSampleTasks } = useTaskStore();
  const { theme } = useThemeStore();
  const { notifyCheckIn, notifyWeeklyInsights } = useNotifications();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

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
        notifyCheckIn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldPromptCheckIn, notifyCheckIn]);

  useEffect(() => {
    const checkWeeklyInsights = () => {
      const now = new Date();
      if (now.getDay() === 0 && now.getHours() === 10) {
        notifyWeeklyInsights();
      }
    };
    
    const interval = setInterval(checkWeeklyInsights, 3600000);
    return () => clearInterval(interval);
  }, [notifyWeeklyInsights]);

  useEffect(() => {
    const isDarkMode = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('dark', isDarkMode);
  }, [theme]);

  useEffect(() => {
    const isDarkMode = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.className = `energy-${level}${isDarkMode ? ' dark' : ''}`;
  }, [level, theme]);

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
    <div className="min-h-screen transition-colors duration-500">
      <Confetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <Header onOpenCheckIn={handleOpenCheckIn} />
      
      <main className="max-w-6xl mx-auto px-4 pb-32">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 mt-4">
          <TabButton
            active={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
            icon={<ListBullets size={20} />}
            label="Tasks"
          />
          <TabButton
            active={activeTab === 'habits'}
            onClick={() => setActiveTab('habits')}
            icon={<Target size={20} />}
            label="Habits"
          />
          <TabButton
            active={activeTab === 'journal'}
            onClick={() => setActiveTab('journal')}
            icon={<BookOpen size={20} />}
            label="Journal"
          />
          <TabButton
            active={activeTab === 'calendar'}
            onClick={() => setActiveTab('calendar')}
            icon={<Calendar size={20} />}
            label="Calendar"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'tasks' && (
              <>
                <FocusSection onStartTimer={handleStartTimer} />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Task Pipeline</h2>
                  <TaskPipeline 
                    tasks={incompleteTasks} 
                    onStartTimer={handleStartTimer}
                  />
                </div>
              </>
            )}

            {activeTab === 'habits' && (
              <HabitTracker />
            )}

            {activeTab === 'journal' && (
              <Journal />
            )}

            {activeTab === 'calendar' && (
              <CalendarView />
            )}
          </div>
          
          <div className="space-y-6">
            <DailyShloka />
            <WeeklyInsights />
            
            {activeTimerTaskId && activeTab === 'tasks' && (
              <FocusTimer 
                activeTaskId={activeTimerTaskId} 
                onClose={handleCloseTimer}
              />
            )}

            {activeTab === 'tasks' && (
              <div className="card p-4">
                <h3 className="font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total tasks</span>
                    <span className="font-medium">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Completed</span>
                    <span className="font-medium text-green-600">
                      {tasks.filter((t: Task) => t.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">In progress</span>
                    <span className="font-medium">{incompleteTasks.length}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Completion rate</span>
                    <span className="font-medium">
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
            )}
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

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
        ${active 
          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
