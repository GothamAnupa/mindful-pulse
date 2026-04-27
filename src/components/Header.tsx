import { motion } from 'framer-motion';
import { Gear, Sun, Moon, CloudSun, SignOut } from '@phosphor-icons/react';
import { useEnergyStore } from '../stores/energyStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getEnergyEmoji, getEnergyLabel } from './EnergySelector';
import { getEncouragementMessage } from '../utils/aiSimulation';

interface HeaderProps {
  onOpenCheckIn: () => void;
  onLogout?: () => void;
}

export function Header({ onOpenCheckIn, onLogout }: HeaderProps) {
  const { level } = useEnergyStore();
  const { openSettings } = useSettingsStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTimeIcon = () => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 20) return <Moon size={24} weight="fill" className="text-indigo-400" />;
    if (hour < 10 || hour > 18) return <CloudSun size={24} weight="fill" className="text-amber-400" />;
    return <Sun size={24} weight="fill" className="text-amber-400" />;
  };

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-indigo-100/50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              {getTimeIcon()}
              <span className="text-lg text-[var(--color-text-secondary)]">{getGreeting()}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2"
            >
              Let's make progress
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[var(--color-text-secondary)] max-w-md"
            >
              {getEncouragementMessage(level)}
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCheckIn}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
                bg-[var(--color-surface)] border border-gray-200 hover:border-[var(--color-primary)]
                text-[var(--color-text)] shadow-sm
              `}
            >
              <span className="text-xl">{getEnergyEmoji(level)}</span>
              <span className="hidden sm:inline text-sm">{getEnergyLabel(level)}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openSettings}
              className="p-3 rounded-xl bg-[var(--color-surface)] border border-gray-200 hover:border-[var(--color-primary)] shadow-sm transition-all"
            >
              <Gear size={24} className="text-[var(--color-muted)]" />
            </motion.button>

            {onLogout && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="p-3 rounded-xl bg-red-50 border border-red-200 hover:border-red-400 shadow-sm transition-all"
                title="Sign out"
              >
                <SignOut size={24} className="text-red-500" />
              </motion.button>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"
        />
      </div>
    </header>
  );
}
