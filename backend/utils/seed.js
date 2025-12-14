import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Settings from '../models/Settings.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();
    await Settings.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@neurontasks.com',
      password: 'demo123',
      role: 'Student',
      bio: 'Demo account for NEURON Tasks'
    });
    console.log('👤 Created demo user');

    // Create demo settings
    await Settings.create({
      userId: user._id,
      theme: { isDark: true },
      aiEnabled: true
    });
    console.log('⚙️  Created demo settings');

    // Create demo tasks
    const tasks = [
      {
        userId: user._id,
        title: 'Complete React Project',
        description: 'Build the NEURON Tasks frontend application',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'high',
        tags: ['work', 'react']
      },
      {
        userId: user._id,
        title: 'Study for Algorithms Exam',
        description: 'Review dynamic programming and graph algorithms',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        priority: 'high',
        tags: ['study']
      },
      {
        userId: user._id,
        title: 'Submit Database Assignment',
        description: 'Complete SQL queries and normalization tasks',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        tags: ['assignment']
      },
      {
        userId: user._id,
        title: 'Review Code Review Comments',
        description: 'Address feedback from team lead',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        completed: true,
        tags: ['work']
      },
      {
        userId: user._id,
        title: 'Prepare Portfolio Projects',
        description: 'Update GitHub with latest projects',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: 'low',
        tags: ['career']
      }
    ];

    await Task.insertMany(tasks);
    console.log('📝 Created demo tasks');

    // Update user stats
    user.tasksCompleted = 1;
    user.streak = 3;
    user.level = 2;
    await user.save();

    console.log('\n✨ Seed data created successfully!');
    console.log('\n📧 Demo Login Credentials:');
    console.log('   Email: demo@neurontasks.com');
    console.log('   Password: demo123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
