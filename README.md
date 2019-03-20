# umi-plugin-menus

[![NPM version](https://img.shields.io/npm/v/umi-plugin-menus.svg?style=flat)](https://npmjs.org/package/umi-plugin-menus)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-menus.svg?style=flat)](https://npmjs.org/package/umi-plugin-menus)

routes to menus

将 `umi` 生成的 `routes` 转换成 `tree` 结构 `menus` 数据，开发中可直接引入该文件来进行导航菜单的生成

PS: `routes` 更新时 `menus` 文件也会实时更新

## Usage

Configure in `.umirc.js` And `config/config.js`,

.umirc.js
```js
import { join } from 'path';

export default {
  plugins: [
    ['umi-plugin-menus', {
  	  build: join(__dirname, './src/layouts/menus.json'),
    }],
  ],
}
```
page.js
```js
/**
 * title: 第一个页面
 */
import React from 'react';

export default function First () {
  return (<div>第一个页面</div>);
}
```
menus.json
```json 
[
  {
    "path": "/",
    "parentPath": "",
    "children": [
      {
        "path": "/first",
        "title": "第一个页面",
        "parentPath": "/",
        "children": []
      }
    ]
  }
]

```

## Options

```typescript
/**
 * @param {string} [build=./menus.json] - 导出的路径
 * @param {string[]} [excludes=exact,component,Routes] - 返回忽略字段
 */
export interface options {
  build?: string,
  excludes?: string[],
}
```

## LICENSE

MIT
