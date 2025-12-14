import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, date, startDate, endDate, sort } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Filter by completion status
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Filter by specific date
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.dueDate = {
        $gte: targetDate,
        $lt: nextDay
      };
    }

    // Filter by date range
    if (startDate && endDate) {
      query.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build sort
    let sortOption = {};
    if (sort === 'dueDate') {
      sortOption = { dueDate: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1, dueDate: 1 };
    } else if (sort === 'created') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { dueDate: 1 };
    }

    const tasks = await Task.find(query).sort(sortOption);

    res.json({
      success: true,
      count: tasks.length,
      tasks: tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        completed: task.completed,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.json({
      success: true,
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        completed: task.completed,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, tags } = req.body;

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        completed: task.completed,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const { title, description, dueDate, priority, completed, tags } = req.body;

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (tags !== undefined) task.tags = tags;
    
    // Handle completion status and update user stats
    if (completed !== undefined && completed !== task.completed) {
      task.completed = completed;
      
      if (completed) {
        // Increment user's completed tasks count
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { tasksCompleted: 1 }
        });
      } else {
        // Decrement if uncompleting
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { tasksCompleted: -1 }
        });
      }
    }

    await task.save();

    res.json({
      success: true,
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        completed: task.completed,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    // If task was completed, decrement user's count
    if (task.completed) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { tasksCompleted: -1 }
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update tasks
// @route   PATCH /api/tasks/bulk
// @access  Private
export const bulkUpdateTasks = async (req, res, next) => {
  try {
    const { taskIds, updates } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task IDs array is required'
      });
    }

    // Verify all tasks belong to user
    const tasks = await Task.find({
      _id: { $in: taskIds },
      userId: req.user.id
    });

    if (tasks.length !== taskIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Some tasks not found or unauthorized'
      });
    }

    // Update tasks
    await Task.updateMany(
      { _id: { $in: taskIds }, userId: req.user.id },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${taskIds.length} tasks updated successfully`
    });
  } catch (error) {
    next(error);
  }
};
