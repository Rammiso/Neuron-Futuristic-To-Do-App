import { motion } from "framer-motion";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-lg transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden";

  const variants = {
    primary:
      "bg-neon-dark dark:bg-neon-green text-white dark:text-cyber-darker hover:bg-neon-green dark:hover:bg-neon-lime shadow-neon-green disabled:hover:bg-neon-dark dark:disabled:hover:bg-neon-green font-semibold",
    secondary:
      "glass border border-neon-dark/30 dark:border-neon-green/30 text-neon-dark dark:text-neon-green hover:border-neon-dark/50 dark:hover:border-neon-green/50 hover:shadow-neon-green",
    ghost:
      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cyber-card hover:text-neon-dark dark:hover:text-neon-green",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
