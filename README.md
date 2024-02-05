# @originjs/js-bundler-benchmark

## Run benchmarks:
```bash
node packages/tools/benchmark.mjs
```
The `-p` parameter switches the evaluation project.

## Results of the last assessment(2024-02-05)

| num |      bundler      |  Cold start time(ms) | Page load time - cold start(ms) | Hot start time(ms) | Page load time - hot start(ms)  | HMR - root	(ms) | HMR - leaf(ms) | Build time(ms) | dist package size(KB) |
|-|-|-|-|-|-|-|-|-|-|
|    0    |  Rspack(babel)  |        11130         |        636        |        10740        |       570        |     171     |     210     |   15808   |  59.5   |
|    1    |   Rspack(swc)   |         1710         |        651        |        1730         |       678        |     194     |     148     |   3324    |  72.3   |
|    2    |     esbuild     |        60000         |        693        |        58000        |       693        |    1821     |    1077     |   1218    |  93.3   |
|    3    |    Turbopack    |         1794         |       8121        |        1784         |       7127       |    2239     |     246     |    /      |   /     |
|    4    | Webpack (babel) |        19157         |       1036        |        19113        |       1219       |     574     |     344     |   25191   |  70.6   |
|    5    |  Webpack (swc)  |         6772         |       1092        |        6749         |       1251       |     503     |     302     |   9712    |  67.9   |
|    6    |      Vite       |         562          |       8524        |         465         |       9528       |     /       |     321     |   6273    |  73.7   |
|    7    |   Vite (swc)    |         513          |       4439        |         467         |       5981       |     /       |     321     |   6590    |  73.7   |
|    8    |      Farm       |         1227         |        632        |         883         |       920        |     45      |     41      |   4485    |  66.5   |
|    9    |     Parcel      |         /            |       6536        |        /            |       6379       |     160     |     76      |   9580    |  70.2   |
|   10    |   Parcel-swc    |         /            |       6238        |        /            |       7322       |     173     |     88      |   36372   |  309.8  |
|   11    |    snowpack     |          52          |       5998        |         51          |       4596       |    1431     |    1330     |   18644   |  161.4  |
|   12    |  snowpack-swc   |          50          |       5475        |         53          |       5447       |    1389     |    1279     |   19097   |  182.9  |
|   13    |  rsbuild-babel  |         9600         |        729        |        9300         |       703        |     373     |     384     |   12182   |  63.1   |
|   14    |   rsbuild-swc   |         850          |        886        |         810         |       866        |     223     |     186     |   3653    |  64.1   |
|   15    |     rollup      |        47500         |        303        |        47100        |       305        |     /       |     /       |   48717   |  87.4   |
|   16    |   rollup-swc    |        35400         |        305        |        35400        |       304        |     /       |     /       |   31699   |  80.9   |
|   17    |       wmr       |          /           |        /          |         /           |        /         |     /       |     /       |   16854   |  108.7  |




## Reference
- https://github.com/sapphi-red/performance-compare
- https://github.com/farm-fe/performance-compare