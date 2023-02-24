const PurgecssPlugin = require("purgecss-webpack-plugin")
const glob = require("glob")
const path = require("path")

module.exports = {
    content: ["./public/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"],
    css: ["./src/**/*.css"],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    plugins: [
        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, {
                nodir: true,
            }),
            safelist: {
                standard: ["active", "disabled"],
                deep: [],
                greedy: [],
            },
            keyframes: true,
            fontFace: true,
        }),
        // ...
    ],
}
