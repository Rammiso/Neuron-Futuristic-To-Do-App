import { create } from "zustand";
import api from "../utils/api";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedDate: new Date(),
  isLoading: false,
  error: null,

  // Fetch all tasks
  fetchTasks: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters);
      const { data } = await api.get(`/tasks?${params}`);
      set({
        tasks: data.tasks.map(task => ({
          ...task,
          dueDate: new Date(task.dueDate)
        })),
        isLoading: false
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  // Add task
  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/tasks', taskData);
      const newTask = {
        ...data.task,
        dueDate: new Date(data.task.dueDate)
      };
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }));
      return newTask;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Update task
  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...data.task, dueDate: new Date(data.task.dueDate) } : task
        ),
        isLoading: false
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Delete task
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Toggle task complete
  toggleTaskComplete: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (task) {
      await get().updateTask(id, { completed: !task.completed });
    }
  },

  // Get tasks by date
  getTasksByDate: (date) => {
    const { tasks } = get();
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },
}));
