import HtmlWebpackPlugin from 'html-webpack-plugin'
import {fileURLToPath, resolve} from "node:url";
import reactRefresh from "@pmmmwh/react-refresh-webpack-plugin";

const env = process.env.NODE_ENV;
const isProdMode = env === 'production';
const config = {
    entry: './src/main.tsx',
    output: {
        path: resolve(fileURLToPath(import.meta.url), 'dist-webpack'),
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
        new HtmlWebpackPlugin({
            template: 'index.webpack.html'
        }),
        !isProdMode && new reactRefresh()
    ],
};
export default config;