"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entry = exports.getphpSessionIdDeferred = exports.initphpSessionIdDeferred = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 入口 取phpsessionid
 */
var entry = exports.entry = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        accessToken = _ref4.accessToken,
        _ref4$callback = _ref4.callback,
        callback = _ref4$callback === undefined ? _index3.NOOP : _ref4$callback,
        _ref4$errCallback = _ref4.errCallback,
        errCallback = _ref4$errCallback === undefined ? _index3.NOOP : _ref4$errCallback;

    var args, res, tryTime, data, userInfo;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            args = {
              timestamp: (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss'),
              slot: 'miniapp',
              from: 'qianniuIphone',
              api_name: _env.ENV.entryApiName,
              version: 1,
              planet: _env.ENV.planet,
              _access_token: accessToken
            };

            if ((0, _index3.isIDE)()) {
              args.user_nick = _userInfo.testUser.nickName;
              args._access_token = _userInfo.testUser.access_token;
            }
            res = void 0;
            tryTime = 0;

          case 4:
            if (!(tryTime++ < 2)) {
              _context.next = 14;
              break;
            }

            _context.next = 7;
            return new Promise(function (resolve) {
              (0, _cloud.getCloud)().application.httpRequest({
                path: 'shenmejibadongxi',
                method: 'POST',
                body: _extends({}, args)
              }).then(function (res) {
                resolve(res);
              }).catch(function (error) {
                _index2.default.showToast({ title: '登录失败 重试中..' + tryTime });
                _logger.Logger.error('entry-error', {
                  args: args,
                  error: error
                });
                resolve(false);
              });
            });

          case 7:
            res = _context.sent;

            if (!res) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("break", 14);

          case 10:
            _context.next = 12;
            return (0, _index3.sleep)(500);

          case 12:
            _context.next = 4;
            break;

          case 14:
            if (res) {
              _context.next = 18;
              break;
            }

            (0, _index3.showConfirmModal)({ content: '登录失败 请稍后再试..', showCancel: false });
            errCallback();
            return _context.abrupt("return");

          case 18:

            // Taro.showToast({ title: '登录成功' });
            data = res;

            if (data.data) {
              data = data.data;
            }
            try {
              data = JSON.parse(data);
            } catch (e) {
              _logger.Logger.error('entry-parse-error', e);
            }
            _logger.Logger.warn('ertry-success', args, data);
            phpSessionId = data.phpSessionId;
            phpSessionIdDeferred.resolve(phpSessionId);
            userInfo = {
              userId: data.user_id,
              userNick: data.nick
            };

            callback(userInfo);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function entry() {
    return _ref3.apply(this, arguments);
  };
}();

exports.api = api;
exports.applicationApi = applicationApi;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./index.js");

var _env = require("../../../constants/env.js");

var _logger = require("./logger.js");

var _cloud = require("./cloud.js");

var _userInfo = require("./userInfo.js");

