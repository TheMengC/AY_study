'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var routes = exports.routes = [{
  name: '订单管理',
  path: '/tradeManagement',
  abstract: true,
  children: [{
    name: '退款管理',
    default: true,
    component: 'refundManagement',
    path: '/refundManagement',
    icon: 'iconfont-tuikuanguanli'

  }, {
    name: '订单信息',
    default: true,
    component: 'orderManagement',
    path: '/orderManagement',
    icon: 'iconfont-tuikuanguanli'

  }]
}];
var defaultPath = exports.defaultPath = '/tradeManagement/refundManagement';