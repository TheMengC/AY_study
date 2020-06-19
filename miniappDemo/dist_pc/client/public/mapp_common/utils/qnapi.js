"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.qnapi = qnapi;

var _index = require("./index.js");

var _cloud = require("./cloud.js");

var _userInfo = require("./userInfo.js");

var _qnProxy = require("./qnProxy.js");

/**
 * top请求调用 从小程序云
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
var invokeTop = function invokeTop(_ref) {
  var api = _ref.api,
      params = _ref.params,
      callback = _ref.callback,
      errCallback = _ref.errCallback;

  var successFlag = 0;
  params = JSON.parse(JSON.stringify(params));
  Object.keys(params).map(function (key) {
    if (Array.isArray(params[key])) {
      params[key] = params[key].join(',');
    }
  });
  _userInfo.authDeferred.then(function () {
    (0, _cloud.getCloud)().topApi.invoke({
      api: api,
      data: params
    }).then(function (res) {
      successFlag = 1;
      callback(res);
    }).catch(function (err) {
      if (successFlag) {
        return;
      }
      errCallback(err);
    });
  });
};
/**
 * qnapi
 *  其中如果QNProxy打开后走QNProxy
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
function qnapi(_ref2) {
  var api = _ref2.api,
      _ref2$params = _ref2.params,
      params = _ref2$params === undefined ? {} : _ref2$params,
      _ref2$callback = _ref2.callback,
      callback = _ref2$callback === undefined ? _index.NOOP : _ref2$callback,
      _ref2$errCallback = _ref2.errCallback,
      errCallback = _ref2$errCallback === undefined ? _index.NOOP : _ref2$errCallback;

  if ((0, _qnProxy.getQNProxyEnabled)()) {
    (0, _qnProxy.getProxyDeferred)().then(function () {
      (0, _qnProxy.invokeTopProxy)({
        api: api,
        params: params,
        callback: callback,
        errCallback: errCallback
      });
    });
  } else {
    invokeTop({
      api: api,
      params: params,
      callback: callback,
      errCallback: errCallback
    });
  }
};