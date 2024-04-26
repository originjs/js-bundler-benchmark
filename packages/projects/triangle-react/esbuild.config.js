import fs from "fs";
import http from "http";
import { existsSync, mkdirSync } from "node:fs";
import path from "path";
import url from "url";
import esbuild from "esbuild";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const watch = args.includes("--watch");
// dist-esbuild dir
const distDir = path.resolve(dirname, "dist-esbuild");
const existDistDir = existsSync(distDir);
if (!existDistDir) {
	mkdirSync(distDir);
}
const context = await esbuild.context({
	entryPoints: [path.resolve(dirname, "./src/index.tsx")],
	bundle: true,
	outfile: path.resolve(distDir, "main.js"),
	// Remove manual HMR
	// banner: {
	// 	js: "(() => { (new EventSource(\"/esbuild\")).addEventListener('change', () => location.reload()); })();",
	// },
});

fs.cpSync(
	path.resolve(dirname, "./esbuild-public/index.html"),
	path.resolve(distDir, "index.html"),
);

if (watch) {
	await context.watch();
	const start = Date.now();
	const { host, port } = await context.serve({
		host: "localhost",
		port: 1235,
		servedir: distDir,
	});
	const end = Date.now();
	const server = http.createServer((req, res) => {
		const { method, headers } = req;
		const url = new URL(req.url, `http://${req.headers.host}`);
		const path = url.pathname === "/" ? "/index.html" : url.pathname;
		const proxyReq = http.request(
			{ hostname: host, port: port, path, method, headers },
			function handler(proxyRes) {
				res.writeHead(proxyRes.statusCode, proxyRes.headers);
				proxyRes.pipe(res, { end: true });
			},
		);
		req.pipe(proxyReq, { end: true });
	});
	server.listen(5040, () => {
		console.log(`esbuild serve cost ${end - start}ms`);
		console.log("http://localhost:5040/");
	});
} else {
	await context.rebuild();
	context.dispose();
}

export const template = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
        <script src="./index.js"></script>
    </body>
</html>
`;
