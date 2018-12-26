const path = require('path');


module.exports = {
    mode: 'production',
    entry: './js/encoding_page.source.js',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'encoding_page.js'
    },
    module: {
        rules: [{
            test: /\.source\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    }
}
