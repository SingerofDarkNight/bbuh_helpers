const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
    entry: {
        // background script
        background: './src/content_script/background.js',
        // popup script
        popup: './src/popup.js',
        // content scripts
        document_start: './src/content_script/document_start.js',
        document_idle: './src/content_script/document_idle.js',
        document_end: './src/content_script/document_end.js',
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
            test: /\.(scss|css)$/,
            use: [
                process.env.NODE_ENV !== 'production'
                        ? 'vue-style-loader'
                        : MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
            {
                from: './src/assets/icons/*.png',
                to: 'icons/[name].[ext]',
                toType: 'template'
            },
            {
                from: './src/assets/licenses/*',
                to: 'licenses/[name]',
                toType: 'template'
            },
            {
                from: './src/assets/DISTLICENSE',
                to: 'LICENSE',
                toType: 'file'
            },
            {
                from: './src/assets/HallOfFame',
                to: 'HallOfFame',
                toType: 'file'
            },
            {
                from: './src/_locales',
                to: '_locales',
                toType: 'dir'
            },
            {
                from: './src/*.html',
                to: 'html/[name].[ext]',
                toType: 'template'
            },
            {
                from: process.env.NODE_ENV !== 'production'
                        ? 'src/manifest-dev.json'
                        : './src/manifest.json',
                to: 'manifest.json',
                toType: 'file'
            }
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ]
};
