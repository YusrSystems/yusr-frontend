import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
      name: 'YusrUI',
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
        '@yusr_systems/core',
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
      output: {
        format: 'es',
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
})