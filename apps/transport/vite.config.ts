import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'yusr-core': path.resolve(__dirname, '../../packages/yusr-core/src/index.ts'),
      'yusr-ui': path.resolve(__dirname, '../../packages/yusr-ui/src/index.ts'),
    }
  },
  
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})