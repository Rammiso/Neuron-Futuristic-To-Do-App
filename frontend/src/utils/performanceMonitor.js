// Performance monitoring and optimization utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null
    };
    
    this.deviceCapability = this.detectDeviceCapability();
    this.connectionSpeed = this.detectConnectionSpeed();
    this.isLowEndDevice = this.deviceCapability === 'low';
    
    this.initializeMonitoring();
  }

  // Detect device capability for adaptive loading
  detectDeviceCapability() {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    const hasSlowConnection = navigator.connection?.effectiveType === 'slow-2g' || 
                             navigator.connection?.effectiveType === '2g';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;

    if (prefersReducedMotion || hasSlowConnection || lowMemory || (isMobile && isLowEnd)) {
      return 'low';
    } else if (isMobile || isLowEnd) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  // Detect connection speed
  detectConnectionSpeed() {
    if (!navigator.connection) return 'unknown';
    
    const connection = navigator.connection;
    const effectiveType = connection.effectiveType;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'medium';
    if (effectiveType === '4g') return 'fast';
    
    return 'unknown';
  }

  // Initialize performance monitoring
  initializeMonitoring() {
    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor long tasks that could block the main thread
    this.observeLongTasks();
    
    // Monitor memory usage
    this.observeMemoryUsage();
    
    // Monitor frame rate
    this.observeFrameRate();
  }

  // Observe Core Web Vitals
  observeWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.logMetric('FCP', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.logMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.logMetric('FID', this.metrics.fid);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Monitor long tasks that could block the UI
  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
            
            // If we detect blocking tasks during initialization, 
            // we can defer non-critical operations
            if (entry.duration > 100) {
              this.handleBlockingTask(entry);
            }
          }
        });
      }).observe({ entryTypes: ['longtask'] });
    }
  }

  // Handle blocking tasks by deferring operations
  handleBlockingTask(entry) {
    // Emit event to defer non-critical operations
    window.dispatchEvent(new CustomEvent('performance:blocking-task', {
      detail: { duration: entry.duration, entry }
    }));
  }

  // Monitor memory usage
  observeMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usedPercent > 80) {
          console.warn('High memory usage detected:', usedPercent + '%');
          // Trigger garbage collection hints
          this.optimizeMemoryUsage();
        }
      }, 10000); // Check every 10 seconds
    }
  }

  // Monitor frame rate
  observeFrameRate() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
          console.warn('Low frame rate detected:', fps + 'fps');
          // Reduce animation complexity
          this.handleLowFrameRate(fps);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  // Handle low frame rate by reducing effects
  handleLowFrameRate(fps) {
    window.dispatchEvent(new CustomEvent('performance:low-fps', {
      detail: { fps }
    }));
  }

  // Optimize memory usage
  optimizeMemoryUsage() {
    // Trigger cleanup events
    window.dispatchEvent(new CustomEvent('performance:memory-pressure'));
  }

  // Get optimized animation configuration based on device capability
  getOptimizedAnimationConfig() {
    switch (this.deviceCapability) {
      case 'low':
        return {
          duration: 0.2,
          easing: 'linear',
          reducedMotion: true,
          particleCount: 5,
          maxConnections: 1
        };
      case 'medium':
        return {
          duration: 0.3,
          easing: 'easeOut',
          reducedMotion: false,
          particleCount: 15,
          maxConnections: 2
        };
      case 'high':
      default:
        return {
          duration: 0.4,
          easing: 'easeInOut',
          reducedMotion: false,
          particleCount: 30,
          maxConnections: 4
        };
    }
  }

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Get loading strategy based on device and connection
  getLoadingStrategy() {
    if (this.isLowEndDevice || this.connectionSpeed === 'slow') {
      return {
        deferAnimations: true,
        reduceParticles: true,
        lazyLoadImages: true,
        preloadCritical: false,
        chunkSize: 'small'
      };
    }
    
    return {
      deferAnimations: false,
      reduceParticles: false,
      lazyLoadImages: false,
      preloadCritical: true,
      chunkSize: 'normal'
    };
  }

  // Log performance metrics
  logMetric(name, value) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance ${name}:`, Math.round(value) + 'ms');
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        device_capability: this.deviceCapability,
        connection_speed: this.connectionSpeed
      });
    }
  }

  // Get current performance score
  getPerformanceScore() {
    const { fcp, lcp, fid, cls } = this.metrics;
    
    let score = 100;
    
    // Deduct points for poor metrics
    if (fcp > 1800) score -= 20;
    else if (fcp > 1000) score -= 10;
    
    if (lcp > 2500) score -= 25;
    else if (lcp > 1500) score -= 15;
    
    if (fid > 100) score -= 20;
    else if (fid > 50) score -= 10;
    
    if (cls > 0.25) score -= 15;
    else if (cls > 0.1) score -= 10;
    
    return Math.max(0, score);
  }

  // Check if app is performing well
  isPerformingWell() {
    return this.getPerformanceScore() >= 80;
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Export utilities for components
export const usePerformanceOptimization = () => {
  return {
    deviceCapability: performanceMonitor.deviceCapability,
    connectionSpeed: performanceMonitor.connectionSpeed,
    isLowEndDevice: performanceMonitor.isLowEndDevice,
    prefersReducedMotion: performanceMonitor.prefersReducedMotion(),
    animationConfig: performanceMonitor.getOptimizedAnimationConfig(),
    loadingStrategy: performanceMonitor.getLoadingStrategy()
  };
};