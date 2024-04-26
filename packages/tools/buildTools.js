import { spawn } from "child_process";
import { existsSync, statSync } from "fs";
import { join } from "path";
import { basename } from "path";
import * as tar from "tar";
import kill from "tree-kill";
import { isNumber } from "underscore";
import { forceRm, sleep } from "./fileUtil.js";
import { runtimeInfo } from "./projectInfo.js";

export class BuildTool {
	workspaceName;
	currentDir;
	serverChild;
	buildChild;
	page;

	constructor(
		projectName,
		name,
		port,
		startScript,
		startedRegex,
		buildScript,
		distDir,
		cacheDir,
	) {
		this.projectName = projectName;
		this.name = name;
		this.port = port;
		this.startScript = startScript;
		this.startedRegex = startedRegex;
		this.buildScript = buildScript;
		this.distDir = distDir;
		this.cacheDir = cacheDir;
	}

	cleanDist = () => {
		if (this.distDir) {
			forceRm(join(this.currentDir, this.distDir));
			console.log(`{${this.projectName}} clean dist dir:{${this.distDir}}`);
		}
	};

	cleanCache = () => {
		if (this.cacheDir) {
			forceRm(join(this.currentDir, this.cacheDir));
			console.log(`{${this.projectName}} clean cache dir:{${this.cacheDir}}`);
		}
	};

	cleanDistAndCache = () => {
		this.cleanDist();
		this.cleanCache();
	};

	loadPageTimeAndClosePage = async (context) => {
		const loadPageTime = await this.loadPageTime(context);
		await this.closePage();
		return loadPageTime;
	};

	closePage = async () => {
		await this.page?.close();
		this.page = null;
	};

	loadPageTime = async (context) => {
		if (!this.port) {
			return -1;
		}
		this.page = await context.newPage();
		await sleep(1000);
		const url = `http://localhost:${this.port}`;
		await this.page.goto(url, {
			timeout: 30000,
			waitUntil: "load",
		});
		const performanceTime = await this.page.evaluate(() => {
			return window.performance.getEntriesByType("navigation")[0];
		});
		const time = performanceTime?.duration ?? -1;
		console.log(`{${this.projectName}} load page ${url} {${time}} ms`);
		return time;
	};

	hmrTime = async (projectInfo, filePath) => {
		const testCodeText = "Test hmr reaction time";
		const rootConsolePromise = this.page.waitForEvent("console", {
			timeout: 10000,
			predicate: (e) => {
				const logText = e.text();
				return logText === testCodeText;
			},
		});
		//  waiting for promise execution,1s is enough
		await sleep(1000);
		projectInfo.changeFileFn(filePath, testCodeText);
		const hmrRootStart = Date.now();
		try {
			await rootConsolePromise;
			const duration = Date.now() - hmrRootStart;
			console.log(
				`{${this.projectName}} hmrTime of ${basename(
					filePath,
				)} {${duration}} ms`,
			);
			return duration;
		} catch (e) {
			console.log(
				`{${this.projectName}} hmrTime of ${basename(filePath)} error , ${e}`,
			);
			return -1;
		}
	};

	startServer = async () => {
		if (!this.startScript) {
			return -1;
		}
		const child = spawn(
			`pnpm --filter "${this.workspaceName}"`,
			["run", this.startScript],
			{
				stdio: ["pipe", "pipe", "pipe"],
				shell: true,
				env: { ...process.env, NO_COLOR: "1" },
			},
		);
		this.serverChild = child;

		return new Promise((resolve) => {
			const timerNum = setTimeout(resolve, 120000);
			const _resolve = (args) => {
				if (timerNum) {
					clearTimeout(timerNum);
				}
				resolve(args);
			};

			let startTime = null;
			const listenMessages = (data) => {
				const match = this.startedRegex.exec(data);
				if (match) {
					const endTime = new Date();
					if (!match[1]) {
						_resolve(null);
						return;
					}

					const buildToolReportTime = match[1].replace(/m?s$/, "").trim();
					let time = null;
					if (isNumber(buildToolReportTime)) {
						const number = parseFloat(buildToolReportTime);
						time = number * (match[1].endsWith("ms") ? 1 : 1000);
					} else {
						time = endTime - startTime;
					}
					console.log(`{${this.projectName}} start server {${time}} ms`);
					_resolve(time);
				}
			};

			child.on("spawn", () => {
				startTime = new Date();
			});
			child.stdout.on("data", (data) => listenMessages(data.toString()));
			child.stderr.on("data", (data) => listenMessages(data.toString()));

			child.on("exit", (code) => {
				if (code !== null && code !== 0 && code !== 1) {
					console.error(`${this.name} exit: ${code}`);
					_resolve(code);
				}
			});
		});
	};

	stopChild = (child) => {
		if (child) {
			child.stdin.pause();
			child.stdout.destroy();
			child.stderr.destroy();
			kill(child.pid);
		}
	};

	stopServer = () => {
		this.stopChild(this.serverChild);
		console.log(`{${this.projectName}} stop server`);
		this.serverChild = null;
	};

	stopBuild = () => {
		this.stopChild(this.buildChild);
		console.log(`{${this.projectName}} stop build`);
		this.buildChild = null;
	};

	buildTime = async () => {
		const child = spawn(
			`pnpm --filter "${this.workspaceName}"`,
			["run", this.buildScript],
			{
				stdio: "pipe",
				shell: true,
				env: { ...process.env, NO_COLOR: "1" },
			},
		);
		this.buildChild = child;
		return new Promise((resolve, reject) => {
			let startTime = null;
			child.on("spawn", () => {
				startTime = new Date();
			});
			child.on("error", (error) => {
				console.log(`${this.name} error: ${error.message}`);
				reject(error);
			});
			child.on("exit", (code) => {
				const endTime = new Date();
				if (code !== null && code !== 0 && code !== 1) {
					console.log(`${this.name} exit: ${code}`);
					reject(code);
				}
				const duration = endTime - startTime;
				console.log(`{${this.projectName}} get build time {${duration} ms}`);
				resolve(duration);
			});
		});
	};

	tarDist = async () => {
		const distDir = join(runtimeInfo.currentDir, this.distDir);
		const exist = existsSync(distDir);
		if (!exist) {
			return -1;
		}
		await tar.c(
			{
				cwd: distDir,
				gzip: true,
				prefix: false,
				file: `${distDir}/dist.tgz`,
				filter: (path, _) => {
					return path !== "dist.tgz";
				},
			},
			["./"],
		);
		const distFileStat = statSync(`${distDir}/dist.tgz`);
		const size = Math.round((distFileStat.size / 1024) * 10) / 10;
		console.log(
			`{${this.projectName}} get tar dist size of dir ${this.distDir}:{${size}} kb`,
		);
		return size;
	};
}
