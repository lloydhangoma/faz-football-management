// vite.config.js (frontend)
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_TARGET = env.VITE_API_PROXY_TARGET || 'http://localhost:5000'

  return {
    base: '/', // app served at site root
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: { '@': '/src' },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // in dev, forward /api to your backend
        '/api': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: { port: 5173 },
    build: { sourcemap: true },
  }
})
