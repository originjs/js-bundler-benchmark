import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";

const env = process.env.NODE_ENV;
const isProdMode = env === "production";
const dir = dirname(fileURLToPath(import.meta.url));

const config = {
	compilation: {
		input: {
			index: "./index.farm.html",
		},
		resolve: {
			symlinks: true,
			mainFields: ["module", "main", "customMain"],
			alias: {
				"@": resolve(dir, "src"),
			},
		},
		output: {
			path: "./dist-farm",
		},
		sourcemap: !isProdMode,
	},
	server: {
		strictPort: true,
		hmr: true,
	},
	vitePlugins: [vue()],
};
export default config;
