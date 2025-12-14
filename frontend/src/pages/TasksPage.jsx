import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTaskStore } from "../context/taskStore";
import { Button } from "../components/Button";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { HolographicCard } from "../components/HolographicCard";
import { 
  Plus, 
  Filter, 
  Search, 
  Grid3X3, 
  List, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  Target,
  Zap
} from "lucide-react";

export const TasksPage = () => {
  const { tasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch = filterPriority === "all" || task.priority === filterPriority;
    const statusMatch = filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);
    const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return priorityMatch && statusMatch && searchMatch;
  });

  const groupedTasks = {
    high: filteredTasks.filter((t) => t.priority === "high"),
    medium: filteredTasks.filter((t) => t.priority === "medium"),
    low: filteredTasks.filter((t) => t.priority === "low"),
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === "high" && !t.completed).length,
  };

  const priorityConfigs = {
    high: { 
      label: "CRITICAL PRIORITY", 
      color: "text-red-400",
      bgColor: "from-red-500/20 to-pink-500/20",
      borderColor: "border-red-500/30",
      icon: AlertTriangle
    },
    medium: { 
      label: "STANDARD PRIORITY", 
      color: "text-yellow-400",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      icon: Clock
    },
    low: { 
      label: "LOW PRIORITY", 
      color: "text-emerald-400",
      bgColor: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/30",
      icon: CheckCircle2
    },
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Task Matrix
              </span>
            </h1>
            <div className="flex items-center space-x-4 text-gray-400 font-mono text-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>OBJECTIVE MANAGEMENT SYSTEM</span>
              </div>
              <span>•</span>
              <span>{filteredTasks.length} ACTIVE TASKS</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 lg:mt-0 flex items-center space-x-3"
          >
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>CREATE TASK</span>
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Tasks", value: taskStats.total, icon: Target, color: "text-blue-400" },
            { label: "Completed", value: taskStats.completed, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "In Progress", value: taskStats.pending, icon: Clock, color: "text-yellow-400" },
            { label: "Critical", value: taskStats.high, icon: AlertTriangle, color: "text-red-400" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <HolographicCard className="p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
                    <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HolographicCard className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white font-mono">NEURAL FILTERS</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none font-mono"
              >
                <option value="all">All Priorities</option>
                <option value="high">Critical</option>
                <option value="medium">Standard</option>
                <option value="low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none font-mono"
              >
                <option value="all">All Status</option>
                <option value="pending">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </HolographicCard>
        </motion.div>

        {/* Tasks Display */}
        <AnimatePresence mode="wait">
          {filteredTasks.length > 0 ? (
            <motion.div
              key="tasks-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {Object.entries(groupedTasks).map(([priority, priorityTasks], groupIndex) => {
                if (priorityTasks.length === 0) return null;

                const config = priorityConfigs[priority];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={priority}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + groupIndex * 0.1 }}
                  >
                    <HolographicCard className={`p-6 bg-gradient-to-r ${config.bgColor} border ${config.borderColor}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${config.color}`} />
                          <h2 className={`text-xl font-bold font-mono ${config.color}`}>
                            {config.label}
                          </h2>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full bg-gray-800/50 text-sm font-bold font-mono ${config.color}`}>
                            {priorityTasks.length} TASKS
                          </span>
                        </div>
                      </div>

                      <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "space-y-3"
                      }>
                        {priorityTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + groupIndex * 0.1 + index * 0.05 }}
                          >
                            <TaskCard task={task} onEdit={() => {}} viewMode={viewMode} />
                          </motion.div>
                        ))}
                      </div>
                    </HolographicCard>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <HolographicCard className="p-12">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                  <Target className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Tasks Found</h3>
                <p className="text-gray-400 font-mono mb-8 max-w-md mx-auto">
                  {searchQuery || filterPriority !== "all" || filterStatus !== "all" 
                    ? "No tasks match your current filters. Try adjusting your search criteria."
                    : "Your task matrix is empty. Initialize your first objective to begin."
                  }
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Task</span>
                  </Button>
                  {(searchQuery || filterPriority !== "all" || filterStatus !== "all") && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterPriority("all");
                        setFilterStatus("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </HolographicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};
