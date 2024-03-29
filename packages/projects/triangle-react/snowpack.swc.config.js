// Snowpack Configuration File
// See all supported options: https://.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	mount: {
		"snowpack-public": "/",
		src: "/src",
	},
	plugins: [
		[
			"./snowpack-plugin-swc.cjs",
			{
				transformOptions: {
					jsc: {
						parser: {
							syntax: "typescript",
							tsx: true,
						},
						transform: {
							react: {
								runtime: "automatic",
							},
						},
					},
				},
			},
		],
	],
	devOptions: {
		open: "none",
		port: 5081,
		hmr: true,
	},
	buildOptions: {
		out: "dist-snowpack-swc",
		sourcemap: false,
	},
};
