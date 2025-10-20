import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    define: {
      __API_BASE__: JSON.stringify(
        mode === 'production'
          ? 'https://api.ph4se.dev/wavecave'
          : '/api'
      )
    },
    base: mode === "production" ? "/wavecave" : "",
    plugins: [
      react(),
      // eslint({
      //   lintOnStart: true,
      //   failOnError: mode === 'production'
      // })
    ],
    // To automatically open the app in the browser whenever the server starts,
    // uncomment the following lines:
    server: {
      host: isProd ? '127.0.0.1' : '0.0.0.0',
      proxy: {
        '/api': {
          target: isProd
            ? 'https://api.ph4se.dev/wavecave' 
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: '../public',
      emptyOutDir: true
    }
}});
