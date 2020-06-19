"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.routerReducer = routerReducer;
exports.convertToRouterOption = convertToRouterOption;
exports.initRouter = initRouter;
exports.changeRoute = changeRoute;
exports.getRouteParams = getRouteParams;
exports.getCurrentPath = getCurrentPath;
exports.getCurrentPage = getCurrentPage;

var _router = require("../miniapp-router/lib/router.js");

var _router2 = _interopRequireDefault(_router);

var _index = require("../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _eventManager = require("../../public/mapp_common/utils/eventManager.js");

var _routes = require("./routes.js");

var _index3 = require("../../public/mapp_common/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export const routeOption = {
//     routes: [
//         {
//             path: '/tradeManagement',
//             component: 'tradeManagement',
//         },
//         {
//             path: '/intercept',
//             component: 'intercept',
//         },
//         {
//             path:'/settings',
//             component:'settings',
//             children: [
//                 { path:'/logisticsAddress', component:'logisticsAddress' },
//             ],
//         },
//     ],
//     option: { initPath: '/component/button' },
// };

var router = void 0;
var app = _index2.default.getApp();

var initState = { currentPath: '' };
function routerReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments[1];

  switch (action.type) {
    case "ROUTER_CHANGE":
      return _extends({}, state, action.data);
      break;
    default:
      return state;
  }
}
function convertToRouterOption(routes) {
  return routes.map(function (route) {
    var path = route.path;
    var component = route.component;
    if (!component && path && !route.children) {
      component = route.path.replace('/', '');
    }

    if (!path) {
      route.path = '/' + route.name;
      if (!component) {
        component = 'unimplemented';
      }
    }

    var newRoute = {
      path: route.path,
      abstract: route.abstract,
      default: route.default
    };
    if (component) {
      newRoute.component = component;
    }
    if (route.children) {
      newRoute.children = convertToRouterOption(route.children);
    }
    return newRoute;
  });
}
/**
 * 初始化路由
 * @param scope
 */
function initRouter(scope) {
  var routesConverted = convertToRouterOption(_routes.routes);
  routesConverted = {
    routes: routesConverted,
    option: { initPath: _routes.defaultPath }
  };
  console.log(routesConverted);
  _router2.default.call(scope, routesConverted);
  router = scope.$router;
}

/**
 * 改变路由(跳转页面)
 * @param path
 */
function changeRoute(_ref) {
  var path = _ref.path,
      _ref$param = _ref.param,
      param = _ref$param === undefined ? null : _ref$param;

  var paramPath = param ? path + '/' + JSON.stringify(param) : path;
  router.push(paramPath);
  // app.store.dispatch({type:'ROUTER_CHANGE',{currentPath:path}});
  _eventManager.events.routerChanged.emit(path);
}

/**
 * 获取路由传递的参数
 */
function getRouteParams() {
  if (router.params && (0, _index3.isJSON)(router.params.param)) {
    return JSON.parse(router.params.param);
  }
}

/**
 * 获取当前路径位置
 * @returns {string|__setCurrentPath.props}
 */
function getCurrentPath() {
  return router.currentPath;
}

/**
 * 获取当前页面
 */
function getCurrentPage() {
  return getCurrentPath().split('/')[2];
}