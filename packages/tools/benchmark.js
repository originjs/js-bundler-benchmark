import { readFileSync, writeFileSync } from "fs";
import { basename, resolve } from "path";
import playwright from "playwright";
import { sleep } from "./fileUtil.js";
import { parseArgs } from "./parseArgs.js";
import { getProjectInfo, projectsDirname, runtimeInfo } from "./projectInfo.js";
import { report } from "./report.js";

const { projectName, indexes } = parseArgs();

const workspaceName = projectName || "triangle-react";
// set currentDir for build tools
runtimeInfo.currentDir = resolve(projectsDirname, workspaceName);
const projectInfo = getProjectInfo(workspaceName);
if (!projectInfo) {
	throw new Error(`no project named ${projectName}`);
}
const rootFilePath = resolve(runtimeInfo.currentDir, projectInfo.rootFilePath);
const leafFilePath = resolve(runtimeInfo.currentDir, projectInfo.leafFilePath);

const rootFileContent = readFileSync(rootFilePath, "utf-8");
const leafFileContent = readFileSync(leafFilePath, "utf-8");

const results = [];
const browser = await playwright.chromium.launch();
const context = await browser.newContext();

const buildTasks =
	!indexes || indexes.length === 0
		? projectInfo.buildInfo
		: projectInfo.buildInfo.filter((_, index) => indexes.includes(index));

for (const item of buildTasks) {
	// set project info
	item.workspaceName = workspaceName;
	item.currentDir = runtimeInfo.currentDir;
}

async function start() {
	for (const task of buildTasks) {
		try {
			// first startup: clear cache, cold start
			task.cleanDistAndCache();
			const serverStartTime4Cold = await task.startServer();
			await sleep(1000);
			let loadPageTime4Cold = -1;
			if (serverStartTime4Cold > -1) {
				loadPageTime4Cold = await task.loadPageTimeAndClosePage(context);
			}

			let loadPageTime4Hot;
			await task.stopServer();
			// second startup: no cache cleaning, hot start
			task.cleanDist();
			const serverStartTime4Hot = await task.startServer();
			await sleep(1000);
			if (serverStartTime4Hot > -1) {
				loadPageTime4Hot = await task.loadPageTime(context);
			}
			// wait for some build tools (like turbo) compile
			await sleep(3000);

			const rootHmrTime = await task.hmrTime(projectInfo, rootFilePath);
			await sleep(1000);
			const leafHmrTime = await task.hmrTime(projectInfo, leafFilePath);

			await task.closePage();
			task.stopServer();

			const buildTime = await task.buildTime();
			task.stopBuild();
			const pkgSize = await task.tarDist();
			// clean
			await task.cleanDistAndCache();

			const thisBuildToolResult = {
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
			results.push(thisBuildToolResult);
		} finally {
			// restore file
			writeFileSync(rootFilePath, rootFileContent);
			writeFileSync(leafFilePath, leafFileContent);
			console.log(
				`{${task.projectName}} restore ${basename(rootFilePath)},${basename(
					leafFilePath,
				)}`,
			);
		}
	}
	await context.close();
	await browser.close();
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

await start();
process.exit();
