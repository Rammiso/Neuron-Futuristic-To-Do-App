import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { EmergencyFallback } from "./components/InstantLoader";
import "./utils/performanceTest.js"; // Auto-runs in development

// CRITICAL: Apply theme IMMEDIATELY to prevent flickering
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const shouldBeDark = savedTheme === null || savedTheme === 'true';
  
  if (shouldBeDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  // Prevent any flash by setting initial styles
  document.documentElement.style.colorScheme = shouldBeDark ? 'dark' : 'light';
};

// Apply theme before any React rendering
applyInitialTheme();

// Performance monitoring starts immediately
const startTime = performance.now();

// Error boundary for the entire app
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App crashed:', error, errorInfo);
    
    // Log to performance monitoring
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <EmergencyFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Ensure DOM is ready before rendering
const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  
  // Remove StrictMode in production to prevent double mounting
  const AppComponent = (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );

  root.render(
    process.env.NODE_ENV === 'development' ? (
      <React.StrictMode>{AppComponent}</React.StrictMode>
    ) : (
      AppComponent
    )
  );

  // Log initialization time
  const endTime = performance.now();
  const initTime = endTime - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`App initialization: ${Math.round(initTime)}ms`);
  }

  // Warn if initialization is too slow
  if (initTime > 100) {
    console.warn(`Slow app initialization: ${Math.round(initTime)}ms (should be <100ms)`);
  }
};

// Render immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
