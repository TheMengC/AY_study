import routerInit from "../miniapp-router/lib/router";
import Taro from "@tarojs/taro";
import { events } from "mapp_common/utils/eventManager";
import { defaultPath, routes } from "./routes";
import { isJSON } from "mapp_common/utils";

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

let router;
let app = Taro.getApp();

const initState = { currentPath:'' };
export function routerReducer (state = initState, action) {
    switch (action.type) {
        case "ROUTER_CHANGE":
            return { ...state, ...action.data };
            break;
        default:
            return state;
    }
}
export function convertToRouterOption (routes) {
    return routes.map(route => {
        let path = route.path;
        let component = route.component;
        if (!component && path && !route.children) {
            component = route.path.replace('/', '');
        }

        if (!path) {
            route.path = '/' + route.name;
            if (!component) {
                component = 'unimplemented';
            }
        }

        let newRoute = {
            path:route.path,
            abstract:route.abstract,
            default:route.default,
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
export function initRouter (scope) {
    let routesConverted = convertToRouterOption(routes);
    routesConverted = {
        routes:routesConverted,
        option: { initPath: defaultPath },
    };
    console.log(routesConverted);
    routerInit.call(scope, routesConverted);
    router = scope.$router;
}

/**
 * 改变路由(跳转页面)
 * @param path
 */
export function changeRoute ({ path, param = null }) {
    const paramPath =  param ? path + '/' + JSON.stringify(param) : path;
    router.push(paramPath);
    // app.store.dispatch({type:'ROUTER_CHANGE',{currentPath:path}});
    events.routerChanged.emit(path);
}

/**
 * 获取路由传递的参数
 */
export function getRouteParams () {
    if (router.params && isJSON(router.params.param)) {
        return JSON.parse(router.params.param);
    }
}

/**
 * 获取当前路径位置
 * @returns {string|__setCurrentPath.props}
 */
export function getCurrentPath () {
    return router.currentPath;
}

/**
 * 获取当前页面
 */
export function getCurrentPage () {
    return getCurrentPath().split('/')[2];
}
