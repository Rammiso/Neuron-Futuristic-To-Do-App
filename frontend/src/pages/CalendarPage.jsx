import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useCalendar } from "../hooks/useCalendar";
import { useTaskStore, useTasksThisMonth, useTasksThisWeek, useTasksToday } from "../context/taskStore";
import { Button } from "../components/Button";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { HolographicCard } from "../components/HolographicCard";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Target,
  Zap
} from "lucide-react";
import { getMonthYear } from "../utils/dateUtils";

export const CalendarPage = () => {
  const {
    currentDate,
    calendarDays,
    nextMonth,
    prevMonth,
    goToToday,
    isToday: checkIsToday,
    isSameMonth,
  } = useCalendar();
  const { getTasksByDate, loadTasks } = useTaskStore();
  const tasksThisMonth = useTasksThisMonth();
  const tasksThisWeek = useTasksThisWeek();
  const tasksToday = useTasksToday();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const tasksForSelectedDay = selectedDay ? getTasksByDate(selectedDay) : [];

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
                Temporal Grid
              </span>
            </h1>
            <div className="flex items-center space-x-4 text-gray-400 font-mono text-sm">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <span>CHRONOLOGICAL TASK MATRIX</span>
              </div>
              <span>•</span>
              <span>{getMonthYear(currentDate)}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 lg:mt-0"
          >
            <Button
              onClick={handleAddTask}
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>SCHEDULE TASK</span>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <HolographicCard className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white font-mono flex items-center">
                  <Clock className="w-6 h-6 text-emerald-400 mr-3" />
                  {getMonthYear(currentDate)}
                </h2>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevMonth}
                    className="p-3 bg-gray-800/50 hover:bg-emerald-500/10 border border-gray-700 hover:border-emerald-500/30 rounded-lg transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToToday}
                    className="px-4 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-mono text-sm hover:bg-emerald-500/30 transition-all duration-300"
                  >
                    TODAY
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextMonth}
                    className="p-3 bg-gray-800/50 hover:bg-emerald-500/10 border border-gray-700 hover:border-emerald-500/30 rounded-lg transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
                  </motion.button>
                </div>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center font-bold text-sm text-emerald-400 py-4 font-mono tracking-wider"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const dayTasks = day ? getTasksByDate(day) : [];
                  const isCurrentDay = day && checkIsToday(day);
                  const isSelected = selectedDay && day && day.getTime() === selectedDay.getTime();
                  const isCurrent = day && isSameMonth(day);

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      whileHover={isCurrent ? { 
                        y: -3, 
                        scale: 1.05,
                        boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)"
                      } : {}}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDayClick(day)}
                      className={`aspect-square p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        !day
                          ? "bg-transparent"
                          : isSelected
                          ? "bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                          : isCurrentDay
                          ? "bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                          : isCurrent
                          ? "bg-gray-800/30 border border-gray-700/50 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                          : "bg-gray-900/20 opacity-30"
                      }`}
                    >
                      {day && (
                        <>
                          {/* Holographic scan line for selected/current day */}
                          {(isSelected || isCurrentDay) && (
                            <motion.div
                              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                              animate={{
                                opacity: [0.3, 0.8, 0.3],
                                scaleX: [0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            />
                          )}
                          
                          <div className="flex flex-col h-full relative z-10">
                            <span
                              className={`text-lg font-bold mb-auto font-mono ${
                                isCurrentDay
                                  ? "text-cyan-400"
                                  : isSelected
                                  ? "text-emerald-400"
                                  : isCurrent
                                  ? "text-white"
                                  : "text-gray-500"
                              }`}
                            >
                              {day.getDate()}
                            </span>

                            {/* Task indicators */}
                            <div className="flex-1 flex items-end justify-center">
                              <div className="flex space-x-1">
                                {dayTasks.slice(0, 3).map((task, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className={`w-2 h-2 rounded-full shadow-lg ${
                                      task.priority === "high"
                                        ? "bg-red-400 shadow-red-400/50"
                                        : task.priority === "medium"
                                        ? "bg-yellow-400 shadow-yellow-400/50"
                                        : "bg-emerald-400 shadow-emerald-400/50"
                                    }`}
                                  />
                                ))}
                                {dayTasks.length > 3 && (
                                  <span className="text-xs font-bold text-emerald-400 ml-1 font-mono">
                                    +{dayTasks.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </HolographicCard>
          </motion.div>

          {/* Day Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <HolographicCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono flex items-center">
                    <Target className="w-5 h-5 text-emerald-400 mr-2" />
                    {selectedDay ? "DAY SCHEDULE" : "SELECT DATE"}
                  </h3>
                  {selectedDay && (
                    <p className="text-sm text-emerald-400 font-mono mt-1">
                      {selectedDay.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTask}
                  className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="border-t border-emerald-500/20 pt-6">
                <AnimatePresence mode="wait">
                  {selectedDay ? (
                    tasksForSelectedDay.length > 0 ? (
                      <motion.div
                        key="tasks"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2 mb-4">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-mono text-emerald-400">
                            {tasksForSelectedDay.length} SCHEDULED TASKS
                          </span>
                        </div>
                        {tasksForSelectedDay.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <TaskCard task={task} onEdit={() => {}} viewMode="compact" />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon className="w-8 h-8 text-emerald-400/50" />
                        </div>
                        <p className="text-gray-400 text-sm font-mono mb-4">
                          NO TASKS SCHEDULED
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleAddTask}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Task</span>
                        </Button>
                      </motion.div>
                    )
                  ) : (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-sm font-mono">
                        SELECT A DATE TO VIEW TASKS
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </HolographicCard>

            {/* Quick Stats */}
            <HolographicCard className="p-6">
              <h4 className="text-lg font-bold text-white font-mono mb-4 flex items-center">
                <Zap className="w-5 h-5 text-emerald-400 mr-2" />
                TEMPORAL STATS
              </h4>
              <div className="space-y-3">
                {[
                  { label: "This Month", value: tasksThisMonth.toString(), color: "text-emerald-400" },
                  { label: "This Week", value: tasksThisWeek.toString(), color: "text-cyan-400" },
                  { label: "Today", value: tasksToday.toString(), color: "text-yellow-400" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
                  >
                    <span className="text-sm text-gray-300 font-mono">{stat.label}</span>
                    <span className={`text-lg font-bold font-mono ${stat.color}`}>
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </motion.div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};
