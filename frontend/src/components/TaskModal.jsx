import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import { useTaskStore } from "../context/taskStore";
import { Calendar, AlertCircle } from "lucide-react";

export const TaskModal = ({ isOpen, onClose, task = null }) => {
  const { addTask, updateTask } = useTaskStore();
  const [formData, setFormData] = useState(
    task || {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (task) {
      updateTask(task.id, formData);
    } else {
      addTask({
        ...formData,
        dueDate: new Date(formData.dueDate),
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "EDIT TASK" : "CREATE TASK"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          error={errors.title}
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-mono">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add description..."
            className="w-full px-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none h-24 border border-gray-200 dark:border-cyber-border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-mono">
              Due Date
            </label>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-dark dark:group-focus-within:text-neon-green transition-colors" />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-cyber-border font-mono"
                required
              />
            </div>
            {errors.dueDate && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1.5">
                {errors.dueDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-mono">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-cyber-border font-mono bg-white dark:bg-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-neon-cyan/10 border border-blue-200 dark:border-neon-cyan/30 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-neon-cyan flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-400 font-mono">
            Tasks saved to local session
          </p>
        </motion.div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {task ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
