import { create } from "zustand";

const mockTasks = [
  {
    id: "1",
    title: "Complete React Project",
    description: "Build the NEURON Tasks frontend application",
    dueDate: new Date(2024, 11, 20),
    priority: "high",
    completed: false,
    tags: ["work", "react"],
  },
  {
    id: "2",
    title: "Study for Algorithms Exam",
    description: "Review dynamic programming and graph algorithms",
    dueDate: new Date(2024, 11, 18),
    priority: "high",
    completed: false,
    tags: ["study"],
  },
  {
    id: "3",
    title: "Submit Database Assignment",
    description: "Complete SQL queries and normalization tasks",
    dueDate: new Date(2024, 11, 19),
    priority: "medium",
    completed: false,
    tags: ["assignment"],
  },
  {
    id: "4",
    title: "Review Code Review Comments",
    description: "Address feedback from team lead",
    dueDate: new Date(2024, 11, 17),
    priority: "medium",
    completed: true,
    tags: ["work"],
  },
  {
    id: "5",
    title: "Prepare Portfolio Projects",
    description: "Update GitHub with latest projects",
    dueDate: new Date(2024, 11, 22),
    priority: "low",
    completed: false,
    tags: ["career"],
  },
];

export const useTaskStore = create((set, get) => ({
  tasks: mockTasks,
  selectedDate: new Date(),

  addTask: (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
    return newTask;
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  toggleTaskComplete: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  },

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
