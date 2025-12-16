import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true,
  },
  preview: {
    port: 4173,
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React bundle - highest priority
          'react-core': ['react', 'react-dom'],
          // Router - separate chunk for better caching
          'react-router': ['react-router-dom'],
          // Heavy animation library - separate chunk
          'animations': ['framer-motion'],
          // Icons - separate chunk, loaded on demand
          'icons': ['lucide-react'],
          // State management - small, can be with core
          'state': ['zustand'],
          // HTTP client - separate for better caching
          'http': ['axios'],
          // Date utilities - separate chunk
          'utils': ['date-fns']
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${chunkInfo.name || facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  esbuild: {
    // Remove all console logs and debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Remove comments in production
    legalComments: 'none'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand'],
    // Exclude heavy dependencies from pre-bundling
    exclude: ['framer-motion']
  }
});
