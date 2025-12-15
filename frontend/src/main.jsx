import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { EmergencyFallback } from "./components/InstantLoader";
import "./utils/performanceTest.js"; // Auto-runs in development

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
  
  root.render(
    <React.StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </React.StrictMode>
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