var _moment = require("./moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _qnProxy = require("./qnProxy.js");

var _userInfoChanger = require("./userInfoChanger.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * 对象转换为www-x-form-encoded
 * @param element
 * @param key
 * @param list
 * @returns {string}
 */
function JSON_to_URLEncoded(element, key, list) {
  var list = list || [];
  if ((typeof element === "undefined" ? "undefined" : _typeof(element)) === 'object') {
    for (var idx in element) {
      JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
    }
  } else {
    list.push(key + "=" + element);
  }

  return list.join('&');
}

var phpSessionId = '';

var hostApiNameMap = {
  'trade.aiyongbao.com': 'tradepc',
  'mtrade.aiyongbao.com': 'mtrade',
  'item.aiyongbao.com': 'itempc',
  'mitem.aiyongbao.com': 'mitem'
};
var style = {
  red: 'background-color:#FF5555;color:#FFFFFF',
  green: 'background-color:#5555FF;color:#FFFFFF'
};

/**
 * api方法 根据不同的环境会用不同的方法获取数据
 *  在目前调试时使用cookie写死的方法
 * @param host
 * @param method
 * @param args
 * @param callback
 * @param errCallback
 */
function api(_ref) {
  var _ref$host = _ref.host,
      host = _ref$host === undefined ? _env.ENV.hosts.default : _ref$host,
      apiName = _ref.apiName,
      method = _ref.method,
      _ref$args = _ref.args,
      args = _ref$args === undefined ? {} : _ref$args,
      _ref$callback = _ref.callback,
      callback = _ref$callback === undefined ? _index3.NOOP : _ref$callback,
      _ref$errCallback = _ref.errCallback,
      errCallback = _ref$errCallback === undefined ? _index3.NOOP : _ref$errCallback,
      rest = _objectWithoutProperties(_ref, ["host", "apiName", "method", "args", "callback", "errCallback"]);

  if (Object.keys(args)) {
    args = _extends({}, args, {
      trade_source: 'TAO'
    });
  }
  {
    if (apiName) {
      applicationApi(_extends({
        args: args,
        apiName: apiName,
        path: method
      }, rest, {
        callback: function callback(res) {
          if (checkLogin(res)) {
            _success(res, apiName, 'application', args);
          } else {
            error(res, apiName, 'application', args);
          }
        },
        errCallback: function errCallback(res) {
          if (checkLogin(res)) {
            error(res, apiName, 'application', args);
          }
        }
      }));
    } else {
      if ((0, _qnProxy.getApiProxyEnabled)()) {
        (0, _qnProxy.getProxyDeferred)().then(function () {
          (0, _qnProxy.invokeApiProxy)({
            url: host + method,
            params: args,
            callback: function callback(res) {
              _success(res, host + method, 'proxy', args);
            },
            errCallback: function errCallback(err) {
              error(err, host + method, 'proxy', args);
            }
          });
        });
        return;
      }
      phpSessionIdDeferred.then(function () {
        _index2.default.request({
          url: host + method,
          data: JSON_to_URLEncoded(args),
          mode: 'cors',
          method: "POST",
          credentials: 'include',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie: 'PHPSESSID=' + phpSessionId
          },
          success: function success(res) {
            res = res.data;
            if (checkLogin(res)) {
              _success(res, host + method, 'request', args);
            } else {
              error(res, host + method, 'request', args);
            }
          },
          fail: function fail(err) {
            if (checkLogin(err)) {
              error(err, host + method, 'request', args);
            }
          }
        });
      });
    }
  }

  /**
   * 检查是否是登录失效
   * @param resp
   * @returns {boolean}
   */
  function checkLogin(resp) {
    if (resp == 'fail' || resp && resp.code == 500 && resp.sub_code == 20003) {
      // 遇见错误时弹框提示   by Mothpro
      // session获取失败登录失效
      (0, _index3.showConfirmModal)({
        title: '温馨提示',
        content: '登录失效，请重新打开插件！' + JSON.stringify(resp),
        onConfirm: function onConfirm() {
          my.qn.returnData();
        },
        onCancel: function onCancel() {
          errCallback(resp);
        }
      });
      return false;
    }
    return true;
  }

  /**
   * 成功
   * @param res
   */
  function _success(res, api, from, req) {
    _logger.Logger.debug("%capi-" + from + "-success", style.green, api, req, res);
    try {
      callback(res);
    } catch (e) {
      debugger;
      _logger.Logger.error('api-callback-error', (0, _index3.formatError)(e));
    }
  }

  /**
   * 失败
   * @param error
   */
  function error(error, api, from, req) {
    _logger.Logger.error("%capi-" + from + "-error", style.red, api, req, error);

    errCallback(error);
  }
};

var phpSessionIdDeferred = (0, _index3.getDeferred)();

var initphpSessionIdDeferred = exports.initphpSessionIdDeferred = function initphpSessionIdDeferred() {
  phpSessionIdDeferred = (0, _index3.getDeferred)();
};

var getphpSessionIdDeferred = exports.getphpSessionIdDeferred = function getphpSessionIdDeferred() {
  return phpSessionIdDeferred;
};

/**
 * 奇门接口
 * @param args
 * @param apiName
 * @param callback
 * @param errCallback
 */
function applicationApi(_ref2) {
  var args = _ref2.args,
      apiName = _ref2.apiName,
      path = _ref2.path,
      _ref2$method = _ref2.method,
      method = _ref2$method === undefined ? 'POST' : _ref2$method,
      _ref2$headers = _ref2.headers,
      headers = _ref2$headers === undefined ? {} : _ref2$headers,
      _ref2$version = _ref2.version,
      version = _ref2$version === undefined ? 1 : _ref2$version,
      callback = _ref2.callback,
      errCallback = _ref2.errCallback;

  phpSessionIdDeferred.then(function () {
    var _path = (0, _userInfoChanger.getUserInfo)().userNick;
    !_path && (_path = path);
    !_path && (_path = '/');
    var isSuccess = false;
    if (args) {
      Object.keys(args).map(function (key) {
        if (args[key] === null || args[key] === undefined) {
          delete args[key];
        }
      });
    }
    var data = {
      path: '#' + _path,
      method: method,
      headers: headers,
      body: _extends({
        api_name: apiName,
        phpSessionId: phpSessionId,
        version: version
      }, args)
    };
    (0, _cloud.getCloud)().application.httpRequest(data).then(function (res) {
      isSuccess = true;
      var data = res;
      if (data.data) {
        data = data.data;
      }
      // 调整自动上下级接口返回的是 '1null' 字符串，单独做一个处理
      if (res === '1null') {
        data = JSON.stringify({ 'res': 1 });
      }
      try {
        data = JSON.parse(data);
      } catch (e) {
        errCallback(e);
        return;
      }
      callback(data);
    }).catch(function (error) {
      if (!isSuccess) {
        if (error instanceof Error) {
          error = { message: error.message /* stack:error.stack */ };
        }
        errCallback(error);
      }
    });
  });
};