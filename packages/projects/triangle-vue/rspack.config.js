import rspack from '@rspack/core'
import { VueLoaderPlugin } from 'vue-loader'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const env = process.env.NODE_ENV
const isProdMode = env === 'production'
const dir = dirname(fileURLToPath(import.meta.url))
const config = {
  entry: './src/main.ts',
  output: {
    path: 'dist-rspack'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          experimentalInlineMatchResource: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: isProdMode ? false : true,
          jsc: {
            parser: {
              syntax: 'typescript'
            }
          }
        },
        type: 'javascript/auto'
      },
      {
        test: /\.less$/,
        loader: 'less-loader',
        type: 'css'
      }
    ]
  },
  resolve: {
    alias: {
      '@': resolve(dir, 'src')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new rspack.HtmlRspackPlugin({ template: './index.html' })
  ],
  watchOptions: {
    poll: 0,
    aggregateTimeout: 0
  },
  devtool: isProdMode ? false : 'nosources-cheap-source-map',
  stats: {
    timings: true,
    all: false
  }
}

export default config
