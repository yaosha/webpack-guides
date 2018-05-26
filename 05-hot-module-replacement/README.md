# webpack指南-模块热替换

[模块热替换](https://webpack.docschina.org/guides/hot-module-replacement/)

## 使用webpack-hot-middleware

### 安装

```
npm install --save-dev webpack-hot-middleware
```

### webpack配置

webpack.config.js中加入插件HotModuleReplacementPlugin。

```js
plugins: [
  new webpack.HotModuleReplacementPlugin()
]
```

entry中加入'webpack-hot-middleware/client'

```js
entry: {
  app: ['./src/index.js', 'webpack-hot-middleware/client']
}
```

### server.js

在server.js中使用webpack-dev-middleware和webpack-hot-middleware

```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

