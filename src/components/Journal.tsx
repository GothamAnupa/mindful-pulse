import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash, Calendar, Smiley, SmileyMeh, SmileySad, Heart } from '@phosphor-icons/react';
import { useJournalStore, type JournalEntry } from '../stores/journalStore';

const moodOptions: { value: JournalEntry['mood']; icon: React.ReactNode; label: string; color: string }[] = [
  { value: 'great', icon: <Smiley size={20} weight="fill" />, label: 'Great', color: '#10B981' },
  { value: 'good', icon: <SmileyMeh size={20} weight="fill" />, label: 'Good', color: '#06B6D4' },
  { value: 'okay', icon: <SmileyMeh size={20} />, label: 'Okay', color: '#F59E0B' },
  { value: 'bad', icon: <SmileySad size={20} weight="fill" />, label: 'Bad', color: '#EF4444' },
  { value: 'struggling', icon: <Heart size={20} weight="fill" />, label: 'Struggling', color: '#EC4899' },
];

export function Journal() {
  const { addEntry, deleteEntry, getTodayEntry, getRecentEntries } = useJournalStore();
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('good');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayEntry = getTodayEntry();
  const recentEntries = getRecentEntries(5);

  const handleSave = () => {
    if (!content.trim()) return;
    
    addEntry({
      date: selectedDate,
      content: content.trim(),
      mood: selectedMood,
      tags: []
    });

    setContent('');
    setShowForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-white" />
            <span className="font-semibold text-white">Daily Journal</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {todayEntry && (
          <div className="mt-4 p-3 bg-white/10 rounded-xl">
            <p className="text-white/80 text-sm">Today's entry</p>
            <p className="text-white mt-1">{todayEntry.content}</p>
          </div>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-200"
          >
            <div className="p-4 bg-gray-50 space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">How are you feeling?</label>
                <div className="flex gap-2">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all ${
                        selectedMood === option.value
                          ? 'text-white scale-105'
                          : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                      style={selectedMood === option.value ? { backgroundColor: option.color } : {}}
                    >
                      {option.icon}
                      <span className="hidden sm:inline">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">What's on your mind?</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts, reflections, or gratitude..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!content.trim()}
                className="w-full py-2 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Entry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Entries */}
      <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
        {recentEntries.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No journal entries yet.</p>
            <p className="text-sm">Start writing to track your thoughts!</p>
          </div>
        ) : (
          recentEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} onDelete={() => deleteEntry(entry.id)} />
          ))
        )}
      </div>
    </motion.div>
  );
}

function JournalEntryCard({ entry, onDelete }: { entry: JournalEntry; onDelete: () => void }) {
  const mood = moodOptions.find((m) => m.value === entry.mood);
  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 bg-gray-50 rounded-xl"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ color: mood?.color }}>{mood?.icon}</span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            {formattedDate}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash size={16} />
        </button>
      </div>
      <p className="text-gray-700 text-sm">{entry.content}</p>
    </motion.div>
  );
}
