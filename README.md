# umi-plugin-menus

[![NPM version](https://img.shields.io/npm/v/umi-plugin-menus.svg?style=flat)](https://npmjs.org/package/umi-plugin-menus)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-menus.svg?style=flat)](https://npmjs.org/package/umi-plugin-menus)

routes to menus

将 `umi` 生成的 `routes` 转换成 `tree` 结构 `[menus|routes].json` 数据，开发中可直接引入该文件来进行导航菜单的生成

PS: `routes` 更新时 `[menus|routes].json` 文件也会实时更新

## Usage

Configure in `.umirc.js` And `config/config.js`,

.umirc.js
```js
import { join } from 'path';

export default {
  plugins: [
    ['umi-plugin-menus', {
      build: join(__dirname, './src/routes.json'),
    }],
  ],
}
```

src/pages/first/index.js
```js
/**
 * title: 首页           // 菜单名称
 * order: 1             // 菜单排序
 * hideMenu: true       // 隐藏菜单（菜单组件实现）
 * hideChildMenu: true  // 隐藏子菜单（菜单组件实现）
 */
import React from 'react';

export default function First(props){
  return (<div>first page</div>)
};
```

src/layouts/index.js
```js
import React, {useState, useEffect} from 'react';
import {Layout, Menu} from 'antd';

import Link from 'umi/link';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _find from 'lodash/find';
import _uniq from 'lodash/uniq';
import _concat from 'lodash/concat';
import _compact from 'lodash/compact';
import _split from 'lodash/split';
import _slice from 'lodash/slice';
import _toString from 'lodash/toString';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';

//  引入插件生成的数据
import routes from '../routes.json';

const {Content, Sider} = Layout;

const menus = _get(routes, [0, 'routes']);

/**
 * 递归生成菜单
 * @param {array} menus
 * @param {object} [parent]
 * @param {string|number} [parent.key]
 * @param {array} stack
 * @returns {Array}
 */
function recursiveMenus (menus, parent = {}, stack = []) {
  const {key: parentKey = ''} = parent;

  return _compact(_map(menus, (menu, key) => {

    const {title, path, routes, hideMenu = false, hideMenuChild = false} = menu;
    const k = `${parentKey? `${parentKey}-`: ''}${key}`;
    stack.push({key: k, ...menu});

    if (hideMenu) return undefined;

    if (_isArray(routes) && !_isEmpty(routes) && !hideMenuChild) {
      return (
        <Menu.SubMenu key={k} title={title}>
          {recursiveMenus(routes, {key: k}, stack)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={k}>
          <Link to={path}>{title}</Link>
        </Menu.Item>
      );
    }
  }));
}

function BasicLayout(props) {

  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(['0']);
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemsComponent, setMenuItemsComponent] = useState();

  useEffect(() => {
    const stack = [];
    const menuItemsComponent = recursiveMenus(menus, {}, stack);
    setMenuItems(stack);
    setMenuItemsComponent(menuItemsComponent);
  }, []);

  useEffect(() => {
    const key = _get(_find(menuItems, ({path, routes}) => !routes && path === props.location.pathname), ['key']);
    if (key) {
      const keys = _split(key, '-');
      if (keys.length > 1) {
        setOpenKeys(_uniq(_concat(_compact(_map(keys, (v, k) => {
          const length = keys.length - 1;
          if (k < length) return _slice(keys, 0, length - k).join('-');
        })), openKeys)));
      }
      setSelectedKeys([_toString(key)]);
    }
  }, [props.location.pathname, JSON.stringify(menuItems)]);

  return (
    <Layout style={{height: '100vh'}}>
      <Sider collapsible collapsed={collapsed} onCollapse={v => setCollapsed(v)}>
        <Menu theme={'dark'} openKeys={openKeys} selectedKeys={selectedKeys} mode={'inline'} onOpenChange={setOpenKeys}>
          {menuItemsComponent}
        </Menu>
      </Sider>
      <Layout>
        <Content>
          <div style={{width: '100vw', height: '100vh'}}>
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
```


## Options

```typescript
declare enum OrderTypes {asc = 'asc', desc = 'desc'}

/**
 * @param {string} [build='./menus.json'] - 导出的路径
 * @param {string[]} [excludes=['exact','component','Routes']] - 返回忽略字段
 * @param {[[string], [string]]} [order=[['order'], ['asc']]] - 根据字段排序 参考 lodash/orderBy
 */
export interface options {
  build?: string,
  excludes?: string[],
  order?: [[string], [OrderTypes]]
}
```

## LICENSE

MIT
