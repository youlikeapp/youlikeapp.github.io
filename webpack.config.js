var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const { CheckerPlugin } = require('awesome-typescript-loader');

var getPath = function(pathToFile) {
    return path.resolve(__dirname, pathToFile);
};

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';
var config = {
    context: __dirname,
    entry: {
        app: './src/app/index.ts',
        vendor: './src/app/vendor.ts'
    },
    output: {
        path: isProd ? getPath('./dist') : getPath('./'),
        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
        chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js',
        publicPath: isProd ? '/' : 'http://localhost:8080/'
    },
    devServer: {
        stats: 'minimal'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {
                // TS LOADER
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    useBabel: true,
                    // useCache: true,
                    forceIsolatedModules: true,
                    transpileOnly: true
                },
                exclude: /node_modules/
            },
            {
                // JS LOADER
                test: /\.js$/,
                loader: 'babel-loader',
                include: [getPath('./src/app')]
            },
            {
                // SCSS LOADER - generates a separate CSS file, and adds the link to <head>
                test: /\.scss$/,
                loader: isProd
                    ? ExtractTextPlugin.extract({
                          fallback: 'style-loader',
                          use: 'css-loader!sass-loader',
                          publicPath: '/dist'
                      })
                    : 'style-loader!css-loader!sass-loader'
            },
            /**
             * To keep CSS bundled in with the generated JS, uncomment this section
             */
            // {
            //     test: /\.scss$/,
            //     loader: 'style-loader!css-loader!sass-loader'
            // },
            {
                // ASSET LOADER
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                // HTML LOADER
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: /(index)/
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity
        }),

        new HtmlWebpackPlugin({
            template: getPath('./src/index.html'),
            inject: 'body'
        }),

        new webpack.ProvidePlugin({
            regeneratorRuntime: 'regenerator-runtime/runtime'
        })
    ],
    stats: {
        colors: true,
        reasons: true,
        chunks: true
    }
};

if (isProd) {
    config.devtool = false;
    config.plugins.push(
        // Create separate CSS file
        new ExtractTextPlugin('app.css'),

        //Minifiy all JS, switch loaders to minimizing mode
        new webpack.optimize.UglifyJsPlugin()
    );
}

module.exports = config;
