import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { memo, useMemo, useCallback } from "react";
import { performanceMonitor } from "../utils/performance";

// Memoized corner accents component
const CornerAccents = memo(() => (
  <>
    <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-emerald-400/50" />
    <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-emerald-400/50" />
    <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-emerald-400/50" />
    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-emerald-400/50" />
  </>
));

// Memoized loading spinner
const LoadingSpinner = memo(() => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <Loader2 className="w-4 h-4" />
  </motion.div>
));

export const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  disableAnimations = false,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const animationConfig = performanceMonitor.getOptimizedAnimationConfig();
  const shouldAnimate = !disableAnimations && !performanceMonitor.prefersReducedMotion();

  // Memoized style objects to prevent recreation
  const baseStyles = useMemo(() => `
    font-mono font-semibold rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-gray-900
    relative overflow-hidden disabled:cursor-not-allowed
    will-change-transform
  `, []);

  const variants = useMemo(() => ({
    primary: `
      bg-gradient-to-r from-emerald-500 to-cyan-500
      text-black font-bold tracking-wide
      hover:from-emerald-400 hover:to-cyan-400
      ${animationConfig.shadows ? 'hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]' : ''}
      disabled:from-gray-600 disabled:to-gray-700
      disabled:text-gray-400 disabled:shadow-none
    `,
    secondary: `
      bg-gray-900/50 backdrop-blur-sm
      border border-emerald-500/30 text-emerald-400
      hover:border-emerald-400 hover:bg-emerald-500/10
      ${animationConfig.shadows ? 'hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''}
      disabled:border-gray-600 disabled:text-gray-500
      disabled:hover:bg-gray-900/50 disabled:hover:border-gray-600
    `,
    ghost: `
      text-gray-300 hover:text-emerald-400
      hover:bg-emerald-500/10
      disabled:text-gray-600 disabled:hover:bg-transparent
    `,
  }), [animationConfig.shadows]);

  const sizes = useMemo(() => ({
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  }), []);

  // Memoized animation variants
  const hoverVariants = useMemo(() => ({
    hover: shouldAnimate ? { 
      scale: isDisabled ? 1 : 1.02,
      transition: { duration: animationConfig.duration }
    } : {},
    tap: shouldAnimate ? { 
      scale: isDisabled ? 1 : 0.98,
      transition: { duration: animationConfig.duration * 0.5 }
    } : {}
  }), [isDisabled, shouldAnimate, animationConfig.duration]);

  // Memoized scan effect variants
  const scanVariants = useMemo(() => ({
    initial: { x: "-100%" },
    hover: shouldAnimate ? { 
      x: "100%",
      transition: { duration: 0.6 }
    } : { x: "-100%" }
  }), [shouldAnimate]);

  // Optimized click handler
  const handleClick = useCallback((e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  }, [isDisabled, onClick]);

  // Memoized className
  const buttonClassName = useMemo(() => 
    `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim(),
    [baseStyles, variants, variant, sizes, size, className]
  );

  return (
    <motion.button
      variants={hoverVariants}
      whileHover={shouldAnimate ? "hover" : undefined}
      whileTap={shouldAnimate ? "tap" : undefined}
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClassName}
      {...props}
    >
      {/* Holographic scan effect - only render if animations enabled */}
      {!isDisabled && shouldAnimate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          variants={scanVariants}
          initial="initial"
          whileHover="hover"
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading && <LoadingSpinner />}
        <span>{children}</span>
      </span>
      
      {/* Corner accents - only render if not disabled */}
      {!isDisabled && <CornerAccents />}
    </motion.button>
  );
});
