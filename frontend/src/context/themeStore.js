import { create } from "zustand";
import api from "../utils/api";

// Initialize theme from localStorage immediately
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === null || savedTheme === 'true';
};

export const useThemeStore = create((set, get) => ({
  isDark: getInitialTheme(),
  aiEnabled: true,
  isLoading: false,

  // Load settings from backend (non-blocking, no DOM manipulation)
  loadSettings: async () => {
    try {
      const { data } = await api.get('/settings');
      const currentTheme = get().isDark;
      const serverTheme = data.settings.theme.isDark;
      
      // Only update if different from current theme
      if (currentTheme !== serverTheme) {
        set({
          isDark: serverTheme,
          aiEnabled: data.settings.aiEnabled
        });
        
        // Update DOM only if theme actually changed
        if (serverTheme) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
        // Update localStorage
        localStorage.setItem('theme', serverTheme.toString());
      } else {
        // Just update AI setting if theme is the same
        set({ aiEnabled: data.settings.aiEnabled });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load settings:', error);
      }
    }
  },

  // Toggle theme
  toggleTheme: async () => {
    const newDark = !get().isDark;
    set({ isLoading: true });
    
    try {
      await api.put('/settings', {
        theme: { isDark: newDark }
      });
      
      set({ isDark: newDark, isLoading: false });
      
      if (newDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      set({ isLoading: false });
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to update theme:', error);
      }
    }
  },

  // Toggle AI
  toggleAI: async () => {
    const newAI = !get().aiEnabled;
    set({ isLoading: true });
    
    try {
      await api.put('/settings', {
        aiEnabled: newAI
      });
      
      set({ aiEnabled: newAI, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to update AI setting:', error);
      }
    }
  },

  setDark: (isDark) => {
    set({ isDark });
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
}));
