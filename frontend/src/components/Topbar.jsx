import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, User, Moon, Sun } from "lucide-react";
import { useAuthStore } from "../context/authStore";
import { useThemeStore } from "../context/themeStore";
import { getMonthYear } from "../utils/dateUtils";
import { ProfileModal } from "./ProfileModal";

export const Topbar = () => {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-neon border-b border-cyber-border dark:border-cyber-border sticky top-0 z-30 bg-white/80 dark:bg-cyber-card/80 backdrop-blur-xl"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left side - Date with mobile spacing */}
        <div className="font-mono ml-0 md:ml-0 pl-14 md:pl-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-neon-green">
            {getMonthYear(new Date())}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long" })}
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 md:p-2.5 hover:bg-gray-200 dark:hover:bg-cyber-card rounded-lg transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 md:p-2.5 hover:bg-gray-200 dark:hover:bg-cyber-card rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-400" />
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 bg-neon-green rounded-full shadow-neon-green" />
          </motion.button>

          {/* User info - hidden on small mobile */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProfileOpen(true)}
              className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-cyber-border hover:bg-gray-100 dark:hover:bg-cyber-card/50 rounded-lg pr-2 py-1 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  ACTIVE
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-neon-dark/20 dark:bg-neon-green/20 border border-neon-dark/30 dark:border-neon-green/30 flex items-center justify-center">
                <User className="w-5 h-5 text-neon-dark dark:text-neon-green" />
              </div>
            </motion.button>
          )}
          
          {/* User avatar only on mobile */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsProfileOpen(true)}
              className="sm:hidden w-8 h-8 rounded-full bg-neon-dark/20 dark:bg-neon-green/20 border border-neon-dark/30 dark:border-neon-green/30 flex items-center justify-center ml-2"
            >
              <User className="w-4 h-4 text-neon-dark dark:text-neon-green" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </motion.div>
  );
};
