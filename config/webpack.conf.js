var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');

var constantPack = new webpack.DefinePlugin({
    CROP_VERSION: JSON.stringify(pkg.version)
});

var BANNER =
    'Google Maps wrapper for Spiral and sf.js v'+pkg.version+'\n' +
    'https://github.com/spiral-modules/google-maps/\n' +
    'Copyright (c) 2016, Alex Chepura, spiralscout.com';

var bannerPlugin = new webpack.BannerPlugin(BANNER);
var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    include: /\.min\.js$/,
    minimize: true,
    compress: {
        warnings: false
    }
});

module.exports = {
    entry: {
        "sf.google-maps": './src/index.js',  // webpack workaround issue #300
        "sf.google-maps.min": './src/index.js'  // webpack workaround issue #300
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '..', 'dist/')
    },
    resolve: {
        alias: {
            'sf': path.resolve(__dirname, '..', 'node_modules/sf/src/sf')
        },
        extensions: ['', '.js']
    },
    resolveLoader: {
        root: path.resolve(__dirname, '..', 'node_modules')
    },
    module: {
        loaders: [
            {test: /\.js?$/, loader: 'babel?presets[]=es2015&plugins[]=transform-runtime'}
        ],
        noParse: []
    },
    devtool: 'source-map',
    plugins: [constantPack, bannerPlugin, uglifyJsPlugin],
    externals: {
        "sf": "sf"
    }
};
