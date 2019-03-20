import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = DefaultRouter;

let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/first",
        "exact": true,
        "component": require('../first/index.js').default,
        "title": "第一个页面",
        "parentPath": "/"
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default,
        "title": "首页",
        "parentPath": ""
      },
      {
        "path": "/second",
        "exact": true,
        "component": require('../second/index.js').default,
        "title": "第二个页面",
        "parentPath": "/"
      },
      {
        "path": "/third",
        "exact": true,
        "component": require('../third/index.js').default,
        "title": "第三个页面",
        "parentPath": "/"
      },
      {
        "component": () => React.createElement(require('E:/WebstormProjects/umi-plugins-menus/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
      }
    ],
    "parentPath": ""
  },
  {
    "component": () => React.createElement(require('E:/WebstormProjects/umi-plugins-menus/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
