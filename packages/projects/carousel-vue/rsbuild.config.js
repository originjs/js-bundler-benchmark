import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'
import { fileURLToPath, resolve } from 'node:url'
import { dirname } from 'node:path'

// let dir = dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  server: {
    port: 1238
  },
  source: {
    alias: {
      '@': './src'
    },
    entry: {
      // index: resolve(dir, 'src/main.ts')
      index: './src/main.ts'
    }
  },
  html: {
    template: './index.html'
  },
  output: {
    distPath: {
      root: 'dist-rsbuild'
    }
  },
  plugins: [pluginVue()]
})
