"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.marketingBeacon = exports.tradeBeacon = exports.itemBeacon = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.newBeacon = newBeacon;
exports.beacons = beacons;
exports.beacon = beacon;

var _version = require("./version.js");

var _index = require("./index.js");

var _logger = require("./logger.js");

var _userInfoChanger = require("./userInfoChanger.js");

var _env = require("../../../constants/env.js");

var _systemInfo = require("./systemInfo.js");

var _cloud = require("./cloud.js");

var _api = require("./api.js");

var _userInfo = require("./userInfo.js");

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * 商品的封装过的埋点
 * flag为false 就是不区分初高级
 */
var itemBeacon = function itemBeacon(_ref) {
  var _ref$page = _ref.page,
      page = _ref$page === undefined ? (0, _index.getCurrentPageName)() : _ref$page,
      func = _ref.func,
      _ref$flag = _ref.flag,
      flag = _ref$flag === undefined ? true : _ref$flag,
      rest = _objectWithoutProperties(_ref, ["page", "func", "flag"]);

  newBeacon(_extends({
    page: page,
    func: func,
    flag: flag,
    project: 'TD20200117150137'
  }, rest));
};

/**
 * 交易的封装过的埋点
 */
exports.itemBeacon = itemBeacon;
var tradeBeacon = function tradeBeacon(_ref2) {
  var _ref2$page = _ref2.page,
      page = _ref2$page === undefined ? (0, _index.getCurrentPageName)() : _ref2$page,
      func = _ref2.func,
      _ref2$flag = _ref2.flag,
      flag = _ref2$flag === undefined ? true : _ref2$flag,
      rest = _objectWithoutProperties(_ref2, ["page", "func", "flag"]);

  newBeacon(_extends({
    page: page,
    func: func,
    flag: flag,
    project: 'TD20191206151236'
  }, rest));
};

/**
 * 埋点统一方法
 * @param page
 * @param func
 * @param project
 * @param rest
 */
exports.tradeBeacon = tradeBeacon;
function newBeacon(_ref3) {
  var _ref3$page = _ref3.page,
      page = _ref3$page === undefined ? (0, _index.getCurrentPageName)() : _ref3$page,
      func = _ref3.func,
      flag = _ref3.flag,
      project = _ref3.project,
      rest = _objectWithoutProperties(_ref3, ["page", "func", "flag", "project"]);

  _userInfo.userInfoDeferred.then(function () {
    var vipFlag = +!!(0, _userInfoChanger.getUserInfo)().vipFlag;
    var vipFlagStr = vipFlag ? 'vip' : 'free';
    var e = void 0;
    if (flag) {
      e = [page, func, vipFlagStr].join('-');
    } else {
      e = [page, func].join('-');
    }
    beacons(_extends({
      n: (0, _userInfoChanger.getUserInfo)().userNick,
      e: e,
      p: project,
      m1: page,
      m2: func,
      d1: (0, _userInfoChanger.getUserInfo)().vipFlag,
      d2: (0, _version.getCurrentVersionNum)()
    }, rest));
  });
}

/*
 * @Description 运营埋点
*/
var marketingBeacon = exports.marketingBeacon = function marketingBeacon(type, pid, level) {
  var app = _env.ENV.app,
      marketingParent = _env.ENV.marketingParent,
      where = _env.ENV.platform;

  var _getSystemInfo = (0, _systemInfo.getSystemInfo)(),
      platform = _getSystemInfo.platform;

  var beaconObj = {
    n: (0, _userInfoChanger.getUserInfo)().userNick,
    e: where + "_" + app + "_" + platform + "_" + level + "_" + type,
    p: marketingParent,
    m1: (0, _index.getCurrentPageName)(),
    m2: pid,
    d1: (0, _userInfoChanger.getUserInfo)().vipFlag,
    d2: (0, _version.getCurrentVersionNum)()
  };
  beacons(beaconObj);
};

/**
 * 埋点
 * @type {Object}
 */
function beacons(args) {
  args.d6 = _env.ENV.platform;
  args.t = new Date().getTime();
  (0, _api.getphpSessionIdDeferred)().then(function (phpSessionId) {
    var data = {
      path: 'beacon',
      method: 'POST',
      body: _extends({
        api_name: 'aiyong.mcs.1.gif',
        version: '1',
        phpSessionId: phpSessionId

      }, args)
    };
    (0, _cloud.getCloud)().application.httpRequest(data).then(function (res) {
      _logger.Logger.debug('beacons', args);
    }).catch(function (e) {
      return _logger.Logger.warn(e);
    });
  });
};
function beacon() {}