import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/eco-news': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,          // enable global mode so expect is defined globally
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
});
