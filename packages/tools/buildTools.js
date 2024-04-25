import { spawn } from "child_process";
import kill from "tree-kill";
import { isNumber } from "underscore";

export class BuildTool {
	constructor(
		projectName,
		name,
		port,
		script,
		startedRegex,
		clean,
		buildScript,
		distDir,
		skipHmr = false,
		skipHotStart = false,
	) {
		this.projectName = projectName;
		this.name = name;
		this.port = port;
		this.script = script;
		this.startedRegex = startedRegex;
		this.clean = clean;
		this.buildScript = buildScript;
		this.distDir = distDir;
		this.skipHmr = skipHmr;
		this.skipHotStart = skipHotStart;
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

			let startTime = null;
			const listenMessages = (data) => {
				const match = this.startedRegex.exec(data);
				if (match) {
					const endTime = new Date();
					if (!match[1]) {
						_resolve(null);
						return;
					}

					const devTime = match[1].replace(/m?s$/, "").trim();
					if (isNumber(devTime)) {
						const number = parseFloat(devTime);
						_resolve(number * (match[1].endsWith("ms") ? 1 : 1000));
					} else {
						_resolve(endTime - startTime);
					}
				}
			};

			child.on("spawn", () => {
				startTime = new Date();
			});
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
				resolve(endTime - startTime);
			});
		});
	}
}
