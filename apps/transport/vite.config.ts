import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@yusr_systems/core': path.resolve(__dirname, '../../packages/yusr-core/src'),
    }
  },
  
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})