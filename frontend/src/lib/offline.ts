import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfflineData {
  workouts: any[];
  meals: any[];
  notes: any[];
  lastSync: Date | null;
}

interface OfflineState {
  isOnline: boolean;
  offlineData: OfflineData;
  pendingSync: boolean;
  
  setOnlineStatus: (status: boolean) => void;
  addOfflineWorkout: (workout: any) => void;
  addOfflineMeal: (meal: any) => void;
  addOfflineNote: (note: any) => void;
  syncData: () => Promise<void>;
  clearOfflineData: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOnline: navigator.onLine,
      offlineData: {
        workouts: [],
        meals: [],
        notes: [],
        lastSync: null,
      },
      pendingSync: false,
      
      setOnlineStatus: (status) => {
        set({ isOnline: status });
        
        // Auto-sync when coming back online
        if (status && !get().pendingSync) {
          const { offlineData } = get();
          const hasOfflineData = 
            offlineData.workouts.length > 0 ||
            offlineData.meals.length > 0 ||
            offlineData.notes.length > 0;
            
          if (hasOfflineData) {
            get().syncData();
          }
        }
      },
      
      addOfflineWorkout: (workout) => {
        set((state) => ({
          offlineData: {
            ...state.offlineData,
            workouts: [...state.offlineData.workouts, { ...workout, timestamp: new Date() }],
          },
        }));
      },
      
      addOfflineMeal: (meal) => {
        set((state) => ({
          offlineData: {
            ...state.offlineData,
            meals: [...state.offlineData.meals, { ...meal, timestamp: new Date() }],
          },
        }));
      },
      
      addOfflineNote: (note) => {
        set((state) => ({
          offlineData: {
            ...state.offlineData,
            notes: [...state.offlineData.notes, { ...note, timestamp: new Date() }],
          },
        }));
      },
      
      syncData: async () => {
        const { offlineData, isOnline } = get();
        
        if (!isOnline) {
          console.log('Cannot sync: offline');
          return;
        }
        
        set({ pendingSync: true });
        
        try {
          // Sync workouts
          for (const workout of offlineData.workouts) {
            try {
              await fetch('http://localhost:8000/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workout),
              });
            } catch (error) {
              console.error('Failed to sync workout:', error);
            }
          }
          
          // Sync meals
          for (const meal of offlineData.meals) {
            try {
              await fetch('http://localhost:8000/nutrition/log-meal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(meal),
              });
            } catch (error) {
              console.error('Failed to sync meal:', error);
            }
          }
          
          // Sync notes
          for (const note of offlineData.notes) {
            try {
              await fetch('http://localhost:8000/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note),
              });
            } catch (error) {
              console.error('Failed to sync note:', error);
            }
          }
          
          // Clear synced data
          set({
            offlineData: {
              workouts: [],
              meals: [],
              notes: [],
              lastSync: new Date(),
            },
            pendingSync: false,
          });
          
          console.log('Offline data synced successfully');
          
        } catch (error) {
          console.error('Sync failed:', error);
          set({ pendingSync: false });
        }
      },
      
      clearOfflineData: () => {
        set({
          offlineData: {
            workouts: [],
            meals: [],
            notes: [],
            lastSync: null,
          },
        });
      },
    }),
    {
      name: 'fitpulse-offline-storage',
    }
  )
);

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useOfflineStore.getState().setOnlineStatus(false);
  });
}