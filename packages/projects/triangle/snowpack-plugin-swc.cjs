const swc = require("@swc/core");
module.exports = function plugin(snowpackConfig, options = {}) {

    let env = process.env.NODE_ENV;
    return {
        name: "my-snowpack-plugin-swc",
        resolve: {
            input: options.input || [".js", ".mjs", ".jsx", ".ts", ".tsx"],
            output: [".js"],
        },
        async load({filePath}) {
            if (!filePath) return
            let {code, map} = await swc.transformFile(
                filePath,
                options.transformOptions
            )
            if (code) {
                // replace process.env.NODE_ENV otherwise browser error because of without process
                code = code.replace(/process\.env\.NODE_ENV/g, `'${env}'`)
            }

            return {".js": {code, map}}
        },
    }
}