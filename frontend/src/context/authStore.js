import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (email, password) => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        user: {
          id: "1",
          email,
          name: email.split("@")[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          phone: "",
          location: "",
          role: "Student",
          bio: "",
          joinDate: new Date().toISOString().split("T")[0],
          tasksCompleted: 0,
          streak: 0,
          level: 1,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    }, 800);
  },

  register: (name, email, password) => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        user: {
          id: "1",
          email,
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          phone: "",
          location: "",
          role: "Student",
          bio: "",
          joinDate: new Date().toISOString().split("T")[0],
          tasksCompleted: 0,
          streak: 0,
          level: 1,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    }, 800);
  },

  updateUser: (userData) => {
    set((state) => ({
      user: {
        ...state.user,
        ...userData,
      },
    }));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
