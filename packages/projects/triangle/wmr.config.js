import {defineConfig} from "wmr";

// Full list of options: https://wmr.dev/docs/configuration
export default defineConfig({
    alias: {
        react: '@esm-bundle/react',
        'react-dom': '@esm-bundle/react-dom',
        "htm/preact": "htm/react",
        preact: 'react',
    },
    out: "dist-wmr",
    public: "src"
});
