import { readFileSync, rmSync, statSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import playwright from "playwright";
import * as tar from "tar";
import { parseArgs } from "./parseArgs.js";
import { getProjectInfo, projectsDirname, runtimeInfo } from "./projectInfo.js";
import { report } from "./report.js";

const { projectName, projectIndex } = parseArgs();

const workspaceName = projectName || "triangle-react";
// set currentDir for build tools
runtimeInfo.currentDir = resolve(projectsDirname, workspaceName);
const projectInfo = getProjectInfo(workspaceName);
if (!projectInfo) {
	throw new Error(`no project named ${projectName}`);
}
const rootFilePath = resolve(runtimeInfo.currentDir, projectInfo.rootFilePath);
const leafFilePath = resolve(runtimeInfo.currentDir, projectInfo.leafFilePath);

const originalRootFileContent = readFileSync(rootFilePath, "utf-8");
const originalLeafFileContent = readFileSync(leafFilePath, "utf-8");

const results = [];
const browser = await playwright.chromium.launch();

const buildTasks =
	projectIndex === -1
		? projectInfo.buildInfo
		: [projectInfo.buildInfo[projectIndex]];

async function start() {
	for (const task of buildTasks) {
		try {
			let totalResult = {};
			// first startup: clear cache, cold start
			await cleanServerCache(task);
			const serverStartTime4Cold = await startServer(task);
			let { time: loadPageTime4Cold, page } = await openBrowser(task);

			let serverStartTime4Hot;
			let loadPageTime4Hot;
			// some build tool don`t support hot cache
			if (!task.skipHotStart) {
				await closePage();
				await stopServer(task);
				await giveSomeRest();
				// second startup: no cache cleaning, hot start
				serverStartTime4Hot = await startServer(task);
				const hotBrowser = await openBrowser(task);
				page = hotBrowser.page;
				loadPageTime4Hot = hotBrowser.time;
			}

			const rootHmrTime = await hmrTime(page, rootFilePath);
			await giveSomeRest(1000);
			const leafHmrTime = await hmrTime(page, leafFilePath);

			await closePage();
			await stopServer(task);

			const buildTime = await build(task);
			const pkgSize = await pack(task);

			totalResult = {
				projectName: task.projectName,
				bundler: task.name,
				serverStartTime4Cold,
				loadPageTime4Cold,
				serverStartTime4Hot: serverStartTime4Hot ?? "skipped",
				loadPageTime4Hot: loadPageTime4Hot ?? "skipped",
				serverStartAndLoadPageTime4Cold: addFormatOutput(
					serverStartTime4Cold,
					loadPageTime4Cold,
				),
				serverStartAndLoadPageTime4Hot: addFormatOutput(
					serverStartTime4Hot,
					loadPageTime4Hot,
				),
				rootHmrTime,
				leafHmrTime,
				buildTime,
				pkgSize,
			};
			results.push(totalResult);
		} finally {
			writeFileSync(rootFilePath, originalRootFileContent);
			writeFileSync(leafFilePath, originalLeafFileContent);
		}
	}
	await report(results, projectInfo);
	console.table(results);
}

function addFormatOutput(...args) {
	let val = 0;
	for (const arg of args) {
		if (!arg || arg === "skipped" || arg === -1) {
			return "skipped";
		}
		val += arg;
	}
	return val;
}

function printResult() {
	const result = Object.fromEntries(
		Object.entries(totalResult).map(([k, v]) => [
			k,
			// average
			v ? (v / count).toFixed(1) : v,
		]),
	);

	results.push({ name: buildTool.name, result });
}

async function giveSomeRest(time = 300) {
	return await new Promise((resolve) => setTimeout(resolve, time));
}

async function openBrowser(bundler) {
	const page = await (await browser.newContext()).newPage();
	if (!bundler.script) {
		return { page, time: -1 };
	}

	await giveSomeRest();
	const loadPromise = page.waitForEvent("load", { timeout: 30000 });
	const pageLoadStart = Date.now();
	page.goto(`http://localhost:${bundler.port}`);
	await loadPromise;
	return { page, time: Date.now() - pageLoadStart };
}

async function closePage() {
	const colseFun = [];
	for (const context of browser.contexts()) {
		colseFun.push(context.close);
	}
	return Promise.all(colseFun);
}

async function cleanServerCache(bundler) {
	console.log(`clean cache: ${bundler.name}`);
	await bundler.clean?.();
}

function cleanDistDir(bundler) {
	rmSync(bundler.distDir, {
		force: true,
		recursive: true,
		maxRetries: 5,
	});
}

async function startServer(bundler) {
	if (!bundler.script) {
		return -1;
	}
	return await bundler.startServer(workspaceName);
}

async function startProductionBuild(bundler) {
	return await bundler.startProductionBuild(workspaceName);
}

async function stopServer(bundler) {
	if (!bundler.script) {
		return;
	}
	return await bundler.stop();
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hmrTime(page, filepath) {
	const testCodeText = "Test hmr reaction time";
	const rootConsolePromise = page.waitForEvent("console", {
		timeout: 10000,
		predicate: (e) => {
			const logText = e.text();
			return logText === testCodeText;
		},
	});
	//  waiting for promise execution,1s is enough
	await sleep(1000);
	projectInfo.changeFileFn(filepath, testCodeText);
	const hmrRootStart = Date.now();
	try {
		await rootConsolePromise;
		return Date.now() - hmrRootStart;
	} catch (e) {
		return -1;
	}
}

async function build(bundler) {
	if (bundler.buildScript) {
		cleanDistDir(bundler);
		await cleanServerCache(bundler);
		await giveSomeRest(1000);
		const productionStart = Date.now();
		await startProductionBuild(bundler);
		const productionEnd = Date.now();
		return productionEnd - productionStart;
	}
	return -1;
}

async function pack(bundler) {
	if (!bundler.buildScript) {
		return -1;
	}
	const distDir = join(runtimeInfo.currentDir, bundler.distDir);
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
	return Math.round((distFileStat.size / 1024) * 10) / 10;
}

await start();
process.exit();
