const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        auto_sign: './src/js/auto_sign.js',
        background: './src/js/background.js',
        blacklist_page: './src/js/blacklist_page.js',
        encoding_page: './src/js/encoding_page.js',
        farm_kit: './src/js/farm_kit.js',
        misc_page: './src/js/misc_page.js',
        modify_forum: './src/js/modify_forum.js',
        modify_thread: './src/js/modify_thread.js',
        options_page: './src/js/options_page.js',
        page_common: './src/js/page_common.js',
        profiles_page: './src/js/profiles_page.js',
        user_info: './src/js/user_info.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: file => ( /node_modules/.test(file) && !/\.vue\.js/.test(file))
        }, {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
            { from: './src/icons/*.png', to: 'icons/[name].[ext]', toType: 'template' },
            { from: './src/css/*.css', to: 'css/[name].[ext]', toType: 'template' },
            { from: './src/html/*.html', to: 'html/[name].[ext]', toType: 'template' },
            { from: './src/manifest.json', to: 'manifest.json', toType: 'file' }
        ])
    ],
    optimization: {
        minimize: false
    }
};
