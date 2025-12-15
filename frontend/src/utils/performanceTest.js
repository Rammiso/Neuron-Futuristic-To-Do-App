// Performance testing utility to verify no blocking operations
class PerformanceTest {
  constructor() {
    this.results = {
      timeToFirstPaint: null,
      timeToInteractive: null,
      blockingTasks: [],
      memoryUsage: null,
      frameRate: null,
      bundleSize: null
    };
    
    this.startTime = performance.now();
    this.isRunning = false;
  }

  // Start comprehensive performance test
  async runTest() {
    if (this.isRunning) return this.results;
    
    this.isRunning = true;
    console.log('🚀 Starting NEURON Performance Test...');

    try {
      // Test 1: Time to First Paint
      await this.testTimeToFirstPaint();
      
      // Test 2: Time to Interactive
      await this.testTimeToInteractive();
      
      // Test 3: Blocking Tasks Detection
      await this.testBlockingTasks();
      
      // Test 4: Memory Usage
      await this.testMemoryUsage();
      
      // Test 5: Frame Rate
      await this.testFrameRate();
      
      // Test 6: Bundle Analysis
      await this.testBundleSize();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      this.isRunning = false;
    }

    return this.results;
  }

  // Test 1: Measure time to first paint
  async testTimeToFirstPaint() {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.results.timeToFirstPaint = entry.startTime;
            console.log(`✅ First Contentful Paint: ${Math.round(entry.startTime)}ms`);
            observer.disconnect();
            resolve();
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      
      // Fallback timeout
      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 5000);
    });
  }

  // Test 2: Measure time to interactive
  async testTimeToInteractive() {
    return new Promise((resolve) => {
      const checkInteractive = () => {
        // Check if main thread is free and app is responsive
        const isInteractive = this.isAppInteractive();
        
        if (isInteractive) {
          this.results.timeToInteractive = performance.now() - this.startTime;
          console.log(`✅ Time to Interactive: ${Math.round(this.results.timeToInteractive)}ms`);
          resolve();
        } else {
          setTimeout(checkInteractive, 100);
        }
      };

      checkInteractive();
      
      // Fallback timeout
      setTimeout(() => {
        this.results.timeToInteractive = performance.now() - this.startTime;
        console.log(`⚠️ Time to Interactive (timeout): ${Math.round(this.results.timeToInteractive)}ms`);
        resolve();
      }, 10000);
    });
  }

  // Test 3: Detect blocking tasks
  async testBlockingTasks() {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.results.blockingTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
            console.warn(`❌ Blocking task detected: ${Math.round(entry.duration)}ms`);
          }
        });
      });

      if ('PerformanceObserver' in window) {
        observer.observe({ entryTypes: ['longtask'] });
      }

      // Monitor for 5 seconds
      setTimeout(() => {
        observer.disconnect();
        
        if (this.results.blockingTasks.length === 0) {
          console.log('✅ No blocking tasks detected');
        } else {
          console.warn(`❌ Found ${this.results.blockingTasks.length} blocking tasks`);
        }
        
        resolve();
      }, 5000);
    });
  }

  // Test 4: Monitor memory usage
  async testMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      this.results.memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
      
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const percentage = Math.round(this.results.memoryUsage.percentage);
      
      if (percentage < 50) {
        console.log(`✅ Memory usage: ${usedMB}MB (${percentage}%)`);
      } else if (percentage < 80) {
        console.warn(`⚠️ Memory usage: ${usedMB}MB (${percentage}%)`);
      } else {
        console.error(`❌ High memory usage: ${usedMB}MB (${percentage}%)`);
      }
    } else {
      console.log('ℹ️ Memory API not available');
    }
  }

  // Test 5: Monitor frame rate
  async testFrameRate() {
    return new Promise((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          this.results.frameRate = fps;
          
          if (fps >= 55) {
            console.log(`✅ Frame rate: ${fps}fps`);
          } else if (fps >= 30) {
            console.warn(`⚠️ Frame rate: ${fps}fps`);
          } else {
            console.error(`❌ Low frame rate: ${fps}fps`);
          }
          
          resolve();
          return;
        }
        
        requestAnimationFrame(measureFPS);
      };
      
      requestAnimationFrame(measureFPS);
      
      // Fallback timeout
      setTimeout(() => {
        console.log('ℹ️ Frame rate test timeout');
        resolve();
      }, 3000);
    });
  }

  // Test 6: Analyze bundle size (approximate)
  async testBundleSize() {
    try {
      // Get all script tags
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      let totalSize = 0;
      
      for (const script of scripts) {
        try {
          const response = await fetch(script.src, { method: 'HEAD' });
          const size = parseInt(response.headers.get('content-length') || '0');
          totalSize += size;
        } catch (error) {
          // Ignore CORS errors for external scripts
        }
      }
      
      this.results.bundleSize = totalSize;
      const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
      
      if (totalSize < 1024 * 1024) { // < 1MB
        console.log(`✅ Bundle size: ${sizeMB}MB`);
      } else if (totalSize < 2 * 1024 * 1024) { // < 2MB
        console.warn(`⚠️ Bundle size: ${sizeMB}MB`);
      } else {
        console.error(`❌ Large bundle size: ${sizeMB}MB`);
      }
    } catch (error) {
      console.log('ℹ️ Bundle size analysis failed:', error.message);
    }
  }

  // Check if app is interactive
  isAppInteractive() {
    // Check if main navigation elements are present and clickable
    const nav = document.querySelector('nav');
    const buttons = document.querySelectorAll('button');
    const links = document.querySelectorAll('a');
    
    return nav && buttons.length > 0 && links.length > 0;
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n📊 NEURON Performance Report');
    console.log('================================');
    
    // Overall score
    const score = this.calculateScore();
    console.log(`Overall Score: ${score}/100`);
    
    if (score >= 90) {
      console.log('🎉 Excellent performance! Ready for production.');
    } else if (score >= 70) {
      console.log('✅ Good performance with room for improvement.');
    } else {
      console.log('⚠️ Performance needs optimization.');
    }
    
    // Detailed metrics
    console.log('\nDetailed Metrics:');
    console.log(`- First Paint: ${this.results.timeToFirstPaint ? Math.round(this.results.timeToFirstPaint) + 'ms' : 'N/A'}`);
    console.log(`- Time to Interactive: ${this.results.timeToInteractive ? Math.round(this.results.timeToInteractive) + 'ms' : 'N/A'}`);
    console.log(`- Blocking Tasks: ${this.results.blockingTasks.length}`);
    console.log(`- Frame Rate: ${this.results.frameRate ? this.results.frameRate + 'fps' : 'N/A'}`);
    console.log(`- Memory Usage: ${this.results.memoryUsage ? Math.round(this.results.memoryUsage.percentage) + '%' : 'N/A'}`);
    
    // Recommendations
    this.generateRecommendations();
  }

  // Calculate performance score
  calculateScore() {
    let score = 100;
    
    // Deduct for slow first paint
    if (this.results.timeToFirstPaint > 1000) score -= 20;
    else if (this.results.timeToFirstPaint > 500) score -= 10;
    
    // Deduct for slow interactivity
    if (this.results.timeToInteractive > 2000) score -= 25;
    else if (this.results.timeToInteractive > 1000) score -= 15;
    
    // Deduct for blocking tasks
    score -= this.results.blockingTasks.length * 10;
    
    // Deduct for low frame rate
    if (this.results.frameRate < 30) score -= 20;
    else if (this.results.frameRate < 50) score -= 10;
    
    // Deduct for high memory usage
    if (this.results.memoryUsage && this.results.memoryUsage.percentage > 80) score -= 15;
    else if (this.results.memoryUsage && this.results.memoryUsage.percentage > 60) score -= 10;
    
    return Math.max(0, score);
  }

  // Generate performance recommendations
  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.timeToFirstPaint > 1000) {
      recommendations.push('- Optimize critical rendering path');
      recommendations.push('- Reduce initial bundle size');
    }
    
    if (this.results.blockingTasks.length > 0) {
      recommendations.push('- Break up long-running tasks');
      recommendations.push('- Use requestIdleCallback for non-critical work');
    }
    
    if (this.results.frameRate < 50) {
      recommendations.push('- Reduce animation complexity');
      recommendations.push('- Optimize rendering performance');
    }
    
    if (this.results.memoryUsage && this.results.memoryUsage.percentage > 60) {
      recommendations.push('- Optimize memory usage');
      recommendations.push('- Clean up unused resources');
    }
    
    if (recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      recommendations.forEach(rec => console.log(rec));
    } else {
      console.log('\n✨ No performance issues detected!');
    }
  }
}

// Export for use in development
export default PerformanceTest;

// Auto-run in development mode
if (process.env.NODE_ENV === 'development') {
  // Run test after app loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      const test = new PerformanceTest();
      window.performanceTest = test; // Make available in console
      test.runTest();
    }, 1000);
  });
}