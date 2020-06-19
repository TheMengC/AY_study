"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUserInfo = exports.saveUserInfo = exports.getUserInfo = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _storage = require("./storage.js");

var _logger = require("./logger.js");

var _userInfo = {
  showVipTime: '加载中',
  vipFlag: 0,
  showPayBtn: '升级'
  //  userNick: '赵东昊的测试店铺',

  // avatar:'http://wwc.alicdn.com/avatar/getAvatar.do?userIdStr=MHkyP8xYvm8LOFc0MmPHMkPIv88LPF*zM88yOmxGXFgT&width=80&height=80&type=sns'
};

var getUserInfo = exports.getUserInfo = function getUserInfo() {
  return _userInfo || {};
};

var saveUserInfo = exports.saveUserInfo = function saveUserInfo() {
  var cacheKeys = ['vipFlag' //, 'userNick','user_id',
  ];
  var cache = {};
  cacheKeys.map(function (key) {
    if (_userInfo[key] !== undefined) {
      cache[key] = _userInfo[key];
    }
  });
  if (Object.keys(cache).length != 0) {
    _storage.storage.setItem('userInfo', cache);
  }
};

var setUserInfo = exports.setUserInfo = function setUserInfo(newUserInfo) {
  _logger.Logger.log('setUserInfo', newUserInfo);
  _userInfo = _extends({}, _userInfo, newUserInfo);
  saveUserInfo();
  return _userInfo;
};