"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataDeferred = exports.verifyInput = exports.phoneTest = exports.judgeRenew = exports.getKeyName = exports.isIPhoneFullScreen = exports.getToday = exports.timeDiffFromNow = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildParams = buildParams;
exports.apiAsync = apiAsync;
exports.getUUID = getUUID;
exports.getDebounce = getDebounce;
exports.showErrorDialog = showErrorDialog;
exports.showConfirmModalAsync = showConfirmModalAsync;
exports.bindErrorDialog = bindErrorDialog;

var _index = require("../tradePolyfills/index.js");

var _constants = require("./marketing/constants.js");

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/*
 * @Description 把对象转成url参数`
*/
function buildParams(params) {
  return Object.keys(params).map(function (key) {
    return key + '=' + params[key];
  }).join('&');
}

/**
 * 计算与当前时间的差值
 * @param time
 */
var timeDiffFromNow = exports.timeDiffFromNow = function timeDiffFromNow(time) {
  var timeDiff = new Date(time.replace(/-/g, '/')).getTime() - new Date().getTime(); // 得到距离高级版到期的毫秒数
  timeDiff = Math.round(timeDiff / 86400000);
  return Math.abs(timeDiff);
};

var getToday = exports.getToday = function getToday() {
  return (0, _index.moment)().format('YYYY-MM-DD');
};

/**
 * 判断是否是iPhone全面屏：iPhoneX或大于10
 */
var isIPhoneFullScreen = exports.isIPhoneFullScreen = function isIPhoneFullScreen() {
  var _getSystemInfo = (0, _index.getSystemInfo)(),
      platform = _getSystemInfo.platform,
      model = _getSystemInfo.model,
      screenHeight = _getSystemInfo.screenHeight;
  //判断屏幕高度是因为 iphone8 在 model中是10


  if (platform == "iOS" && screenHeight > 800) {
    var iphonemModelArr = model.replace('iPhone', '').trim().split(',');
    if (iphonemModelArr.includes('X') || Number(iphonemModelArr[0]) > 10) {
      return true;
    }
  }
};

/*
 * @Description 获取广告在redux中的key名
*/
var getKeyName = exports.getKeyName = function getKeyName(pid) {
  return (0, _index.getCurrentPageName)() + "_" + pid;
};

/*
 * @Description 判断用户处于什么续费周期
*/
var judgeRenew = exports.judgeRenew = function judgeRenew(type) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var judgeTime = (0, _index.isEmpty)(time) ? (0, _index.getUserInfo)().vipRemain : time;
  return judgeTime >= _constants.RENEW_RULES[_index.ENV.app][type][0] && judgeTime <= _constants.RENEW_RULES[_index.ENV.app][type][1];
};

/**
 * 手机校验方法
 * @Description 判断用户处于什么续费周期
 * 台湾 ：台湾手机10位数，皆以09起头，如0932XXXXXX，0920XXXXXX。
 * 香港 ：香港手机号是 6 或 9 开头的 8 位数字。
 * 澳门 ：6 开头的 8 位数字。
 * 大陆 ：只要是11位的数字，以1开头的，我们都认为是国内合法的手机号码
 */
var phoneTest = exports.phoneTest = function phoneTest(phone, province) {
  var d = /^1\d{10}$/; // 1开头11为数字
  if (province == '台湾' || province == '海外' || province == '澳门特别行政区' || province == '香港特别行政区') {
    d = /^[0-9]*$/;
  }
  if (d.test(phone)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 修改价格和库存时验证输入的值是否合法
 * @return {boolean} 返回false表示合法 返回true表示不合法
 */
var verifyInput = exports.verifyInput = function verifyInput(inputPrice, inputQuantity) {
  var testInt = /^(0|[1-9][0-9]*)$/;
  if (!testInt.test(inputQuantity)) {
    return true;
  }
  var testFlo = /^(\-|\+)?\d+(\.\d+)?$/;
  var testNum = /^([1-9][0-9]*)$/;
  if (!(testFlo.test(inputPrice) || testNum.test(inputPrice)) || Number(inputPrice) <= 0) {
    return true;
  }
  return false;
};
/**
 * api方法的promise包装 可以被await
 * @param host
 * @param apiName
 * @param method
 * @param args
 * @param rest
 * @returns {Promise<unknown>}
 */
function apiAsync(_ref) {
  var _ref$host = _ref.host,
      host = _ref$host === undefined ? _index.ENV.hosts.default : _ref$host,
      apiName = _ref.apiName,
      method = _ref.method,
      _ref$args = _ref.args,
      args = _ref$args === undefined ? {} : _ref$args,
      rest = _objectWithoutProperties(_ref, ["host", "apiName", "method", "args"]);

  return new Promise(function (resolve, reject) {
    var isSuccess = false;
    (0, _index.api)(_extends({
      host: host,
      method: method,
      apiName: apiName,
      args: args
    }, rest, {
      callback: function callback(res) {
        isSuccess = true;
        resolve(res);
      },
      errCallback: function errCallback(res) {
        if (!isSuccess) {
          reject(res);
        }
      }
    }));
  });
}

var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
/**
 * 生成uuid
 * @param len 位数
 * @param radix 随机数进制
 * @returns {string}
 */
function getUUID() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
  var radix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;

  var uuid = [],
      i = void 0;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    var r = void 0;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

/**
 * 获取一个防抖函数
 * @param func
 * @param duration
 * @returns {Function}
 */
function getDebounce(func, duration) {
  var timer = void 0;
  return function (args) {
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      func(args);
    }, duration ? duration : 800);
  };
}

/**
 * 异步获取数据 且只获取一次 返回一个promise
 * @param func
 * @param callback
 * @param errCallback
 * @returns {function({params?: *}=): Promise<any>}
 */
function getDataDeferred(func) {
  var _callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _index.NOOP;

  var _errCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _index.NOOP;

  var deferred = void 0;
  return function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$refresh = _ref2.refresh,
        refresh = _ref2$refresh === undefined ? false : _ref2$refresh,
        _ref2$params = _ref2.params,
        params = _ref2$params === undefined ? {} : _ref2$params;

    if (!deferred || refresh) {
      deferred = (0, _index.getDeferred)();
      func({
        params: params,
        callback: function callback(res) {
          _callback(res);
          deferred.resolve(res);
        },
        errCallback: function errCallback(err) {
          _errCallback(err);
          deferred = null;
        }
      });
    }
    return deferred;
  };
}
exports.getDataDeferred = getDataDeferred;
function showErrorDialog() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '出错了';
  var content = arguments[1];
  var detail = arguments[2];

  (0, _index.showConfirmModal)({
    title: title,
    content: content + (detail ? JSON.stringify(detail) : ''),
    showCancel: false
  });
}
function showConfirmModalAsync(args) {
  return new Promise(function (resolve) {
    (0, _index.showConfirmModal)(_extends({}, args, {
      onCancel: resolve.bind(null, false),
      onConfirm: resolve.bind(null, true)
    }));
  });
}

/**
 * 绑定错误对话框
 * @param brief
 * @param detail
 * @returns {{new(...args: any[]): unknown} | ((...args: any[]) => unknown) | OmitThisParameter<showErrorDialog> | showErrorDialog | any | {new(...args: *[]): unknown} | ((...args: *[]) => unknown)}
 */
function bindErrorDialog(brief, detail) {
  return showErrorDialog.bind(null, '出错了', brief, detail);
}