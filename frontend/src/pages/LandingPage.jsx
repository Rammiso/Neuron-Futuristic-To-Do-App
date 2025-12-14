import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Calendar, 
  CheckSquare, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight,
  Play,
  Users,
  Target,
  Clock
} from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { HolographicCard } from '../components/HolographicCard';
import { DemoPreview } from '../components/DemoPreview';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { PerformanceMonitor, usePerformanceMonitor } from '../components/PerformanceMonitor';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const { showMonitor } = usePerformanceMonitor();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assistant',
      description: 'Smart task prioritization and intelligent scheduling with neural network optimization',
      color: 'from-emerald-400 to-cyan-400'
    },
    {
      icon: CheckSquare,
      title: 'Advanced Task Management',
      description: 'Cyberpunk-inspired interface with real-time collaboration and progress tracking',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: Calendar,
      title: 'Quantum Calendar',
      description: 'Time-bending calendar views with predictive scheduling and deadline optimization',
      color: 'from-cyan-400 to-blue-400'
    },
    {
      icon: Zap,
      title: 'Lightning Performance',
      description: 'Blazing fast interface with real-time updates and seamless synchronization',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Military-grade encryption with zero-knowledge architecture for maximum privacy',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Sparkles,
      title: 'Futuristic UI',
      description: 'Immersive cyberpunk design with holographic elements and smooth animations',
      color: 'from-indigo-400 to-purple-400'
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Target, value: '99.9%', label: 'Uptime' },
    { icon: Clock, value: '2.3s', label: 'Avg Load Time' },
    { icon: Zap, value: '50%', label: 'Productivity Boost' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 text-white overflow-hidden">
      <ParticleBackground />
      <PerformanceMonitor show={showMonitor} />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-emerald-500/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              NEURON
            </span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/demo')}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300"
            >
              Try Demo
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          style={{ y }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NEURON
              </span>
              <br />
              <span className="text-white">Tasks</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The future of productivity is here. Experience AI-powered task management 
              with a cyberpunk twist that adapts to your neural patterns.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold text-lg flex items-center space-x-2 hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              <span>Experience Demo</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 glass-neon rounded-xl font-semibold text-lg flex items-center space-x-2 hover:bg-emerald-500/10 transition-all duration-300"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <HolographicCard key={index} className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </HolographicCard>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Demo Preview Section */}
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
                Live Dashboard
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See NEURON Tasks in action with our interactive demo dashboard
            </p>
          </motion.div>
          
          <DemoPreview />
        </div>
      </section>

      {/* Features Section */}
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
                Neural Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge technology meets intuitive design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <HolographicCard className="p-8 h-full hover-lift">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-0.5 mb-6`}>
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </HolographicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Upgrade
              </span> Your Mind?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of users who have already enhanced their productivity with NEURON Tasks
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold text-lg flex items-center space-x-2 hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/demo')}
                className="px-8 py-4 glass-neon rounded-xl font-semibold text-lg flex items-center space-x-2 hover:bg-emerald-500/10 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                <span>Try Demo First</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              NEURON Tasks
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 NEURON Tasks. Enhancing human productivity through AI.
          </p>
        </div>
      </footer>
    </div>
  );
};