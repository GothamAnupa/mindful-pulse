import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Moon, Sun, Desktop, BellSlash, Clock, Megaphone } from '@phosphor-icons/react';
import { useSettingsStore } from '../stores/settingsStore';
import { useThemeStore } from '../stores/themeStore';
import { useNotifications } from '../hooks/useNotifications';

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative w-12 h-6 rounded-full transition-colors
        ${enabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
      `}
    >
      <span
        className={`
          absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
          ${enabled ? 'left-7' : 'left-1'}
        `}
      />
    </button>
  );
}

export function SettingsPanel() {
  const {
    isSettingsOpen,
    closeSettings,
    checkInFrequency,
    notificationStyle,
    soundEnabled,
    defaultTimerDuration,
    notifications,
    updateSettings,
    updateNotificationPreferences
  } = useSettingsStore();

  const { theme, setTheme } = useThemeStore();
  const { permission, requestPermission } = useNotifications();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('dark', isDark);
  }, [theme]);

  const handleEnableNotifications = async () => {
    if (permission === 'granted') {
      updateNotificationPreferences({ enabled: true });
    } else if (permission === 'default') {
      const granted = await requestPermission();
      if (granted) {
        updateNotificationPreferences({ enabled: true });
      }
    } else {
      setShowPermissionPrompt(true);
    }
  };

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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <button
                onClick={closeSettings}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Appearance */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Appearance
                </h3>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'light', icon: <Sun size={20} />, label: 'Light' },
                      { value: 'dark', icon: <Moon size={20} />, label: 'Dark' },
                      { value: 'auto', icon: <Desktop size={20} />, label: 'Auto' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as 'light' | 'dark' | 'auto')}
                        className={`
                          flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                          ${theme === option.value
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                          }
                        `}
                      >
                        {option.icon}
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Push Notifications */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Push Notifications
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Megaphone size={24} className="text-purple-500" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Enable Notifications</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {permission === 'denied' ? 'Blocked by browser - check settings' : 'Get reminders and updates'}
                        </p>
                      </div>
                    </div>
                    <Toggle 
                      enabled={notifications.enabled} 
                      onChange={(value) => {
                        if (value) {
                          handleEnableNotifications();
                        } else {
                          updateNotificationPreferences({ enabled: false });
                        }
                      }} 
                    />
                  </div>

                  {notifications.enabled && (
                    <>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Notification Types</p>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Check size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">Task Reminders</span>
                          </div>
                          <Toggle 
                            enabled={notifications.taskReminders} 
                            onChange={(v) => updateNotificationPreferences({ taskReminders: v })} 
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Check size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">Habit Reminders</span>
                          </div>
                          <Toggle 
                            enabled={notifications.habitReminders} 
                            onChange={(v) => updateNotificationPreferences({ habitReminders: v })} 
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Check size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">Daily Check-in</span>
                          </div>
                          <Toggle 
                            enabled={notifications.dailyCheckIn} 
                            onChange={(v) => updateNotificationPreferences({ dailyCheckIn: v })} 
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Check size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">Weekly Insights</span>
                          </div>
                          <Toggle 
                            enabled={notifications.weeklyInsights} 
                            onChange={(v) => updateNotificationPreferences({ weeklyInsights: v })} 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Clock size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">Quiet Hours</span>
                          </div>
                          <Toggle 
                            enabled={notifications.quietHoursEnabled} 
                            onChange={(v) => updateNotificationPreferences({ quietHoursEnabled: v })} 
                          />
                        </div>

                        {notifications.quietHoursEnabled && (
                          <div className="flex gap-3 px-3">
                            <div className="flex-1">
                              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Start</label>
                              <input
                                type="time"
                                value={notifications.quietHoursStart}
                                onChange={(e) => updateNotificationPreferences({ quietHoursStart: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">End</label>
                              <input
                                type="time"
                                value={notifications.quietHoursEnd}
                                onChange={(e) => updateNotificationPreferences({ quietHoursEnd: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Notification Style */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Notification Style
                </h3>
                
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
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{option.label}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</p>
                        </div>
                        {notificationStyle === option.value && (
                          <Check size={20} className="text-purple-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between p-3 mt-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Sound effects</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Play sounds on timer completion</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={soundEnabled} 
                    onChange={(v) => updateSettings({ soundEnabled: v })} 
                  />
                </div>
              </section>

              {/* Check-in */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Check-in Preferences
                </h3>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
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
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Timer */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Timer
                </h3>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
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
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* About */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  About
                </h3>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">✨</span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Pulse</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Emotionally Intelligent To-Do</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    An app that knows your energy, adapts to your mood, and helps you focus on what matters.
                  </p>
                </div>
              </section>
            </div>
          </motion.div>

          {showPermissionPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="text-center mb-4">
                  <BellSlash size={48} className="mx-auto text-red-500 mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications Blocked</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Your browser is blocking notifications. Please enable them in your browser settings to receive reminders.
                  </p>
                </div>
                <button
                  onClick={() => setShowPermissionPrompt(false)}
                  className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
