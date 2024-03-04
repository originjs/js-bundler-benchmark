import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import server from "rollup-plugin-server";
import { defineRollupSwcOption, swc } from "rollup-plugin-swc3";
import typescript from "rollup-plugin-typescript2";

const env = process.env.NODE_ENV;
const isProdMode = env === "production";
const serverConfig = [];
if (!isProdMode) {
	serverConfig.push(
		server({
			open: true,
			contentBase: "dist-rollup-swc",
			port: 5101,
		}),
	);
	//     copy index.html to dist
	const projectDir = dirname(fileURLToPath(import.meta.url));
	const srcPath = resolve(projectDir, "index.rollup.html");
	const distDir = resolve(projectDir, "dist-rollup-swc/");
	if (!existsSync(distDir)) {
		mkdirSync(distDir);
	}
	const distPath = resolve(distDir, "./index.html");
	copyFileSync(srcPath, distPath);
}
export default {
	input: "src/index.tsx",
	output: {
		file: "dist-rollup-swc/index.js",
		format: "esm",
		sourcemap: !isProdMode,
	},
	plugins: [
		nodeResolve({
			extensions: [".js", ".jsx", ".ts", ".tsx"],
		}),
		commonjs(),
		typescript({ check: false }),
		swc(
			defineRollupSwcOption({
				include: /\.[mc]?[jt]sx?$/, // default
				exclude: /node_modules/, // default
				tsconfig: "tsconfig.json", // default
				jsc: {},
			}),
		),
		replace({
			preventAssignment: false,
			"process.env.NODE_ENV": `'${env}'`,
		}),
		postcss({ include: /(?<!&module=.*)\.css$/ }),
		...serverConfig,
	],
};
