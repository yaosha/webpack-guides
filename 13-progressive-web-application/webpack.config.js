const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HTMLWebpackPlugin({
      title: 'Progressive Web Application'
    }),
    new WebpackManifestPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.ProvidePlugin({//全局shim 自动加载模块,'_'被当作未赋值的变量时，lodash就会自动被加载
      // _: 'lodash'
      join: ['lodash', 'join']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {//细粒度shim 覆写 this
        test: require.resolve('./src/index.js'),
        use: 'imports-loader?this=>window,define=>false'//不设置defile=>false会有兼容性问题
      },
      {
        test: require.resolve('./src/globals.js'),
        use: 'exports-loader?file,parse=helpers.parse'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['env']
        }
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10
        },
      }
    }
  },
  // devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
};
