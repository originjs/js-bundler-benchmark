import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "path";
import { BuildTool } from "./buildTools.js";

const map = new Map();
const triangleReact = {
	dirname: "triangle-react",
	framework: "react",
	rootFilePath: "src/comps/triangle.jsx",
	leafFilePath: "src/comps/triangle_1_1_2_1_2_2_1.jsx",
	changeFileFn: (filePath, text) => {
		appendFileSync(filePath, `console.log('${text}');`);
	},
	buildInfo: [
		new BuildTool(
			"Rspack",
			"Rspack(babel)",
			5030,
			"start:rspack",
			/compiled in (.+m?s)/,
			"build:rspack",
			"dist-rspack",
		),
		new BuildTool(
			"Rspack",
			"Rspack(swc)",
			5031,
			"start:rspack-swc",
			/compiled in (.+m?s)/,
			"build:rspack-swc",
			"dist-rspack-swc",
		),
		new BuildTool(
			"esbuild",
			"esbuild",
			5040,
			"start:esbuild",
			/esbuild serve cost (.+m?s)/,
			"build:esbuild",
			"dist-esbuild",
		),
		new BuildTool(
			"turbo",
			"Turbopack",
			5050,
			"start:turbopack",
			/Ready in (.+m?s)/,
			"",
			"dist-turbopack",
			".next",
		),
		new BuildTool(
			"Webpack",
			"Webpack(babel)",
			5020,
			"start:webpack",
			/compiled successfully in (.+m?s)/,
			"build:webpack",
			"dist-webpack",
		),
		new BuildTool(
			"Webpack",
			"Webpack(swc)",
			5021,
			"start:webpack-swc",
			/compiled successfully in (.+ m?s)/,
			"build:webpack-swc",
			"dist-webpack-swc",
		),
		new BuildTool(
			"Vite",
			"Vite(babel)",
			5010,
			"start:vite",
			/ready in (.+ m?s)/,
			"build:vite",
			"dist-vite",
			"node_modules/.cache-vite",
		),
		new BuildTool(
			"Vite",
			"Vite(swc)",
			5011,
			"start:vite-swc",
			/ready in (.+ m?s)/,
			"build:vite-swc",
			"dist-vite-swc",
			"node_modules/.cache-vite-swc",
		),
		new BuildTool(
			"Farm",
			"Farm(swc)",
			5000,
			"start:farm",
			/Ready in (.+m?s)/,
			"build:farm",
			"dist-farm",
			"node_modules/.farm",
		),
		new BuildTool(
			"Parcel",
			"Parcel(babel)",
			5070,
			"start:parcel",
			/Built in (.+m?s)/,
			"build:parcel",
			"dist-parcel",
			".parcel-cache",
		),
		new BuildTool(
			"Parcel",
			"Parcel(swc)",
			5071,
			"start:parcel-swc",
			/Built in (.+m?s)/,
			"build:parcel-swc",
			"dist-parcel-swc",
			".parcel-cache",
		),
		new BuildTool(
			"snowpack",
			"snowpack(babel)",
			5080,
			"start:snowpack",
			/Server started in (.+m?s)/,
			"build:snowpack",
			"dist-snowpack",
			"node_modules/.cache",
		),
		new BuildTool(
			"snowpack",
			"snowpack(swc)",
			5081,
			"start:snowpack-swc",
			/Server started in (.+m?s)/,
			"build:snowpack-swc",
			"dist-snowpack-swc",
			"node_modules/.cache",
		),
		new BuildTool(
			"rsbuild",
			"rsbuild(babel)",
			5090,
			"start:rsbuild-babel",
			/Client compiled in (.+m?s)/,
			"build:rsbuild-babel",
			"dist-rsbuild-babel",
		),
		new BuildTool(
			"rsbuild",
			"rsbuild(swc)",
			5091,
			"start:rsbuild-swc",
			/Client compiled in (.+m?s)/,
			"build:rsbuild-swc",
			"dist-rsbuild-swc",
		),
		new BuildTool(
			"rollup",
			"rollup(babel)",
			5100,
			"start:rollup",
			/created dist-rollup\/index.js in (.+m?s)/,
			"build:rollup",
			"dist-rollup",
		),
		new BuildTool(
			"rollup",
			"rollup(swc)",
			5101,
			"start:rollup-swc",
			/created dist-rollup-swc\/index.js in (.+m?s)/,
			"build:rollup-swc",
			"dist-rollup-swc",
		),
		new BuildTool(
			"wmr",
			"wmr",
			5110,
			"start:wmr",
			/WMR dev server running (.+)/,
			"build:wmr",
			"dist-wmr",
		),
	],
};
const triangleVue = {
	dirname: "triangle-vue",
	framework: "vue",
	rootFilePath: "src/components/triangle.vue",
	leafFilePath: "src/components/triangle_1_1_2_1_2_2_1.vue",
	changeFileFn: (filePath, text) => {
		const content = readFileSync(filePath, "utf8");
		const newContent = content.replace(
			"</script>",
			`\n console.log('${text}') \n</script>`,
		);
		writeFileSync(filePath, newContent, "utf8");
	},
	buildInfo: [
		new BuildTool(
			"Rspack",
			"Rspack(babel)",
			5030,
			"start:rspack",
			/compiled in (.+m?s)/,
			"build:rspack",
			"dist-rspack",
		),
		new BuildTool(
			"esbuild",
			"esbuild",
			5040,
			"start:esbuild",
			/esbuild serve cost (.+m?s)/,
			"build:esbuild",
			"dist-esbuild",
		),
		new BuildTool(
			"Webpack",
			"Webpack (babel)",
			5020,
			"start:webpack",
			/compiled successfully in (.+m?s)/,
			"build:webpack",
			"dist-webpack",
		),
		new BuildTool(
			"Vite",
			"Vite",
			5010,
			"start:vite",
			/ready in (.+ m?s)/,
			"build:vite",
			"dist-vite",
		),
		new BuildTool(
			"Farm",
			"Farm",
			5000,
			"start:farm",
			/Ready in (.+m?s)/,
			"build:farm",
			"dist-farm",
			"node_modules/.farm",
		),
		new BuildTool(
			"Parcel",
			"Parcel",
			5070,
			"start:parcel",
			/Built in (.+m?s)/,
			"build:parcel",
			"dist-parcel",
			".parcel-cache",
		),
		new BuildTool(
			"rsbuild",
			"rsbuild-babel",
			5090,
			"start:rsbuild",
			/Client compiled in (.+m?s)/,
			"build:rsbuild",
			"dist-rsbuild",
			"dist-rsbuild-babel",
		),
		new BuildTool(
			"rollup",
			"rollup",
			5100,
			"start:rollup",
			/created dist-rollup\/index.js in (.+m?s)/,
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
