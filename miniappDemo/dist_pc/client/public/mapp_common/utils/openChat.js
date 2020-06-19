"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contactCustomerService = exports.openChat = undefined;

var _api = require("./api.js");

var _env = require("../../../constants/env.js");

var _logger = require("./logger.js");

var _index = require("./index.js");

/**
 * 打开旺旺聊天
 * @param nick 聊天的对象的nick
 * @param text 携带的文本
 */
var openChat = exports.openChat = function openChat(_ref) {
  var nick = _ref.nick,
      text = _ref.text,
      _ref$success = _ref.success,
      success = _ref$success === undefined ? _index.NOOP : _ref$success,
      _ref$fail = _ref.fail,
      fail = _ref$fail === undefined ? _index.NOOP : _ref$fail;

  _logger.Logger.log('打开旺旺', {
    nick: nick,
    text: text
  });
  try {
    my.qn.openChat({
      nick: nick,
      text: text,
      success: success,
      fail: fail
    });
  } catch (e) {
    _logger.Logger.error('openChat', e);
  }
};

/**
 * 联系爱用客服
 * @param text 发送的话术
 */
var contactCustomerService = exports.contactCustomerService = function contactCustomerService(text, nick) {
  if (nick) {
    openChat({ nick: nick, text: text });
    return;
  }
  (0, _api.api)({
    apiName: 'aiyong.tools.staffnick.get',
    host: _env.ENV.hosts.trade,
    method: '/iytrade2/getchatnick',
    callback: function callback(res) {
      var nick = res ? res.result ? res.result : res : 'cntaobao爱用科技';
      openChat({ nick: nick, text: text });
    },
    errCallback: function errCallback() {
      openChat({ nick: 'cntaobao爱用科技', text: text });
    }
  });
};