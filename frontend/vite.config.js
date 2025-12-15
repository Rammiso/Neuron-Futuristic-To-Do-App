import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure correct base path for SPA routing
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true, // Enable SPA routing in dev server
  },
  preview: {
    port: 4173,
    historyApiFallback: true, // Enable SPA routing in preview mode
  },
  build: {
    minify: 'esbuild', //added now
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'state-vendor': ['zustand', 'axios']
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
