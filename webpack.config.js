const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // TODO(luciusgone): We have to use production to avoid content security problem for now
    mode: 'production',
    entry: {
        // background script
        background: './src/content_script/background.js',
        // popup script
        popup: './src/popup.js',
        // content scripts
        auto_sign: './src/content_script/auto_sign.js',
        farm_kit: './src/content_script/farm_kit.js',
        modify_forum: './src/content_script/modify_forum.js',
        modify_thread: './src/content_script/modify_thread.js',
        user_info: './src/content_script/user_info.js'
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
            { from: './src/assets/icons/*.png', to: 'icons/[name].[ext]', toType: 'template' },
            { from: './src/*.html', to: 'html/[name].[ext]', toType: 'template' },
            { from: './src/manifest.json', to: 'manifest.json', toType: 'file' }
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/popup.css'
        })
    ],
    // TODO(luciusgone): remove this when building releases
    optimization: {
        minimize: false
    },
    // TODO(luciusgone): remove this when building releases
    performance: {
        hints: false
    }
};
