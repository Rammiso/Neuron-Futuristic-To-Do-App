import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  theme: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  aiEnabled: {
    type: Boolean,
    default: true
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    taskReminders: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    defaultPriority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    defaultView: {
      type: String,
      enum: ['list', 'calendar', 'kanban'],
      default: 'list'
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Settings', settingsSchema);
