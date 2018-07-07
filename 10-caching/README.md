# webpack指南-缓存

[缓存](https://webpack.docschina.org/guides/caching/)

# SplitChunksPlugin

最初，块（和模块内部导入的模块）通过内部webpack图中的父子关系进行关联。 `CommonsChunkPlugin`用于避免跨越它们的重复依赖，但无法进一步优化

自从webpack v4以来，`CommonsChunkPlugin`被移除，转而使用`optimization.splitChunks`。

## Defaults

`SplitChunksPlugin`开箱即用应该对大多数用户来说非常有用。

默认情况下，它只影响按需块，因为更改初始块会影响HTML文件运行项目时应包含的脚本标记。

webpack将根据这些条件自动分割块：

* 可被共享的新块或来自`node_modules`文件夹的模块
* 新块大于30kb（在min + gz之前）
* 按需加载块时的最大并行请求数小于或等于5
* 初始页面加载时的最大并行请求数将小于或等于3

当试图满足最后两个条件时，首选更大的块。

## Configuration

对于想要更多地控制此功能的开发人员，webpack提供了一组选项以更好地满足您的需求。 如果您要更改配置，最好衡量您所做更改的影响，以确保获得真正的收益。

默认配置被选择为适合web性能最佳实践，但是项目的最佳策略可能会根据其性质而推迟。

## `optimization.splitChunks`

该配置对象表示`SplitChunksPlugin`的默认行为。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### `splitChunks.automaticNameDelimiter`

`string`

默认情况下，webpack将使用块的源和名称（例如`vendors〜main.js`）生成名称。 此选项允许您指定用于生成的名称的分隔符。

### `splitChunks.chunks`

`function` `string`

这表明哪些组块将被选择用于优化。 如果提供了字符串，则可能的值为`all`，`async`和`initial`。 `all`功能特别强大，因为它意味着即使在异步块和非异步块之间也可以共享块。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
};
```

或者，您可以使用函数获得更多控制。 返回值将指示是否包括每个块。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks (chunk) {
        // exclude `my-excluded-chunk`
        return chunk.name !== 'my-excluded-chunk';
      }
    }
  }
};
```

您可以将此配置与HtmlWebpackPlugin结合使用。 它会为您注入所有生成的vendor块。

### `splitChunks.maxAsyncRequests`

`number`

按需加载时的最大并行请求数。

### `splitChunks.maxInitialRequests`

`number`

入口点处的最大并行请求数。

### `splitChunks.minChunks`

`number`

分割前必须共享模块的最小块数。

### `splitChunks.minSize`

`number`

要生成的块的最小大小。

### `splitChunks.name`

`boolean: true` `function` `string`

拆分块的名称。 提供`true`将基于chunk和cacheGroup的key自动生成名称。 提供一个字符串或函数将允许您使用自定义名称。 如果名称与入口点名称匹配，则入口点将被删除。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      name (module) {
        // generate a chunk name...
        return; //...
      }
    }
  }
};
```

当为不同的拆分块分配相同的名称时，所有vendor模块都被放置到一个共享块中，但不推荐使用，因为它可能会导致更多的代码下载。

### `splitChunks.cacheGroups`

缓存组可以继承和/或覆盖`splitChunk.*`中的任何选项。 但`test`，`priority`和`reuseExistingChunk`只能在缓存组级别配置。 要禁用任何默认缓存组，请将它们设置为`false`。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false
      }
    }
  }
};
```

#### `splitChunks.cacheGroups.priority`

`number`

模块可以属于多个缓存组。 将优先选择具有更高优先级的缓存组优化。 默认组的优先级是负的，以允许自定义组具有更高的优先级（自定义组的默认值为`0`）。

#### `splitChunks.cacheGroups.reuseExistingChunk`

`boolean`

如果当前块包含已从主束拆分的模块，则将重用它而不是生成新的块。 这可能会影响块的结果文件名。

#### `splitChunks.cacheGroups.test`

`function` `RegExp` `string`

控制此缓存组选择的模块。 省略它选择所有模块。 它可以匹配绝对模块资源路径或块名称。 匹配块名称时，将选择块中的所有模块。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      test (chunks) {
        //...
        return true;
      }
    }
  }
};
```

## Examples

### Defaults: Example 1

```js
// index.js

import('./a'); // dynamic import
```

```js
// a.js
import 'react';

//...
```

**结果**：将创建一个包含react的单独块。 在导入调用时，此块与包含./a的原始块并行加载。

为什么:

* 条件 1: 块包含`node_modules`的模块
* 条件 2: `react`大于30kb
* 条件 3: import的并行请求数量为2
* 条件 4: 不影响加载初始页的请求

这背后的原因是什么？ `react`可能不会像您的应用程序代码那样频繁地改变。 通过将其移动到单独的块中，可以将此块与应用程序代码分开缓存（假设您正在使用chunkhash，记录，Cache-Control或其他长期缓存方法）。

### Defaults: Example 2

```js
// entry.js

// dynamic imports
import('./a');
import('./b');
```

```js
// a.js
import './helpers'; // helpers is 40kb in size

//...
```

```js
// b.js
import './helpers';
import './more-helpers'; // more-helpers is also 40kb in size

//...
```

**结果：** 将创建一个单独的块，其中包含./helpers及其所有依赖项。 在导入调用时，此块与原始块并行加载。

为什么:

* 条件 1: 块在两个导入调用之间共享
* 条件 2: `helpers`大于30kb
* 条件 3: import的并行请求数量为2
* 条件 4: 不影响加载初始页的请求

将`helpers`的内容放入每个块中将导致其代码被下载两次。 通过使用单独的块，这将只发生一次。 我们支付额外请求的开销，这可能被视为权衡。 这就是为什么最小尺寸为30kb。

### Split Chunks: Example 1

创建一个`commons`块，其中包括入口点之间共享的所有代码。

__webpack.config.js__


```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
};
```

此配置可以扩大您的初始捆绑包，建议动态导入不立即使用的模块

### Split Chunks: Example 2

创建`vendors`块，其中包括整个应用程序中`node_modules`的所有代码。

__webpack.config.js__


```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

这可能会导致生成包含所有外部包的大块。 建议仅包含核心框架和实用程序，并动态加载其余的依赖项。
