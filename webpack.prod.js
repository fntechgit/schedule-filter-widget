const path                      = require('path');
//const TerserJSPlugin            = require('terser-webpack-plugin');
//const OptimizeCSSAssetsPlugin   = require('optimize-css-assets-webpack-plugin');
const merge                     = require('webpack-merge');
const common                    = require('./webpack.common.js');
const nodeExternals             = require('webpack-node-externals');
const { CleanWebpackPlugin }    = require('clean-webpack-plugin');
const MiniCssExtractPlugin      = require("mini-css-extract-plugin");

module.exports = merge(common, {
    entry: './src/schedule-lite.js',
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: './index.css',
        }),
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'schedule-lite',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        publicPath: '/dist/',
        globalObject: 'this'
    },
    mode: 'production',
    // devtool: 'source-map',
    optimization: {
    //     minimizer: [
    //         new TerserJSPlugin({sourceMap: true, parallel: true}),
    //         new OptimizeCSSAssetsPlugin({})
    //     ]
        minimize: false
    },
    externals: [nodeExternals({
        whitelist: ['react-transition-group']
    })]
});
