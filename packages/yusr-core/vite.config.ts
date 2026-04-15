import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'YusrCore',
      formats: ['es'],
      fileName: () => 'yusr-core.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@reduxjs/toolkit',
        'redux',
        'immer',
        'reselect',
        'sonner',
      ],
      output: {
        format: 'es',
        exports: 'named'
      },
    },
  },
})