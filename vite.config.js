import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/coingecko': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, ''),
      },
      '/api/cryptocompare': {
        target: 'https://min-api.cryptocompare.com/data/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cryptocompare/, ''),
      }
    }
  },
})
