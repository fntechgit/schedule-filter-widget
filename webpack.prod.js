const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const nodeExternals = require('webpack-node-externals');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    entry: './src/schedule-filter.js',
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: './index.css',
        })
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'schedule-filter-widget',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        publicPath: '/dist/',
        globalObject: 'this'
    },
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin({
                parallel: true,
                terserOptions: {
                    compress: {inline: false},
                    sourceMap: {
                        file: '[name].map'
                    },
                    mangle: { reserved: ['Lock','SuperTokensLock','GET_TOKEN_SILENTLY_LOCK_KEY'] }
                }
            }),
            new CssMinimizerPlugin(),
        ],
    },
    externals: [nodeExternals({
        allowlist: ['react-transition-group']
    })]
});
