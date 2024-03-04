import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";

const env = process.env.NODE_ENV;
const isProdMode = env === "production";
const dir = dirname(fileURLToPath(import.meta.url));
const config = {
	entry: "./src/main.ts",
	output: {
		path: resolve(dir, "dist-webpack"),
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					experimentalInlineMatchResource: true,
				},
				exclude: /node_modules/,
			},
			{
				test: /\.less$/,
				loader: "less-loader",
				type: "css",
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	devServer: {
		port: 5020,
		hot: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
		}),
		new VueLoaderPlugin(),
	],
};
export default config;
