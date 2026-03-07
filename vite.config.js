import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method !== 'GET' || req.url?.startsWith('/api')) return next();
          if (req.url?.includes('.')) return next();
          req.url = '/index.html';
          next();
        });
      },
    },
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          antd: ['antd'],
        },
      },
    },
  },
});
