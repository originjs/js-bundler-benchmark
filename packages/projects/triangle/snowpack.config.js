// Snowpack Configuration File
// See all supported options: https://.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mode:'production',
  mount: {
    'snowpack-public':'/',
    src:'/src'
  },
  plugins: [
    '@snowpack/plugin-react-refresh'
  ],
  devOptions: {
    port: 1236,
    hmr: true
  },
  buildOptions: {
    out:'dist-snowpack',
    sourcemap: true
  },
};
