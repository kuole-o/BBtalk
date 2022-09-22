const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const path = require('path');
const version = require('./package.json').version
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const banner =
  'BBtalk v' + version + '\n' +
  '(c) 2020-' + new Date().getFullYear() + ' Heson\n' +
  'Released under the MIT License.\n' +
  'Last Update: ' + (new Date()).toLocaleString()


module.exports = {
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  entry: './src/index.js',
  output: {
    filename: 'bbtalk.min@' + version + '.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'bbtalk'
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new VueLoaderPlugin()
    // new BundleAnalyzerPlugin(),

  ]
};


