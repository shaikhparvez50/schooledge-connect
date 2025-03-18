
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false, // Disable the HMR overlay to reduce DOM operations
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lodash'], // Pre-bundle commonly used dependencies
    exclude: ['mongodb'], // Exclude server-side packages
  },
  build: {
    target: 'esnext', // Modern browsers for better performance
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ]
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
