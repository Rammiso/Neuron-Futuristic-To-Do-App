import { create } from "zustand";

export const useDemoStore = create((set, get) => ({
  // Demo mode flag
  isDemoMode: false,
  
  // Mock tasks for demo
  demoTasks: [
    {
      id: 1,
      title: 'Complete React Dashboard',
      description: 'Build the main dashboard with cyberpunk styling',
      priority: 'high',
      completed: false,
      dueDate: new Date(),
      category: 'Development',
      tags: ['react', 'ui', 'dashboard']
    },
    {
      id: 2,
      title: 'Review AI Algorithm',
      description: 'Analyze the neural network performance metrics',
      priority: 'medium',
      completed: true,
      dueDate: new Date(Date.now() - 86400000), // Yesterday
      category: 'Research',
      tags: ['ai', 'algorithm', 'analysis']
    },
    {
      id: 3,
      title: 'Design System Updates',
      description: 'Update the design tokens for the new cyberpunk theme',
      priority: 'low',
      completed: false,
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      category: 'Design',
      tags: ['design', 'tokens', 'theme']
    },
    {
      id: 4,
      title: 'Team Standup Meeting',
      description: 'Daily sync with the development team',
      priority: 'high',
      completed: false,
      dueDate: new Date(),
      category: 'Meeting',
      tags: ['meeting', 'team', 'sync']
    },
    {
      id: 5,
      title: 'Code Review Session',
      description: 'Review pull requests from team members',
      priority: 'medium',
      completed: false,
      dueDate: new Date(),
      category: 'Development',
      tags: ['code', 'review', 'collaboration']
    },
    {
      id: 6,
      title: 'User Research Analysis',
      description: 'Analyze user feedback and behavior patterns',
      priority: 'low',
      completed: true,
      dueDate: new Date(Date.now() - 604800000), // Last week
      category: 'Research',
      tags: ['user', 'research', 'analysis']
    }
  ],

  // Mock AI messages
  aiMessages: [
    {
      id: 1,
      type: 'suggestion',
      message: 'Based on your patterns, consider scheduling deep work between 9-11 AM for optimal productivity.',
      timestamp: new Date(),
      priority: 'medium'
    },
    {
      id: 2,
      type: 'reminder',
      message: 'You have 3 high-priority tasks due today. Would you like me to reorganize your schedule?',
      timestamp: new Date(),
      priority: 'high'
    },
    {
      id: 3,
      type: 'insight',
      message: 'Your productivity increased 23% this week. Great job maintaining focus!',
      timestamp: new Date(),
      priority: 'low'
    }
  ],

  // Demo statistics
  demoStats: {
    tasksCompleted: 24,
    productivityScore: 94,
    focusTime: 6.2,
    goalsAchieved: 8,
    totalGoals: 10,
    weeklyGrowth: 12,
    streakDays: 7
  },

  // Actions
  setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),

  // Initialize demo with welcome sequence
  initializeDemo: () => {
    set({ isDemoMode: true });
    
    // Reset demo data to initial state
    const { demoTasks, aiMessages, demoStats } = get();
    set({
      demoTasks: demoTasks.map(task => ({ ...task, completed: false })),
      aiMessages: [
        {
          id: 1,
          type: 'suggestion',
          message: 'Welcome to NEURON Tasks! I\'m your AI assistant. I can help optimize your workflow and boost productivity.',
          timestamp: new Date(),
          priority: 'medium'
        }
      ]
    });
  },

  // Exit demo mode
  exitDemo: () => {
    set({ isDemoMode: false });
  },

  // Toggle task completion in demo
  toggleDemoTask: (taskId) => {
    const { demoTasks } = get();
    const updatedTasks = demoTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    set({ demoTasks: updatedTasks });
  },

  // Add demo task
  addDemoTask: (taskData) => {
    const { demoTasks } = get();
    const newTask = {
      id: Date.now(),
      completed: false,
      dueDate: new Date(),
      category: 'General',
      tags: [],
      ...taskData
    };
    set({ demoTasks: [...demoTasks, newTask] });
  },

  // Delete demo task
  deleteDemoTask: (taskId) => {
    const { demoTasks } = get();
    const updatedTasks = demoTasks.filter(task => task.id !== taskId);
    set({ demoTasks: updatedTasks });
  },

  // Add AI message
  addAIMessage: (message) => {
    const { aiMessages } = get();
    const newMessage = {
      id: Date.now(),
      timestamp: new Date(),
      priority: 'medium',
      ...message
    };
    set({ aiMessages: [newMessage, ...aiMessages] });
  },

  // Get tasks by status
  getDemoTasksByStatus: (completed) => {
    const { demoTasks } = get();
    return demoTasks.filter(task => task.completed === completed);
  },

  // Get tasks by priority
  getDemoTasksByPriority: (priority) => {
    const { demoTasks } = get();
    return demoTasks.filter(task => task.priority === priority);
  },

  // Get tasks due today
  getDemoTasksDueToday: () => {
    const { demoTasks } = get();
    const today = new Date();
    return demoTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    });
  },

  // Calculate productivity metrics
  getProductivityMetrics: () => {
    const { demoTasks, demoStats } = get();
    const completedTasks = demoTasks.filter(task => task.completed).length;
    const totalTasks = demoTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      ...demoStats,
      completionRate: Math.round(completionRate),
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks
    };
  }
}));