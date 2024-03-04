import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "path";
import { BuildTool } from "./buildTools.js";
import { forceRm } from "./fileUtil.js";

const map = new Map();
const triangleReact = {
	dirname: "triangle-react",
	rootFilePath: "src/comps/triangle.jsx",
	leafFilePath: "src/comps/triangle_1_1_2_1_2_2_1.jsx",
	buildInfo: [
		new BuildTool(
			"Rspack(babel)",
			5030,
			"start:rspack",
			/compiled in (.+m?s)/,
			async () => {
				return forceRm("dist-rspack");
			},
			"build:rspack",
			"dist-rspack",
			false,
			true,
		),
		new BuildTool(
			"Rspack(swc)",
			5031,
			"start:rspack-swc",
			/compiled in (.+m?s)/,
			async () => {
				return forceRm("dist-rspack-swc");
			},
			"build:rspack-swc",
			"dist-rspack-swc",
			false,
			true,
		),
		new BuildTool(
			"esbuild",
			5040,
			"start:esbuild",
			/esbuild serve cost (.+m?s)/,
			async () => {
				const serveDir = join(runtimeInfo.currentDir, "esbuild-serve");
				try {
					await mkdir(serveDir);
					await forceRm("dist-esbuild");
				} catch (err) {
					if (err.code !== "EEXIST") {
						throw err;
					}
				}
			},
			"build:esbuild",
			"dist-esbuild",
		),
		new BuildTool(
			"Turbopack",
			5050,
			"start:turbopack",
			/Ready in (.+m?s)/,
			() => {
				return Promise.all([forceRm(".next"), forceRm("dist-turbopack")]);
			},
			"",
			"",
		),
		new BuildTool(
			"Webpack (babel)",
			5020,
			"start:webpack",
			/compiled successfully in (.+m?s)/,
			async () => {
				return forceRm("dist-webpack");
			},
			"build:webpack",
			"dist-webpack",
		),
		new BuildTool(
			"Webpack (swc)",
			5021,
			"start:webpack-swc",
			/compiled successfully in (.+ m?s)/,
			async () => {
				return forceRm("dist-webpack-swc");
			},
			"build:webpack-swc",
			"dist-webpack-swc",
		),
		new BuildTool(
			"Vite",
			5010,
			"start:vite",
			/ready in (.+ m?s)/,
			async () => {
				return Promise.all([
					forceRm("node_modules/.cache-vite"),
					forceRm("dist-vite"),
				]);
			},
			"build:vite",
			"dist-vite",
		),
		new BuildTool(
			"Vite (swc)",
			5011,
			"start:vite-swc",
			/ready in (.+ m?s)/,
			async () => {
				Promise.all([
					forceRm("node_modules/.cache-vite-swc"),
					forceRm("dist-vite-swc"),
				]);
			},
			"build:vite-swc",
			"dist-vite-swc",
		),
		new BuildTool(
			"Farm",
			5000,
			"start:farm",
			/Ready in (.+m?s)/,
			async () => {
				return Promise.all([
					forceRm("node_modules/.farm"),
					forceRm("dist-farm"),
				]);
			},
			"build:farm",
			"dist-farm",
			true,
		),
		new BuildTool(
			"Parcel",
			5070,
			"start:parcel",
			/Server running/,
			async () => {
				return Promise.all([forceRm(".parcel-cache"), forceRm("dist-parcel")]);
			},
			"build:parcel",
			"dist-parcel",
		),
		new BuildTool(
			"Parcel-swc",
			5071,
			"start:parcel-swc",
			/Server running/,
			async () => {
				return Promise.all([
					forceRm(".parcel-cache"),
					forceRm("dist-parcel-swc"),
				]);
			},
			"build:parcel-swc",
			"dist-parcel-swc",
		),
		new BuildTool(
			"snowpack",
			5080,
			"start:snowpack",
			/Server started in (.+m?s)/,
			async () => {
				return Promise.all([
					forceRm("node_modules/.cache"),
					forceRm("dist-snowpack"),
				]);
			},
			"build:snowpack",
			"dist-snowpack",
		),
		new BuildTool(
			"snowpack-swc",
			5081,
			"start:snowpack-swc",
			/Server started in (.+m?s)/,
			async () => {
				return Promise.all([
					forceRm("node_modules/.cache"),
					forceRm("dist-snowpack-swc"),
				]);
			},
			"build:snowpack-swc",
			"dist-snowpack-swc",
		),
		new BuildTool(
			"rsbuild-babel",
			5090,
			"start:rsbuild-babel",
			/Client compiled in (.+m?s)/,
			async () => {
				forceRm("dist-rsbuild-babel");
			},
			"build:rsbuild-babel",
			"dist-rsbuild-babel",
		),
		new BuildTool(
			"rsbuild-swc",
			5091,
			"start:rsbuild-swc",
			/Client compiled in (.+m?s)/,
			async () => {
				return forceRm("dist-rsbuild-swc");
			},
			"build:rsbuild-swc",
			"dist-rsbuild-swc",
		),
		new BuildTool(
			"rollup",
			5100,
			"start:rollup",
			/created dist-rollup\/index.js in (.+m?s)/,
			async () => {
				return forceRm("dist-rollup");
			},
			"build:rollup",
			"dist-rollup",
		),
		new BuildTool(
			"rollup-swc",
			5101,
			"start:rollup-swc",
			/created dist-rollup-swc\/index.js in (.+m?s)/,
			async () => {
				return forceRm("dist-rollup-swc");
			},
			"build:rollup-swc",
			"dist-rollup-swc",
		),
		new BuildTool(
			"wmr",
			5110,
			"start:wmr",
			/WMR dev server running at:/,
			async () => {
				return forceRm("dist-wmr");
			},
			"build:wmr",
			"dist-wmr",
		),
	],
};
const triangleVue = {
	dirname: "triangle-vue",
	rootFilePath: "src/components/triangle.vue",
	leafFilePath: "src/components/triangle_1_1_2_1_2_2_1.vue",
	buildInfo: [
		new BuildTool(
			"Rspack(babel)",
			5030,
			"start:rspack",
			/compiled in (.+m?s)/,
			async () => {
				return forceRm("dist-rspack");
			},
			"build:rspack",
			"dist-rspack",
			false,
			true,
		),
		new BuildTool(
			"esbuild",
			5040,
			"start:esbuild",
			/esbuild serve cost (.+m?s)/,
			async () => {
				const serveDir = join(runtimeInfo.currentDir, "esbuild-serve");
				try {
					await mkdir(serveDir);
					await forceRm("dist-esbuild");
				} catch (err) {
					if (err.code !== "EEXIST") {
						throw err;
					}
				}
			},
			"build:esbuild",
			"dist-esbuild",
		),
		new BuildTool(
			"Webpack (babel)",
			5020,
			"start:webpack",
			/compiled successfully in (.+m?s)/,
			async () => {
				return forceRm("dist-webpack");
			},
			"build:webpack",
			"dist-webpack",
		),
		new BuildTool(
			"Vite",
			5010,
			"start:vite",
			/ready in (.+ m?s)/,
			async () => {
				return Promise.all([
					forceRm("node_modules/.cache-vite"),
					forceRm("dist-vite"),
				]);
			},
			"build:vite",
			"dist-vite",
		),
		new BuildTool(
			"Farm",
			5000,
			"start:farm",
			/Ready in (.+m?s)/,
			async () => {
				return Promise.all([
					forceRm("node_modules/.farm"),
					forceRm("dist-farm"),
				]);
			},
			"build:farm",
			"dist-farm",
			true,
		),
		new BuildTool(
			"Parcel",
			5070,
			"start:parcel",
			/Server running/,
			async () => {
				return Promise.all([forceRm(".parcel-cache"), forceRm("dist-parcel")]);
			},
			"build:parcel",
			"dist-parcel",
		),
		new BuildTool(
			"rsbuild-babel",
			5090,
			"start:rsbuild",
			/Client compiled in (.+m?s)/,
			async () => {
				forceRm("dist-rsbuild-babel");
			},
			"build:rsbuild",
			"dist-rsbuild",
		),
		new BuildTool(
			"rollup",
			5100,
			"start:rollup",
			/created dist-rollup\/index.js in (.+m?s)/,
			async () => {
				return forceRm("dist-rollup");
			},
			"build:rollup",
			"dist-rollup",
		),
	],
};
map.set(triangleReact.dirname, triangleReact);
map.set(triangleVue.dirname, triangleVue);

const projectsDirname = resolve(
	fileURLToPath(import.meta.url),
	"../../projects",
);

const runtimeInfo = {
	currentDir: "",
};

export const getProjectInfo = (dirname) => {
	return map.get(dirname);
};

export { projectsDirname, runtimeInfo };
