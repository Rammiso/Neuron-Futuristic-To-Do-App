import { memo, useMemo } from 'react';
import { usePerformanceOptimization } from '../utils/performanceMonitor';

// High-performance wrapper for expensive components
export const PerformanceWrapper = memo(({ 
  children, 
  fallback = null, 
  enableOnLowEnd = false,
  className = ''
}) => {
  const { isLowEndDevice, prefersReducedMotion } = usePerformanceOptimization();
  
  // Memoize the decision to avoid recalculation
  const shouldRender = useMemo(() => {
    if (enableOnLowEnd) return true;
    return !isLowEndDevice;
  }, [isLowEndDevice, enableOnLowEnd]);
  
  if (!shouldRender) {
    return fallback || <div className={className} />;
  }
  
  return children;
});

PerformanceWrapper.displayName = 'PerformanceWrapper';

// Wrapper for animation-heavy components
export const AnimationWrapper = memo(({ children, fallback, className = '' }) => {
  const { isLowEndDevice, prefersReducedMotion } = usePerformanceOptimization();
  
  if (isLowEndDevice || prefersReducedMotion) {
    return fallback || <div className={className}>{children}</div>;
  }
  
  return children;
});

AnimationWrapper.displayName = 'AnimationWrapper';