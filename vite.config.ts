import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-test/', // <-- Reemplaza 'nombre-de-tu-repo' por el nombre exacto de tu repositorio en GitHub
})
