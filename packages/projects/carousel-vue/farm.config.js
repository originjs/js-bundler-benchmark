import vue from '@vitejs/plugin-vue'
import farmJsPluginLess from '@farmfe/js-plugin-less'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const env = process.env.NODE_ENV
const isProdMode = env === 'production'
const dir = dirname(fileURLToPath(import.meta.url))

const config = {
  compilation: {
    input: {
      index: './index.farm.html'
    },
    resolve: {
      symlinks: true,
      mainFields: ['module', 'main', 'customMain'],
      alias: {
        '@': resolve(dir, 'src')
      }
    },
    output: {
      path: './dist-farm'
    },
    sourcemap: !isProdMode
  },
  server: {
    strictPort: true,
    hmr: true
  },
  vitePlugins: [vue()],
  plugins: [farmJsPluginLess()]
}
export default config
