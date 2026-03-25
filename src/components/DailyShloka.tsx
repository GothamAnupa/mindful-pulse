import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quotes, ArrowClockwise, Heart, Copy, Check, Sparkle } from '@phosphor-icons/react';
import { getDailyShloka, getRandomShloka, type Shloka } from '../data/shlokas';

export function DailyShloka() {
  const [currentShloka, setCurrentShloka] = useState<Shloka>(getDailyShloka);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setShowMeaning(false);
    setTimeout(() => {
      setCurrentShloka(getRandomShloka());
      setIsRefreshing(false);
    }, 500);
  };

  const handleCopy = async () => {
    const text = `${currentShloka.verse}\n\nTransliteration: ${currentShloka.transliteration}\n\nMeaning: ${currentShloka.meaning}\n\n— ${currentShloka.source}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden relative"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 opacity-50" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200 to-yellow-200 rounded-full blur-2xl opacity-30" />

      <div className="relative">
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 p-4 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkle size={20} weight="fill" className="text-white" />
              <span className="font-semibold text-white">Daily Wisdom</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-white/20 text-white/90 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-white/20 text-white/90 transition-colors disabled:opacity-50"
                title="Get another wisdom"
              >
                <motion.span
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <ArrowClockwise size={18} />
                </motion.span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <motion.div
            key={currentShloka.verse}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Decorative Om symbol */}
            <div className="mb-4">
              <span className="text-5xl">🙏</span>
            </div>

            <div className="relative mb-6">
              <Quotes size={40} className="absolute -left-4 -top-2 text-amber-300 transform -scale-x-100" />
              <p className="text-xl md:text-2xl leading-relaxed text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                {currentShloka.verse}
              </p>
              <Quotes size={40} className="absolute -right-4 -bottom-4 text-amber-300" />
            </div>

            <AnimatePresence>
              {showMeaning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-amber-100 space-y-4">
                    <div className="bg-amber-50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-2">
                        Transliteration
                      </p>
                      <p className="text-sm text-gray-600 italic leading-relaxed">
                        {currentShloka.transliteration}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wider text-orange-600 font-semibold mb-2">
                        English Meaning
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {currentShloka.meaning}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Heart size={14} weight="fill" className="text-red-400" />
                      <p className="text-sm text-gray-500 font-medium">
                        {currentShloka.source}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMeaning(!showMeaning)}
              className={`
                mt-6 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md
                ${showMeaning 
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {showMeaning ? (
                <span className="flex items-center gap-2">
                  <span>🙏</span> Close Wisdom
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkle size={16} />
                  Reveal Meaning
                </span>
              )}
            </motion.button>

            {!showMeaning && (
              <p className="mt-4 text-xs text-gray-400">
                Tap to discover the deeper meaning ✨
              </p>
            )}
          </motion.div>
        </div>

        {/* Bottom decoration */}
        <div className="h-1 bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300" />
      </div>
    </motion.div>
  );
}
