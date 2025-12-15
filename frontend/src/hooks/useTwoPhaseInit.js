import { useState, useEffect, useCallback } from 'react';
import performanceMonitor from '../utils/performanceMonitor';

// Non-blocking initialization hook that ensures UI responsiveness
export const useTwoPhaseInit = () => {
  const [phase, setPhase] = useState('critical'); // 'critical' | 'enhanced' | 'complete'
  const [isReady, setIsReady] = useState(false);
  const [hasBlockingTasks, setHasBlockingTasks] = useState(false);

  // Phase 1: Critical path (immediate, non-blocking)
  useEffect(() => {
    // Mark critical phase as ready immediately - no blocking operations
    setIsReady(true);
    
    // Listen for blocking task warnings
    const handleBlockingTask = (event) => {
      setHasBlockingTasks(true);
      console.warn('Blocking task detected during initialization:', event.detail);
      
      // Defer enhancements if blocking tasks are detected
      setTimeout(() => setHasBlockingTasks(false), 1000);
    };

    window.addEventListener('performance:blocking-task', handleBlockingTask);
    
    // Schedule Phase 2 enhancement with performance awareness
    const scheduleEnhancement = () => {
      // Don't enhance if we're experiencing blocking tasks
      if (hasBlockingTasks) {
        setTimeout(scheduleEnhancement, 500);
        return;
      }
      
      setPhase('enhanced');
      
      // Schedule completion after enhancements load
      const scheduleCompletion = () => {
        if (hasBlockingTasks) {
          setTimeout(scheduleCompletion, 500);
          return;
        }
        setPhase('complete');
      };

      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(scheduleCompletion, { timeout: 1000 });
      } else {
        setTimeout(scheduleCompletion, 200);
      }
    };

    // Start enhancement after first paint with performance monitoring
    const startEnhancement = () => {
      // Check if we should defer based on device capability
      const strategy = performanceMonitor.getLoadingStrategy();
      const delay = strategy.deferAnimations ? 500 : 50; // Reduced delay
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(scheduleEnhancement, { timeout: delay });
      } else {
        setTimeout(scheduleEnhancement, 16); // One frame delay
      }
    };

    // Start immediately if DOM is ready, otherwise wait
    if (document.readyState === 'complete') {
      startEnhancement();
    } else {
      window.addEventListener('load', startEnhancement, { once: true });
    }

    return () => {
      window.removeEventListener('performance:blocking-task', handleBlockingTask);
      window.removeEventListener('load', startEnhancement);
    };
  }, []); // Remove hasBlockingTasks dependency to prevent loops

  const isCritical = phase === 'critical';
  const isEnhanced = phase === 'enhanced' || phase === 'complete';
  const isComplete = phase === 'complete';

  return {
    phase,
    isReady,
    isCritical,
    isEnhanced,
    isComplete,
    hasBlockingTasks
  };
};

// Hook for progressive feature loading
export const useProgressiveFeature = (featureName, priority = 'low') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isEnhanced, isComplete } = useTwoPhaseInit();

  useEffect(() => {
    if (!isEnhanced && priority !== 'immediate') return;

    const loadFeature = () => {
      setIsLoaded(true);
    };

    switch (priority) {
      case 'immediate':
        loadFeature();
        break;
      case 'high':
        if (isEnhanced) {
          setTimeout(loadFeature, 0);
        }
        break;
      case 'medium':
        if (isEnhanced) {
          setTimeout(loadFeature, 100);
        }
        break;
      case 'low':
      default:
        if (isComplete) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(loadFeature, { timeout: 1000 });
          } else {
            setTimeout(loadFeature, 200);
          }
        }
        break;
    }
  }, [isEnhanced, isComplete, priority, featureName]);

  return isLoaded;
};

// Hook for device-aware loading
export const useDeviceAwareLoading = () => {
  const [deviceCapability, setDeviceCapability] = useState('high');

  useEffect(() => {
    // Detect device capability
    const detectCapability = () => {
      const isMobile = window.innerWidth < 768;
      const isLowEnd = navigator.hardwareConcurrency <= 4;
      const hasSlowConnection = navigator.connection?.effectiveType === 'slow-2g' || 
                               navigator.connection?.effectiveType === '2g';
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion || hasSlowConnection || (isMobile && isLowEnd)) {
        setDeviceCapability('low');
      } else if (isMobile || isLowEnd) {
        setDeviceCapability('medium');
      } else {
        setDeviceCapability('high');
      }
    };

    detectCapability();
    window.addEventListener('resize', detectCapability, { passive: true });

    return () => {
      window.removeEventListener('resize', detectCapability);
    };
  }, []);

  return deviceCapability;
};