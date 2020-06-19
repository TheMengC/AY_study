'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goToOpenPlugin = undefined;

var _logger = require('./logger.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _arguments = arguments;

/** 
 * 打开小程序插件的方法
 * appkey 默认商品
 * category 
 * param {}
 * appParam {}
 * directPage {}
*/
var goToOpenPlugin = exports.goToOpenPlugin = function goToOpenPlugin(_ref) {
  var _ref$appkey = _ref.appkey,
      appkey = _ref$appkey === undefined ? '21085832' : _ref$appkey,
      category = _ref.category,
      param = _ref.param,
      appParam = _ref.appParam,
      directPage = _ref.directPage;

  if (!my.qn) {
    _logger.Logger.log('预览模式才能跳转');
  }
  my.qn.openPlugin({
    appkey: appkey,
    category: category,
    param: JSON.stringify(param),
    appParam: JSON.stringify(appParam),
    directPage: JSON.stringify(directPage),
    // 
    success: function success(res) {
      _logger.Logger.log.apply(_logger.Logger, ['跳转插件成功！跳转参数:'].concat(_toConsumableArray(_arguments)));
    },
    fail: function fail(err) {
      _logger.Logger.error.apply(_logger.Logger, ['跳转插件失败！跳转参数:'].concat(_toConsumableArray(_arguments)));
    }
  });
};