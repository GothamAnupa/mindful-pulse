import { useCallback, useEffect, useState } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

const NOTIFICATION_MESSAGES = {
  encouraging: {
    task: [
      "Hey there! Your task is waiting for you 💪",
      "Time to shine! You've got this ✨",
      "A little progress each day adds up to big results 🌱",
      "Your future self will thank you for starting now 🌟"
    ],
    habit: [
      "Don't break the chain! Your streak needs you 🔗",
      "Small steps, big changes. Time for your habit! 🦋",
      "Consistency is your superpower today 💫",
      "You're building something great, one habit at a time 🌈"
    ],
    checkIn: [
      "How are you feeling? Take a moment for yourself 🌸",
      "Your energy matters. Let's check in! ☀️",
      "A quick pause to understand how you're doing 💭"
    ],
    weekly: [
      "Your weekly insights are ready! Let's reflect on your journey 🪞",
      "Another week of growth! See your progress 📊"
    ]
  },
  neutral: {
    task: ["Task reminder", "Time for your task", "Task pending"],
    habit: ["Habit reminder", "Time for your habit", "Habit check"],
    checkIn: ["Check-in time", "How are you feeling?", "Energy check-in"],
    weekly: ["Weekly insights ready", "View your weekly progress"]
  },
  minimal: {
    task: ["Task"],
    habit: ["Habit"],
    checkIn: ["Check-in"],
    weekly: ["Weekly"]
  }
};

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { notifications, notificationStyle } = useSettingsStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const isInQuietHours = useCallback(() => {
    if (!notifications.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = notifications.quietHoursStart.split(':').map(Number);
    const [endH, endM] = notifications.quietHoursEnd.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    if (start <= end) {
      return currentTime >= start && currentTime < end;
    } else {
      return currentTime >= start || currentTime < end;
    }
  }, [notifications.quietHoursEnabled, notifications.quietHoursStart, notifications.quietHoursEnd]);

  const getMessage = useCallback((type: keyof typeof NOTIFICATION_MESSAGES['encouraging']) => {
    const messages = NOTIFICATION_MESSAGES[notificationStyle][type];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [notificationStyle]);

  const showNotification = useCallback(async (
    title: string,
    options?: NotificationOptions
  ) => {
    if (!notifications.enabled) return;
    if (permission !== 'granted') return;
    if (isInQuietHours()) return;

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 10000);

      return notification;
    } catch {
      console.warn('Failed to show notification');
    }
  }, [notifications.enabled, permission, isInQuietHours]);

  const notifyTaskReminder = useCallback((taskTitle: string) => {
    if (!notifications.taskReminders) return;
    showNotification(getMessage('task'), {
      body: taskTitle,
      tag: 'task-reminder'
    });
  }, [notifications.taskReminders, showNotification, getMessage]);

  const notifyHabitReminder = useCallback((habitName: string, streak: number) => {
    if (!notifications.habitReminders) return;
    const streakText = streak > 0 ? ` (${streak} day streak)` : '';
    showNotification(getMessage('habit'), {
      body: `${habitName}${streakText}`,
      tag: 'habit-reminder'
    });
  }, [notifications.habitReminders, showNotification, getMessage]);

  const notifyCheckIn = useCallback(() => {
    if (!notifications.dailyCheckIn) return;
    showNotification(getMessage('checkIn'), {
      tag: 'check-in'
    });
  }, [notifications.dailyCheckIn, showNotification, getMessage]);

  const notifyWeeklyInsights = useCallback(() => {
    if (!notifications.weeklyInsights) return;
    showNotification(getMessage('weekly'), {
      tag: 'weekly-insights'
    });
  }, [notifications.weeklyInsights, showNotification, getMessage]);

  return {
    permission,
    requestPermission,
    isInQuietHours,
    showNotification,
    notifyTaskReminder,
    notifyHabitReminder,
    notifyCheckIn,
    notifyWeeklyInsights
  };
}
