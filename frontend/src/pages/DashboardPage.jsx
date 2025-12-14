import { motion } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTaskStore } from "../context/taskStore";
import { useAuthStore } from "../context/authStore";
import { TaskCard } from "../components/TaskCard";
import { Button } from "../components/Button";
import { Plus, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { TaskModal } from "../components/TaskModal";

export const DashboardPage = () => {
  const { tasks } = useTaskStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const highPriorityCount = tasks.filter(
    (t) => t.priority === "high" && !t.completed
  ).length;

  const upcomingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const stats = [
    {
      label: "Total Tasks",
      value: totalCount,
      icon: CheckCircle2,
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle2,
    },
    {
      label: "High Priority",
      value: highPriorityCount,
      icon: AlertCircle,
    },
    {
      label: "Completion",
      value:
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      suffix: "%",
      icon: TrendingUp,
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2"
          >
            Welcome back, <span className="text-neon-dark dark:text-neon-green">{user?.name}</span>
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
            SYSTEM STATUS: OPERATIONAL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-neon rounded-lg p-6 hover-lift"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider font-mono">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-neon-dark dark:text-neon-green font-mono">
                      {stat.value}
                      {stat.suffix}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-neon-dark/10 dark:bg-neon-green/10 border border-neon-dark/20 dark:border-neon-green/20">
                    <Icon className="w-6 h-6 text-neon-dark dark:text-neon-green" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Upcoming Tasks
                </h2>
                <Button
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </div>

              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <TaskCard task={task} onEdit={() => {}} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-neon-dark/50 dark:text-neon-green/50 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                    NO PENDING TASKS
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
              Analytics
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-mono">
                    PROGRESS
                  </span>
                  <span className="text-lg font-bold text-neon-dark dark:text-neon-green font-mono">
                    {totalCount > 0
                      ? Math.round((completedCount / totalCount) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-cyber-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        totalCount > 0
                          ? `${(completedCount / totalCount) * 100}%`
                          : 0,
                    }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-full bg-neon-dark dark:bg-neon-green rounded-full shadow-neon-green"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-cyber-border">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wider font-mono">
                  PRIORITY DIST.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "High",
                      count: tasks.filter((t) => t.priority === "high").length,
                      color: "bg-red-500",
                    },
                    {
                      label: "Medium",
                      count: tasks.filter((t) => t.priority === "medium")
                        .length,
                      color: "bg-amber-500",
                    },
                    {
                      label: "Low",
                      count: tasks.filter((t) => t.priority === "low").length,
                      color: "bg-emerald-500",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-sm font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};
