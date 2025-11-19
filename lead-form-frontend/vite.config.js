import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tandem.it.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Ensure JS & CSS are minified in production
  build: {
    minify: 'esbuild',
    cssMinify: 'esbuild',
    sourcemap: false,
    target: 'es2018',
  },
  // Drop console/debugger only in production builds
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},
}))
