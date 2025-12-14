import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', color = 'emerald' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    emerald: 'border-emerald-500',
    cyan: 'border-cyan-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500'
  };

  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        border-2 border-transparent 
        ${colorClasses[color]} 
        border-t-transparent 
        rounded-full
      `}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

export const NeuralLoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="absolute inset-1 border-2 border-cyan-500/50 rounded-full border-t-transparent"
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-2 border-2 border-emerald-400 rounded-full border-b-transparent"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          className="w-1 h-1 bg-emerald-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export const MatrixLoadingEffect = () => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-6 bg-gradient-to-t from-emerald-400 to-cyan-400 rounded-sm"
          animate={{
            scaleY: [0.3, 1, 0.3],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export const PulseLoader = ({ count = 3, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400'
  };

  return (
    <div className="flex items-center space-x-2">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-3 h-3 ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};