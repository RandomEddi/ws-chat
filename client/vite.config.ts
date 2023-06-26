import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  server: {
    open: true,
    port: 3000,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  mode: 'development',
  base: '/',
  plugins: [react(), eslint()]
})
