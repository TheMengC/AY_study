"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterAd = exports.getAd = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require("../../tradePolyfills/index.js");

var _utils = require("../utils.js");

var _userInfo = require("../../mapp_common/utils/userInfo.js");

var _index2 = require("../../mapp_common/marketing/utils/index.js");

var filterPids = [];

var DEFAULT_OPENAD_DATA = {
  n: 10,
  nf: 1,
  mo: 'android',
  rs: 0,
  did: 913181696,
  IMEI: 0,
  f: 'creative_name,creative_id,category,user_define,img_path,dest_url'
};
// 运营模块获取广告统一方法
var getAd = exports.getAd = function getAd(_ref) {
  var pid = _ref.pid,
      _callback = _ref.callback,
      _ref$error_callback = _ref.error_callback,
      error_callback = _ref$error_callback === undefined ? undefined : _ref$error_callback,
      _ref$data = _ref.data,
      data = _ref$data === undefined ? {} : _ref$data;

  if (filterPids.includes("" + pid)) {
    (0, _index2.marketConsole)('log', "\u8FD9\u4E2A\u5E7F\u544A\u662F\u9700\u8981\u88AB\u8FC7\u6EE4\u6389\u54D2\uFF1A" + pid);
    return;
  }
  var args = _extends({
    pid: pid
  }, DEFAULT_OPENAD_DATA, data);
  (0, _index.api)({
    apiName: 'aiyong.ad.showAd.get.creatives',
    args: args,
    callback: function callback(res) {
      if (res.status == '200') {
        // 先根据各种条件过滤一遍广告
        var adData = filterAd(res);
        // 然后随机指定一个广告
        if ((0, _index.isEmpty)(adData.results)) {
          // 如果过滤之后就没有广告了，那就直接返回吧，没必要随机啦
          return _callback(adData);
        }
        adData = randomAd(pid, adData);
        if (!(0, _index.isEmpty)(adData.result)) {
          adData.result.open_id = adData.open_id;
          adData.result.pid = pid;
        }
        _callback(adData);
      } else {
        _callback(res);
      }
    },
    errCallback: function errCallback(err) {
      if (typeof error_callback === 'function') {
        error_callback(err);
      }
    }
  });
};

/*
 * @Description 过滤广告统一方法。
 * type：
 *  bannerAD、modal、notice
*/
var filterAd = exports.filterAd = function filterAd(adData) {
  if ((0, _index.isEmpty)(adData.results)) {
    return adData;
  }
  var userInfo = (0, _index.getUserInfo)();
  var filteredAds = [];
  adData.results.forEach(function (res) {
    // 2019-10-11 广告系统https SSL 失效，导致图片加载失败，将所有 https 换为 http
    if (res.img_path && res.img_path.includes('https:')) {
      res.img_path = res.img_path.replace('https://', 'http://');
    }
    var userDefine = void 0;
    if (_typeof(res.user_define) === 'object') {
      userDefine = res.user_define;
    } else {
      userDefine = JSON.parse(res.user_define);
    }
    if (userDefine.body.vipflag == 0) {
      // 初级版广告
      if (userInfo.vipFlag != 0) {
        return;
      }
    } else if (parseInt(userDefine.body.vipflag) > 0) {
      // 高级版广告
      if (userInfo.vipFlag == 0) {
        return;
      }
    }
    if ((0, _userInfo.isAutoPay)() || userInfo.lastPaidTime != null && (0, _utils.timeDiffFromNow)(userInfo.lastPaidTime) < 10) {
      // 自动续费用户 || 10日内订购的用户 需要过滤掉售卖广告
      if (userDefine.body.type == 2) {
        // 1.功能跳转2.订购插件3.联系客服4.千牛电台
        return;
      }
    }
    filteredAds.push(res);
  });
  adData.results = filteredAds;
  adData.total_num = filteredAds.length;
  return adData;
};
/*
 * @Description 随机选择广告的cid
*/
var randomAd = function randomAd(pid, adData) {
  var rdomNum = void 0;
  var resultsLength = adData.results.length;
  if ((0, _index.isEmpty)(rdomNum) && resultsLength > 0) {
    // 证明今天没有随机过嗷
    if (resultsLength == 1) {
      rdomNum = 0;
    } else {
      rdomNum = Math.ceil(Math.random() * resultsLength) - 1;
    }
  }
  adData.result = adData.results[rdomNum];
  adData.result.rdomNum = rdomNum;
  if ((0, _index.isEmpty)(adData.result)) {
    // 如果到这里压根没有广告，那直接886
    return adData;
  }
  // 如果是有广告的，那统一把user_define给jsonParse一下~
  adData.result.user_define = JSON.parse(adData.result.user_define);
  return adData;
};