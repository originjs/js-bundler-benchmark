import rspack from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import path, {resolve} from 'path';
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";

const dir = dirname(resolve(fileURLToPath(import.meta.url)));
const generateSwcOptions = (syntax, isProd) => ({
    jsc: {
        parser: {
            syntax,
            jsx: true,
            dynamicImport: true,
            privateMethod: true,
            functionBind: true,
            classPrivateProperty: true,
            exportDefaultFrom: true,
            exportNamespaceFrom: true,
            decorators: true,
            decoratorsBeforeExport: true,
            importMeta: true,
        },
        transform: {
            react: {
                runtime: "automatic",
                development: !isProd,
                refresh: !isProd,
            },
        },
    },
})

export default function (env, argv) {
    const isBuild = argv['_'][0] === 'build'
    /**
     * @type {import('@rspack/cli').Configuration}
     */
    return {
        context: dir,
        entry: {
            main: "./src/index.tsx"
        },
        output: {
            path: path.resolve(dir, './dist-rspack-swc')
        },
        target: 'browserslist',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'builtin:swc-loader',
                        options: generateSwcOptions('typescript', argv.mode === 'production'),
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.jsx?$/,
                    use: {
                        loader: 'builtin:swc-loader',
                        options: generateSwcOptions('ecmascript', argv.mode === 'production'),
                    }
                },
                {
                    test: /\.svg$/,
                    type: "asset"
                }
            ]
        },
        plugins: [
            new rspack.HtmlRspackPlugin({template: './index.webpack.html'}),
            argv.mode !== 'production' && new ReactRefreshPlugin()
        ],
        watchOptions: {
            poll: 0,
            aggregateTimeout: 0
        },
        devtool: isBuild ? false : 'nosources-cheap-source-map',
        stats: {
            timings: true,
            all: false
        }
    };
};
