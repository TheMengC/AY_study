"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goToQAP = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _userInfoChanger = require("./userInfoChanger.js");

var _logger = require("./logger.js");

/**
 * 跳转进入qap的页面
 * @param page
 * @param pageName
 */
var goToQAP = exports.goToQAP = function goToQAP(_ref) {
  var page = _ref.page,
      pageName = _ref.pageName,
      query = _ref.query;

  if (!my.qn) {
    _logger.Logger.log('预览模式才能跳转');
  }
  var userInfo = (0, _userInfoChanger.getUserInfo)();
  my.qn.navigateToQAP({
    url: 'qap:///index',
    title: pageName,
    query: _extends({
      event: 'itemList',
      otherPage: page,
      authString: {
        taobao_user_nick: userInfo.nick,
        sub_taobao_user_nick: userInfo.sub_nick,
        taobao_user_id: userInfo.userId
      }
    }, query),
    success: function success(res) {
      _logger.Logger.log('跳转成功');
    },
    fail: function fail(res) {
      _logger.Logger.error('跳转失败', res);
    }
  });
};