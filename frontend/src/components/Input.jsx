import { motion } from "framer-motion";

export const Input = ({
  label,
  error,
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-dark dark:group-focus-within:text-neon-green transition-colors" />
        )}
        <motion.input
          whileFocus={{ scale: 1.005 }}
          className={`w-full px-4 py-2.5 ${
            Icon ? "pl-10" : ""
          } glass rounded-lg input-focus text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium ${
            error
              ? "ring-2 ring-red-500 border-red-500"
              : "border border-gray-200 dark:border-cyber-border"
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-red-600 dark:text-red-400 mt-1.5"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
