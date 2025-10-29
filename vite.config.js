import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite conexiones externas en desarrollo local 
  },
  preview: {
    host: '0.0.0.0', // exponer el puerto
    port: process.env.PORT || 4173, // usa el puerto que se asigne
    allowedHosts: ['tambo-frontend.onrender.com'], //dominio
  }
})
