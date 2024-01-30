import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import http from 'http'
import path from 'path'
import url from 'url'
import fs from 'fs'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const watch = args.includes('--watch')


const context = await esbuild.context({
  plugins: [
    vuePlugin({
      generateHTML: watch ? 'esbuild-serve/index.html' : 'dist-esbuild/index.html'
    })
  ],
  entryPoints: [path.resolve(dirname, 'src/main.ts')],
  bundle: true,
  outfile: watch ? 'esbuild-serve/main.js' : 'dist-esbuild/main.js',
  sourcemap: true,
  define: {
    __VUE_OPTIONS_API__: 'false',
    __VUE_PROD_DEVTOOLS__: 'false'
  }
})

const targetDir = watch ? path.resolve(dirname, 'esbuild-serve') : path.resolve(dirname, 'dist-esbuild')

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir)
}

fs.cpSync(path.resolve(dirname, 'index.esbuild.html'), path.resolve(targetDir, 'index.html'))

if (watch) {
  await context.watch()
  let start = Date.now()
  const { host, port } = await context.serve({
    host: 'localhost',
    port: 1235,
    servedir: 'esbuild-serve'
  })
  let end = Date.now()
  const server = http.createServer((req, res) => {
    const { method, headers } = req
    const url = new URL(req.url, `http://${req.headers.host}`)
    const path = url.pathname === '/' ? '/index.html' : url.pathname
    const proxyReq = http.request(
      { hostname: host, port: port, path, method, headers },
      function handler(proxyRes) {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      }
    )
    req.pipe(proxyReq, { end: true })
  })
  server.listen(12345, () => {
    console.log(`esbuild serve cost ${end - start}ms: http://localhost:12345/`)
  })
} else {
  await context.rebuild()
  context.dispose()
}
