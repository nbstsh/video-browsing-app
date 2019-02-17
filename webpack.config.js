path = require('path')

module.exports = {
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js'
    },
    module : {
        rules: [{
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    },
    devtool: 'source-map'
}