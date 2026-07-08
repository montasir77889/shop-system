import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // any request to /api/* from React gets forwarded to the Express server
      '/api': 'http://localhost:5000',
    },
  },
});
