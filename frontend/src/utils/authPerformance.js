// Authentication performance monitoring utility
class AuthPerformanceMonitor {
  constructor() {
    this.metrics = {
      loginAttempts: 0,
      successfulLogins: 0,
      averageLoginTime: 0,
      slowLogins: 0
    };
  }

  // Track login attempt
  trackLoginStart() {
    this.metrics.loginAttempts++;
    return performance.now();
  }

  // Track login completion
  trackLoginEnd(startTime, success = true) {
    const duration = performance.now() - startTime;
    
    if (success) {
      this.metrics.successfulLogins++;
      
      // Update average login time
      const totalLogins = this.metrics.successfulLogins;
      this.metrics.averageLoginTime = 
        (this.metrics.averageLoginTime * (totalLogins - 1) + duration) / totalLogins;
      
      // Track slow logins (>2 seconds)
      if (duration > 2000) {
        this.metrics.slowLogins++;
        console.warn(`Slow login detected: ${Math.round(duration)}ms`);
      }
      
      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Login completed in ${Math.round(duration)}ms`);
      }
    }
    
    return {
      duration: Math.round(duration),
      isSlowLogin: duration > 2000,
      metrics: this.getMetrics()
    };
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.loginAttempts > 0 
        ? (this.metrics.successfulLogins / this.metrics.loginAttempts * 100).toFixed(1)
        : 0,
      averageLoginTime: Math.round(this.metrics.averageLoginTime)
    };
  }

  // Check if authentication is performing well
  isPerformingWell() {
    return this.metrics.averageLoginTime < 2000 && 
           this.metrics.slowLogins / Math.max(this.metrics.successfulLogins, 1) < 0.2;
  }

  // Get performance recommendations
  getRecommendations() {
    const recommendations = [];
    
    if (this.metrics.averageLoginTime > 3000) {
      recommendations.push('Consider optimizing server response time');
    }
    
    if (this.metrics.slowLogins / Math.max(this.metrics.successfulLogins, 1) > 0.3) {
      recommendations.push('High number of slow logins detected');
    }
    
    if (this.metrics.successfulLogins > 0 && 
        this.metrics.successfulLogins / this.metrics.loginAttempts < 0.8) {
      recommendations.push('High login failure rate detected');
    }
    
    return recommendations;
  }
}

// Create singleton instance
const authPerformanceMonitor = new AuthPerformanceMonitor();

export default authPerformanceMonitor;

// Hook for components to use auth performance monitoring
export const useAuthPerformance = () => {
  return {
    trackLoginStart: () => authPerformanceMonitor.trackLoginStart(),
    trackLoginEnd: (startTime, success) => authPerformanceMonitor.trackLoginEnd(startTime, success),
    getMetrics: () => authPerformanceMonitor.getMetrics(),
    isPerformingWell: () => authPerformanceMonitor.isPerformingWell(),
    getRecommendations: () => authPerformanceMonitor.getRecommendations()
  };
};