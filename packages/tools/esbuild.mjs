import esbuild from "esbuild";
import http from "http";
import path from "path";
import fs from "fs";
import {fileURLToPath, resolve} from "node:url";

const projectsDir = resolve(fileURLToPath((import.meta.url)), '../projects/');
const args = process.argv.slice(2);
const parsedArg = new Map();
args.forEach(arg => {
    const [key, value] = arg.split('=');
    parsedArg.set(key, value);
})
const watch = parsedArg.has("--watch");
const entry = parsedArg.get("--entry");

const outputDir = resolve(projectsDir, parsedArg.get("--outputDir"));
const context = await esbuild.context({
    entryPoints: [resolve(projectsDir, entry)],
    bundle: true,
    outfile: `${outputDir}/main.js`,
    banner: {
        js: "(() => { (new EventSource(\"/esbuild\")).addEventListener('change', () => location.reload()); })();",
    },
});


if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

fs.cpSync(path.resolve(outputDir, "../index.esbuild.html"), path.resolve(outputDir, "index.html"));

if (watch) {
    await context.watch();
    let start = Date.now();
    const {host, port} = await context.serve({
        host: "localhost",
        port: 1235,
        servedir: outputDir,
    });
    let end = Date.now();
    const server = http.createServer((req, res) => {
        const {method, headers} = req;
        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname === "/" ? "/index.html" : url.pathname;
        const proxyReq = http.request(
            {hostname: host, port: port, path, method, headers},
            function handler(proxyRes) {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res, {end: true});
            }
        );
        req.pipe(proxyReq, {end: true});
    });
    server.listen(12345, () => {
        console.log(`esbuild serve cost ${end - start}ms: http://localhost:12345/`);
    });
} else {
    await context.rebuild();
    context.dispose();
}