import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configured for GitHub Pages subpath deployment
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist'
  }
})
