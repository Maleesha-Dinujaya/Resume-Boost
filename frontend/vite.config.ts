import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      'pdfjs-dist': path.resolve(__dirname, './src/test/__mocks__/pdfjs-dist.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
}))
