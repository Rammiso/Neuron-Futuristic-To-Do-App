import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Shield, 
  Calendar,
  CheckSquare,
  Users,
  BarChart3,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { HolographicCard } from './HolographicCard';

export const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      id: 'ai-assistant',
      title: 'Neural AI Assistant',
      subtitle: 'Intelligent Task Optimization',
      description: 'Advanced machine learning algorithms analyze your work patterns and automatically optimize your schedule for maximum productivity.',
      icon: Brain,
      color: 'from-emerald-400 to-cyan-400',
      preview: {
        type: 'ai-chat',
        messages: [
          { role: 'ai', text: 'I noticed you\'re most productive between 9-11 AM. Should I reschedule your deep work tasks?' },
          { role: 'user', text: 'Yes, that sounds perfect!' },
          { role: 'ai', text: 'Done! I\'ve moved 3 high-focus tasks to your peak hours and scheduled lighter tasks for the afternoon.' }
        ]
      }
    },
    {
      id: 'smart-scheduling',
      title: 'Quantum Scheduling',
      subtitle: 'Time Manipulation Technology',
      description: 'Our quantum scheduling engine predicts optimal time slots and automatically prevents conflicts before they happen.',
      icon: Calendar,
      color: 'from-blue-400 to-purple-400',
      preview: {
        type: 'calendar',
        events: [
          { time: '09:00', title: 'Deep Work Block', type: 'focus' },
          { time: '11:00', title: 'Team Sync', type: 'meeting' },
          { time: '14:00', title: 'Code Review', type: 'collaboration' },
          { time: '16:00', title: 'Creative Time', type: 'creative' }
        ]
      }
    },
    {
      id: 'task-intelligence',
      title: 'Intelligent Task Management',
      subtitle: 'Adaptive Priority System',
      description: 'Tasks automatically adjust priority based on deadlines, dependencies, and your personal productivity patterns.',
      icon: CheckSquare,
      color: 'from-green-400 to-emerald-400',
      preview: {
        type: 'task-board',
        columns: [
          { name: 'Neural Queue', tasks: ['AI Model Training', 'Data Analysis'] },
          { name: 'In Progress', tasks: ['Dashboard Design', 'API Integration'] },
          { name: 'Review', tasks: ['Code Optimization', 'Testing Suite'] }
        ]
      }
    },
    {
      id: 'collaboration',
      title: 'Holographic Collaboration',
      subtitle: 'Real-time Team Sync',
      description: 'Seamlessly collaborate with your team through real-time updates, shared workspaces, and intelligent conflict resolution.',
      icon: Users,
      color: 'from-purple-400 to-pink-400',
      preview: {
        type: 'team-activity',
        activities: [
          { user: 'Alex', action: 'completed', item: 'UI Components', time: '2m ago' },
          { user: 'Sarah', action: 'started', item: 'Backend API', time: '5m ago' },
          { user: 'Mike', action: 'reviewed', item: 'Design System', time: '8m ago' }
        ]
      }
    }
  ];

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  const renderPreview = (preview) => {
    switch (preview.type) {
      case 'ai-chat':
        return (
          <div className="space-y-3">
            {preview.messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.role === 'ai' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs p-3 rounded-lg ${
                  message.role === 'ai' 
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30' 
                    : 'bg-gray-700/50 text-gray-100 border border-gray-600/30'
                }`}>
                  <div className="text-sm">{message.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-2">
            {preview.events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30"
              >
                <div className="text-sm font-mono text-cyan-400">{event.time}</div>
                <div className="flex-1 text-sm text-white">{event.title}</div>
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'focus' ? 'bg-emerald-400' :
                  event.type === 'meeting' ? 'bg-blue-400' :
                  event.type === 'collaboration' ? 'bg-purple-400' :
                  'bg-yellow-400'
                }`} />
              </motion.div>
            ))}
          </div>
        );

      case 'task-board':
        return (
          <div className="grid grid-cols-3 gap-3">
            {preview.columns.map((column, colIndex) => (
              <div key={colIndex} className="space-y-2">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {column.name}
                </div>
                {column.tasks.map((task, taskIndex) => (
                  <motion.div
                    key={taskIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (colIndex * column.tasks.length + taskIndex) * 0.1 }}
                    className="p-2 bg-gray-800/50 rounded border border-gray-600/30 text-xs text-white"
                  >
                    {task}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        );

      case 'team-activity':
        return (
          <div className="space-y-3">
            {preview.activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {activity.user[0]}
                </div>
                <div className="flex-1 text-sm">
                  <span className="text-white font-medium">{activity.user}</span>
                  <span className="text-gray-400"> {activity.action} </span>
                  <span className="text-emerald-400">{activity.item}</span>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const currentFeatureData = features[currentFeature];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Feature Spotlight
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the cutting-edge capabilities that make NEURON Tasks the ultimate productivity platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Info */}
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${currentFeatureData.color} p-0.5`}>
                <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                  <currentFeatureData.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">{currentFeatureData.title}</h3>
                <p className="text-lg text-emerald-400">{currentFeatureData.subtitle}</p>
              </div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed">
              {currentFeatureData.description}
            </p>

            {/* Feature Navigation */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevFeature}
                className="p-3 glass-neon rounded-lg hover:bg-emerald-500/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-emerald-400" />
              </motion.button>

              <div className="flex space-x-2">
                {features.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentFeature ? 'bg-emerald-400' : 'bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextFeature}
                className="p-3 glass-neon rounded-lg hover:bg-emerald-500/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-emerald-400" />
              </motion.button>
            </div>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            key={`preview-${currentFeature}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HolographicCard className="p-8">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <div className="flex-1 text-center">
                    <span className="text-sm text-gray-400 font-mono">
                      neuron://features/{currentFeatureData.id}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="min-h-[300px]"
                >
                  {renderPreview(currentFeatureData.preview)}
                </motion.div>
              </AnimatePresence>

              {/* Holographic Effects */}
              <div className="absolute top-4 right-4 flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-emerald-400 rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};