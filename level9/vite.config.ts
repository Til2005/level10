import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Base path for deployment (adjust if needed for your hosting setup)
  base: './',

  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  plugins: [react()],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Optimize for production
    sourcemap: false,
    minify: 'esbuild',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
