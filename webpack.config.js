'use strict';
var webpack = require('webpack'),
    dev = (process.env.NE || 'dev') === 'dev';

module.exports = {
    entry: "./src/GB",
    output: {
        path: __dirname + "/build",
        filename: dev ? "GB.js" : 'GB.min.js',
        library: 'GB'
    },
    watch: dev,
    devtool: dev ? 'cheap-source-map' : null,
    plugins: []
};

if (!dev) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true
            }
        })
    );
}