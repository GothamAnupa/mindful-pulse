import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, TrendUp, Heart } from '@phosphor-icons/react';
import { useTaskStore } from '../stores/taskStore';
import { useEnergyStore } from '../stores/energyStore';

export function WeeklyInsights() {
  const { getCompletedThisWeek, getCarriedForwardTasks, getBestProductivityTime } = useTaskStore();
  const { getAverageEnergy } = useTaskStore();
  const { level } = useEnergyStore();

  const completedThisWeek = getCompletedThisWeek();
  const carriedForward = getCarriedForwardTasks();
  const bestTime = getBestProductivityTime();
  const avgEnergy = getAverageEnergy();

  const motivationalQuote = getMotivationalQuote(completedThisWeek.length, carriedForward.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendUp size={24} className="text-[var(--color-primary)]" />
        <h2 className="text-lg font-semibold text-[var(--color-text)]">This Week</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle size={20} weight="fill" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <span className="text-3xl font-bold text-green-700">{completedThisWeek.length}</span>
          <span className="text-sm text-green-600 ml-1">tasks</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <ArrowRight size={20} />
            <span className="text-sm font-medium">Carried forward</span>
          </div>
          <span className="text-3xl font-bold text-amber-700">{carriedForward.length}</span>
          <span className="text-sm text-amber-600 ml-1">tasks</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Clock size={16} />
            Best productivity
          </span>
          <span className="font-medium text-[var(--color-text)]">{bestTime}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Heart size={16} />
            Average energy
          </span>
          <span className="font-medium text-[var(--color-text)]">{avgEnergy} ({level})</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm text-[var(--color-text-secondary)] italic">
          "{motivationalQuote}"
        </p>
      </div>
    </motion.div>
  );
}

function getMotivationalQuote(completed: number, carried: number): string {
  if (carried > 3) {
    return "You've got some catching up to do, but that's okay. Take it one task at a time.";
  }
  if (completed === 0) {
    return "No tasks completed this week yet. The only way out is through.";
  }
  if (completed < 5) {
    return "Every task you complete is progress. Keep going.";
  }
  if (completed < 10) {
    return "Solid week so far. You're building momentum.";
  }
  if (completed < 15) {
    return "Impressive output this week! Your consistency is showing.";
  }
  return "What a week! You're on fire. Don't forget to celebrate your wins.";
}
