import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, priority: 1 });

// Update completedAt when task is marked complete
taskSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    this.completedAt = this.completed ? new Date() : null;
  }
  next();
});

export default mongoose.model('Task', taskSchema);
