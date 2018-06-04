const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HTMLWebpackPlugin({
      title: 'Code Splitting'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
