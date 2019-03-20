const fs = require('fs');
const path = require('path');

const _set = require('lodash/set');
const _map = require('lodash/map');
const _isArray = require('lodash/isArray');
const _isEmpty = require('lodash/isEmpty');
const _omit = require('lodash/omit');
const _compact = require('lodash/compact');
const _orderBy = require('lodash/orderBy');
const _cloneDeep = require('lodash/cloneDeep');

function recursiveAnalysis (routes = [], parent = {}, opts = []) {
  const {excludes = [], order = [[], []]} = opts;
  return _orderBy(_compact(_map(routes, (route) => {
    const {path, routes} = route;
    if (!_isEmpty(path) || !_isEmpty(routes)) {
      if (_isArray(routes)) {
        _set(route, ['routes'], recursiveAnalysis(routes, route, opts));
      }
      return _omit(route, excludes);
    }
    return void 0;
  })), ...order);
}

const defaultOptions = {
  build: path.resolve('.', './menus.json'),
  excludes: [
    'exact',
    'component',
    'Routes'
  ],
  order: [['order'], ['asc']]
};

let routesCache;

export default function (api, options) {
  const opts = {...defaultOptions, ...options};

  api.modifyRoutes(routes => {

    if (!routesCache || JSON.stringify(routesCache) !== JSON.stringify(routes)) {
      routesCache = routes;
      const _routes = _cloneDeep(routes);
      const {Signale} = api.log;
      const interactive = new Signale({interactive: true, scope: 'umi-plugin-menus'});

      interactive.await('[%d/3] - analysis routes...', 1);
      const tree = recursiveAnalysis(_routes,  {}, opts);

      interactive.await('[%d/3] - build menus file...', 2);
      fs.writeFileSync(opts.build, JSON.stringify(tree));
      interactive.success('[%d/3] - build menus file done!', 3);
    }

    return routes;
  });
}
