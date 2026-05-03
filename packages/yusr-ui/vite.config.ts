import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'yusr-ui': resolve(__dirname, '../../packages/yusr-ui/src/index.ts'),
    },
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'yusr-ui.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router',
        'react-router-dom',
        'react-redux',
        '@reduxjs/toolkit',
        'lucide-react',
        'sonner',
        'yusr-ui',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'date-fns',
        'recharts',
        'vaul',
        'cmdk',
        'next-themes',
        'use-debounce',
        'embla-carousel-react',
        'embla-carousel',
        'react-day-picker',
        /^@radix-ui\/.*/,
        /^@base-ui\/.*/,
      ],
    },
  },
})