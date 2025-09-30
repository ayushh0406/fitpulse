import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      
      setTheme: (theme: Theme) => {
        const resolved = resolveTheme(theme);
        set({ theme, resolvedTheme: resolved });
        
        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
      },
      
      toggleTheme: () => {
        const current = get().resolvedTheme;
        const newTheme = current === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      }
    }),
    {
      name: 'fitpulse-theme-storage',
      onRehydrate: (state) => {
        if (state) {
          // Initialize theme on app load
          const resolved = resolveTheme(state.theme);
          state.resolvedTheme = resolved;
          
          const root = document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(resolved);
        }
      }
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const store = useThemeStore.getState();
    if (store.theme === 'system') {
      const newResolved = e.matches ? 'dark' : 'light';
      useThemeStore.setState({ resolvedTheme: newResolved });
      
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolved);
    }
  });
}