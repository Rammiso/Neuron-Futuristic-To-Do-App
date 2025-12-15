// Render loop protection utility
class RenderLoopProtection {
  constructor() {
    this.renderCounts = new Map();
    this.maxRenders = 10;
    this.timeWindow = 1000; // 1 second
  }

  // Check if component is rendering too frequently
  checkRenderLoop(componentName) {
    const now = Date.now();
    const key = componentName;
    
    if (!this.renderCounts.has(key)) {
      this.renderCounts.set(key, []);
    }
    
    const renders = this.renderCounts.get(key);
    
    // Remove old renders outside time window
    const recentRenders = renders.filter(time => now - time < this.timeWindow);
    
    // Add current render
    recentRenders.push(now);
    this.renderCounts.set(key, recentRenders);
    
    // Check if too many renders
    if (recentRenders.length > this.maxRenders) {
      console.error(`Render loop detected in ${componentName}: ${recentRenders.length} renders in ${this.timeWindow}ms`);
      return true;
    }
    
    return false;
  }

  // Reset render count for component
  resetComponent(componentName) {
    this.renderCounts.delete(componentName);
  }

  // Clear all render counts
  clearAll() {
    this.renderCounts.clear();
  }
}

const renderLoopProtection = new RenderLoopProtection();

export default renderLoopProtection;

// Hook to use render loop protection
export const useRenderLoopProtection = (componentName) => {
  const isLooping = renderLoopProtection.checkRenderLoop(componentName);
  
  if (isLooping) {
    console.warn(`Render loop protection activated for ${componentName}`);
  }
  
  return isLooping;
};