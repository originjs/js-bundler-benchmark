import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'vue-carousel'
  },
  plugins: [
    vue({
      css: true,
      compileTemplate: true
    }),
    postcss({ include: /(?<!&module=.*)\.css$/ }),
    typescript({
      check: false
    }),
    serve({
      open: true,
      contentBase: 'dist',
      port: 8080
    })
  ]
}
