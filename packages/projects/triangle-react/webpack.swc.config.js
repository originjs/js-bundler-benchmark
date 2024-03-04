import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";

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
});

// webpack.config.js
export default (env, argv) => ({
	entry: "./src/index.tsx",
	output: {
		path: resolve(dir, "./dist-webpack-swc"),
	},
	resolve: {
		extensions: [".tsx", ".jsx", ".ts", ".js", ".json"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "swc-loader",
					options: generateSwcOptions("typescript", argv.mode === "production"),
				},
				exclude: /node_modules/,
			},
			{
				test: /\.jsx?$/,
				use: {
					loader: "swc-loader",
					options: generateSwcOptions("ecmascript", argv.mode === "production"),
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
		port: 5021,
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
		minimize: argv.mode === "production",
		minimizer: [
			new TerserPlugin({ minify: TerserPlugin.swcMinify }),
			new CssMinimizerPlugin(),
		],
	},

	experiments: {
		futureDefaults: true,
		css: false,
	},
	node: {
		global: false,
	},
});
