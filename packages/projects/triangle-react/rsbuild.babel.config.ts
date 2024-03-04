import {defineConfig} from '@rsbuild/core';
import {pluginBabel} from '@rsbuild/plugin-babel'

export default defineConfig({
    server: {
        port:5090
    },
    output: {
        distPath: {
            root: 'dist-rsbuild-babel'
        },
    },
    plugins: [
        pluginBabel({
            babelLoaderOptions: {
                presets: [
                    ['@babel/preset-env', {}],
                    ['@babel/preset-react', {runtime: "automatic"}],
                    ['@babel/preset-typescript', {}]
                ],
            },
            include: /\.(js|ts)x?$/,
            exclude: /node_modules/
        })
    ],
});
