import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthStore } from "./context/authStore";
import { useThemeStore } from "./context/themeStore";
import { useTaskStore } from "./context/taskStore";
import { useEffect, Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { performanceMonitor } from "./utils/performance";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const DemoMode = lazy(() => import("./pages/DemoMode").then(m => ({ default: m.DemoMode })));
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const CalendarPage = lazy(() => import("./pages/CalendarPage").then(m => ({ default: m.CalendarPage })));
const TasksPage = lazy(() => import("./pages/TasksPage").then(m => ({ default: m.TasksPage })));
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage").then(m => ({ default: m.AIAssistantPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(m => ({ default: m.SettingsPage })));
const CyberTransition = lazy(() => import("./components/PageTransition").then(m => ({ default: m.CyberTransition })));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Loading component for Suspense
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-emerald-400 font-mono text-sm">INITIALIZING NEURAL INTERFACE...</p>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, loadUser } = useAuthStore();
  const { isDark, loadSettings } = useThemeStore();
  const { fetchTasks } = useTaskStore();

  // Initialize performance monitoring
  useEffect(() => {
    performanceMonitor.startFPSMonitor();
    
    // Initialize performance monitoring for production
    if (process.env.NODE_ENV === 'development') {
      // Performance logging only in development
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Load settings and tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
      fetchTasks();
    }
  }, [isAuthenticated, loadSettings, fetchTasks]);

  // Theme management
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Performance monitoring for route changes
  useEffect(() => {
    performanceMonitor.startMeasure(`route-${location.pathname}`);
    
    return () => {
      performanceMonitor.endMeasure(`route-${location.pathname}`);
    };
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<CyberTransition><LandingPage /></CyberTransition>} />
            <Route path="/demo" element={<CyberTransition><DemoMode /></CyberTransition>} />
            
            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <CyberTransition><LoginPage /></CyberTransition>
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <CyberTransition><RegisterPage /></CyberTransition>
                )
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <CyberTransition><DashboardPage /></CyberTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CyberTransition><CalendarPage /></CyberTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <CyberTransition><TasksPage /></CyberTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <CyberTransition><AIAssistantPage /></CyberTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <CyberTransition><SettingsPage /></CyberTransition>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
