const rspack = require('@rspack/core');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const path = require('path');

module.exports = function (env, argv) {
    const isBuild = argv['_'][0] === 'build'
    /**
     * @type {import('@rspack/cli').Configuration}
     */
    return {
        context: __dirname,
        entry: {
            main: "./src/index.tsx"
        },
        output: {
            path: path.resolve(__dirname, './dist-rspack')
        },
        target: 'browserslist',
        module: {
            rules: [
                {
                    test: /\.(jsx|tsx)$/,
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
        },
        devServer: {
            port: 8079,
        }
    };
};
