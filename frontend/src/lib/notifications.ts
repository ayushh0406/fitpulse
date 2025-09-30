import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'workout' | 'nutrition';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isEnabled: boolean;
  workoutReminders: boolean;
  mealReminders: boolean;
  achievementAlerts: boolean;
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateSettings: (settings: Partial<Pick<NotificationState, 'isEnabled' | 'workoutReminders' | 'mealReminders' | 'achievementAlerts'>>) => void;
  scheduleWorkoutReminder: () => void;
  scheduleMealReminder: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isEnabled: true,
      workoutReminders: true,
      mealReminders: true,
      achievementAlerts: true,
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          read: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50
          unreadCount: state.unreadCount + 1,
        }));
        
        // Show browser notification if enabled
        if (get().isEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
          });
        }
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },
      
      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: notification && !notification.read 
              ? Math.max(0, state.unreadCount - 1) 
              : state.unreadCount,
          };
        });
      },
      
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
      
      updateSettings: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },
      
      scheduleWorkoutReminder: () => {
        const { workoutReminders, addNotification } = get();
        if (!workoutReminders) return;
        
        // Schedule for tomorrow at 8 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);
        
        const timeUntilReminder = tomorrow.getTime() - Date.now();
        
        setTimeout(() => {
          addNotification({
            title: '🏋️ Time to Workout!',
            message: 'Ready to crush your fitness goals today?',
            type: 'workout',
            actionUrl: '/log-workout',
            actionText: 'Start Workout'
          });
        }, Math.min(timeUntilReminder, 2147483647)); // Max setTimeout value
      },
      
      scheduleMealReminder: () => {
        const { mealReminders, addNotification } = get();
        if (!mealReminders) return;
        
        // Schedule meal reminders every 4 hours
        const reminderIntervals = [8, 12, 16, 20]; // 8 AM, 12 PM, 4 PM, 8 PM
        const now = new Date();
        const currentHour = now.getHours();
        
        // Find next meal time
        const nextMealHour = reminderIntervals.find(hour => hour > currentHour) || reminderIntervals[0];
        const nextMeal = new Date();
        
        if (nextMealHour <= currentHour) {
          nextMeal.setDate(nextMeal.getDate() + 1);
        }
        nextMeal.setHours(nextMealHour, 0, 0, 0);
        
        const timeUntilMeal = nextMeal.getTime() - Date.now();
        
        setTimeout(() => {
          addNotification({
            title: '🍽️ Meal Time!',
            message: "Don't forget to log your meal and track your nutrition.",
            type: 'nutrition',
            actionUrl: '/nutrition-tracker',
            actionText: 'Log Meal'
          });
        }, Math.min(timeUntilMeal, 2147483647));
      },
    }),
    {
      name: 'fitpulse-notifications-storage',
      onRehydrate: (state) => {
        if (state) {
          // Request notification permission on app load
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }
          
          // Schedule reminders
          state.scheduleWorkoutReminder();
          state.scheduleMealReminder();
        }
      }
    }
  )
);