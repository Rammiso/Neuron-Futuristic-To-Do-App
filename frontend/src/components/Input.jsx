import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({
  label,
  error,
  icon: Icon,
  className = "",
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {label && (
        <motion.label 
          className="block text-sm font-semibold text-gray-300 mb-2 font-mono tracking-wide"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isFocused ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {label.toUpperCase()}
        </motion.label>
      )}
      
      <div className="relative group">
        {Icon && (
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
            animate={{
              color: isFocused ? "#00ff88" : "#6b7280",
              scale: isFocused ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
        
        <motion.input
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.005 }}
          className={`
            w-full px-4 py-3 ${Icon ? "pl-11" : ""} ${isPassword ? "pr-11" : ""}
            bg-gray-900/50 backdrop-blur-sm
            border border-emerald-500/30 rounded-lg
            text-white placeholder-gray-400 font-mono
            focus:border-emerald-400 focus:outline-none
            focus:shadow-[0_0_20px_rgba(16,185,129,0.3)]
            transition-all duration-300
            ${error 
              ? "border-red-500/50 focus:border-red-400 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]" 
              : ""
            }
            ${className}
          `}
          {...props}
        />
        
        {isPassword && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-400 hover:text-emerald-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.button>
        )}
        
        {/* Holographic scan line effect */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
              animate={{
                y: [0, 48, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-sm font-mono text-red-400 flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse" />
            {error}
          </p>
        </motion.div>
      )}
    </div>
  );
};
