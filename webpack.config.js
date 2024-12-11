//@ts-check

'use strict';
const path = require('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
    mode: 'production',
    entry: "./src/extension.ts",
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: "extension.js",
        libraryTarget: "commonjs2",
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    externals: {
        vscode: "commonjs vscode",
    },
};

/** @type WebpackConfig */
const webviewConfig = {
    mode: 'production',
    entry: './src/react-app/index.tsx',
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'main.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};

module.exports = [ extensionConfig, webviewConfig ];
