import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import server from "rollup-plugin-serve";
import vue from "rollup-plugin-vue";

const env = process.env.NODE_ENV;
const isProdMode = env === "production";
const serverConfig = [];
if (!isProdMode) {
	serverConfig.push(
		server({
			open: true,
			contentBase: "dist-rollup",
			port: 5100,
		}),
	);
	//     copy index.html to dist
	const projectDir = dirname(fileURLToPath(import.meta.url));
	const srcPath = resolve(projectDir, "index.rollup.html");
	const distDir = resolve(projectDir, "dist-rollup/");
	if (!existsSync(distDir)) {
		mkdirSync(distDir);
	}
	const distPath = resolve(distDir, "./index.html");
	copyFileSync(srcPath, distPath);
}

export default {
	input: "src/main.ts",
	output: {
		file: "dist-rollup/index.js",
		format: "esm",
		name: "app",
	},
	plugins: [
		nodeResolve({
			extensions: [".mjs", ".js", ".json", ".ts"],
		}),
		vue({
			css: true,
		}),
		replace({
			preventAssignment: false,
			"process.env.NODE_ENV": `'${env}'`,
		}),
		babel({
			exclude: "node_modules/**",
			babelHelpers: "bundled",
			presets: ["@babel/preset-env"],
		}),
		postcss({ include: /(?<!&module=.*)\.css$/ }),
	],
};
