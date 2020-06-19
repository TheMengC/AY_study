"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.marketingShowTabbar = exports.marketingHideTabbar = undefined;
exports.marketConsole = marketConsole;

var _logger = require("../../utils/logger.js");

var _index = require("../../utils/index.js");

var _index2 = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index3 = _interopRequireDefault(_index2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var shouldMarketingLog = true;

/*
 * @Description marketing统一console
*/
function marketConsole() {
  {
    var args2 = [].concat(Array.prototype.slice.call(arguments));
    _logger.Logger[args2[0]].apply(_logger.Logger, _toConsumableArray(args2));
  }
}

/*
 * @Description 运营统一收起tabbar功能，非pc可用
*/
var marketingHideTabbar = exports.marketingHideTabbar = function marketingHideTabbar() {
  if (!(0, _index.isPC)()) {
    _index3.default.hideTabBar({ animation: true });
  }
};

/*
 * @Description 运营统一展开tabbar功能，非pc可用
*/
var marketingShowTabbar = exports.marketingShowTabbar = function marketingShowTabbar() {
  if (!(0, _index.isPC)()) {
    _index3.default.showTabBar({ animation: true });
  }
};