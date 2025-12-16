import { create } from "zustand";
import api from "../utils/api";

// Initialize theme from localStorage immediately (stable)
const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === null || savedTheme === 'true';
  } catch (error) {
    return true; // Default to dark theme
  }
};

let themeInitialized = false;

export const useThemeStore = create((set, get) => ({
  isDark: getInitialTheme(),
  aiEnabled: true,
  isLoading: false,

  // Load settings from backend (optimized, batched updates)
  loadSettings: async () => {
    if (themeInitialized) return;
    
    try {
      const { data } = await api.get('/settings');
      const currentTheme = get().isDark;
      const serverTheme = data.settings.theme.isDark;
      
      // Batch updates to prevent multiple re-renders
      if (currentTheme !== serverTheme) {
        set({
          isDark: serverTheme,
          aiEnabled: data.settings.aiEnabled
        });
        
        // Update localStorage only
        localStorage.setItem('theme', serverTheme.toString());
      } else {
        // Just update AI setting if theme is the same
        set({ aiEnabled: data.settings.aiEnabled });
      }
      
      themeInitialized = true;
    } catch (error) {
      themeInitialized = true; // Prevent retry loops
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
