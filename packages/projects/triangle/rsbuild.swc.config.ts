import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server:{
    port: 1238
  },
  output: {
    distPath: {
      root: 'dist-rsbuild-swc'
    },
  },
  // TODO 删了也能运行???
  plugins: [pluginReact()],
});