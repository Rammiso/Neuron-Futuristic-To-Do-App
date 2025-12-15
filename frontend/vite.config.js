import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Force esbuild minification (no terser)
    minify: 'esbuild',
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'state-vendor': ['zustand', 'axios'],
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
    esbuild: {
      drop: ['console', 'debugger'],
      minify: true,
      target: 'esnext'
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['framer-motion'] // Let it be lazy loaded
  }
});
