import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Progressive motion wrapper that defers animations until after first paint
export const ProgressiveMotion = ({ 
  children, 
  enabled = true, 
  fallback = null,
  priority = 'low',
  ...motionProps 
}) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setIsEnhanced(false);
      return;
    }

    const enableMotion = () => {
      setIsEnhanced(true);
    };

    if (priority === 'immediate') {
      enableMotion();
    } else if (priority === 'idle') {
      // Use requestIdleCallback for lowest priority
      if ('requestIdleCallback' in window) {
        requestIdleCallback(enableMotion, { timeout: 1000 });
      } else {
        setTimeout(enableMotion, 500);
      }
    } else if (priority === 'interaction') {
      // Enable on first user interaction
      const handleInteraction = () => {
        enableMotion();
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      };

      document.addEventListener('click', handleInteraction, { passive: true });
      document.addEventListener('scroll', handleInteraction, { passive: true });
      document.addEventListener('keydown', handleInteraction, { passive: true });

      // Fallback timeout
      const fallbackTimer = setTimeout(enableMotion, 2000);

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        clearTimeout(fallbackTimer);
      };
    } else {
      // Default: enable after a short delay
      const timer = setTimeout(enableMotion, 100);
      return () => clearTimeout(timer);
    }
  }, [enabled, priority]);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!enabled || prefersReducedMotion || !isEnhanced) {
    // Return static version without motion
    return (
      <div ref={elementRef} {...(motionProps.className && { className: motionProps.className })}>
        {fallback || children}
      </div>
    );
  }

  // Return enhanced version with motion
  return (
    <motion.div ref={elementRef} {...motionProps}>
      {children}
    </motion.div>
  );
};

// Specific progressive motion components for common use cases
export const ProgressiveFadeIn = ({ children, delay = 0, ...props }) => (
  <ProgressiveMotion
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay }}
    {...props}
  >
    {children}
  </ProgressiveMotion>
);

export const ProgressiveSlideUp = ({ children, delay = 0, ...props }) => (
  <ProgressiveMotion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    {...props}
  >
    {children}
  </ProgressiveMotion>
);

export const ProgressiveScale = ({ children, delay = 0, ...props }) => (
  <ProgressiveMotion
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    {...props}
  >
    {children}
  </ProgressiveMotion>
);

// Hook for progressive motion state
export const useProgressiveMotion = (priority = 'low') => {
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    const enableMotion = () => setIsEnhanced(true);

    if (priority === 'immediate') {
      enableMotion();
    } else if (priority === 'idle') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(enableMotion, { timeout: 1000 });
      } else {
        setTimeout(enableMotion, 500);
      }
    } else {
      const timer = setTimeout(enableMotion, 100);
      return () => clearTimeout(timer);
    }
  }, [priority]);

  return isEnhanced && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};