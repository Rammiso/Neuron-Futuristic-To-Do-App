import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

// Progressive particle background that loads after first paint
export const ProgressiveParticleBackground = ({ enabled = true, priority = 'low' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const isVisibleRef = useRef(true);
  const lastTimeRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Defer initialization based on priority
  useEffect(() => {
    if (!enabled) return;

    const initializeParticles = () => {
      setIsLoaded(true);
    };

    if (priority === 'immediate') {
      initializeParticles();
    } else if (priority === 'idle') {
      // Use requestIdleCallback for lowest priority
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initializeParticles, { timeout: 2000 });
      } else {
        setTimeout(initializeParticles, 1000);
      }
    } else {
      // Default: load after first interaction or timeout
      const handleFirstInteraction = () => {
        initializeParticles();
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('scroll', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction, { passive: true });
      document.addEventListener('scroll', handleFirstInteraction, { passive: true });
      document.addEventListener('keydown', handleFirstInteraction, { passive: true });

      // Fallback timeout
      const fallbackTimer = setTimeout(initializeParticles, 2000);

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('scroll', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        clearTimeout(fallbackTimer);
      };
    }
  }, [enabled, priority]);

  // Optimized particle configuration
  const particleConfig = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return {
        count: 5,
        maxConnections: 1,
        connectionDistance: 60,
        animationThrottle: 100,
      };
    }
    
    return {
      count: isMobile ? 12 : isLowEnd ? 20 : 30,
      maxConnections: isMobile ? 2 : 4,
      connectionDistance: isMobile ? 70 : 100,
      animationThrottle: isMobile ? 32 : 16,
    };
  }, []);

  // Lightweight particle class
  const createParticle = useCallback((canvas) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.2 + 0.6,
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.3 + 0.1,
    baseOpacity: Math.random() * 0.3 + 0.1,
    pulsePhase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.7 ? '#10b981' : '#06b6d4',
    
    update(deltaTime, canvas) {
      this.x += this.speedX * deltaTime * 0.04;
      this.y += this.speedY * deltaTime * 0.04;

      // Edge wrapping
      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;

      // Subtle pulsing
      this.pulsePhase += deltaTime * 0.001;
      this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.05;
    }
  }), []);

  // Initialize particles
  const initializeParticles = useCallback((canvas) => {
    particlesRef.current = Array.from({ length: particleConfig.count }, () => 
      createParticle(canvas)
    );
  }, [particleConfig.count, createParticle]);

  // Optimized render function
  const render = useCallback((ctx, canvas, currentTime) => {
    if (!isVisibleRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    
    // Throttle animation based on device capability
    if (deltaTime < particleConfig.animationThrottle) {
      animationRef.current = requestAnimationFrame((time) => render(ctx, canvas, time));
      return;
    }

    lastTimeRef.current = currentTime;

    // Clear with fade effect for trails
    ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update(deltaTime, canvas);
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
    });

    // Draw connections (limited for performance)
    let connectionCount = 0;
    for (let i = 0; i < particlesRef.current.length && connectionCount < particleConfig.maxConnections * 3; i++) {
      for (let j = i + 1; j < particlesRef.current.length && connectionCount < particleConfig.maxConnections * 3; j++) {
        const dx = particlesRef.current[i].x - particlesRef.current[j].x;
        const dy = particlesRef.current[i].y - particlesRef.current[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < particleConfig.connectionDistance) {
          const opacity = (1 - distance / particleConfig.connectionDistance) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
          ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          connectionCount++;
        }
      }
    }

    animationRef.current = requestAnimationFrame((time) => render(ctx, canvas, time));
  }, [particleConfig]);

  // Setup canvas and animation
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles(canvas);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Start animation
    animationRef.current = requestAnimationFrame((time) => {
      lastTimeRef.current = time;
      render(ctx, canvas, time);
    });

    // Visibility optimization
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !animationRef.current) {
        animationRef.current = requestAnimationFrame((time) => render(ctx, canvas, time));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoaded, initializeParticles, render]);

  if (!enabled || !isLoaded) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        willChange: 'auto' // Let browser optimize
      }}
    />
  );
};

// Wrapper component for backward compatibility
export const ParticleBackground = (props) => {
  return <ProgressiveParticleBackground {...props} />;
};