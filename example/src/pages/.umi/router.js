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
        "title": 1
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default,
        "title": 0
      },
      {
        "path": "/second/first",
        "exact": true,
        "component": require('../second/first/index.js').default,
        "title": "2-1"
      },
      {
        "path": "/second",
        "exact": true,
        "component": require('../second/index.js').default,
        "title": 2
      },
      {
        "path": "/second/second/first",
        "exact": true,
        "component": require('../second/second/first/index.js').default,
        "title": "2-2-1"
      },
      {
        "path": "/second/second",
        "exact": true,
        "component": require('../second/second/index.js').default,
        "title": "2-2"
      },
      {
        "path": "/third",
        "exact": false,
        "component": require('../third/_layout.js').default,
        "routes": [
          {
            "path": "/third/first",
            "exact": true,
            "component": require('../third/first/index.js').default,
            "title": "3-1"
          },
          {
            "path": "/third",
            "exact": true,
            "component": require('../third/index.js').default,
            "title": 3
          },
          {
            "path": "/third/second",
            "exact": false,
            "component": require('../third/second/_layout.js').default,
            "routes": [
              {
                "path": "/third/second/first",
                "exact": true,
                "component": require('../third/second/first/index.js').default,
                "title": "3-2-1"
              },
              {
                "path": "/third/second",
                "exact": true,
                "component": require('../third/second/index.js').default,
                "title": "3-2"
              },
              {
                "component": () => React.createElement(require('E:/WebstormProjects/umi-plugins-menus/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
              }
            ],
            "title": "3-2-layout"
          },
          {
            "component": () => React.createElement(require('E:/WebstormProjects/umi-plugins-menus/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
          }
        ],
        "title": "3-layout"
      },
      {
        "component": () => React.createElement(require('E:/WebstormProjects/umi-plugins-menus/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
      }
    ]
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
