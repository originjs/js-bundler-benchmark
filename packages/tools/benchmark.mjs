import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import playwright from 'playwright';
import { parseArgs } from './parseArgs.mjs';
import { buildTools } from './buildTools.mjs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'path';

const { projectName, projectIndex } = parseArgs();

const workspaceName = projectName || 'triangle-demo';

let rootFilePath = resolve(
  fileURLToPath(import.meta.url),
  '../../projects/react/src/components',
  'Carousel_0_0.tsx'
);
let leafFilePath = resolve(
  fileURLToPath(import.meta.url),
  '../../projects/react/src/components',
  'Carousel_0_0.tsx'
);

if (workspaceName == 'triangle-demo') {
  rootFilePath = resolve(
    fileURLToPath(import.meta.url),
    '../../projects/triangle/src/comps',
    'triangle.jsx'
  );
  leafFilePath = resolve(
    fileURLToPath(import.meta.url),
    '../../projects/triangle/src/comps',
    'triangle_1_1_2_1_2_2_1.jsx'
  );
}

const originalRootFileContent = readFileSync(rootFilePath, 'utf-8');
const originalLeafFileContent = readFileSync(leafFilePath, 'utf-8');

const results = [];
const browser = await playwright.chromium.launch();

const array = projectIndex == -1 ? buildTools : [buildTools[projectIndex]];

async function start() {
  for (const buildTool of array) {
    try {
      let totalResult = {};
      // 第一次启动：清理缓存，冷启动
      await cleanServerCache(buildTool);
      const serverStartTime4Cold = await startServer(buildTool);
      const { time: loadPageTime4Cold } = await openBrowser(buildTool);

      await closePage();
      await stopServer(buildTool);
      await giveSomeRest();

      // 第二次启动：没有清理缓存，热启动
      const serverStartTime4Hot = await startServer(buildTool);
      const { time: loadPageTime4Hot, page } = await openBrowser(buildTool);

      const rootHmrTime = await hmrTime(page, rootFilePath);
      await giveSomeRest(1000);
      const leafHmrTime = await hmrTime(page, leafFilePath);

      await closePage();
      await stopServer(buildTool);

      const buildTime = await build(buildTool);

      const pkgSize = await pack(buildTool);

      totalResult = {
        bundler: buildTool.name,
        serverStartTime4Cold,
        loadPageTime4Cold,
        serverStartTime4Hot,
        loadPageTime4Hot,
        rootHmrTime,
        leafHmrTime,
        buildTime,
      };
      results.push(totalResult);
    } finally {
      writeFileSync(rootFilePath, originalRootFileContent);
      writeFileSync(leafFilePath, originalLeafFileContent);
    }
  }

  console.table(results);
}

function printResult() {
  const result = Object.fromEntries(
    Object.entries(totalResult).map(([k, v]) => [
      k,
      v ? (v / count).toFixed(1) : v, //求平均
    ])
  );

  results.push({ name: buildTool.name, result });
}

async function giveSomeRest(time = 300) {
  return await new Promise((resolve) => setTimeout(resolve, time));
}

async function openBrowser(bundler) {
  const page = await (await browser.newContext()).newPage();
  await giveSomeRest();
  const loadPromise = page.waitForEvent('load', { timeout: 30000 }); // 30s
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

async function startServer(bundler) {
  return await bundler.startServer(workspaceName);
}

async function startProductionBuild(bundler) {
  return await bundler.startProductionBuild(workspaceName);
}

async function stopServer(bundler) {
  return await bundler.stop();
}

async function hmrTime(page, filepath) {
  const testCodeText = 'Test hmr reaction time';
  const rootConsolePromise = page.waitForEvent('console', {
    timeout: 10000,
    predicate: (e) => {
      const logText = e.text();
      return logText.includes(testCodeText);
    },
  });
  appendFileSync(filepath, `console.log('${testCodeText}');`);
  const hmrRootStart = Date.now();
  try {
    await rootConsolePromise;
  } catch (e) {
    return -1;
  }
  return Date.now() - hmrRootStart;
}

async function build(bundler) {
  if (bundler.buildScript) {
    await cleanServerCache(bundler);
    await giveSomeRest(1000);
    const productionStart = Date.now();
    await startProductionBuild(bundler);
    const productionEnd = Date.now();
    return productionEnd - productionStart;
  }
  return 0;
}

async function pack(bundler){
  // 找到构建的目录
  // tgz目录
  // 获取tgz包大小
  return -1;
}

await start();
process.exit();
