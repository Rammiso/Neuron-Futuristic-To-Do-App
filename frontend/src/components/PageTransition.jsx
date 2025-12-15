import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const SlideTransition = ({ children, direction = 'right' }) => {
  const location = useLocation();

  const slideVariants = {
    initial: {
      x: direction === 'right' ? '100%' : '-100%',
      opacity: 0
    },
    in: {
      x: 0,
      opacity: 1
    },
    out: {
      x: direction === 'right' ? '-100%' : '100%',
      opacity: 0
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={slideVariants}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.5
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const FadeTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Cyberpunk-style transition with holographic effects
export const CyberTransition = ({ children }) => {
  const location = useLocation();

  const cyberVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      rotateX: 5,
      y: 50
    },
    in: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0
    },
    out: {
      opacity: 0,
      scale: 1.05,
      rotateX: -5,
      y: -50
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={cyberVariants}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{ perspective: 1000 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Non-blocking transition with instant feedback
export const NeuralTransition = ({ children, isLoading = false }) => {
  const location = useLocation();

  // NEVER show a blocking loading screen - always return content immediately
  if (isLoading) {
    // Return instant skeleton instead of blocking screen
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="animate-pulse">
          {/* Instant navigation skeleton */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-400/20 rounded-lg"></div>
                <div className="w-20 h-6 bg-gray-700/30 rounded"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-8 bg-gray-700/20 rounded"></div>
                <div className="w-20 h-8 bg-emerald-400/20 rounded"></div>
              </div>
            </div>
          </nav>
          
          {/* Instant content skeleton */}
          <div className="pt-20 px-6">
            <div className="max-w-7xl mx-auto py-12">
              <div className="h-12 bg-gray-800/30 rounded mb-6"></div>
              <div className="h-6 bg-gray-800/20 rounded mb-4 w-3/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-800/20 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};