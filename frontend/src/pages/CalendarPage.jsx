import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useCalendar } from "../hooks/useCalendar";
import { useTaskStore } from "../context/taskStore";
import { Button } from "../components/Button";
import { TaskCard } from "../components/TaskCard";
import { TaskModal } from "../components/TaskModal";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
  const { getTasksByDate } = useTaskStore();
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  const tasksForSelectedDay = selectedDay ? getTasksByDate(selectedDay) : [];

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
            className="text-4xl font-bold text-gray-100 mb-2"
          >
            Calendar
          </motion.h1>
          <p className="text-gray-400 font-mono text-sm">
            TASK SCHEDULE OVERVIEW
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neon-green font-mono">
                {getMonthYear(currentDate)}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevMonth}
                  className="p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextMonth}
                  className="p-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center font-bold text-xs text-gray-400 py-3 uppercase tracking-wider font-mono"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const dayTasks = day ? getTasksByDate(day) : [];
                const isCurrentDay = day && checkIsToday(day);
                const isSelected =
                  selectedDay && day && day.getTime() === selectedDay.getTime();
                const isCurrent = day && isSameMonth(day);

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={
                      isCurrent
                        ? { y: -2, scale: 1.05 }
                        : {}
                    }
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square p-2 rounded-lg transition-all relative ${
                      !day
                        ? "bg-transparent"
                        : isSelected
                        ? "glass-neon ring-1 ring-neon-green"
                        : isCurrentDay
                        ? "glass-neon ring-1 ring-neon-cyan"
                        : isCurrent
                        ? "glass hover-lift"
                        : "bg-cyber-card/20 opacity-30"
                    }`}
                  >
                    {day && (
                      <div className="flex flex-col h-full">
                        <span
                          className={`text-sm font-bold mb-auto font-mono ${
                            isCurrentDay
                              ? "text-neon-cyan"
                              : isSelected
                              ? "text-neon-green"
                              : "text-gray-100"
                          }`}
                        >
                          {day.getDate()}
                        </span>

                        <div className="flex-1 flex items-end justify-center gap-1">
                          {dayTasks.slice(0, 3).map((task, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <span className="text-xs font-bold text-gray-400 ml-0.5 font-mono">
                              +{dayTasks.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 font-mono">
                {selectedDay
                  ? selectedDay.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  : "SELECT DAY"}
              </h3>
              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                disabled={!selectedDay}
                className="p-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="border-t border-cyber-border pt-4">
              <AnimatePresence mode="wait">
                {selectedDay ? (
                  tasksForSelectedDay.length > 0 ? (
                    <motion.div
                      key="tasks"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {tasksForSelectedDay.map((task) => (
                        <TaskCard key={task.id} task={task} onEdit={() => {}} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <p className="text-gray-400 text-sm font-mono">
                        NO TASKS SCHEDULED
                      </p>
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <p className="text-gray-400 text-sm font-mono">
                      SELECT A DAY
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};
