const isProdMode = process.env.NODE_ENV === 'production';
export default {
  mode: 'production',
  alias: {
    '@': './src'
  },
  mount: {
    'snowpack-public': {
      url: '/',
      static: true
    },
    src: '/src',
    'src/components': '/'
  },
  plugins: [
    '@snowpack/plugin-vue',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-vue/plugin-tsx-jsx.js'
  ],
  routes: [],
  optimize: {},
  packageOptions: {},
  devOptions: {
    port: 1236,
    hmr: true
  },
  buildOptions: {
    out: 'dist-snowpack',
    sourcemap: false
  },
};
