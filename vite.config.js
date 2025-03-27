// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // enable global mode so expect is defined globally
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
});
