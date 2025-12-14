import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import { DatePicker } from "./DatePicker";
import { useTaskStore } from "../context/taskStore";
import { AlertCircle } from "lucide-react";

export const TaskModal = ({ isOpen, onClose, task = null }) => {
  const { addTask, updateTask } = useTaskStore();
  
  // Initialize form data
  const getInitialFormData = () => {
    if (task) {
      return {
        ...task,
        dueDate: task.dueDate instanceof Date 
          ? task.dueDate.toISOString().split("T")[0]
          : task.dueDate
      };
    }
    
    return {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});

  // Update form data when task changes
  useEffect(() => {
    setFormData(getInitialFormData());
    setErrors({}); // Clear errors when modal opens with new data
  }, [task, isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (task) {
        await updateTask(task.id, formData);
      } else {
        await addTask({
          ...formData,
          dueDate: new Date(formData.dueDate),
        });
      }
      onClose();
    } catch (error) {
      setErrors({ title: error.message || 'Failed to save task' });
    }
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
            <DatePicker
              value={formData.dueDate}
              onChange={(date) => handleChange({ target: { name: 'dueDate', value: date } })}
            />
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
            Tasks are synced with the database
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
