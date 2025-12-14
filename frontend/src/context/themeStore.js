import { create } from "zustand";
import api from "../utils/api";

export const useThemeStore = create((set, get) => ({
  isDark: true,
  aiEnabled: true,
  isLoading: false,

  // Load settings from backend
  loadSettings: async () => {
    try {
      const { data } = await api.get('/settings');
      set({
        isDark: data.settings.theme.isDark,
        aiEnabled: data.settings.aiEnabled
      });
      
      if (data.settings.theme.isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
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
      console.error('Failed to update theme:', error);
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
      console.error('Failed to update AI setting:', error);
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
