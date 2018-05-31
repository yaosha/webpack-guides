# webpack指南-production

[production](https://webpack.docschina.org/guides/production/)

process.env.NODE_ENV会随mode值变化。

extract-text-webpack-plugin不适用webpack4，使用mini-css-extract-plugin替代。

## 分离CSS

- 安装mini-css-extract-plugin

  ```
  npm install --save-dev mini-css-extract-plugin
  ```

- webpack配置

  引入mini-css-extract-plugin，设置rules和plugins
  
  ```js
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  module.exports = {
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        }
      ]
    }
  }
  ```