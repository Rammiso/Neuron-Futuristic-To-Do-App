import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTaskStore } from "../context/taskStore";
import { Button } from "../components/Button";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { Plus, Filter } from "lucide-react";

export const TasksPage = () => {
  const { tasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch =
      filterPriority === "all" || task.priority === filterPriority;
    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);
    return priorityMatch && statusMatch;
  });

  const groupedTasks = {
    high: filteredTasks.filter((t) => t.priority === "high"),
    medium: filteredTasks.filter((t) => t.priority === "medium"),
    low: filteredTasks.filter((t) => t.priority === "low"),
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              Tasks
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              TASK MANAGEMENT SYSTEM
            </p>
          </motion.div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-neon-green" />
            <span className="font-bold text-gray-100 font-mono">
              FILTERS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 font-mono">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2.5 glass rounded-lg input-focus text-gray-100 border border-cyber-border font-mono"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 font-mono">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 glass rounded-lg input-focus text-gray-100 border border-cyber-border font-mono"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {filteredTasks.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedTasks).map(
              ([priority, priorityTasks], groupIndex) => {
                if (priorityTasks.length === 0) return null;

                const priorityConfig = {
                  high: { label: "HIGH PRIORITY", color: "text-red-400" },
                  medium: { label: "MEDIUM PRIORITY", color: "text-amber-400" },
                  low: { label: "LOW PRIORITY", color: "text-emerald-400" },
                };

                const config = priorityConfig[priority];

                return (
                  <motion.div
                    key={priority}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + groupIndex * 0.05 }}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className={`text-xl font-bold font-mono ${config.color}`}>
                          {config.label}
                        </h2>
                        <span className="ml-auto px-3 py-1 rounded-full bg-cyber-card text-sm font-bold text-gray-100 font-mono">
                          {priorityTasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {priorityTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.25 + groupIndex * 0.05 + index * 0.03,
                          }}
                        >
                          <TaskCard task={task} onEdit={() => {}} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-lg p-12 text-center"
          >
            <p className="text-lg font-semibold text-gray-300 mb-4 font-mono">
              NO TASKS FOUND
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Create Task
            </Button>
          </motion.div>
        )}
      </motion.div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};
