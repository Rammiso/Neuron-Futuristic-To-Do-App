import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Settings from '../models/Settings.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Only clear data if explicitly requested
    if (process.argv.includes('--clear')) {
      await User.deleteMany();
      await Task.deleteMany();
      await Settings.deleteMany();
    }

    // Create indexes for better performance
    await User.createIndexes();
    await Task.createIndexes();
    await Settings.createIndexes();

    process.exit(0);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Seed failed:', error);
    }
    process.exit(1);
  }
};

seedData();