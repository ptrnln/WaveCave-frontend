import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(( { mode }) =>  ({
  base: mode === "production" ? "/wavecave/" : "",
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: false // mode === 'production'
    })
  ],
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
  server: {
    proxy: {
      '/api': mode === "production" ? 'https://api.ph4se.dev/wavecave' : 'http://localhost:5000'
    }
  },
  build: {
    outDir: '../public',
    emptyOutDir: true
  }
}));
