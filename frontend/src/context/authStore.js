import { create } from "zustand";
import api from "../utils/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Register user
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Login user
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Get current user (optimized for progressive loading)
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    // Set authenticated immediately based on token presence
    // This prevents blocking the UI while validating
    set({ isAuthenticated: true, isLoading: true });

    try {
      const { data } = await api.get('/auth/me');
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      // Only clear auth if token is actually invalid
      localStorage.removeItem('token');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  // Quick auth check (synchronous)
  checkAuthSync: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ isAuthenticated: true });
      return true;
    }
    set({ isAuthenticated: false });
    return false;
  },

  // Update user profile
  updateUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/auth/profile', userData);
      set({
        user: data.user,
        isLoading: false
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  },
}));
