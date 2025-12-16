import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import api from "../utils/api";

// Optimized task store with performance improvements
export const useTaskStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    tasks: [],
    selectedDate: new Date(),
    isLoading: false,
    error: null,
    lastFetch: null,
    cache: new Map(), // Cache for computed values

    // Optimized fetch with caching
    fetchTasks: async (filters = {}) => {
      const cacheKey = JSON.stringify(filters);
      const now = Date.now();
      const lastFetch = get().lastFetch;
      
      // Skip fetch if recent (within 30 seconds) and no filters
      if (lastFetch && now - lastFetch < 30000 && Object.keys(filters).length === 0) {
        return;
      }

      console.log('📋 Loading tasks with filters:', filters);
      set({ isLoading: true, error: null });
      try {
        const params = new URLSearchParams(filters);
        console.log('🔍 Fetching tasks from:', `/tasks?${params}`);
        const { data } = await api.get(`/tasks?${params}`);
        
        const processedTasks = data.tasks.map(task => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }));

        console.log('✅ Tasks loaded successfully:', {
          count: processedTasks.length,
          tasks: processedTasks
        });

        set({
          tasks: processedTasks,
          isLoading: false,
          lastFetch: now,
          cache: new Map() // Clear cache on new data
        });
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch tasks';
        set({ error: message, isLoading: false });
      }
    },

    // Optimistic updates for better UX
    addTask: async (taskData) => {
      // Create optimistic task
      const optimisticTask = {
        id: `temp-${Date.now()}`,
        ...taskData,
        dueDate: new Date(taskData.dueDate),
        completed: false,
        createdAt: new Date(),
        isOptimistic: true
      };

      // Add optimistically
      set((state) => ({
        tasks: [...state.tasks, optimisticTask],
        cache: new Map() // Clear cache
      }));

      try {
        console.log('📝 Creating task with data:', taskData);
        const { data } = await api.post('/tasks', taskData);
        console.log('✅ Task created successfully:', data);
        
        const newTask = {
          ...data.task,
          dueDate: new Date(data.task.dueDate)
        };

        // Replace optimistic task with real task
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === optimisticTask.id ? newTask : task
          ),
          cache: new Map()
        }));

        return newTask;
      } catch (error) {
        console.error('❌ Task creation failed:', {
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
          taskData: taskData
        });
        
        // Remove optimistic task on error
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== optimisticTask.id),
          cache: new Map()
        }));
        
        const message = error.response?.data?.message || 'Failed to create task';
        set({ error: message });
        throw new Error(message);
      }
    },

    // Optimistic update
    updateTask: async (id, updates) => {
      const originalTask = get().tasks.find(task => task.id === id);
      if (!originalTask) return;

      // Apply updates optimistically
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
        cache: new Map()
      }));

      try {
        const { data } = await api.put(`/tasks/${id}`, updates);
        const updatedTask = {
          ...data.task,
          dueDate: new Date(data.task.dueDate)
        };

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? updatedTask : task
          )
        }));
      } catch (error) {
        // Revert on error
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? originalTask : task
          ),
          cache: new Map()
        }));

        const message = error.response?.data?.message || 'Failed to update task';
        set({ error: message });
        throw new Error(message);
      }
    },

    // Optimistic delete
    deleteTask: async (id) => {
      const taskToDelete = get().tasks.find(task => task.id === id);
      if (!taskToDelete) return;

      // Remove optimistically
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        cache: new Map()
      }));

      try {
        await api.delete(`/tasks/${id}`);
      } catch (error) {
        // Restore on error
        set((state) => ({
          tasks: [...state.tasks, taskToDelete].sort((a, b) => 
            new Date(a.dueDate) - new Date(b.dueDate)
          ),
          cache: new Map()
        }));

        const message = error.response?.data?.message || 'Failed to delete task';
        set({ error: message });
        throw new Error(message);
      }
    },

    // Optimized toggle with immediate UI feedback
    toggleTaskComplete: async (id) => {
      const task = get().tasks.find(t => t.id === id);
      if (task) {
        // Update immediately for instant feedback
        const newCompleted = !task.completed;
        set((state) => ({
          tasks: state.tasks.map(t => 
            t.id === id ? { ...t, completed: newCompleted } : t
          ),
          cache: new Map()
        }));

        try {
          await api.put(`/tasks/${id}`, { completed: newCompleted });
        } catch (error) {
          // Revert on error
          set((state) => ({
            tasks: state.tasks.map(t => 
              t.id === id ? { ...t, completed: task.completed } : t
            ),
            cache: new Map()
          }));
          throw error;
        }
      }
    },

    // Memoized selectors for performance
    getTasksByDate: (date) => {
      const cacheKey = `tasks-${date.toDateString()}`;
      const cached = get().cache.get(cacheKey);
      
      if (cached) return cached;

      const { tasks } = get();
      const filtered = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      });

      // Cache result
      get().cache.set(cacheKey, filtered);
      return filtered;
    },

    // Computed selectors with caching
    getCompletedTasks: () => {
      const cached = get().cache.get('completed-tasks');
      if (cached) return cached;

      const completed = get().tasks.filter(task => task.completed);
      get().cache.set('completed-tasks', completed);
      return completed;
    },

    getPendingTasks: () => {
      const cached = get().cache.get('pending-tasks');
      if (cached) return cached;

      const pending = get().tasks.filter(task => !task.completed);
      get().cache.set('pending-tasks', pending);
      return pending;
    },

    getHighPriorityTasks: () => {
      const cached = get().cache.get('high-priority-tasks');
      if (cached) return cached;

      const highPriority = get().tasks.filter(task => 
        task.priority === 'high' && !task.completed
      );
      get().cache.set('high-priority-tasks', highPriority);
      return highPriority;
    },

    // Batch operations for performance
    batchUpdateTasks: async (updates) => {
      const originalTasks = get().tasks;
      
      // Apply all updates optimistically
      set((state) => ({
        tasks: state.tasks.map(task => {
          const update = updates.find(u => u.id === task.id);
          return update ? { ...task, ...update.data } : task;
        }),
        cache: new Map()
      }));

      try {
        await Promise.all(
          updates.map(({ id, data }) => api.put(`/tasks/${id}`, data))
        );
      } catch (error) {
        // Revert all on error
        set({ tasks: originalTasks, cache: new Map() });
        throw error;
      }
    },

    setSelectedDate: (date) => {
      set({ selectedDate: date });
    },

    // Clear cache manually if needed
    clearCache: () => {
      set({ cache: new Map() });
    },

    // Reset error state
    clearError: () => {
      set({ error: null });
    },

    // Alias for fetchTasks for better naming
    loadTasks: async (filters = {}) => {
      return get().fetchTasks(filters);
    }
  }))
);

