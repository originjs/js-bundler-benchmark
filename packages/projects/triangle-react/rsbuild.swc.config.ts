import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server:{
    port:5091
  },
  output: {
    distPath: {
      root: 'dist-rsbuild-swc'
    },
  },
  // TODO why it works if delete plugin???
  plugins: [pluginReact()],
});
