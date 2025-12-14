import { motion } from "framer-motion";
import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { useTaskStore } from "../context/taskStore";
import { formatDateShort, isOverdue } from "../utils/dateUtils";
import { memo, useCallback, useMemo } from "react";

export const TaskCard = memo(({ task, onEdit, viewMode = "default" }) => {
  const { toggleTaskComplete, deleteTask } = useTaskStore();

  // Memoized priority colors to prevent object recreation
  const priorityColors = useMemo(() => ({
    high: "bg-red-500/20 text-red-400 border border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    low: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  }), []);

  // Memoized computed values
  const overdue = useMemo(() => 
    isOverdue(task.dueDate) && !task.completed, 
    [task.dueDate, task.completed]
  );

  const formattedDate = useMemo(() => 
    formatDateShort(task.dueDate), 
    [task.dueDate]
  );

  // Memoized event handlers to prevent re-renders
  const handleToggleComplete = useCallback((e) => {
    e.stopPropagation();
    toggleTaskComplete(task.id);
  }, [task.id, toggleTaskComplete]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    deleteTask(task.id);
  }, [task.id, deleteTask]);

  const handleEdit = useCallback(() => {
    onEdit?.(task);
  }, [onEdit, task]);

  // Memoized animation variants
  const cardVariants = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    hover: { y: -2 }
  }), []);

  const buttonVariants = useMemo(() => ({
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  }), []);

  // Memoized class names
  const cardClassName = useMemo(() => {
    const baseClasses = "glass rounded-lg p-4 cursor-pointer group hover-lift";
    const completedClass = task.completed ? "opacity-60" : "";
    const overdueClass = overdue ? "ring-1 ring-red-500/40" : "";
    const viewModeClass = viewMode === "calendar" ? "border-l-4 border-emerald-400/50" : "";
    
    return `${baseClasses} ${completedClass} ${overdueClass} ${viewModeClass}`.trim();
  }, [task.completed, overdue, viewMode]);

  const titleClassName = useMemo(() => {
    const baseClasses = "font-semibold text-sm";
    const completedClasses = task.completed 
      ? "line-through text-gray-500 dark:text-gray-500"
      : "text-gray-900 dark:text-gray-100";
    
    return `${baseClasses} ${completedClasses}`;
  }, [task.completed]);

  const dateClassName = useMemo(() => {
    const baseClasses = "text-xs px-2.5 py-1 rounded-md font-medium";
    const overdueClasses = overdue
      ? "bg-red-500/20 text-red-400 border border-red-500/30"
      : "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    
    return `${baseClasses} ${overdueClasses}`;
  }, [overdue]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className={cardClassName}
      onClick={handleEdit}
      layout={viewMode === "calendar"} // Enable layout animations for calendar view
    >
      <div className="flex items-start gap-3">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleToggleComplete}
          className="mt-1 flex-shrink-0"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-emerald-400 dark:group-hover:text-emerald-400 transition-colors" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <h3 className={titleClassName}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap font-mono">
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority.toUpperCase()}
            </span>
            <span className={dateClassName}>
              {formattedDate}
            </span>
            {viewMode === "calendar" && (
              <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md font-medium border border-emerald-500/20">
                {new Date(task.dueDate).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </div>
        </div>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleDelete}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  );
});
