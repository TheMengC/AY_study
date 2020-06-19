"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetAuthorize = resetAuthorize;

var _userInfo = require("./userInfo.js");

var _index = require("../../tradePolyfills/index.js");

var _index2 = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index3 = _interopRequireDefault(_index2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 重新授权
 * @returns {*}
 */
function resetAuthorize() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$callback = _ref.callback,
      callback = _ref$callback === undefined ? _index.NOOP : _ref$callback;

  if (!my.qn || !my.qn.cleanToken) {
    _index3.default.showToast({ title: '无法重新授权' + !!my.qn + !!(my.qn || {}).cleanToken });
    return;
  }
  my.qn.cleanToken({
    success: function success(res) {
      _index3.default.showToast({ title: '清除授权成功' + JSON.stringify(res) });
      (0, _userInfo.userInfoInit)(callback);
    },
    fail: function fail(res) {
      _index3.default.showToast({ title: '清除授权失败' + JSON.stringify(res) });
    }
  });
};