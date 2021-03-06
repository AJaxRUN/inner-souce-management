const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const webpack = require("webpack");

module.exports =  {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/",
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    { loader: "css-loader",
                        options: {importLoaders: 1},
                    },
                    "postcss-loader"
                ],
                exclude: [
                    /node_modules/,
                ],
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|tiff|ttf|woff|woff2)$/,
                use: [
                    "file-loader?name=assets/[name].[ext]",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.html",
            filename: "./index.html",
            inject: "body",
        }),
        new webpack.DefinePlugin({
            "process.env.CLIENT_ID": JSON.stringify(process.env.CLIENT_ID),
            "process.env.API_URL": JSON.stringify(process.env.API_URL),
            "process.env.GITHUB_DOMAIN": JSON.stringify(
                process.env.GITHUB_DOMAIN),
            "process.env.GRAPH_API_URL": JSON.stringify(
                process.env.GRAPH_API_URL),
        }),
    ],
    devServer: {
        port: process.env.PORT,
        historyApiFallback: true,
    },
    devtool: "cheap-module-eval-source-map",
};
