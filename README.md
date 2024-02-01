# performance-compare

## reference
- https://github.com/sapphi-red/performance-compare
- https://github.com/farm-fe/performance-compare

## Run benchmarks:
```bash
node packages/tools/benchmark.mjs
```
The `-p` parameter switches the evaluation project.

## Results of the last assessment(2024-02-01)

| (index) |      bundler      | serverStartTime4Cold | loadPageTime4Cold | serverStartTime4Hot | loadPageTime4Hot | rootHmrTime | leafHmrTime | buildTime |
|-        |-                  |-                     |-                  |-                    |-                 |-            |-            |-          |
|    0    |  'Rspack(babel)'  |         6790         |        320        |        7040         |       316        |     164     |     130     |   8378    |
|    1    |   'Rspack(swc)'   |         1310         |        543        |        1290         |       357        |     173     |     105     |   8493    |
|    2    |     'esbuild'     |        66000         |        713        |        62000        |       733        |    1103     |    3346     |  208480   |
|    3    |    'Turbopack'    |         1258         |       4620        |        1209         |       4803       |     -1      |     64      |     0     |
|    4    | 'Webpack (babel)' |        12657         |        552        |        13043        |       614        |     369     |     323     |   17339   |
|    5    |  'Webpack (swc)'  |         4767         |        631        |        4744         |       697        |     386     |     225     |   7538    |
|    6    |      'Vite'       |         468          |       8401        |         477         |       9001       |     -1      |     323     |   5202    |
|    7    |   'Vite (swc)'    |         1567         |       5079        |         350         |       5276       |     -1      |     318     |   4467    |
|    8    |      'Farm'       |         570          |        359        |         522         |       355        |     -1      |     -1      |   2356    |
|    9    |     'Parcel'      |         null         |       8909        |        null         |       8442       |     265     |     57      |   11570   |
|   10    |   'Parcel-swc'    |         null         |       10876       |        null         |       9698       |     281     |     65      |   17392   |
|   11    |    'snowpack'     |          39          |       7711        |         39          |       6612       |    3222     |    2826     |   11776   |
|   12    |  'snowpack-swc'   |          50          |       9752        |         37          |       8595       |    2727     |    2357     |   14612   |
|   13    |  'rsbuild-babel'  |         810          |        546        |         690         |       522        |    1108     |     330     |   2234    |
|   14    |   'rsbuild-swc'   |         940          |        632        |         950         |       633        |     235     |     215     |   2607    |