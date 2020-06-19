"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiProxyEnabled = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getProxyDeferred = getProxyDeferred;
exports.invokeTopProxy = invokeTopProxy;
exports.invokeApiProxy = invokeApiProxy;
exports.proxySend = proxySend;
exports.proxyClientInit = proxyClientInit;
exports.getQNProxyEnabled = getQNProxyEnabled;
exports.getRemoteLogEnabled = getRemoteLogEnabled;

var _index = require("./index.js");

var _settings = require("./settings.js");

var _index2 = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index3 = _interopRequireDefault(_index2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proxyDeferred = void 0;

/**
 * 获取代理打开的promise
 * @returns {*}
 */
function getProxyDeferred() {

  if (!proxyDeferred) {
    proxyClientInit();
  }
  return proxyDeferred;
}

/**
 * node 项目位置 https://github.com/moonkop/QNProxy
 * 这个是将千牛外的 请求 转发到千牛内 在千牛内打开该页面 并在浏览器打开该页面 浏览器将把所有QN.top.invoke全部发送到node中 node将把请求发送到千牛的页面中 千牛页面进行处理后将数据发回node node再发回浏览器
 */
var wsClient = void 0;
var requestPool = [];
var QNproxy = {};
var requestId = 0;

['top', 'application', 'plugin', 'wangwang'].map(function (item) {
  QNproxy[item] = function (params, callback, errCallback) {
    var request = {
      requestId: requestId,
      params: params,
      type: item,
      category: "TOP"
    };
    requestPool[requestId] = {
      request: request,
      callback: callback,
      errCallback: errCallback
    };
    requestId++;
    proxySend(request);
  };
});

/**
 * top请求走QNProxy的方法
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
function invokeTopProxy(_ref) {
  var api = _ref.api,
      params = _ref.params,
      callback = _ref.callback,
      errCallback = _ref.errCallback;

  QNproxy.top({
    cmd: api,
    param: params
  }, callback, errCallback);
}

/**
 * api请求走代理
 * @param params
 * @param callback
 * @param errCallback
 */
function invokeApiProxy(_ref2) {
  var params = _ref2.params,
      url = _ref2.url,
      callback = _ref2.callback,
      errCallback = _ref2.errCallback;

  var request = {
    requestId: requestId,
    params: params,
    url: url,
    category: "HTTP"
  };
  requestPool[requestId] = {
    request: request,
    callback: callback,
    errCallback: errCallback
  };
  requestId++;
  proxySend(request);
}

/**
 * websocket发送的方法
 * @param msg
 */
function proxySend(msg) {
  var cache = [];
  var msgStr = JSON.stringify(msg, function (key, value) {
    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && value !== null) {
      var index = cache.indexOf(value);
      if (index !== -1) {
        // Circular reference found, discard key
        return '[cycle]' + index;
      }
      // Store value in our collection
      cache.push(value);
      if (value instanceof Error) {
        var error = {};
        Object.getOwnPropertyNames(value).forEach(function (key) {
          error[key] = value[key];
        });
        return error;
      }
    }
    return value;
  });
  console.debug('websocket proxy send', msg);
  {
    my.sendSocketMessage({ data: msgStr });
  }
}

/* eslint-disable */
/**
 * 初始化QNProxyClient 项目见 http://github.com/moonkop/QNProxy
 * @param callback
 */
function proxyClientInit() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _index.NOOP;

  proxyDeferred = (0, _index.getDeferred)();
  my.closeSocket();
  var url = "ws://" + (0, _settings.getSettings)().proxy.host + ":12355";
  var onMessage = function onMessage(msg_event) {
    var data = JSON.parse(msg_event.data);
    var request = JSON.parse(data.request);
    if (data.type == 'SUCCESS') {
      if (!requestPool[request.requestId]) {
        return;
      }
      requestPool[request.requestId].callback(data.response);
      delete requestPool[request.requestId];
    } else if (data.type == 'ERROR') {
      if (!requestPool[request.requestId]) {
        return;
      }
      requestPool[request.requestId].errCallback(data.response);
      delete requestPool[request.requestId];
    }
  };

  {
    my.connectSocket({
      url: url,
      success: function success() {
        console.log('正在打开websocket', url);
      },
      fail: function fail(err) {
        console.log('my error', err);
      }
    });
    my.onSocketMessage(onMessage);

    var onOpen = function onOpen(res) {
      console.log('QNProxy-Client连接成功', url);
      if (proxyDeferred) {
        proxyDeferred.resolve();
      }
      _index3.default.showToast({ title: '代理服务器连接成功' });
      callback();
      my.offSocketOpen(onOpen);
      my.onSocketClose(onClose);
    };
    my.onSocketOpen(onOpen);

    var onError = function onError(res) {
      _index3.default.showToast({ title: '代理服务器连接失败' });
      console.log('WebSocket 连接打开失败，请检查！', res);
      my.offSocketError(onError);
    };
    my.onSocketError(onError);

    var onClose = function onClose(res) {
      _index3.default.showToast({ title: '代理服务器连接已关闭' });
      console.log('连接已关闭！', res);
      proxyDeferred = null;
      my.offSocketMessage(onMessage);
      my.offSocketClose(onClose);
    };
  }
}

var getApiProxyEnabled = exports.getApiProxyEnabled = function getApiProxyEnabled() {
  return (0, _settings.getSettings)().proxy.apiProxyMode == "on";
};

/**
 * TOP代理是否开启
 * @returns {boolean}
 */
function getQNProxyEnabled() {
  var qnProxyMode = (0, _settings.getSettings)().proxy.qnProxyMode;

  if (qnProxyMode == "on") {
    return true;
  }
  return false;
}

/**
 * 日志是否开启
 * @returns {boolean}
 */
function getRemoteLogEnabled() {
  var logMode = (0, _settings.getSettings)().proxy.logMode;

  if (logMode == 'on') {
    return true;
  }
  return false;
}