import {fileURLToPath, resolve} from "node:url";
import rspack from "@rspack/core";
import reactRefresh from "@rspack/plugin-react-refresh";

const env = process.env.NODE_ENV;
const isProdMode = env === 'production';
const path = fileURLToPath(import.meta.url);
const config = {
    entry: './src/main.tsx',
    output: {
        path: resolve(path, 'dist-rspack-swc'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'swc-loader', // Switched to swc-loader
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript"
                            },
                            transform: {
                                react: {
                                    runtime: "automatic",
                                    development: !isProdMode,
                                    refresh: !isProdMode,
                                },
                            },
                        }
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
        new rspack.HtmlRspackPlugin({template:'index.webpack.html'}),
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