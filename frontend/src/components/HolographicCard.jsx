import { motion } from 'framer-motion';
import { useState, useCallback, useMemo, memo } from 'react';

// Memoized corner accents to prevent re-renders
const CornerAccents = memo(() => (
  <>
    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-emerald-400/60" />
    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-emerald-400/60" />
    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-emerald-400/60" />
    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-emerald-400/60" />
  </>
));

// Memoized scan lines with optimized animations
const ScanLines = memo(() => (
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-pulse" />
    {Array.from({ length: 3 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
        style={{ top: `${25 + i * 25}%` }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
));

export const HolographicCard = memo(({ 
  children, 
  className = '', 
  glowColor = 'emerald',
  disableHover = false,
  ...props 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Memoized glow colors to prevent object recreation
  const glowColors = useMemo(() => ({
    emerald: 'rgba(16, 185, 129, 0.3)',
    cyan: 'rgba(6, 182, 212, 0.3)',
    blue: 'rgba(59, 130, 246, 0.3)',
    purple: 'rgba(147, 51, 234, 0.3)',
    pink: 'rgba(236, 72, 153, 0.3)',
  }), []);

  // Throttled mouse move handler for performance
  const handleMouseMove = useCallback((e) => {
    if (disableHover) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only update if position changed significantly (reduces re-renders)
    setMousePosition(prev => {
      if (Math.abs(prev.x - x) > 5 || Math.abs(prev.y - y) > 5) {
        return { x, y };
      }
      return prev;
    });
  }, [disableHover]);

  const handleMouseEnter = useCallback(() => {
    if (!disableHover) setIsHovered(true);
  }, [disableHover]);

  const handleMouseLeave = useCallback(() => {
    if (!disableHover) setIsHovered(false);
  }, [disableHover]);

  // Memoized hover animation variants
  const hoverVariants = useMemo(() => ({
    hover: { 
      scale: 1.02,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }), []);

  // Memoized glow style to prevent recalculation
  const glowStyle = useMemo(() => ({
    width: '200px',
    height: '200px',
    left: mousePosition.x - 100,
    top: mousePosition.y - 100,
    background: `radial-gradient(circle, ${glowColors[glowColor]} 0%, transparent 70%)`,
  }), [mousePosition.x, mousePosition.y, glowColors, glowColor]);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={hoverVariants}
      whileHover={disableHover ? undefined : "hover"}
      {...props}
    >
      {/* Holographic background - static, no re-renders */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl" />
      
      {/* Border glow - static */}
      <div className="absolute inset-0 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-500/20" />
      
      {/* Mouse follow glow - only render when hovered */}
      {isHovered && !disableHover && (
        <motion.div
          className="absolute pointer-events-none rounded-full blur-xl"
          style={glowStyle}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
        />
      )}
      
      {/* Scan lines - memoized component */}
      <ScanLines />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner accents - memoized component */}
      <CornerAccents />
    </motion.div>
  );
});