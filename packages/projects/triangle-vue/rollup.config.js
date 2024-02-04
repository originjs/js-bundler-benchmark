import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import  nodeResolve from '@rollup/plugin-node-resolve'
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {copyFileSync, existsSync, mkdirSync} from "node:fs";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist-rollup/index.js',
        format:'esm',
        name:'app'
    },
    plugins: [
        nodeResolve({
            extensions: ['.mjs', '.js', '.json', '.ts'],
        }),
        commonjs(),
        vue({
            css: true,
            compileTemplate: true
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env']
        }),
        postcss({include: /(?<!&module=.*)\.css$/}),
        typescript({
            check: false
        })
    ]
}
