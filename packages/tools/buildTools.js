import { spawn } from "child_process";
import { join } from "path";
import { mkdir, rm } from "fs/promises";
import kill from "tree-kill";
import { runtimeInfo } from "./projectInfo.js";

class BuildTool {
	constructor(
		name,
		port,
		script,
		startedRegex,
		clean,
		buildScript,
		distDir,
		skipHmr = false,
	) {
		this.name = name;
		this.port = port;
		this.script = script;
		this.startedRegex = startedRegex;
		this.clean = clean;
		this.buildScript = buildScript;
		this.distDir = distDir;
		this.skipHmr = skipHmr;
	}

	async startServer(workspaceName) {
		const child = spawn(
			`pnpm --filter "${workspaceName}"`,
			["run", this.script],
			{
				stdio: ["pipe", "pipe", "pipe"],
				shell: true,
				env: { ...process.env, NO_COLOR: "1" },
			},
		);
		this.child = child;

		return new Promise((resolve) => {
			const timerNum = setTimeout(resolve, 120000);
			const _resolve = (args) => {
				if (timerNum) {
					clearTimeout(timerNum);
				}
				resolve(args);
			};

			const listenMessages = (data) => {
				console.log(data.toString());
				const match = this.startedRegex.exec(data);
				if (match) {
					if (!match[1]) {
						_resolve(null);
						return;
					}

					const number = parseFloat(match[1].replace(/m?s$/, "").trim());
					_resolve(number * (match[1].endsWith("ms") ? 1 : 1000));
				}
			};

			child.stdout.on("data", (data) => listenMessages(data));
			child.stderr.on("data", (data) => listenMessages(data));

			child.on("exit", (code) => {
				if (code !== null && code !== 0 && code !== 1) {
					console.error(`${this.name} exit: ${code}`);
					_resolve(code);
				}
			});
		});
	}

	stop() {
		if (this.child) {
			this.child.stdin.pause();
			this.child.stdout.destroy();
			this.child.stderr.destroy();
			kill(this.child.pid);
		}
	}

	async startProductionBuild(workspaceName) {
		const child = spawn(
			`pnpm --filter "${workspaceName}"`,
			["run", this.buildScript],
			{
				stdio: "pipe",
				shell: true,
				env: { ...process.env, NO_COLOR: "1" },
			},
		);
		this.child = child;
		return new Promise((resolve, reject) => {
			child.on("error", (error) => {
				console.log(`${this.name} error: ${error.message}`);
				reject(error);
			});
			child.on("exit", (code) => {
				if (code !== null && code !== 0 && code !== 1) {
					console.log(`${this.name} exit: ${code}`);
					reject(code);
				}
				resolve();
			});
		});
	}
}

