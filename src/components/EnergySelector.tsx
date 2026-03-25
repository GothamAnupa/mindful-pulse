import { motion } from 'framer-motion';
import type { EnergyLevel } from '../types';

interface EnergySelectorProps {
  onSelect: (level: EnergyLevel) => void;
  currentLevel?: EnergyLevel;
}

const energyOptions: { level: EnergyLevel; emoji: string; label: string; description: string }[] = [
  { level: 'energized', emoji: '🔥', label: 'Energized', description: 'Ready to tackle anything' },
  { level: 'focused', emoji: '💪', label: 'Focused', description: 'Got some good work in me' },
  { level: 'steady', emoji: '🌊', label: 'Steady', description: 'Moving at a comfortable pace' },
  { level: 'tired', emoji: '🌙', label: 'Tired', description: 'Need to take it easy' },
  { level: 'struggling', emoji: '😔', label: 'Struggling', description: 'Be gentle with me today' }
];

export function EnergySelector({ onSelect, currentLevel }: EnergySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {energyOptions.map((option, index) => (
        <motion.button
          key={option.level}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(option.level)}
          className={`
            relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200
            ${currentLevel === option.level
              ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-lg'
              : 'border-gray-200 bg-white hover:border-[var(--color-primary-light)] hover:shadow-md'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-3xl mb-2">{option.emoji}</span>
          <span className="font-medium text-sm text-[var(--color-text)]">{option.label}</span>
          <span className="text-xs text-[var(--color-text-secondary)] mt-1">{option.description}</span>
          {currentLevel === option.level && (
            <motion.div
              layoutId="energyIndicator"
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}

export function getEnergyEmoji(level: EnergyLevel): string {
  return energyOptions.find(o => o.level === level)?.emoji || '🌊';
}

export function getEnergyLabel(level: EnergyLevel): string {
  return energyOptions.find(o => o.level === level)?.label || 'Steady';
}
