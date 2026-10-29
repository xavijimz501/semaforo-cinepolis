import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  //PROBLEMAS DE CORS
  //server: {
  //  proxy: {
  //    '/api': {
  //      target: 'http://10.2.72.40:8109',
  //      changeOrigin: true,
  //      secure: false,
  //    },
  //  },
  //},
  //preview: {
  //  proxy: {
  //    '/api': {
  //      target: 'http://10.2.72.40:8109',
  //      changeOrigin: true,
  //      secure: false,
  //    },
  //  },
  //},
})
