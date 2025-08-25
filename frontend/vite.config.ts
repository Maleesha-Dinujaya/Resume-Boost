import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const aliases: Record<string, string> = {}

  if (mode === 'test') {
    aliases['pdfjs-dist'] = path.resolve(
      __dirname,
      './src/test/__mocks__/pdfjs-dist.ts',
    )
  }

  return {
    server: {
      host: '0.0.0.0',
      port: 4173,
    },
    plugins: [react()],
    resolve: {
      alias: aliases,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
    },
  }
})
