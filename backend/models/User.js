import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    index: { unique: true, background: true } // Optimized indexing
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.email}`;
    }
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'Student'
  },
  bio: {
    type: String,
    default: ''
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving (optimized for performance)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Reduced salt rounds from 10 to 8 for better performance
  // Still secure but ~4x faster
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords (optimized)
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Use bcrypt.compare which is optimized for comparison
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    phone: this.phone,
    location: this.location,
    role: this.role,
    bio: this.bio,
    joinDate: this.createdAt.toISOString().split('T')[0],
    tasksCompleted: this.tasksCompleted,
    streak: this.streak,
    level: this.level
  };
};

export default mongoose.model('User', userSchema);
