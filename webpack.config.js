path = require('path')

module.exports = {
    entry: {
        index: './src/index.js',
        schedule: './src/admin/schedule/index.js',
        scheduleForm: ['@babel/polyfill', './src/admin/schedule/form.js']
    }, 
    output: {
        path: path.resolve(__dirname, 'public/scripts'), 
        filename: '[name]-bundle.js'
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