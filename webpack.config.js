'use strict';

const path = require('path');
const webpack = require('webpack');

const config = module.exports = {
    entry: {
        js: ['./app/client/index'],
        vendor: ['react', 'react-dom',
                 'react-redux',
                 'react-bootstrap-table',
                 'react-mdl'],
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader?cacheDirectory",
            },
        ],
    },
    externals: {
        highcharts: 'Highcharts',
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor.bundle.js',
        }),
        new webpack.DefinePlugin({
            "process.env.BASE_URL": JSON.stringify(process.env.BASE_URL),
        }),
    ],
    output: {
        filename: 'app-bundle.js',
        publicPath: `${process.env.BASE_URL || ''}/js/`,
        path: path.join(__dirname, '/static/js'),
    },
};



if (process.env.NODE_ENV === 'production') {
    // install polyfills for production
    config.entry.vendor.push('babel-polyfill', 'whatwg-fetch');
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('production'),
            },
        })
    );
}
