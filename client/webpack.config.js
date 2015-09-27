var path = require('path');
var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('shared.js');

module.exports = {
    context: path.resolve('js'),
    entry: ["./main.es6"],
    output: {
        path: path.resolve('public/assets/js/'),
        filename: "app.js"
    },
    devServer: {
        contentBase: 'public'
    },
    plugins: [commonsPlugin],

    module: {
        loaders: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 1000
    },
    resolve: {
        //alias: {
        //    'jsencrypt': 'jsencrypt/bin/jsencrypt.js'
        //},
        modulesDirectories: [
            'node_modules',
            'web_modules'
        ],
        extensions: ['', '.js', '.jsx', '.es6']
    }
};