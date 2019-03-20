import React, {useState, useEffect} from 'react';
import {Layout, Menu} from 'antd';

import Link from 'umi/link';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _find from 'lodash/find';
import _toString from 'lodash/toString';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';

import routes from '../routes.json';

const {Content, Sider} = Layout;

const menus = _get(routes, [0, 'routes']);

/**
 * 递归生成菜单
 * @param {array} menus
 * @param {object} [parent]
 * @param {number} [parent.key]
 * @param {array} stack
 * @returns {Array}
 */
function recursiveMenus (menus, parent = {}, stack = []) {
  const {key: parentKey = ''} = parent;

  return _map(menus, (menu, key) => {

    const {title, path, routes} = menu;
    const k = `${parentKey? `${parentKey}-`: ''}${key}`;
    stack.push({key: k, ...menu});

    if (_isArray(routes) && !_isEmpty(routes)) {
      return (
        <Menu.SubMenu key={k} title={title}>
          {recursiveMenus(routes, {key}, stack)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={k}>
          <Link to={path}>{title}</Link>
        </Menu.Item>
      );
    }
  });
}

function BasicLayout(props) {

  const [collapsed, setCollapsed] = useState(false);
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
    const key = _get(_find(menuItems, ({path}) => path === props.location.pathname), ['key']);
    if (key) {
      setSelectedKeys([_toString(key)]);
    }
  }, [props.location.pathname]);

  return (
    <Layout style={{height: '100vh'}}>
      <Sider collapsible collapsed={collapsed} onCollapse={v => setCollapsed(v)}>
        <Menu theme={'dark'} selectedKeys={selectedKeys} mode={'inline'}>
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