export const buildTools = [
	new BuildTool(
		"Rspack(babel)",
		8079,
		"start:rspack",
		/compiled in (.+m?s)/,
		null,
		"build:rspack",
		"dist-rspack",
	),
	new BuildTool(
		"Rspack(swc)",
		8080,
		"start:rspack-swc",
		/compiled in (.+m?s)/,
		null,
		"build:rspack-swc",
		"dist-rspack-swc",
	),
	new BuildTool(
		"esbuild",
		1235,
		"start:esbuild",
		/esbuild serve cost (.+m?s)/,
		async () => {
			const serveDir = join(runtimeInfo.currentDir, "esbuild-serve");
			try {
				await mkdir(serveDir);
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
		3000,
		"start:turbopack",
		/Ready in (.+m?s)/,
		() =>
			rm(join(runtimeInfo.currentDir, ".next"), {
				force: true,
				recursive: true,
				maxRetries: 5,
			}),
		"",
		"",
	),
	new BuildTool(
		"Webpack (babel)",
		8081,
		"start:webpack",
		/compiled successfully in (.+m?s)/,
		null,
		"build:webpack",
		"dist-webpack",
	),
	new BuildTool(
		"Webpack (swc)",
		8082,
		"start:webpack-swc",
		/compiled successfully in (.+ m?s)/,
		null,
		"build:webpack-swc",
		"dist-webpack-swc",
	),
	new BuildTool(
		"Vite",
		5173,
		"start:vite",
		/ready in (.+ m?s)/,
		() =>
			rm(join(runtimeInfo.currentDir, "node_modules/.vite"), {
				force: true,
				recursive: true,
				maxRetries: 5,
			}),
		"build:vite",
		"dist-vite",
	),
	new BuildTool(
		"Vite (swc)",
		5174,
		"start:vite-swc",
		/ready in (.+ m?s)/,
		() =>
			rm(join(runtimeInfo.currentDir, "node_modules/.vite-swc"), {
				force: true,
				recursive: true,
				maxRetries: 5,
			}),
		"build:vite-swc",
		"dist-vite-swc",
	),
	new BuildTool(
		"Farm",
		9000,
		"start:farm",
		/Ready in (.+m?s)/,
		() =>
			rm(join(runtimeInfo.currentDir, "node_modules/.farm"), {
				force: true,
				recursive: true,
				maxRetries: 5,
			}),
		"build:farm",
		"dist-farm",
		true,
	),
	new BuildTool(
		"Parcel",
		1234,
		"start:parcel",
		/Server running/,
		() =>
			Promise.all([
				rm(join(runtimeInfo.currentDir, ".parcel-cache"), {
					force: true,
					recursive: true,
					maxRetries: 5,
				}),
				rm(join(runtimeInfo.currentDir, "dist-parcel"), {
					force: true,
					recursive: true,
					maxRetries: 5,
				}),
			]),
		"build:parcel",
		"dist-parcel",
	),
	new BuildTool(
		"Parcel-swc",
		1234,
		"start:parcel-swc",
		/Server running/,
		() =>
			Promise.all([
				rm(join(runtimeInfo.currentDir, ".parcel-cache"), {
					force: true,
					recursive: true,
					maxRetries: 5,
				}),
				rm(join(runtimeInfo.currentDir, "dist-parcel"), {
					force: true,
					recursive: true,
					maxRetries: 5,
				}),
			]),
		"build:parcel-swc",
		"dist-parcel-swc",
	),
	new BuildTool(
		"snowpack",
		1236,
		"start:snowpack",
		/Server started in (.+m?s)/,
		() =>
			rm(join(runtimeInfo.currentDir, "node_modules/.cache"), {
				force: true,
				recursive: true,
				maxRetries: 5,
			}),
		"build:snowpack",
		"dist-snowpack",
	),
	new BuildTool(
		"snowpack-swc",
		1237,
		"start:snowpack-swc",
		/Server started in (.+m?s)/,
		() =>
			rm(join(runtimeInfo.currentDir, "node_modules/.cache"), {
				force: true,
				recursive: true,
				maxRetries: 5,
			}),
		"build:snowpack-swc",
		"dist-snowpack-swc",
	),
	new BuildTool(
		"rsbuild-babel",
		1237,
		"start:rsbuild-babel",
		/Client compiled in (.+m?s)/,
		null,
		"build:rsbuild-babel",
		"dist-rsbuild-babel",
	),
	new BuildTool(
		"rsbuild-swc",
		1238,
		"start:rsbuild-swc",
		/Client compiled in (.+m?s)/,
		null,
		"build:rsbuild-swc",
		"dist-rsbuild-swc",
	),
	new BuildTool(
		"rollup",
		8083,
		"start:rollup",
		/created dist-rollup\/index.js in (.+m?s)/,
		null,
		"build:rollup",
		"dist-rollup",
	),
	new BuildTool(
		"rollup-swc",
		8084,
		"start:rollup-swc",
		/created dist-rollup-swc\/index.js in (.+m?s)/,
		null,
		"build:rollup-swc",
		"dist-rollup-swc",
	),
	new BuildTool("wmr", null, null, null, () => {}, "build:wmr", "dist-wmr"),
];
