// Snowpack Configuration File
// See all supported options: https://.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	mode: "production",
	mount: {
		"snowpack-public": "/",
		src: "/src",
	},
	plugins: ["@snowpack/plugin-react-refresh"],
	devOptions: {
		open: "none",
		port: 5080,
		hmr: true,
	},
	buildOptions: {
		out: "dist-snowpack",
		sourcemap: false,
	},
};
