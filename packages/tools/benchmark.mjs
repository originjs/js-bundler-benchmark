import {appendFileSync, readFileSync, writeFileSync} from "fs";
import playwright from "playwright";
import {parseArgs} from './parseArgs.mjs'
import {buildTools} from "./buildTools.mjs"
import {fileURLToPath} from "node:url";
import {resolve, dirname} from "path";

const {
    type,
    count,
    hotRun,
    outputMd,
    projectName
} = parseArgs()
const runDev = type === 'all' || type === 'dev'
const runBuild = type === 'all' || type === 'build'
const workspaceName = projectName || "triangle-demo"

let rootFilePath = resolve(fileURLToPath(import.meta.url), '../../projects/react/src/components', 'Carousel_0_0.tsx')
let leafFilePath = resolve(fileURLToPath(import.meta.url), '../../projects/react/src/components', 'Carousel_0_0.tsx')

if(workspaceName == "triangle-demo"){
    rootFilePath = resolve(fileURLToPath(import.meta.url), '../../projects/triangle/src/comps', 'triangle.jsx');
    leafFilePath = resolve(fileURLToPath(import.meta.url), '../../projects/triangle/src/comps',  'triangle_1_1_2_1_2_2_1.jsx');
}

const originalRootFileContent = readFileSync(rootFilePath, 'utf-8');
const originalLeafFileContent = readFileSync(leafFilePath, 'utf-8');

console.log(`Running ${hotRun ? 'hot' : 'cold'} run ${count} times`)
console.log()

const results = []

if (runDev) {
    const browser = await playwright.chromium.launch();

    for (const buildTool of buildTools) {
        const totalResult = {}

        if (hotRun) {
            console.log(`Populate cache: ${buildTool.name}`);
            const page = await (await browser.newContext()).newPage();
            await buildTool.startServer(workspaceName);
            await page.goto(`http://localhost:${buildTool.port}`, {waitUntil: 'load'});
            buildTool.stop();
            await page.close();
        }

        for (let i = 0; i < count; i++) {
            try {
                console.log(`Running: ${buildTool.name} (${i + 1})`);

                if (!hotRun) {
                    await buildTool.clean?.()
                }

                const page = await (await browser.newContext()).newPage();
                await new Promise((resolve) => setTimeout(resolve, 300)); // give some rest

                const loadPromise = page.waitForEvent('load', {timeout: 300000});
                const pageLoadStart = Date.now();
                const serverStartTime = await buildTool.startServer(workspaceName);
                page.goto(`http://localhost:${buildTool.port}`);
                await loadPromise;
                totalResult.startup ??= 0;
                totalResult.startup += (Date.now() - pageLoadStart);
                if (serverStartTime !== null) {
                    totalResult.serverStart ??= 0;
                    totalResult.serverStart += serverStartTime;
                }

                await new Promise((resolve) => setTimeout(resolve, 500));

                if (!buildTool.skipHmr) {
                    const rootConsolePromise = page.waitForEvent('console', {
                        timeout: 300000, predicate: e => {
                            const logText = e.text();
                            console.log(logText)
                            return logText.includes('root hmr');
                        }
                    });
                    appendFileSync(rootFilePath, `
            console.log('root hmr');
          `)
                    const hmrRootStart = Date.now();
                    await rootConsolePromise;
                    totalResult.rootHmr ??= 0;
                    totalResult.rootHmr += (Date.now() - hmrRootStart);

                    await new Promise((resolve) => setTimeout(resolve, 500));

                    const leafConsolePromise = page.waitForEvent('console', {
                        timeout: 300000, predicate: e => {
                            const logText = e.text();
                            console.log(logText)
                            return logText.includes('leaf hmr');
                        }
                    });
                    appendFileSync(leafFilePath, `
            console.log('leaf hmr');
          `)
                    const hmrLeafStart = Date.now();
                    await leafConsolePromise;
                    totalResult.leafHmr ??= 0;
                    totalResult.leafHmr += (Date.now() - hmrLeafStart);
                }

                buildTool.stop();
                await page.close();
            } finally {
                writeFileSync(rootFilePath, originalRootFileContent);
                writeFileSync(leafFilePath, originalLeafFileContent);
            }
        }

        const result = Object.fromEntries(Object.entries(totalResult).map(([k, v]) => [k, v ? (v / count).toFixed(1) : v]))
        results.push({name: buildTool.name, result})
    }

    await browser.close();
}

if (runBuild) {
    for (const buildTool of buildTools) {
        if (buildTool.buildScript) {
            await buildTool.clean?.()

            let sum = 0;
            for (let i = 0; i < count; i++) {
                console.log(`Running: ${buildTool.name} (${i + 1})`);
                const productionStart = Date.now();
                await buildTool.startProductionBuild(workspaceName)
                const productionEnd = Date.now()
                sum += productionEnd - productionStart
            }

            const matchedResult = results.find((item) => item.name === buildTool.name)
            if (matchedResult) {
                matchedResult.result.production = (sum / count).toFixed(1);
            } else {
                results.push({name: buildTool.name, result: {production: (sum / count).toFixed(1)}})
            }
        }
    }
}

console.log('-----')
console.log('Results')

if (outputMd) {
    const rows = [
        'name',
        ...(runDev ? ['startup', 'Root HMR', 'Leaf HMR'] : []),
        ...(runBuild ? ['Build time'] : [])
    ]
    let out = `| ${rows.join(' | ')} |\n`
    out += `| ${rows.map((v, i) => i === 0 ? ' --- ' : ' ---: ').join('|')} |\n`
    out += results
        .map(
            ({name, result}) =>
                `| ${[
                    name,
                    ...(runDev
                        ? [
                            `${result.startup}ms${
                                result.serverStart
                                    ? ` (including server start up time: ${result.serverStart}ms)`
                                    : ''
                            }`,
                            `${result.rootHmr ? `${result.rootHmr}ms` : '---'}`,
                            `${result.leafHmr ? `${result.leafHmr}ms` : '---'}`
                        ]
                        : []),
                    ...(runBuild
                            ? [`${result.production ? `${result.production}ms` : '---'}`]
                            : []
                    )
                ].join(' | ')} |`
        )
        .join('\n')
    console.log(out)
} else {
    const out = Object.fromEntries(results.map(({name, result}) => [
        name,
        {
            ...(runDev
                ? {
                    'startup time': `${result.startup}ms${
                        result.serverStart
                            ? ` (including server start up time: ${result.serverStart}ms)`
                            : ''
                    }`,
                    'Root HMR time': `${result.rootHmr ? `${result.rootHmr}ms` : '---'}`,
                    'Leaf HMR time': `${result.leafHmr ? `${result.leafHmr}ms` : '---'}`,
                }
                : {}),
            ...(runBuild
                    ? {
                        'Build time': `${result.production ? `${result.production}ms` : '---'}`
                    }
                    : {}
            )
        }
    ]))
    console.table(out)
}
