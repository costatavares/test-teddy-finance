import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // aceita conexões externas
    port: 5173,        // porta já mapeada no Docker
    strictPort: true,  // falha se a porta estiver ocupada
    fs: {
      strict: true
    }
  },
  base: '/',
})
