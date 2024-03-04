# @originjs/js-bundler-benchmark

## Run benchmarks:
```bash
node packages/tools/benchmark.mjs
```

The `-p` parameter switches the evaluation project
``` bash
pnpm benchmark -p=triangle-vue
```

## Results of the last assessment(2024-02-05)

| num |      bundler      |  Cold start time(ms) | Page load time - cold start(ms) | Hot start time(ms) | Page load time - hot start(ms)  | HMR - root	(ms) | HMR - leaf(ms) | Build time(ms) | dist package size(KB) |
|-|-|-|-|-|-|-|-|-|-|
|    0    |  Rspack(babel)  |         8500         |        465        |        8260         |       452        |     139     |     131     |   9984    |  59.5   |
|    1    |   Rspack(swc)   |         1520         |        527        |        1350         |       506        |     140     |     145     |   3415    |  72.3   |
|    2    |     esbuild     |        70000         |        793        |        58000        |       700        |     559     |    1506     |   1817    |  93.3   |
|    3    |    Turbopack    |         2500         |       7982        |        1573         |       9003       |     /       |     200     |    /      |   /     |
|    4    | Webpack (babel) |        16077         |        790        |        15404        |       982        |     436     |     232     |   22641   |  70.6   |
|    5    |  Webpack (swc)  |         6415         |        906        |        6765         |       994        |     388     |     279     |   8420    |  67.9   |
|    6    |      Vite       |         568          |       9500        |         466         |      10559       |     /       |     328     |   5061    |  73.7   |
|    7    |   Vite (swc)    |         531          |       5855        |         392         |       6774       |     /       |     322     |   5190    |  73.7   |
|    8    |      Farm       |         1425         |       1566        |         823         |       1820       |     90      |     42      |   4096    |  66.5   |
|    9    |     Parcel      |         /            |       5776        |        /            |       5623       |     180     |     65      |   8774    |  70.2   |
|   10    |   Parcel-swc    |         /            |       5615        |        /            |       5573       |     166     |     53      |   8948    |  70.2   |
|   11    |    snowpack     |          42          |       3994        |         39          |       3788       |    1223     |    1039     |   15224   |  74.6   |
|   12    |  snowpack-swc   |          40          |       4576        |         39          |       4532       |    1182     |    1021     |   18946   |   86    |
|   13    |  rsbuild-babel  |         8200         |        743        |        8000         |       622        |    1050     |     300     |   10788   |  63.1   |
|   14    |   rsbuild-swc   |         950          |        801        |         800         |       740        |     176     |     145     |   3515    |  64.1   |
|   15    |     rollup      |        38700         |        239        |        38600        |       228        |     /       |     /       |   38231   |  87.4   |
|   16    |   rollup-swc    |        30300         |        237        |        28900        |       233        |     /       |     /       |   26579   |  80.9   |
|   17    |       wmr       |          /           |        /          |         /           |        /         |     /       |     /       |   13064   |  108.7  |

## Reference
- https://github.com/sapphi-red/performance-compare
- https://github.com/farm-fe/performance-compare
