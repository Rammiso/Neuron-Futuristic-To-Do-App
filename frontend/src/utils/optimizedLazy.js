import { lazy } from 'react';

// Optimized lazy loading with preloading capabilities
export const optimizedLazy = (importFunc, preload = false) => {
  const LazyComponent = lazy(importFunc);
  
  // Preload component when requested
  if (preload) {
    // Preload after a short delay to not block initial render
    setTimeout(() => {
      importFunc();
    }, 100);
  }
  
  return LazyComponent;
};

// Preload critical components based on route
export const preloadCriticalComponents = () => {
  // Preload dashboard components when user is authenticated
  const token = localStorage.getItem('token');
  if (token) {
    // Preload dashboard after initial render
    setTimeout(() => {
      import('../pages/DashboardPage');
      import('../pages/TasksPage');
    }, 500);
  }
};

// Intersection Observer for lazy loading components when they come into view
export const useLazyComponentLoader = (ref, importFunc) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            importFunc();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, importFunc]);
};