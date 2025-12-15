import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Brain, ArrowLeft, Zap, Shield } from "lucide-react";
import { useAuthStore } from "../context/authStore";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ParticleBackground } from "../components/ParticleBackground";
import { HolographicCard } from "../components/HolographicCard";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ 
        general: error.message || 'Authentication failed. Please check your credentials.' 
      });
    }
  };

  const fillDemoCredentials = () => {
    // Demo credentials removed for production
    setFormData({
      email: "",
      password: ""
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 text-white relative overflow-hidden">
      <ParticleBackground />
      
      {/* Back to Landing Button */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-sm">BACK</span>
      </motion.button>

      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : 50,
            scale: isVisible ? 1 : 0.9
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <HolographicCard className="p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Brain className="w-7 h-7 text-black" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                  NEURON
                </h1>
              </div>
              <p className="text-gray-400 font-mono text-sm tracking-wider">
                AUTHENTICATION PROTOCOL
              </p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto mt-4" />
            </motion.div>

            {/* General Error */}
            <AnimatePresence>
              {(errors.general || authError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <p className="text-sm font-mono text-red-400">
                      {errors.general || authError}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@neuron.sys"
                  icon={Mail}
                  error={errors.email}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={Lock}
                  error={errors.password}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <Button 
                  type="submit" 
                  loading={isLoading}
                  className="w-full"
                >
                  {isLoading ? "AUTHENTICATING" : "INITIALIZE LOGIN"}
                </Button>
                

              </motion.div>
            </form>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 space-y-4"
            >
              <div className="text-center">
                <p className="text-gray-400 text-sm font-mono">
                  NO NEURAL PROFILE?{" "}
                  <Link
                    to="/register"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
                  >
                    CREATE ACCOUNT
                  </Link>
                </p>
              </div>
              
             {/* <div className="text-center">
                <Link
                  to="/demo"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm"
                >
                  → ENTER DEMO MODE
                </Link>
              </div> */}
            </motion.div>

            {/* Demo Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <p className="text-xs font-semibold text-cyan-400 font-mono">
                  DEMO ACCESS AVAILABLE
                </p>
              </div>
              <p className="text-xs text-gray-300 font-mono leading-relaxed">
                Experience NEURON without registration. Visit demo mode to explore the interface.
              </p>
            </motion.div>
          </HolographicCard>
        </motion.div>
      </div>
    </div>
  );
};
