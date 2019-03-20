import fs from 'fs';
import path from 'path';

import _get from 'lodash/get';
import _set from 'lodash/set';
import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import _omit from 'lodash/omit';

function listToTree(data, options = {idKey: '', parentKey: '', childrenKey: ''}) {
  options = options || {};
  const ID_KEY = options.idKey || 'path';
  const PARENT_KEY = options.parentKey || 'parentPath';
  const CHILDREN_KEY = options.childrenKey || 'children';

  const tree = [], childrenOf = {};
  let item, id, parentId;

  for(let i = 0, length = data.length; i < length; i++) {
    item = data[i];
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    // every item may have children
    childrenOf[id] = childrenOf[id] || [];
    // init its children
    item[CHILDREN_KEY] = childrenOf[id];
    if (parentId !== 0) {
      // init its parent's children object
      childrenOf[parentId] = childrenOf[parentId] || [];
      // push it into its parent's children object
      childrenOf[parentId].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
}

function recursiveAnalysis (routes, parent, stack = [], opts = {excludes: []}) {
  _forEach(routes, (route) => {
    const {path} = route;
    if (!path) return;

    const {routes} = route;
    if (route.path === parent.path) {
      _set(route, ['parentPath'], parent.parentPath);
    } else {
      _set(route, ['parentPath'], parent.path);
    }

    if (_isArray(routes) && !_isEmpty(routes)) {
      recursiveAnalysis(routes, route, stack, opts);
    } else {
      stack.push(_omit(route, opts.excludes));
    }
  });

  return stack;
}

const defaultOptions = {
  build: path.resolve('.', './menus.json'),
  excludes: [
    'exact',
    'component',
    'Routes'
  ]
};

let routesCache;

export default function (api, options) {
  const opts = {...defaultOptions, ...options};

  api.modifyRoutes(routes => {

    if (!routesCache || JSON.stringify(routesCache) !== JSON.stringify(routes)) {
      routesCache = routes;
      const {Signale} = api.log;
      const interactive = new Signale({interactive: true, scope: 'umi-plugin-menus'});

      interactive.await('[%d/4] - start', 1);
      //  判断 pages 下是否存在 index.js
      const _routes = _get(routes, [0, 'routes']);
      if (!_isEmpty(_routes)) {
        if (!_find(_routes, ({path}) => path === '/')) {
          _set(routes, [0, 'routes', _routes.length], {path: '/'});
        }
      }

      interactive.await('[%d/4] - analysis routes...', 2);
      const parent = {path: '/', parentPath: ''};
      const list = recursiveAnalysis(routes, parent, [], {excludes: opts.excludes});
      const tree = listToTree(list);

      interactive.await('[%d/4] - build menus file...', 3);
      fs.writeFileSync(opts.build, JSON.stringify(tree));
      interactive.success('[%d/4] - build menus file done!', 4);
    }

    return routes;
  });
}
