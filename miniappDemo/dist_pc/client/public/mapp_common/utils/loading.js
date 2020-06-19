'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loading = undefined;
exports.showLoading = showLoading;
exports.hideLoading = hideLoading;

var _index = require('../../../npm/_tarojs/taro-alipay/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 显示菊花
 *     (这个函数其实是pc遗留下来的弊病 不应该用type来区分是show 还是hide
 * @param type
 * @param title
 */
var loading = exports.loading = function loading(type) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '加载中...';

  if (type == 'show') {
    showLoading(title);
  }
  if (type == 'hide') {
    hideLoading();
  }
};

function showLoading() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '加载中...';

  _index2.default.showLoading({ title: title });
}
function hideLoading() {
  _index2.default.hideLoading();
}