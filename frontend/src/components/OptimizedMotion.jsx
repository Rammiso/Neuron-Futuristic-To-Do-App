import { motion } from 'framer-motion';
import { usePerformanceOptimization } from '../utils/performanceMonitor';

// Performance-aware motion wrapper
export const OptimizedMotion = ({ children, disabled, ...props }) => {
  const { isLowEndDevice, prefersReducedMotion } = usePerformanceOptimization();
  
  // Disable animations on low-end devices or when user prefers reduced motion
  const shouldDisableAnimation = disabled || isLowEndDevice || prefersReducedMotion;
  
  if (shouldDisableAnimation) {
    // Return a regular div with only the final styles
    const finalStyle = props.animate || props.style || {};
    return (
      <div style={finalStyle} className={props.className}>
        {children}
      </div>
    );
  }
  
  // Use motion only when performance allows
  return (
    <motion.div {...props}>
      {children}
    </motion.div>
  );
};

// Optimized AnimatePresence that respects performance settings
export const OptimizedAnimatePresence = ({ children, disabled, ...props }) => {
  const { isLowEndDevice, prefersReducedMotion } = usePerformanceOptimization();
  
  if (disabled || isLowEndDevice || prefersReducedMotion) {
    return children;
  }
  
  // Lazy load AnimatePresence only when needed
  const { AnimatePresence } = require('framer-motion');
  return <AnimatePresence {...props}>{children}</AnimatePresence>;
};

// Simple fade animation for critical elements
export const simpleFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

// Reduced motion variants
export const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};