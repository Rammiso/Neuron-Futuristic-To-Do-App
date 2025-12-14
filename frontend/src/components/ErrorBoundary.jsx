import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            {/* Holographic Error Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl border border-red-500/30 shadow-lg shadow-red-500/20 p-8">
              
              {/* Scan lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent animate-pulse" />
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent"
                    style={{ top: `${25 + i * 25}%` }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scaleX: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Error Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 p-0.5"
                >
                  <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                  </div>
                </motion.div>

                {/* Error Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-2xl font-bold text-white mb-2 font-mono">
                    NEURAL INTERFACE ERROR
                  </h1>
                  <p className="text-red-400 font-mono text-sm mb-2">
                    SYSTEM MALFUNCTION DETECTED
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    An unexpected error occurred in the neural network. The system is attempting to recover.
                  </p>
                </motion.div>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 text-left"
                  >
                    <p className="text-xs font-mono text-red-400 mb-2">DEBUG INFO:</p>
                    <p className="text-xs font-mono text-gray-300 break-all">
                      {this.state.error.toString()}
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={this.handleReload}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>RESTART INTERFACE</span>
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="secondary"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>RETURN TO BASE</span>
                  </Button>
                </motion.div>

                {/* Status Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500 font-mono"
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span>ERROR STATE ACTIVE</span>
                </motion.div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-400/60" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-400/60" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-400/60" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-400/60" />
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-gray-500 font-mono">
                If this error persists, please contact system administrator
              </p>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}