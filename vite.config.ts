import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 3000,
    host: process.env.CI ? '0.0.0.0' : 'localhost',
    headers: {
      'Cache-Control': 'no-store' // Disable caching in dev
    }
  },
  build: {
    outDir: 'dist',
    // Add content hash to filenames for automatic cache busting
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        jogo: fileURLToPath(new URL('./jogo.html', import.meta.url))
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})