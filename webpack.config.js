const path = require("path");
const webpack = require("webpack");
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const libraryName = "loglevel-plugin-server";
const outputFile = libraryName + ".min.js";

module.exports = {
    devtool: "source-map",
    context: path.join(__dirname, "src"),
    entry: {
        app: './index.js'
    },
    output: {
        path: path.join(__dirname, "lib"),
        filename: outputFile,
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            }
        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, "node_modules")
        ],
        extensions: [".js"]
    },
    plugins: [
        new uglifyJsPlugin({
            minimize: true
        })
    ]
};