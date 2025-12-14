import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Zap } from 'lucide-react';

export const PerformanceMonitor = ({ show = false }) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    renderTime: 0,
    particleCount: 50
  });

  useEffect(() => {
    if (!show) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps: fps,
          memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0,
          renderTime: Math.round(currentTime - lastTime),
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-emerald-500/30 font-mono text-xs"
    >
      <div className="flex items-center space-x-2 mb-2">
        <Activity className="w-3 h-3 text-emerald-400" />
        <span className="text-emerald-400 font-semibold">Performance</span>
      </div>
      
      <div className="space-y-1 text-gray-300">
        <div className="flex items-center justify-between space-x-4">
          <span>FPS:</span>
          <span className={`${metrics.fps >= 55 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
            {metrics.fps}
          </span>
        </div>
        
        {metrics.memory > 0 && (
          <div className="flex items-center justify-between space-x-4">
            <span>Memory:</span>
            <span className="text-cyan-400">{metrics.memory}MB</span>
          </div>
        )}
        
        <div className="flex items-center justify-between space-x-4">
          <span>Particles:</span>
          <span className="text-purple-400">{metrics.particleCount}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Toggle performance monitor with Ctrl+Shift+P
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowMonitor(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return { showMonitor, setShowMonitor };
};