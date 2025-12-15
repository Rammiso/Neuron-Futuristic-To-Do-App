import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthStore } from "./context/authStore";
import { useThemeStore } from "./context/themeStore";
import { useEffect, Suspense, lazy, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppShell, DashboardShell } from "./components/AppShell";
import { useTwoPhaseInit, useProgressiveFeature } from "./hooks/useTwoPhaseInit";
import performanceMonitor, { usePerformanceOptimization } from "./utils/performanceMonitor";

// Phase 1: Critical path - immediate imports (no lazy loading)
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// Phase 2: Enhanced features - aggressive lazy loading
const DemoMode = lazy(() => 
  import("./pages/DemoMode").then(m => ({ default: m.DemoMode }))
);
const DashboardPage = lazy(() => 
  import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage }))
);
const CalendarPage = lazy(() => 
  import("./pages/CalendarPage").then(m => ({ default: m.CalendarPage }))
);
const TasksPage = lazy(() => 
  import("./pages/TasksPage").then(m => ({ default: m.TasksPage }))
);
const AIAssistantPage = lazy(() => 
  import("./pages/AIAssistantPage").then(m => ({ default: m.AIAssistantPage }))
);
const SettingsPage = lazy(() => 
  import("./pages/SettingsPage").then(m => ({ default: m.SettingsPage }))
);

// Lazy load transitions and animations
const CyberTransition = lazy(() => 
  import("./components/PageTransition").then(m => ({ default: m.CyberTransition }))
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};



const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, loadUser, checkAuthSync } = useAuthStore();
  const { isDark, loadSettings } = useThemeStore();
  const { phase, isReady, isCritical, isEnhanced, isComplete, hasBlockingTasks } = useTwoPhaseInit();
  const { isLowEndDevice, prefersReducedMotion, loadingStrategy } = usePerformanceOptimization();
  
  // Disable transitions on low-end devices or if user prefers reduced motion
  const transitionsEnabled = useProgressiveFeature('transitions', 'medium') && 
                            !isLowEndDevice && 
                            !prefersReducedMotion &&
                            !hasBlockingTasks;

  // Phase 1: Critical path - immediate, synchronous operations only (non-blocking)
  useEffect(() => {
    // Immediate auth check (synchronous from localStorage) - never blocks
    const startTime = performance.now();
    
    try {
      checkAuthSync();
      
      // Immediate theme application (no flash) - synchronous DOM operation
      const savedTheme = localStorage.getItem('theme');
      const shouldBeDark = savedTheme === 'false' ? false : true;
      
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log warning if critical path takes too long
      if (duration > 16) { // More than one frame (16ms at 60fps)
        console.warn(`Critical path took ${duration}ms - should be <16ms`);
      }
      
    } catch (error) {
      console.error('Error in critical path:', error);
      // Never let errors block the UI
    }
  }, [checkAuthSync]);

  // Phase 2: Enhanced features - background loading (never blocks UI)
  useEffect(() => {
    if (!isEnhanced || hasBlockingTasks) return;

    // Use requestIdleCallback to ensure we don't block the main thread
    const performBackgroundTasks = () => {
      try {
        // Background user validation (non-blocking)
        const token = localStorage.getItem('token');
        if (token && !isAuthenticated) {
          loadUser().catch(() => {
            // Silent fail, user will see login if needed
          });
        }

        // Background settings loading (non-blocking)
        if (isAuthenticated) {
          loadSettings().catch(() => {
            // Silent fail, use defaults
          });
        }
      } catch (error) {
        console.error('Error in background tasks:', error);
        // Never let background tasks affect UI
      }
    };

    // Use requestIdleCallback to run during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(performBackgroundTasks, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(performBackgroundTasks, 100);
    }
  }, [isEnhanced, isAuthenticated, loadUser, loadSettings, hasBlockingTasks]);

  // Theme updates (immediate)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'true');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'false');
    }
  }, [isDark]);

  // Show app shell during critical phase
  if (isCritical || !isReady) {
    return <AppShell isLoading={true} />;
  }

  // Progressive route wrapper
  const ProgressiveRoute = ({ children, fallback = <DashboardShell /> }) => {
    if (transitionsEnabled) {
      return (
        <Suspense fallback={fallback}>
          <CyberTransition>{children}</CyberTransition>
        </Suspense>
      );
    }
    
    return (
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    );
  };

  return (
    <ErrorBoundary>
      <Routes location={location} key={location.pathname}>
        {/* Phase 1: Critical Routes - Instant, no lazy loading */}
        <Route 
          path="/" 
          element={
            transitionsEnabled ? (
              <Suspense fallback={<AppShell isLoading={true} />}>
                <CyberTransition><LandingPage /></CyberTransition>
              </Suspense>
            ) : (
              <LandingPage />
            )
          } 
        />
        
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : transitionsEnabled ? (
              <Suspense fallback={<AppShell isLoading={true} />}>
                <CyberTransition><LoginPage /></CyberTransition>
              </Suspense>
            ) : (
              <LoginPage />
            )
          }
        />
        
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : transitionsEnabled ? (
              <Suspense fallback={<AppShell isLoading={true} />}>
                <CyberTransition><RegisterPage /></CyberTransition>
              </Suspense>
            ) : (
              <RegisterPage />
            )
          }
        />
        
        {/* Phase 2: Enhanced Routes - Lazy loaded */}
        <Route 
          path="/demo" 
          element={
            <ProgressiveRoute fallback={<AppShell isLoading={true} />}>
              <DemoMode />
            </ProgressiveRoute>
          } 
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProgressiveRoute>
                <DashboardPage />
              </ProgressiveRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <ProgressiveRoute>
                <CalendarPage />
              </ProgressiveRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <ProgressiveRoute>
                <TasksPage />
              </ProgressiveRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <ProgressiveRoute>
                <AIAssistantPage />
              </ProgressiveRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProgressiveRoute>
                <SettingsPage />
              </ProgressiveRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
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
