import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";

// let dir = dirname(fileURLToPath(import.meta.url))
export default defineConfig({
	server: {
		port: 5090,
	},
	source: {
		alias: {
			"@": "./src",
		},
		entry: {
			// index: resolve(dir, 'src/main.ts')
			index: "./src/main.ts",
		},
	},
	html: {
		template: "./index.html",
	},
	output: {
		distPath: {
			root: "dist-rsbuild",
		},
	},
	plugins: [pluginVue()],
});
