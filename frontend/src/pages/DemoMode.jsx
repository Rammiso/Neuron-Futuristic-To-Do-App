import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Calendar, 
  CheckSquare, 
  Settings, 
  User, 
  LogOut,
  Bell,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { HolographicCard } from '../components/HolographicCard';
import { ParticleBackground } from '../components/ParticleBackground';
import { useNotifications } from '../components/DemoNotification';
import { DemoAIChat } from '../components/DemoAIChat';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useDemoStore } from '../context/demoStore';

export const DemoMode = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [showDemoNotice, setShowDemoNotice] = useState(true);
  
  // Notifications
  const { addNotification, NotificationContainer } = useNotifications();
  
  // Demo store
  const { 
    demoTasks, 
    aiMessages, 
    toggleDemoTask, 
    getProductivityMetrics,
    setDemoMode 
  } = useDemoStore();

  useEffect(() => {
    setDemoMode(true);
    
    // Welcome notifications
    setTimeout(() => {
      addNotification('Welcome to NEURON Tasks Demo! 🚀', 'demo', 5000);
    }, 1000);
    
    setTimeout(() => {
      addNotification('Try clicking on tasks to complete them', 'info', 4000);
    }, 3000);
    
    return () => setDemoMode(false);
  }, [setDemoMode, addNotification]);

  const handleTaskToggle = (taskId) => {
    const task = demoTasks.find(t => t.id === taskId);
    if (task) {
      toggleDemoTask(taskId);
      if (!task.completed) {
        addNotification(`Task "${task.title}" completed! 🎉`, 'success');
      } else {
        addNotification(`Task "${task.title}" reopened`, 'demo');
      }
    }
  };

  const handleFloatingAction = (actionType) => {
    switch (actionType) {
      case 'task':
        addNotification('Task creation is available in the full version! Sign up to unlock all features.', 'demo', 5000);
        break;
      case 'calendar':
        addNotification('Calendar scheduling is available in the full version!', 'demo', 4000);
        break;
      case 'ai':
        setActiveView('ai');
        addNotification('Switched to AI Assistant view', 'success', 3000);
        break;
      case 'quick':
        addNotification('Quick notes feature is available in the full version!', 'demo', 4000);
        break;
      default:
        break;
    }
  };

  const metrics = getProductivityMetrics();
  
  const mockStats = [
    { label: 'Tasks Completed', value: metrics.completedTasks.toString(), change: '+12%', icon: CheckSquare },
    { label: 'Productivity Score', value: `${metrics.productivityScore}%`, change: '+8%', icon: TrendingUp },
    { label: 'Focus Time', value: `${metrics.focusTime}h`, change: '+15%', icon: Clock },
    { label: 'Goals Achieved', value: `${metrics.goalsAchieved}/${metrics.totalGoals}`, change: '+2', icon: Target },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ai', label: 'AI Assistant', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 text-white">
      <ParticleBackground />
      <NotificationContainer />
      
      {/* Demo Notice */}
      {showDemoNotice && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <HolographicCard className="px-6 py-3 flex items-center space-x-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-white">
              Demo Mode Active - All changes are simulated
            </span>
            <button
              onClick={() => setShowDemoNotice(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </HolographicCard>
        </motion.div>
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-64 glass border-r border-emerald-500/20 p-6"
        >
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              NEURON
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="mt-auto">
            <HolographicCard className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Neural User</div>
                  <div className="text-xs text-gray-400">user@neuron.ai</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Exit Demo</span>
              </motion.button>
            </HolographicCard>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass border-b border-emerald-500/20 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white capitalize">{activeView}</h1>
                <p className="text-gray-400">Welcome to your neural workspace</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 glass-neon rounded-lg"
                >
                  <Bell className="w-5 h-5 text-emerald-400" />
                </motion.button>
              </div>
            </div>
          </motion.header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {activeView === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mockStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <HolographicCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <stat.icon className="w-6 h-6 text-emerald-400" />
                          <span className="text-xs text-green-400">{stat.change}</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </HolographicCard>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Tasks */}
                <HolographicCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Recent Tasks</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addNotification('Task creation is available in the full version! Sign up to unlock all features.', 'demo', 5000)}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Task</span>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-3">
                    {demoTasks.slice(0, 5).map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-emerald-500/30 transition-colors"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTaskToggle(task.id)}
                          className={`w-4 h-4 rounded border-2 cursor-pointer transition-colors ${
                            task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400 hover:border-emerald-400'
                          }`}
                        />
                        <div className="flex-1">
                          <div className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.category} • {task.dueDate instanceof Date ? 
                              task.dueDate.toLocaleDateString() : 
                              task.dueDate
                            }
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <button className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </HolographicCard>
              </motion.div>
            )}

            {activeView === 'tasks' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Task Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addNotification('Task creation is available in the full version! Sign up to unlock all features.', 'demo', 5000)}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Task</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addNotification('Advanced filtering is available in the full version!', 'demo', 4000)}
                      className="flex items-center space-x-2 px-4 py-2 glass-neon rounded-lg"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </motion.button>
                  </div>
                </div>

                {/* Task List */}
                <HolographicCard className="p-6">
                  <div className="space-y-4">
                    {demoTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-emerald-500/30 transition-colors group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTaskToggle(task.id)}
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
                          <div className="text-sm text-gray-500">{task.category} • Due: {task.dueDate}</div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        
                        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </HolographicCard>
              </motion.div>
            )}

            {activeView === 'ai' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center">
                      <Brain className="w-6 h-6 text-emerald-400 mr-3" />
                      AI Assistant
                    </h3>
                    <p className="text-gray-400 mt-1">Chat with NEURON to optimize your productivity</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Neural Network Active</span>
                  </div>
                </div>

                <HolographicCard className="p-6">
                  <DemoAIChat 
                    onSendMessage={(message) => {
                      addNotification('AI response generated! 🤖', 'success', 3000);
                    }}
                  />
                </HolographicCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HolographicCard className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Zap className="w-5 h-5 text-emerald-400 mr-2" />
                      AI Insights
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <div className="text-sm text-emerald-400 font-medium mb-1">Productivity Tip</div>
                        <div className="text-sm text-gray-300">Your focus peaks at 9-11 AM. Schedule deep work during this time.</div>
                      </div>
                      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <div className="text-sm text-cyan-400 font-medium mb-1">Task Optimization</div>
                        <div className="text-sm text-gray-300">Break large tasks into 25-minute focused sessions for better results.</div>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-sm text-blue-400 font-medium mb-1">Weekly Goal</div>
                        <div className="text-sm text-gray-300">You're 80% towards your weekly completion target. Keep it up!</div>
                      </div>
                    </div>
                  </HolographicCard>

                  <HolographicCard className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 text-emerald-400 mr-2" />
                      Smart Suggestions
                    </h4>
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addNotification('AI scheduling optimization is available in the full version!', 'demo', 4000)}
                        className="w-full p-3 text-left bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="text-sm text-white font-medium">Optimize Schedule</div>
                        <div className="text-xs text-gray-400">Reorganize tasks for maximum efficiency</div>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addNotification('AI priority analysis is available in the full version!', 'demo', 4000)}
                        className="w-full p-3 text-left bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="text-sm text-white font-medium">Analyze Priorities</div>
                        <div className="text-xs text-gray-400">AI-powered task importance ranking</div>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addNotification('AI productivity coaching is available in the full version!', 'demo', 4000)}
                        className="w-full p-3 text-left bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="text-sm text-white font-medium">Productivity Coaching</div>
                        <div className="text-xs text-gray-400">Personalized improvement recommendations</div>
                      </motion.button>
                    </div>
                  </HolographicCard>
                </div>
              </motion.div>
            )}

            {(activeView === 'calendar' || activeView === 'settings') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center h-64"
              >
                <HolographicCard className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {activeView === 'calendar' ? 'Calendar View' : 'Settings Panel'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    This feature is available in the full version
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300"
                  >
                    Get Full Access
                  </motion.button>
                </HolographicCard>
              </motion.div>
            )}
          </main>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton onAction={handleFloatingAction} />
    </div>
  );
};