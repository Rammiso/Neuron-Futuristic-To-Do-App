// Performance monitoring utilities for NEURON Tasks

// Performance observer for monitoring render times
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  // Start measuring a component render
  startMeasure(componentName) {
    if (!this.isEnabled) return;
    
    const startTime = performance.now();
    this.metrics.set(componentName, { startTime, renders: 0 });
  }

  // End measuring and log results
  endMeasure(componentName) {
    if (!this.isEnabled) return;
    
    const metric = this.metrics.get(componentName);
    if (!metric) return;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metric.renders++;
    metric.lastRenderTime = duration;
    metric.averageRenderTime = metric.averageRenderTime 
      ? (metric.averageRenderTime + duration) / 2 
      : duration;

    // Log slow renders in development only
    if (process.env.NODE_ENV === 'development' && duration > 16) {
      console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
    }

    this.metrics.set(componentName, metric);
  }

  // Get performance metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Monitor FPS
  startFPSMonitor() {
    if (!this.isEnabled) return;

    let frames = 0;
    let lastTime = performance.now();

    const countFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        if (process.env.NODE_ENV === 'development' && fps < 50) {
          console.warn(`Low FPS detected: ${fps} fps`);
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFPS);
    };

    requestAnimationFrame(countFPS);
  }

  // Monitor memory usage
  monitorMemory() {
    if (!this.isEnabled || !performance.memory) return;

    const memory = performance.memory;
    const used = Math.round(memory.usedJSHeapSize / 1048576); // MB
    const total = Math.round(memory.totalJSHeapSize / 1048576); // MB
    
    if (process.env.NODE_ENV === 'development' && used > 100) {
      console.warn(`High memory usage: ${used}MB / ${total}MB`);
    }

    return { used, total };
  }

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Get device performance tier
  getPerformanceTier() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const connection = navigator.connection?.effectiveType || '4g';

    if (cores >= 8 && memory >= 8 && connection === '4g') {
      return 'high';
    } else if (cores >= 4 && memory >= 4) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Optimize animations based on device
  getOptimizedAnimationConfig() {
    const tier = this.getPerformanceTier();
    const reducedMotion = this.prefersReducedMotion();

    if (reducedMotion) {
      return {
        duration: 0,
        particles: 0,
        blur: false,
        shadows: false
      };
    }

    switch (tier) {
      case 'high':
        return {
          duration: 0.3,
          particles: 35,
          blur: true,
          shadows: true,
          fps: 60
        };
      case 'medium':
        return {
          duration: 0.2,
          particles: 25,
          blur: true,
          shadows: false,
          fps: 30
        };
      case 'low':
        return {
          duration: 0.1,
          particles: 15,
          blur: false,
          shadows: false,
          fps: 30
        };
      default:
        return {
          duration: 0.2,
          particles: 25,
          blur: false,
          shadows: false,
          fps: 30
        };
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const startMeasure = () => performanceMonitor.startMeasure(componentName);
  const endMeasure = () => performanceMonitor.endMeasure(componentName);
  
  return { startMeasure, endMeasure };
};

// HOC for performance monitoring
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return function PerformanceMonitoredComponent(props) {
    const { startMeasure, endMeasure } = usePerformanceMonitor(componentName);
    
    React.useEffect(() => {
      startMeasure();
      return endMeasure;
    });

    return React.createElement(WrappedComponent, props);
  };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [ref, setRef] = React.useState(null);

  React.useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isIntersecting];
};

// Virtual scrolling utilities
export const calculateVisibleItems = (scrollTop, itemHeight, containerHeight, totalItems) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems - 1
  );
  
  return { startIndex, endIndex };
};

// Memoization helper
export const createMemoizedSelector = (selector) => {
  let lastArgs = [];
  let lastResult;
  
  return (...args) => {
    const argsChanged = args.length !== lastArgs.length || 
      args.some((arg, index) => arg !== lastArgs[index]);
    
    if (argsChanged) {
      lastArgs = args;
      lastResult = selector(...args);
    }
    
    return lastResult;
  };
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((total, script) => {
    return total + (script.src.length * 2); // Rough estimate
  }, 0);
  
  // Bundle size analysis for development only
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startFPSMonitor();
  
  // Monitor memory every 30 seconds
  setInterval(() => {
    performanceMonitor.monitorMemory();
  }, 30000);
  
  // Log performance metrics every minute in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      console.table(performanceMonitor.getMetrics());
    }, 60000);
  }
}