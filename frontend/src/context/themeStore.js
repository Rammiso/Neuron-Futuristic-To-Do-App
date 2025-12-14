import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isDark: true, // Default to dark mode for cyberpunk theme
  aiEnabled: true,

  toggleTheme: () => {
    set((state) => {
      const newDark = !state.isDark;
      if (newDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { isDark: newDark };
    });
  },

  toggleAI: () => {
    set((state) => ({
      aiEnabled: !state.aiEnabled,
    }));
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
