import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // API_PROXY_DESTINO no lleva el prefijo VITE_: solo lo lee este archivo y nunca llega al navegador.
  const { API_PROXY_DESTINO } = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // En desarrollo el navegador pide /api a Vite y Vite lo reenvía al backend: mismo origen, sin CORS,
      // igual que en producción, donde Nginx envía /api al backend.
      proxy: API_PROXY_DESTINO ? { '/api': { target: API_PROXY_DESTINO, changeOrigin: true } } : undefined,
    },
  }
})
