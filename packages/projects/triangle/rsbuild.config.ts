import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server:{
    port: 1238
  },
  output: {
    distPath: {
      root: 'dist-rsbuild'
    },
  },
  plugins: [pluginReact()],
});