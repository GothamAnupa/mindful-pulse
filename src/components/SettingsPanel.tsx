import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check } from '@phosphor-icons/react';
import { useSettingsStore } from '../stores/settingsStore';

export function SettingsPanel() {
  const {
    isSettingsOpen,
    closeSettings,
    checkInFrequency,
    notificationStyle,
    soundEnabled,
    defaultTimerDuration,
    updateSettings
  } = useSettingsStore();

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <button
                onClick={closeSettings}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Check-in Preferences
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      How often should I check in?
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'once', label: 'Once' },
                        { value: 'twice', label: 'Twice' },
                        { value: 'manual', label: 'Manual' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateSettings({ checkInFrequency: option.value as 'once' | 'twice' | 'manual' })}
                          className={`
                            flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                            ${checkInFrequency === option.value
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Notifications
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Notification style
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'encouraging', label: 'Encouraging', description: 'Warm, supportive messages' },
                        { value: 'neutral', label: 'Neutral', description: 'Straightforward reminders' },
                        { value: 'minimal', label: 'Minimal', description: 'Only essential alerts' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateSettings({ notificationStyle: option.value as 'encouraging' | 'neutral' | 'minimal' })}
                          className={`
                            w-full p-3 rounded-lg border-2 text-left transition-all
                            ${notificationStyle === option.value
                              ? 'border-[var(--color-primary)] bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900">{option.label}</span>
                              <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                            </div>
                            {notificationStyle === option.value && (
                              <Check size={20} className="text-[var(--color-primary)]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-900">Sound effects</span>
                        <p className="text-xs text-gray-500">Play sounds on timer completion</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors
                        ${soundEnabled ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}
                      `}
                    >
                      <span
                        className={`
                          absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                          ${soundEnabled ? 'left-7' : 'left-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Timer
                </h3>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Default timer duration
                  </label>
                  <div className="flex gap-2">
                    {[15, 25, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => updateSettings({ defaultTimerDuration: mins })}
                        className={`
                          flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                          ${defaultTimerDuration === mins
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  About
                </h3>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">✨</span>
                    <div>
                      <h4 className="font-bold text-gray-900">Pulse</h4>
                      <p className="text-xs text-gray-500">Emotionally Intelligent To-Do</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    An app that knows your energy, adapts to your mood, and helps you focus on what matters.
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
