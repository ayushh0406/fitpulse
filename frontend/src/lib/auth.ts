// src/lib/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  notificationsEnabled: boolean;
  measurementUnit: 'metric' | 'imperial';
  fitnessGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'general-fitness';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<UserPreferences>;
}

// Mock user database for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    profilePicture: 'https://i.pravatar.cc/150?img=68',
    createdAt: new Date('2024-09-01'),
    preferences: {
      darkMode: false,
      notificationsEnabled: true,
      measurementUnit: 'metric',
      fitnessGoal: 'general-fitness',
    }
  }
];

// In a real app, these would be API calls to your backend
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = MOCK_USERS.find(user => user.email === email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  return user;
};

const mockRegister = async (username: string, email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUser = MOCK_USERS.find(user => user.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: `${MOCK_USERS.length + 1}`,
    username,
    email,
    profilePicture: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    createdAt: new Date(),
    preferences: {
      darkMode: false,
      notificationsEnabled: true,
      measurementUnit: 'metric',
      fitnessGoal: 'general-fitness',
    }
  };
  
  // In a real app, this would add the user to a database
  MOCK_USERS.push(newUser);
  
  return newUser;
};

const mockUpdateProfile = async (userData: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would update the user in a database
  return {
    ...MOCK_USERS[0],
    ...userData,
  };
};

const mockUpdatePreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In a real app, this would update the preferences in a database
  return {
    ...(MOCK_USERS[0].preferences || {
      darkMode: false,
      notificationsEnabled: true,
      measurementUnit: 'metric',
      fitnessGoal: 'general-fitness',
    }),
    ...preferences,
  };
};

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      
      login: async (email: string, password: string) => {
        try {
          const user = await mockLogin(email, password);
          // In a real app, the API would return a token
          const token = `mock-token-${Date.now()}`;
          
          set({ user, isAuthenticated: true, token });
          return user;
        } catch (error) {
          throw error;
        }
      },
      
      register: async (username: string, email: string, password: string) => {
        try {
          const user = await mockRegister(username, email, password);
          // In a real app, the API would return a token
          const token = `mock-token-${Date.now()}`;
          
          set({ user, isAuthenticated: true, token });
          return user;
        } catch (error) {
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
      },
      
      updateProfile: async (userData: Partial<User>) => {
        try {
          const updatedUser = await mockUpdateProfile(userData);
          set({ user: updatedUser });
          return updatedUser;
        } catch (error) {
          throw error;
        }
      },
      
      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        try {
          const updatedPreferences = await mockUpdatePreferences(preferences);
          const currentUser = get().user;
          
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                preferences: updatedPreferences
              }
            });
          }
          
          return updatedPreferences;
        } catch (error) {
          throw error;
        }
      }
    }),
    {
      name: 'fitpulse-auth-storage',
    }
  )
);