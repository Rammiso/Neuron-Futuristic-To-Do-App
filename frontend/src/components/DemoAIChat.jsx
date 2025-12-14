import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Zap, Sparkles } from 'lucide-react';
import { PulseLoader } from './LoadingSpinner';

export const DemoAIChat = ({ onSendMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m NEURON, your AI productivity assistant. I can help you optimize your workflow, prioritize tasks, and boost your productivity. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const demoResponses = [
    "Based on your current task load, I recommend focusing on high-priority items first. Would you like me to reorganize your schedule?",
    "I've analyzed your productivity patterns. You're most efficient between 9-11 AM. Should I schedule your deep work during this time?",
    "Great question! I can help you break down complex tasks into smaller, manageable chunks. This increases completion rates by 40%.",
    "Your productivity score has increased 23% this week! Keep up the excellent work. Would you like tips to maintain this momentum?",
    "I notice you have 3 meetings today. I can suggest optimal break times to prevent cognitive fatigue.",
    "That's a fantastic goal! I can create a personalized action plan with milestones and deadlines. Shall we get started?",
    "I'm designed to learn from your work patterns and continuously improve my suggestions. The more you use NEURON, the smarter I become!",
    "In demo mode, I can show you my capabilities, but the full AI features are available when you sign up. Would you like to see more examples?"
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: demoResponses[Math.floor(Math.random() * demoResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      if (onSendMessage) {
        onSendMessage(userMessage.content);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "How can I be more productive?",
    "Organize my tasks by priority",
    "What's my productivity score?",
    "Schedule my deep work time"
  ];

  return (
    <div className="flex flex-col h-96 bg-gray-800/30 rounded-lg border border-gray-700/50">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-700/50">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 text-black" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">NEURON AI Assistant</h4>
          <div className="flex items-center space-x-2 text-xs text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>Neural Network Active</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30'
                  : 'bg-gray-700/50 text-gray-100 border border-gray-600/30'
              }`}>
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">NEURON</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700/50 border border-gray-600/30 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">NEURON</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <PulseLoader count={3} color="emerald" />
                <span className="text-xs text-gray-400">thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-gray-700/50">
        <div className="flex flex-wrap gap-2 mb-2">
          {quickPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setInputValue(prompt)}
              className="px-3 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-full border border-gray-600/30 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask NEURON anything..."
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none text-sm"
            disabled={isTyping}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};