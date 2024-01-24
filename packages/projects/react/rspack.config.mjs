import {fileURLToPath, resolve} from "node:url";
import {dirname} from 'node:path'
import rspack from "@rspack/core";
import reactRefresh from '@rspack/plugin-react-refresh'

const env = process.env.NODE_ENV;
const isProdMode = env === 'production';
const path = fileURLToPath(import.meta.url)
const config = {
    entry: './src/main.tsx',
    output: {
        path: resolve(path, 'dist-rspack'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', {runtime: "automatic"}],
                            '@babel/preset-typescript'
                        ],
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new rspack.HtmlRspackPlugin({template: 'index.webpack.html'}),
        !isProdMode && new reactRefresh()
    ],
    watchOptions: {
        poll: 0,
        aggregateTimeout: 0
    },
    devtool: isProdMode ? false : 'nosources-cheap-source-map',
    stats: {
        timings: true,
        all: false
    }
};

export default config;