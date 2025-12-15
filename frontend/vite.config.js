import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Critical vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'state-vendor': ['zustand', 'axios'],
          
          // Feature chunks (lazy loaded)
          'dashboard-chunk': [
            './src/pages/DashboardPage.jsx',
            './src/pages/CalendarPage.jsx',
            './src/pages/TasksPage.jsx'
          ],
          'ai-chunk': ['./src/pages/AIAssistantPage.jsx'],
          'settings-chunk': ['./src/pages/SettingsPage.jsx'],
          'demo-chunk': ['./src/pages/DemoMode.jsx']
        }
      }
    },
    // Optimize for faster loading
    target: 'esnext',
    minify: 'esbuild', // Use esbuild (faster, smaller bundle, no extra dependencies)
    esbuild: {
      drop: ['console', 'debugger'], // Remove console.log and debugger in production
    },
    // Additional optimizations
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['framer-motion'] // Let it be lazy loaded
  }
});
