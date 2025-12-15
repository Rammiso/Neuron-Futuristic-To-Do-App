import { useState, useEffect } from 'react';
import { SkeletonLoader } from './InstantLoader';
import { usePerformanceOptimization } from '../utils/performanceMonitor';

// Phase 1: Instant App Shell - Critical path only (never blocks)
export const AppShell = ({ children, isLoading = false, type = 'page' }) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const { isLowEndDevice, prefersReducedMotion } = usePerformanceOptimization();

  // Phase 2: Enhancement after first paint (non-blocking)
  useEffect(() => {
    const enableEnhancements = () => {
      setIsEnhanced(true);
    };

    // Skip enhancements on low-end devices or if user prefers reduced motion
    if (isLowEndDevice || prefersReducedMotion) {
      return;
    }

    // Use requestIdleCallback for non-blocking enhancement
    if ('requestIdleCallback' in window) {
      requestIdleCallback(enableEnhancements, { timeout: 200 });
    } else {
      setTimeout(enableEnhancements, 50);
    }
  }, [isLowEndDevice, prefersReducedMotion]);

  // Show instant skeleton loader while loading
  if (isLoading) {
    return <SkeletonLoader type={type} />;
  }

  // Return enhanced or basic shell based on device capability
  return (
    <div className={`min-h-screen ${isEnhanced && !isLowEndDevice ? 'transition-all duration-300' : ''}`}>
      {children}
    </div>
  );
};

// Instant skeleton for protected routes
export const DashboardShell = () => (
  <div className="min-h-screen bg-gray-900 flex">
    {/* Sidebar skeleton */}
    <div className="w-64 bg-gray-800/50 border-r border-gray-700/50 p-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-emerald-400/20 rounded-lg"></div>
        <div className="h-6 bg-gray-700/30 rounded w-24"></div>
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 bg-gray-700/20 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="flex-1 flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-800/50 border-b border-gray-700/50 flex items-center justify-between px-6">
        <div className="h-8 bg-gray-700/30 rounded w-48 animate-pulse"></div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-700/30 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-700/30 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-800/20 rounded-lg animate-pulse"></div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-800/20 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);