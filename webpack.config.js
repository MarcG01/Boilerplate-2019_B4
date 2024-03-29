const path = require('path');
//const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const CONFIG = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: 'build',
        filename: 'app.js'
    },
    plugins: [
      // new webpack.optimize.UglifyJsPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
        minify: {
          "collapseWhitespace": true,
          "minifyCSS": true,
          "removeComments": true
        }
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '<script type="text/javascript" src="../build/app.js"></script>',
          replacement: ''
        },
        {
          pattern: '<link rel="stylesheet" href="./css/app.css">',
          replacement: ''
        }
      ]),
      new MiniCssExtractPlugin({
        filename: 'css/app.bundle.css'
      }),

      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } }
      }),
      new CopyWebpackPlugin([{
        from: 'src/images/',
        to: 'images/'
      }]),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        optipng: { optimizationLevel: 3 },
        jpegtran: { progressive: true },
        gifsicle: { optimizationLevel: 1 },
        svgo: {},
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.(sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // minimize: false
              }
            },
            {
              loader: 'css-loader?url=false'
            },
            {
              loader: 'postcss-loader'
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        }
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, "src"),
      compress: true,
      port: 3010,
      hot: false,
      watchContentBase: true,
      noInfo: true
    },
    devtool: '#source-map'
}

if(process.env.NODE_ENV === 'production') {

  CONFIG.output.publicPath = './';
  CONFIG.output.filename = 'js/app.js';

}

module.exports = CONFIG;
