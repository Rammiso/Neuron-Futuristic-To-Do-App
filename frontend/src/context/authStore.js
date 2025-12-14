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

  // Get current user
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get('/auth/me');
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
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
