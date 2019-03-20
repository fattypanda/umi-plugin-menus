import React, {useState, useEffect} from 'react';
import {Layout, Menu} from 'antd';
import menusData from './menus.json';

import Link from 'umi/link';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _findIndex from 'lodash/findIndex';
import _toString from 'lodash/toString';

const {Content, Sider} = Layout;

const menus = _map(_get(menusData, [0, 'children']), (menu, k) => {
	const {path, title} = menu;
	return {name: `${k+1}、${title}`, path}
});

function BasicLayout(props) {

	const [collapsed, setCollapsed] = useState(false);
	const [selectedKeys, setSelectedKeys] = useState(['0']);

	useEffect(() => {
		const key = _findIndex(menus, ({path}) => path === props.location.pathname);
		if (key > -1) {
			setSelectedKeys([_toString(key)]);
		}
	}, [props.location.pathname]);

	return (
		<Layout style={{height: '100vh'}}>
			<Sider collapsible collapsed={collapsed} onCollapse={v => setCollapsed(v)}>
				<Menu theme={'dark'} selectedKeys={selectedKeys} mode={'inline'}>
					{menus.map((menu, key) => (
						<Menu.Item key={key}>
							<Link to={menu.path}>{menu.name}</Link>
						</Menu.Item>
					))}
				</Menu>
			</Sider>
			<Layout>
				<Content>
					<div style={{width: '100%', height: '100%'}}>
						{props.children}
					</div>
				</Content>
			</Layout>
		</Layout>
	);
}

export default BasicLayout;
