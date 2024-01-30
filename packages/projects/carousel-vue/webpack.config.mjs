import HtmlWebpackPlugin from 'html-webpack-plugin'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { VueLoaderPlugin } from 'vue-loader'

const env = process.env.NODE_ENV
const isProdMode = env === 'production'
const dir = dirname(fileURLToPath(import.meta.url))
const config = {
  entry: './src/main.ts',
  output: {
    path: resolve(dir, 'dist-webpack')
  },
  resolve: {
    alias: {
      '@': resolve(dir, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          experimentalInlineMatchResource: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: 'less-loader',
        type: 'css'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
      // {
      //   test: /\.ts$/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         '@babel/preset-env',
      //         ['@babel/preset-react', { runtime: 'automatic' }],
      //         '@babel/preset-typescript'
      //       ]
      //     }
      //   },
      //   exclude: /node_modules/
      // },

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new VueLoaderPlugin(),
  ]
}
export default config
