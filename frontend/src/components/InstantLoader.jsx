import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { usePerformanceOptimization } from '../utils/performanceMonitor';

// Instant, non-blocking loader that appears immediately
export const InstantLoader = ({ 
  message = "Loading...", 
  showProgress = false,
  minimal = false 
}) => {
  const [progress, setProgress] = useState(0);
  const { isLowEndDevice, prefersReducedMotion } = usePerformanceOptimization();

  // Simulate progress for better UX (non-blocking)
  useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // Stop at 90%, let actual loading complete
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showProgress]);

  // Minimal loader for low-end devices
  if (minimal || isLowEndDevice) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="w-5 h-5 text-black" />
          </div>
          <p className="text-emerald-400 text-sm font-mono">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Brain className="w-7 h-7 text-black" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            NEURON
          </span>
        </div>

        {/* Loading indicator */}
        <div className="mb-6">
          {!prefersReducedMotion ? (
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full"></div>
              <div 
                className="absolute inset-0 border-2 border-emerald-400 rounded-full border-t-transparent animate-spin"
                style={{ animationDuration: '1s' }}
              ></div>
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto bg-emerald-400/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-emerald-400 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Message */}
        <p className="text-emerald-400 font-mono text-sm mb-4">
          {message}
        </p>

        {/* Progress bar */}
        {showProgress && (
          <div className="w-full bg-gray-800/50 rounded-full h-1 mb-4">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Hint */}
        <p className="text-gray-400 text-xs">
          Initializing neural pathways...
        </p>
      </div>
    </div>
  );
};

// Ultra-fast skeleton loader for immediate display
export const SkeletonLoader = ({ type = 'page' }) => {
  const { isLowEndDevice } = usePerformanceOptimization();

  if (type === 'navigation') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-400/20 rounded-lg"></div>
            <div className="w-20 h-6 bg-gray-700/30 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-8 bg-gray-700/20 rounded"></div>
            <div className="w-20 h-8 bg-emerald-400/20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <div className="w-64 bg-gray-800/50 border-r border-gray-700/50 p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-700/20 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-800/20 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default page skeleton
  return (
    <div className="min-h-screen bg-gray-900">
      <SkeletonLoader type="navigation" />
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="h-12 bg-gray-800/30 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-800/20 rounded w-3/4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-800/20 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Emergency fallback for when everything else fails
export const EmergencyFallback = ({ error }) => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Brain className="w-7 h-7 text-red-400" />
      </div>
      <h1 className="text-xl font-bold text-white mb-2">
        Neural Interface Error
      </h1>
      <p className="text-gray-400 text-sm mb-4">
        Something went wrong during initialization
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
      >
        Restart Interface
      </button>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4 text-left">
          <summary className="text-xs text-gray-500 cursor-pointer">
            Debug Info
          </summary>
          <pre className="text-xs text-red-400 mt-2 p-2 bg-gray-800 rounded overflow-auto">
            {error.toString()}
          </pre>
        </details>
      )}
    </div>
  </div>
);