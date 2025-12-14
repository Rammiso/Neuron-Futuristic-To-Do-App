import { motion } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useThemeStore } from "../context/themeStore";
import { useAuthStore } from "../context/authStore";
import { 
  Zap, 
  Bell, 
  Shield, 
  HelpCircle, 
  User, 
  Moon, 
  Globe,
  Lock,
  Download,
  Trash2,
  Database,
  Palette,
  Settings,
  Monitor,
  Cpu,
  Activity
} from "lucide-react";
import { Button } from "../components/Button";
import { HolographicCard } from "../components/HolographicCard";
import { ParticleBackground } from "../components/ParticleBackground";
import { useState } from "react";

export const SettingsPage = () => {
  const { isDark, toggleTheme, aiEnabled, toggleAI } = useThemeStore();
  const { user } = useAuthStore();
  const [language, setLanguage] = useState("en");
  const [autoSave, setAutoSave] = useState(true);

  const settings = [
    {
      category: "APPEARANCE",
      icon: Palette,
      items: [
        {
          label: "Dark Mode",
          description: "Toggle dark mode for comfortable viewing",
          toggle: isDark,
          onChange: toggleTheme,
        },
        {
          label: "Compact Mode",
          description: "Reduce spacing for more content",
          toggle: false,
          onChange: () => {},
        },
      ],
    },
    {
      category: "FEATURES",
      icon: Zap,
      items: [
        {
          label: "AI Assistant",
          description: "Enable AI-powered task suggestions",
          toggle: aiEnabled,
          onChange: toggleAI,
        },
        {
          label: "Auto Save",
          description: "Automatically save changes",
          toggle: autoSave,
          onChange: () => setAutoSave(!autoSave),
        },
      ],
    },
    {
      category: "NOTIFICATIONS",
      icon: Bell,
      items: [
        {
          label: "Task Reminders",
          description: "Get notified about upcoming tasks",
          toggle: true,
          onChange: () => {},
        },
        {
          label: "Daily Summary",
          description: "Receive daily productivity summary",
          toggle: true,
          onChange: () => {},
        },
        {
          label: "Email Notifications",
          description: "Receive updates via email",
          toggle: false,
          onChange: () => {},
        },
      ],
    },
    {
      category: "SECURITY",
      icon: Shield,
      items: [
        {
          label: "Two-Factor Auth",
          description: "Add extra security layer",
          toggle: false,
          onChange: () => {},
        },
        {
          label: "Session Timeout",
          description: "Auto logout after inactivity",
          toggle: true,
          onChange: () => {},
        },
      ],
    },
  ];

  const handleExportData = () => {
    alert("Exporting your data...");
  };

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear cache?")) {
      alert("Cache cleared successfully!");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This action cannot be undone!")) {
      alert("Account deletion requested. Please contact support.");
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-2"
          >
            <span className="text-white">Neural</span>{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Settings
            </span>
          </motion.h1>
          <div className="flex items-center space-x-4 text-gray-400 font-mono text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>SYSTEM CONFIGURATION</span>
            </div>
            <span>•</span>
            <span>USER ID: {user?.id?.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <HolographicCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-400/10 border border-emerald-400/30 rounded-lg">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white font-mono">
                  NEURAL PROFILE
                </h2>
              </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider font-mono">
                  USER
                </label>
                <p className="text-lg font-bold text-neon-dark dark:text-neon-green mt-2 font-mono">
                  {user?.name}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider font-mono">
                  EMAIL
                </label>
                <p className="text-base text-gray-700 dark:text-gray-300 mt-2 font-mono">
                  {user?.email}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider font-mono">
                  ROLE
                </label>
                <p className="text-base text-gray-700 dark:text-gray-300 mt-2">
                  {user?.role || "Student"}
                </p>
              </div>
              <div className="pt-5 border-t border-gray-200 dark:border-cyber-border">
                <div className="w-16 h-16 rounded-full bg-neon-dark/20 dark:bg-neon-green/20 border-2 border-neon-dark/30 dark:border-neon-green/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-neon-dark dark:text-neon-green" />
                </div>
              </div>
            </div>
            </HolographicCard>
          </motion.div>

          {/* Settings Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {settings.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              return (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + sectionIndex * 0.05 }}
                  className="glass rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-neon-dark/10 dark:bg-neon-green/10 border border-neon-dark/30 dark:border-neon-green/30 rounded-lg">
                      <SectionIcon className="w-5 h-5 text-neon-dark dark:text-neon-green" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
                      {section.category}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.25 + sectionIndex * 0.05 + itemIndex * 0.03,
                        }}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-cyber-card/50 rounded-lg transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 font-mono">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
                            {item.description}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={item.onChange}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all flex-shrink-0 ml-4 ${
                            item.toggle
                              ? "bg-neon-dark dark:bg-neon-green shadow-neon-green"
                              : "bg-gray-300 dark:bg-cyber-card"
                          }`}
                        >
                          <motion.span
                            layout
                            className={`inline-block h-6 w-6 transform rounded-full shadow-md ${
                              item.toggle ? "bg-white dark:bg-cyber-darker" : "bg-gray-500 dark:bg-gray-600"
                            }`}
                            animate={{
                              x: item.toggle ? 28 : 2,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Language & Region */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-neon-dark/10 dark:bg-neon-green/10 border border-neon-dark/30 dark:border-neon-green/30 rounded-lg">
                  <Globe className="w-5 h-5 text-neon-dark dark:text-neon-green" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
                  LANGUAGE & REGION
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-mono">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 glass rounded-lg input-focus text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-cyber-border font-mono bg-white dark:bg-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-neon-dark/10 dark:bg-neon-green/10 border border-neon-dark/30 dark:border-neon-green/30 rounded-lg">
                  <Database className="w-5 h-5 text-neon-dark dark:text-neon-green" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
                  DATA MANAGEMENT
                </h2>
              </div>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClearCache}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cache
                </Button>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-lg p-6 border-2 border-red-200 dark:border-red-500/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 font-mono">
                  DANGER ZONE
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Account
              </Button>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-lg p-6"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-neon-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 font-mono">
                    SUPPORT
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Access documentation or contact support team
                  </p>
                  <div className="flex gap-3 font-mono text-sm">
                    <button className="text-neon-dark dark:text-neon-green hover:text-neon-green dark:hover:text-neon-lime transition-colors font-bold">
                      DOCS
                    </button>
                    <span className="text-gray-400 dark:text-gray-600">|</span>
                    <button className="text-neon-dark dark:text-neon-green hover:text-neon-green dark:hover:text-neon-lime transition-colors font-bold">
                      SUPPORT
                    </button>
                    <span className="text-gray-400 dark:text-gray-600">|</span>
                    <button className="text-neon-dark dark:text-neon-green hover:text-neon-green dark:hover:text-neon-lime transition-colors font-bold">
                      FEEDBACK
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};