// Selectors for components to prevent unnecessary re-renders
export const useTaskCount = () => useTaskStore(state => state.tasks.length);
export const useCompletedCount = () => useTaskStore(state => 
  state.tasks.filter(t => t.completed).length
);
export const useHighPriorityCount = () => useTaskStore(state => 
  state.tasks.filter(t => t.priority === 'high' && !t.completed).length
);
export const useTasksLoading = () => useTaskStore(state => state.isLoading);
export const useTasksError = () => useTaskStore(state => state.error);

// Simplified temporal statistics selectors (performance optimized)
export const useTasksThisMonth = () => useTaskStore(state => {
  // Simple approximation to avoid expensive date calculations
  const recentTasks = state.tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const now = new Date();
    const daysDiff = Math.abs(now - taskDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Approximate month
  });
  return recentTasks.length;
});

export const useTasksThisWeek = () => useTaskStore(state => {
  // Simple approximation to avoid expensive date calculations
  const recentTasks = state.tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const now = new Date();
    const daysDiff = Math.abs(now - taskDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7; // Approximate week
  });
  return recentTasks.length;
});

export const useTasksToday = () => useTaskStore(state => {
  // Simple approximation to avoid expensive date calculations
  const todayTasks = state.tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const now = new Date();
    const daysDiff = Math.abs(now - taskDate) / (1000 * 60 * 60 * 24);
    return daysDiff < 1; // Today
  });
  return todayTasks.length;
});

// Simplified productivity metrics selectors (performance optimized)
export const useProductivityMetrics = () => useTaskStore(state => {
  const completedCount = state.tasks.filter(t => t.completed).length;
  const highPriorityTasks = state.tasks.filter(t => t.priority === 'high');
  const completedHighPriority = highPriorityTasks.filter(t => t.completed);
  
  // Simplified calculations to avoid performance issues
  const focusTimeHours = Math.round((completedCount * 0.5) * 10) / 10;
  const goalsHit = highPriorityTasks.length > 0 
    ? `${completedHighPriority.length}/${highPriorityTasks.length}`
    : "0/0";
  const streak = Math.min(completedCount, 30); // Simple streak based on completed tasks
  const aiAssists = Math.min(completedCount * 2, 99);
  
  return {
    focusTime: `${focusTimeHours}h`,
    goalsHit,
    streak: streak.toString(),
    aiAssists: aiAssists.toString()
  };
});
