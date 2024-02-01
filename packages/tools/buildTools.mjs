import {mkdir, rm} from "fs/promises";
import {spawn} from "child_process";
import kill from "tree-kill";
import path from "path";
import url from "url";

const _dirname = path.dirname(url.fileURLToPath(import.meta.url))

class BuildTool {
    constructor(name, port, script, startedRegex, clean, buildScript, skipHmr = false) {
        this.name = name;
        this.port = port;
        this.script = script;
        this.startedRegex = startedRegex;
        this.clean = clean;
        this.buildScript = buildScript;
        this.skipHmr = skipHmr;
    }

    async startServer(workspaceName) {
        const child = spawn(`pnpm --filter "${workspaceName}"`, ["run", this.script], {
            stdio: 'pipe',
            shell: true,
            env: {...process.env, NO_COLOR: '1'}
        });
        this.child = child;
        return new Promise((resolve, reject) => {
            child.stdout.on('data', (data) => {
                console.log(data.toString());
                const match = this.startedRegex.exec(data);
                if (match) {
                    if (!match[1]) {
                        resolve(null)
                        return
                    }

                    const number = parseFloat(match[1].replace(/m?s$/, '').trim())
                    resolve(number * (match[1].endsWith('ms') ? 1 : 1000));
                }
            });
            child.on('error', (error) => {
                console.log(`${this.name} error: ${error.message}`);
                reject(error);
            });
            child.on('exit', (code) => {
                if (code !== null && code !== 0 && code !== 1) {
                    console.log(`${this.name} exit: ${code}`);
                    reject(code);
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
        const child = spawn(`pnpm --filter "${workspaceName}"`, ["run", this.buildScript], {
            stdio: 'pipe',
            shell: true,
            env: {...process.env, NO_COLOR: '1'}
        });
        this.child = child;
        return new Promise((resolve, reject) => {
            child.on('error', (error) => {
                console.log(`${this.name} error: ${error.message}`);
                reject(error);
            });
            child.on('exit', (code) => {
                if (code !== null && code !== 0 && code !== 1) {
                    console.log(`${this.name} exit: ${code}`);
                    reject(code);
                }
                resolve()
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
        () => {
        },
        "build:rspack"
    ),
    new BuildTool(
        "Rspack(swc)",
        8080,
        "start:rspack-swc",
        /compiled in (.+m?s)/,
        () => {
        },
        "build:rspack"
    ),
    new BuildTool(
        "esbuild",
        1235,
        "start:esbuild",
        /esbuild serve cost (.+m?s)/,
        async () => {
            const serveDir = path.join(_dirname, "../esbuild-serve");
            try {
                await mkdir(serveDir)
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err
                }
            }
        },
        "build:esbuild"
    ),
    new BuildTool(
        "Turbopack",
        3000,
        "start:turbopack",
        /Ready in (.+m?s)/,
        () => rm(path.join(_dirname, '../.next'), {force: true, recursive: true, maxRetries: 5}),
        ""
    ),
    new BuildTool(
        "Webpack (babel)",
        8081,
        "start:webpack",
        /compiled successfully in (.+m?s)/,
        () => {
        },
        "build:webpack"
    ),
    new BuildTool(
        "Webpack (swc)",
        8082,
        "start:webpack-swc",
        /compiled successfully in (.+ m?s)/,
        () => {
        },
        "build:webpack-swc"
    ),
    new BuildTool(
        "Vite",
        5173,
        "start:vite",
        /ready in (.+ m?s)/,
        () => rm(path.join(_dirname, '../node_modules/.vite'), {force: true, recursive: true, maxRetries: 5}),
        "build:vite"
    ),
    new BuildTool(
        "Vite (swc)",
        5174,
        "start:vite-swc",
        /ready in (.+ m?s)/,
        () => rm(path.join(_dirname, '../node_modules/.vite-swc'), {force: true, recursive: true, maxRetries: 5}),
        "build:vite-swc"
    ),
    new BuildTool(
        "Farm",
        9000,
        "start:farm",
        /Ready in (.+m?s)/,
        () => rm(path.join(_dirname, '../node_modules/.farm'), {force: true, recursive: true, maxRetries: 5}),
        "build:farm",
        true
    ),
    new BuildTool(
        "Parcel",
        1234,
        "start:parcel",
        /Server running/,
        () => Promise.all([
            rm(path.join(_dirname, '../.parcel-cache'), {force: true, recursive: true, maxRetries: 5}),
            rm(path.join(_dirname, '../dist-parcel'), {force: true, recursive: true, maxRetries: 5})
        ]),
        "build:parcel"
    ),
    new BuildTool(
        "Parcel-swc",
        1234,
        "start:parcel-swc",
        /Server running/,
        () => Promise.all([
            rm(path.join(_dirname, '../.parcel-cache'), {force: true, recursive: true, maxRetries: 5}),
            rm(path.join(_dirname, '../dist-parcel'), {force: true, recursive: true, maxRetries: 5})
        ]),
        "build:parcel-swc"
    ),
    new BuildTool(
        "snowpack",
        1236,
        "start:snowpack",
        /Server started in (.+m?s)/,
        () => rm(path.join(_dirname, '../node_modules/.cache'), {force: true, recursive: true, maxRetries: 5}),
        "build:snowpack"
    ),
    new BuildTool(
        "snowpack-swc",
        1237,
        "start:snowpack-swc",
        /Server started in (.+m?s)/,
        () => rm(path.join(_dirname, '../node_modules/.cache'), {force: true, recursive: true, maxRetries: 5}),
        "build:snowpack-swc"
    ),
    new BuildTool(
        "rsbuild-babel",
        8080,
        "start:rsbuild-babel",
        /Client compiled in (.+m?s)/,
        () => {
        },
        "build:rsbuild-babel"
    ),
    new BuildTool(
        "rsbuild-swc",
        1238,
        "start:rsbuild-swc",
        /Client compiled in (.+m?s)/,
        () => {
        },
        "build:rsbuild-swc"
    ),

    // rollup
    // rollup-swc
]
