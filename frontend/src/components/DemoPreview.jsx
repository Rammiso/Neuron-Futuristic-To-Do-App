import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  CheckSquare, 
  Brain, 
  Plus, 
  Clock,
  Target,
  Zap,
  TrendingUp,
  User,
  Bell
} from 'lucide-react';
import { HolographicCard } from './HolographicCard';

export const DemoPreview = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mockTasks = [
    { id: 1, title: 'Complete React Dashboard', priority: 'high', completed: false, dueDate: 'Today' },
    { id: 2, title: 'Review AI Algorithm', priority: 'medium', completed: true, dueDate: 'Yesterday' },
    { id: 3, title: 'Design System Updates', priority: 'low', completed: false, dueDate: 'Tomorrow' },
    { id: 4, title: 'Team Standup Meeting', priority: 'high', completed: false, dueDate: 'Today' },
  ];

  const mockStats = [
    { label: 'Tasks Completed', value: '24', change: '+12%', icon: CheckSquare },
    { label: 'Productivity Score', value: '94%', change: '+8%', icon: TrendingUp },
    { label: 'Focus Time', value: '6.2h', change: '+15%', icon: Clock },
    { label: 'Goals Achieved', value: '8/10', change: '+2', icon: Target },
  ];

  const mockAIMessages = [
    { id: 1, type: 'suggestion', message: 'Based on your patterns, consider scheduling deep work between 9-11 AM for optimal productivity.' },
    { id: 2, type: 'reminder', message: 'You have 3 high-priority tasks due today. Would you like me to reorganize your schedule?' },
    { id: 3, type: 'insight', message: 'Your productivity increased 23% this week. Great job maintaining focus!' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ai', label: 'AI Assistant', icon: Brain },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto"
    >
      <HolographicCard className="p-8">
        {/* Demo Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">NEURON Dashboard</h3>
              <p className="text-sm text-gray-400">Interactive Demo Mode</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Current Time</div>
              <div className="text-lg font-mono text-emerald-400">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs text-green-400">{stat.change}</span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Tasks */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-emerald-500/20">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <CheckSquare className="w-5 h-5 text-emerald-400 mr-2" />
                    Recent Tasks
                  </h4>
                  <div className="space-y-3">
                    {mockTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-400' : 'bg-gray-400'}`} />
                        <div className="flex-1">
                          <div className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-500">{task.dueDate}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Task Management</h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </motion.button>
                </div>
                
                <div className="space-y-3">
                  {mockTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                          task.completed 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-gray-400 hover:border-emerald-400'
                        }`}
                      >
                        {task.completed && <CheckSquare className="w-3 h-3 text-white" />}
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">Due: {task.dueDate}</div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <Calendar className="w-5 h-5 text-emerald-400 mr-2" />
                  Quantum Calendar
                </h4>
                
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-400 p-2">
                      {day}
                    </div>
                  ))}
                  
                  {[...Array(35)].map((_, i) => {
                    const day = i - 6;
                    const isToday = day === 15;
                    const hasTask = [12, 15, 18, 22].includes(day);
                    
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          day < 1 || day > 30 
                            ? 'text-gray-600' 
                            : isToday 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                              : hasTask
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        {day > 0 && day <= 30 ? day : ''}
                        {hasTask && (
                          <div className="w-1 h-1 bg-cyan-400 rounded-full mx-auto mt-1" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20">
                  <h5 className="text-sm font-medium text-white mb-3">Today's Schedule</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <span className="text-gray-300">9:00 AM - Team Standup</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span className="text-gray-300">2:00 PM - Code Review</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span className="text-gray-300">4:30 PM - Design Meeting</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <Brain className="w-5 h-5 text-emerald-400 mr-2" />
                    AI Assistant
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Neural Network Active</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockAIMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-black" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white leading-relaxed">
                            {message.message}
                          </div>
                          <div className="flex items-center space-x-4 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs text-emerald-400 hover:text-emerald-300"
                            >
                              Apply Suggestion
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs text-gray-400 hover:text-gray-300"
                            >
                              Dismiss
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Ask NEURON anything..."
                      className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </HolographicCard>
    </motion.div>
  );
};