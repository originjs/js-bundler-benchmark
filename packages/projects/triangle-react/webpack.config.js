import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import reactRefresh from "react-refresh/babel";

const dir = dirname(resolve(fileURLToPath(import.meta.url)));
// webpack.config.js
export default (env, argv) => ({
	entry: "./src/index.tsx",
	output: {
		path: resolve(dir, "./dist-webpack"),
	},
	resolve: {
		extensions: [".tsx", ".jsx", ".ts", ".js", ".json"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							["@babel/preset-react", { runtime: "automatic" }],
							"@babel/preset-typescript",
						],
						plugins: argv.mode !== "production" ? [reactRefresh] : [],
					},
				},
				exclude: /node_modules/,
			},
			{
				test: /\.jsx?$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							["@babel/preset-react", { runtime: "automatic" }],
						],
						plugins: argv.mode !== "production" ? [reactRefresh] : [],
					},
				},
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.svg$/,
				type: "asset",
			},
		],
	},
	devServer: {
		port: 5020,
		hot: true,
	},
	devtool:
		argv.mode === "production"
			? false
			: "eval-nosources-cheap-module-source-map",
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.webpack.html",
		}),
		argv.mode !== "production" && new ReactRefreshWebpackPlugin(),
		new MiniCssExtractPlugin(),
	],
	optimization: {
		minimizer: ["...", new CssMinimizerPlugin()],
	},

	experiments: {
		futureDefaults: true,
		css: false,
	},
	node: {
		global: false,
	},
});
