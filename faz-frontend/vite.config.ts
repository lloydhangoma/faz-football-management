import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Use polling so that changes in /mnt/c/ are detected
      usePolling: true,
    },
    // Optional: ensures your port stays consistents
    port: 3001, 
  },
})