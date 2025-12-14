import { motion } from "framer-motion";
import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { useTaskStore } from "../context/taskStore";
import { formatDateShort, isOverdue } from "../utils/dateUtils";

export const TaskCard = ({ task, onEdit }) => {
  const { toggleTaskComplete, deleteTask } = useTaskStore();

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    low: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  };

  const overdue = isOverdue(task.dueDate) && !task.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className={`glass rounded-lg p-4 cursor-pointer group hover-lift ${
        task.completed ? "opacity-60" : ""
      } ${overdue ? "ring-1 ring-red-500/40" : ""}`}
      onClick={onEdit}
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          className="mt-1 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-neon-dark dark:text-neon-green" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-neon-dark dark:group-hover:text-neon-green transition-colors" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-sm ${
              task.completed
                ? "line-through text-gray-500 dark:text-gray-500"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
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
              {task.priority}
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                overdue
                  ? "bg-red-500/20 text-red-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {formatDateShort(task.dueDate)}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  );
};
