import { useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Performance optimized particle background
export const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const isVisibleRef = useRef(true);
  const lastTimeRef = useRef(0);
  const fpsRef = useRef(60);

  // Memoized particle configuration based on device capabilities
  const particleConfig = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    return {
      count: isMobile ? 15 : isLowEnd ? 25 : 35,
      maxConnections: isMobile ? 3 : 5,
      connectionDistance: isMobile ? 80 : 120,
      animationThrottle: isMobile ? 32 : 16, // ms between frames
    };
  }, []);

  // Optimized particle class with object pooling
  const createParticle = useCallback((canvas) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.8,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.2,
    baseOpacity: Math.random() * 0.4 + 0.2,
    pulsePhase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.6 ? '#10b981' : '#06b6d4',
    
    update(deltaTime, canvas) {
      this.x += this.speedX * deltaTime * 0.06;
      this.y += this.speedY * deltaTime * 0.06;

      // Efficient edge wrapping
      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;

      // Optimized pulsing with sine wave
      this.pulsePhase += deltaTime * 0.002;
      this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.1;
    },

    draw(ctx) {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 6.283185307179586); // 2 * Math.PI
      ctx.fill();
    }
  }), []);

  // Throttled resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Recreate particles for new canvas size
    particlesRef.current = Array.from({ length: particleConfig.count }, () => 
      createParticle(canvas)
    );
  }, [particleConfig.count, createParticle]);

  // Optimized connection drawing with spatial partitioning
  const drawConnections = useCallback((ctx, particles, canvas) => {
    const { maxConnections, connectionDistance } = particleConfig;
    
    for (let i = 0; i < particles.length; i++) {
      let connectionCount = 0;
      const particle1 = particles[i];
      
      for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
        const particle2 = particles[j];
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distanceSquared = dx * dx + dy * dy;
        const maxDistanceSquared = connectionDistance * connectionDistance;

        if (distanceSquared < maxDistanceSquared) {
          const opacity = (1 - distanceSquared / maxDistanceSquared) * 0.08;
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.stroke();
          connectionCount++;
        }
      }
    }
  }, [particleConfig]);

  // Performance-optimized animation loop
  const animate = useCallback((currentTime) => {
    if (!isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    
    // Throttle animation based on device capabilities
    if (deltaTime < particleConfig.animationThrottle) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    lastTimeRef.current = currentTime;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;

    // Clear with efficient method
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Batch particle updates and drawing
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(deltaTime, canvas);
      particles[i].draw(ctx);
    }
    ctx.restore();

    // Draw connections with reduced frequency
    if (particles.length > 1) {
      ctx.save();
      drawConnections(ctx, particles, canvas);
      ctx.restore();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [particleConfig.animationThrottle, drawConnections]);

  // Visibility API for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Intersection Observer for viewport detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Main effect with optimized setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    
    // Throttled resize listener
    let resizeTimeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', throttledResize);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', throttledResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(resizeTimeout);
    };
  }, [handleResize, animate]);

  // Memoized floating elements with reduced count for performance
  const floatingElements = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const elementCount = isMobile ? 3 : 4;
    const glowCount = isMobile ? 2 : 3;

    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: elementCount }, (_, i) => (
          <motion.div
            key={`float-${i}`}
            className="absolute w-1.5 h-1.5 bg-emerald-400/15 rounded-full"
            style={{
              left: `${20 + (i * 25)}%`,
              top: `${15 + (i * 20)}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.15, 0.6, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {Array.from({ length: glowCount }, (_, i) => (
          <motion.div
            key={`glow-${i}`}
            className="absolute w-24 h-24 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-xl"
            style={{
              left: `${10 + (i * 35)}%`,
              top: `${20 + (i * 25)}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ 
          background: 'transparent',
          willChange: 'auto', // Let browser optimize
        }}
      />
      {floatingElements}
    </>
  );
};