import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash, Check, Fire, Trophy, Target } from '@phosphor-icons/react';
import { useHabitStore, type Habit } from '../stores/habitStore';

const presetHabits = [
  { name: 'Meditate', icon: '🧘', color: '#8B5CF6' },
  { name: 'Drink Water', icon: '💧', color: '#06B6D4' },
  { name: 'Exercise', icon: '🏃', color: '#10B981' },
  { name: 'Read', icon: '📚', color: '#F59E0B' },
  { name: 'Sleep Early', icon: '😴', color: '#6366F1' },
  { name: 'Gratitude', icon: '🙏', color: '#EC4899' },
  { name: 'Journal', icon: '✍️', color: '#F97316' },
  { name: 'Walk', icon: '🚶', color: '#84CC16' },
];

export function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabitComplete, isHabitCompletedToday, getTodayProgress, getAllStreaks } = useHabitStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('✨');
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');

  const today = new Date().toISOString().split('T')[0];
  const { completed, total } = getTodayProgress();
  const { current: currentStreak, best: bestStreak } = getAllStreaks();
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    
    addHabit({
      name: newHabitName,
      icon: selectedIcon,
      color: selectedColor,
      frequency: 'daily',
      targetDays: [0, 1, 2, 3, 4, 5, 6]
    });

    setNewHabitName('');
    setShowAddForm(false);
  };

  const handleQuickAdd = (habit: typeof presetHabits[0]) => {
    addHabit({
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      frequency: 'daily',
      targetDays: [0, 1, 2, 3, 4, 5, 6]
    });
  };

  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#F97316', '#6366F1', '#84CC16'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={24} className="text-white" />
            <span className="font-semibold text-white">Daily Habits</span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/80 mb-1">
            <span>Today's Progress</span>
            <span>{completed}/{total}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>

        {/* Streaks */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Fire size={20} className={currentStreak > 0 ? 'text-orange-300 streak-fire' : 'text-white/60'} />
            <span className="text-white font-medium">{currentStreak} day streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-300" />
            <span className="text-white font-medium">Best: {bestStreak}</span>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-200"
          >
            <div className="p-4 bg-gray-50">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Enter habit name..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
              />

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Quick Add</p>
                <div className="flex flex-wrap gap-2">
                  {presetHabits.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleQuickAdd(preset)}
                      className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm hover:border-emerald-500 transition-colors"
                    >
                      {preset.icon} {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Icon</p>
                <div className="flex gap-2 flex-wrap">
                  {['✨', '🎯', '💪', '🌟', '📝', '🎨', '🎵', '🏋️'].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        selectedIcon === icon ? 'bg-emerald-500 text-white scale-110' : 'bg-white border border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Color</p>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddHabit}
                className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Add Habit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habit List */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {habits.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No habits yet. Add one to get started!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isCompleted={isHabitCompletedToday(habit.id)}
              onToggle={() => toggleHabitComplete(habit.id, today)}
              onDelete={() => deleteHabit(habit.id)}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

function HabitItem({ habit, isCompleted, onToggle, onDelete }: { habit: Habit; isCompleted: boolean; onToggle: () => void; onDelete: () => void }) {
  return (
    <motion.div
      layout
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isCompleted ? 'bg-emerald-50' : 'bg-gray-50'
      }`}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
          isCompleted ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-gray-200'
        }`}
        style={isCompleted ? {} : { borderColor: habit.color }}
      >
        {isCompleted ? <Check size={20} weight="bold" /> : habit.icon}
      </motion.button>

      <div className="flex-1">
        <p className={`font-medium ${isCompleted ? 'line-through text-gray-400' : ''}`}>
          {habit.name}
        </p>
        {habit.streak > 0 && (
          <span className="text-xs text-orange-500 flex items-center gap-1">
            <Fire size={12} /> {habit.streak} day streak
          </span>
        )}
      </div>

      <button
        onClick={onDelete}
        className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash size={18} />
      </button>
    </motion.div>
  );
}
