const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const dirname = __dirname.replace('build','');
module.exports = (options = {}) => ({
    entry: {
        vendor: dirname + '/src/vendor.js',
        "element-ui-pro": dirname + '/src/main.js'
    },
    output: {
        filename: '[name].js?[chunkhash]',
        chunkFilename: '[id].js?[chunkhash]',
        path: path.resolve(dirname, 'dist'),
        publicPath: "./",
        library: 'element-ui-pro',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        // 自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
        extensions: ['.js', '.json', '.scss', '.css', '.vue'],
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: ['vue-loader']
        },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: [path.resolve('src'), path.resolve('static'), path.resolve(__dirname, 'node_modules/axios'),]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename:'index.html',
            chunks: ['manifest', 'vendor', 'app']
        }),
    ],
    devtool: 'inline-source-map',
    devServer: {
        port: 8080,
        host: "127.0.0.1",
        //contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        hot: true,
    },
})
