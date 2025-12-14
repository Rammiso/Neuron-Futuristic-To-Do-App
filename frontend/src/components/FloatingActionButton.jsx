import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CheckSquare, Calendar, Brain, Zap } from 'lucide-react';

export const FloatingActionButton = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      id: 'task', 
      label: 'Add Task', 
      icon: CheckSquare, 
      color: 'from-emerald-500 to-green-500',
      action: () => onAction('task')
    },
    { 
      id: 'calendar', 
      label: 'Schedule Event', 
      icon: Calendar, 
      color: 'from-blue-500 to-cyan-500',
      action: () => onAction('calendar')
    },
    { 
      id: 'ai', 
      label: 'Ask AI', 
      icon: Brain, 
      color: 'from-purple-500 to-pink-500',
      action: () => onAction('ai')
    },
    { 
      id: 'quick', 
      label: 'Quick Note', 
      icon: Zap, 
      color: 'from-yellow-500 to-orange-500',
      action: () => onAction('quick')
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0, 
                  y: 20,
                  transition: { delay: (actions.length - index - 1) * 0.05 }
                }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-600/50 text-sm text-white whitespace-nowrap"
                >
                  {action.label}
                </motion.div>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center shadow-lg`}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};