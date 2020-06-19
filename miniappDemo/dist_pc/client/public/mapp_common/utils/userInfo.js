"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAutoPay = exports.isHuser = exports.getMainUserName = exports.isNotVip = exports.fetchUserInfoFromTcUser = exports.getCheckinData = exports.getNewUserTasksData = exports.authorize = exports.userInfoInit = exports.initUserInfoFromCache = exports.testUser = exports.authDeferred = exports.userInfoDeferred = undefined;

/**
 * 授权失败 并弹出对话框 可以选择退出或者重新授权 重新授权会清除授权
 * @param location
 * @param err
 */
var authFailed = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(location, err) {
    var retry;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            _logger.Logger.error('auth failed', location, err);
            err = JSON.stringify(err);
            (0, _beacon.tradeBeacon)({ func: 'authorize_failed', m3: location, m4: err });
            _context.next = 5;
            return new Promise(function (resolve) {
              (0, _index.showConfirmModal)({
                content: '授权失败' + location + err,
                cancelText: '退出',
                confirmText: "重试",
                onCancel: function onCancel() {
                  my.qn.returnData();
                  resolve(false);
                },
                onConfirm: function onConfirm() {
                  my.qn.cleanToken({
                    success: function success(res) {
                      _index3.default.showToast({ title: '清除授权成功' + JSON.stringify(res) });
                      resolve(true);
                    },
                    fail: function fail(res) {
                      _index3.default.showToast({ title: '清除授权失败' + JSON.stringify(res) });
                      resolve(true);
                    }
                  });
                }
              });
            });

          case 5:
            retry = _context.sent;

            if (!retry) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", authorize());

          case 10:
            return _context.abrupt("return");

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function authFailed(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * 授权 并拿到用户信息
 * @returns {Promise<{access_token: string, nickName: string}|{[p: string]: *}|{access_token: string, nickName: string}|*|undefined>}
 */


var authorize = exports.authorize = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var _ref3, authRes, authErr, _ref4, userRes, userErr;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(0, _index.isIDE)()) {
              _context2.next = 5;
              break;
            }

            _logger.Logger.error('auth dev mode');
            (0, _beacon.tradeBeacon)({
              func: 'auth_dev_mode',
              m3: !!my.qn,
              m4: !!(my.qn || {}).openPlugin
            });
            authDeferred.resolve(testUser);
            return _context2.abrupt("return", testUser);

          case 5:
            _context2.prev = 5;
            _context2.next = 8;
            return new Promise(function (resolve) {
              my.authorize({
                scopes: '*',
                success: function success(authRes) {
                  _logger.Logger.warn('authorize', authRes);
                  (0, _userInfoChanger.setUserInfo)({ accessToken: authRes.accessToken });
                  resolve({ authRes: authRes });
                },
                fail: function fail(authErr) {
                  resolve({ authErr: authErr });
                }
              });
            });

          case 8:
            _ref3 = _context2.sent;
            authRes = _ref3.authRes;
            authErr = _ref3.authErr;

            if (!authErr) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt("return", authFailed('authorize_fail', authErr));

          case 13:
            authDeferred.resolve(authRes);

            _context2.next = 16;
            return new Promise(function (resolve) {
              my.getAuthUserInfo({
                success: function success(userRes) {
                  _logger.Logger.warn('getAuthUserInfo', userRes);
                  resolve({ userRes: userRes });
                },
                fail: function fail(userErr) {
                  resolve({ userErr: userErr });
                }
              });
            });

          case 16:
            _ref4 = _context2.sent;
            userRes = _ref4.userRes;
            userErr = _ref4.userErr;

            if (!userErr) {
              _context2.next = 21;
              break;
            }

            return _context2.abrupt("return", authFailed('getAuthUserInfo_fail', userErr));

          case 21:
            return _context2.abrupt("return", (0, _userInfoChanger.setUserInfo)(userRes));

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](5);
            return _context2.abrupt("return", authFailed('authorize throw', _context2.t0));

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 24]]);
  }));

  return function authorize() {
    return _ref2.apply(this, arguments);
  };
}();

exports.authLimited = authLimited;
exports.isPaidVip = isPaidVip;

var _api = require("./api.js");

var _env = require("../../../constants/env.js");

var _index = require("./index.js");

var _eventManager = require("./eventManager.js");

var _moment = require("./moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _storage = require("./storage.js");

var _logger = require("./logger.js");

var _utils = require("../../tradePublic/utils.js");

var _userInfoChanger = require("./userInfoChanger.js");

var _constants = require("../../tradePublic/marketing/constants.js");

var _action = require("../newUserVillage/action.js");

var _beacon = require("./beacon.js");

var _index2 = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index3 = _interopRequireDefault(_index2);

var _openChat = require("./openChat.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = _env.ENV.app;
var userInfoDeferred = exports.userInfoDeferred = (0, _index.getDeferred)();
var authDeferred = exports.authDeferred = (0, _index.getDeferred)();
var testUser = exports.testUser = {
  // nickName: '子小一十八',
  // access_token: '80008901239nOZZ0nyiqvaetdbBax3PuyeKkOjvhtyCCYnpugNQ12fee8d2VRQMROONUpfU5'
  nickName: '赵东昊的测试店铺'
  // nickName:'sinpo0',
  // access_token:'80008201047oUmyiZ6nyfidDRqkWFiqgPSzDkDKn4jUXjCW9uwgupXvdECv108e4a1dCn2gzj',

};

var initUserInfoFromCache = exports.initUserInfoFromCache = function initUserInfoFromCache() {
  var cache = _storage.storage.getItemSync('userInfo');
  _logger.Logger.warn("initUserInfoFromCache", cache);
  (0, _userInfoChanger.setUserInfo)(cache);
};

/*
 * @Description 接入tc/user，获取用户信息
*/
var userInfoInit = exports.userInfoInit = function userInfoInit() {
  var _callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _index.NOOP;

  (0, _api.initphpSessionIdDeferred)();
  authorize().then(function (res) {
    var nick = !(0, _index.isEmpty)(res) ? res.nickName : testUser.nickName;
    (0, _api.entry)({
      callback: function callback(userInfoEntry) {
        _logger.Logger.warn("userInfoEntry", userInfoEntry);
        (0, _userInfoChanger.setUserInfo)(userInfoEntry);
      }
    });
    fetchUserInfoFromTcUser({
      nick: nick,
      callback: function callback(newUserInfo) {

        // 添加一些便于使用的userInfo相关内容
        // 该展示的账号版本
        newUserInfo.showVipState = newUserInfo.vipFlag > 0 ? '高级版' : '初级版';
        // 用户版本剩余天数
        newUserInfo.vipRemain = getVipRemain(newUserInfo.vipTime);
        // 展示用的到期时间
        var showVipTime = '';
        if (newUserInfo.vipRemain === 1) {
          showVipTime = '今天到期';
        } else if ((0, _utils.judgeRenew)('high', newUserInfo.vipRemain)) {
          showVipTime = "\u5269\u4F59" + newUserInfo.vipRemain + "\u5929";
        } else {
          showVipTime = "\u5230\u671F\u65F6\u95F4\uFF1A" + newUserInfo.vipTime;
        }
        newUserInfo.showVipTime = showVipTime;
        // 展示用的升级/续费按钮
        newUserInfo.showPayBtn = newUserInfo.vipFlag ? '续费' : '升级';
        // 判断是否是子账号
        if (!(0, _index.isEmpty)(newUserInfo.sub_nick)) {
          newUserInfo.subUserNick = newUserInfo.sub_nick;
        }
        _logger.Logger.warn("fetchUserInfoFromTcUser", newUserInfo);
        (0, _userInfoChanger.setUserInfo)(newUserInfo);
        userInfoDeferred.resolve();
        _eventManager.events.userInfoCallback.emit(newUserInfo);
        _callback(newUserInfo);
        getCheckinData(nick).then(function (res) {
          (0, _action.checkIn_dispatch)(res);
        });
        setTimeout(function () {
          getNewUserTasksData(nick).then(function (res) {
            (0, _action.newUserTasks_dispatch)(res);
          });
        }, 5000);
      }
    });
  });
};;
/**
 * 获取任务记录数据
 * @param userNick
 * @returns {Promise<unknown>}
 */
var getNewUserTasksData = exports.getNewUserTasksData = function getNewUserTasksData(userNick) {
  return new Promise(function (resolve, reject) {
    (0, _api.api)({
      apiName: 'aiyong.marketing.newuser.taskinfo.get',
      host: _env.ENV.hosts.trade,
      method: '/activity/getNewUserTaskInfo',
      isloading: false,
      // dataType:'json',
      args: {
        userNick: userNick,
        app: app
      },
      callback: function callback(res) {
        var _res = res,
            taskInfo = _res.taskInfo,
            taskStatus = _res.taskStatus;
        // 小程序版不需要扫码发货以及设置默认插件的任务

        var userTasks = taskInfo && taskInfo.filter(function (item) {
          return item.id != 13 && item.id != 16;
        });
        var statusArr = taskStatus && taskStatus.filter(function (item) {
          return item.task_id != 13 && item.task_id != 16;
        });
        res = { "taskInfo": userTasks, "taskStatus": statusArr };
        resolve(res);
      },
      errCallback: function errCallback(err) {
        reject(err);
      }
    });
  });
};
/**
 * 获取签到记录数据
 * @param userNick
 * @returns {Promise<unknown>}
 */
var getCheckinData = exports.getCheckinData = function getCheckinData(userNick) {
  return new Promise(function (resolve, reject) {
    (0, _api.api)({
      apiName: 'aiyong.marketing.newuser.checkininfo.get',
      host: _env.ENV.hosts.trade,
      method: '/activity/getUserCheckInInfo',
      isloading: false,
      // dataType:'json',
      args: {
        userNick: userNick,
        app: app
      },
      callback: function callback(res) {
        resolve(res);
      },
      errCallback: function errCallback(err) {
        reject(err);
      }
    });
  });
};

var authNameMap = {
  'trade': "查看订单",
  'update': "修改订单",
  'refund': "处理退款",
  'logistics': "查看物流信息",
  'rate': "评价",
  'close': "关闭订单"
};
/**
 * 权限受到了限制 主要是因为tc/user返回的needauth为1 有可能是授权过期 或子账号的accessToken权限不足导致的
 * 要找主账号授权
 */
function authLimited(authResult) {
  var unAuthorizedPermissionsStr = '';
  try {
    if (authResult && Object.keys(authResult)) {
      unAuthorizedPermissionsStr = Object.keys(authResult).map(function (key) {
        if (authResult[key] && authResult[key].code == 27 || authResult[key].code == 12) {
          return authNameMap[key];
        }
      }).filter(Boolean).join('，');
      if (unAuthorizedPermissionsStr) {
        unAuthorizedPermissionsStr = "\uFF0C\u5F53\u524D\u7F3A\u5931" + unAuthorizedPermissionsStr + "\u6743\u9650";
      }
    }
  } catch (e) {
    _index3.default.showToast({ title: JSON.stringify((0, _index.formatError)(e)) });
  }

  (0, _index.showConfirmModal)({
    title: '温馨提示',
    content: '爱用交易授权即将过期，自动评价、差评拦截、自动合单功能将无法正常使用，请立即联系主账号进行授权' + unAuthorizedPermissionsStr,
    showCancel: false,
    confirmText: '联系主账号授权',
    onConfirm: function onConfirm() {
      (0, _openChat.openChat)({
        nick: (0, _userInfoChanger.getUserInfo)().userNick,
        text: "\u7231\u7528\u4EA4\u6613\u6388\u6743\u5373\u5C06\u8FC7\u671F\uFF0C\u73B0\u5728\u9700\u8981\u4F7F\u7528\u4E3B\u8D26\u53F7\u7684\u767B\u5F55\u5343\u725B\uFF0C\u6253\u5F00\u7231\u7528\u4EA4\u6613\u6388\u6743\uFF0C\u5982\u4E0D\u6388\u6743\uFF0C\u6240\u6709\u8D26\u53F7\u5C06\u65E0\u6CD5\u8FDB\u5165\u7231\u7528\u4EA4\u6613\uFF0C\u81EA\u52A8\u8BC4\u4EF7\u3001\u5DEE\u8BC4\u62E6\u622A\u3001\u81EA\u52A8\u5408\u5355\u529F\u80FD\u65E0\u6CD5\u6B63\u5E38\u4F7F\u7528\uFF0C\u8BF7\u7ACB\u5373\u6388\u6743\u7231\u7528\u4EA4\u6613\u3002"
      });
    }
  });
}
/*
 * @Description 从tcUser获取用户信息
*/
var fetchUserInfoFromTcUser = exports.fetchUserInfoFromTcUser = function fetchUserInfoFromTcUser(_ref5) {
  var _callback2 = _ref5.callback,
      nick = _ref5.nick;

  var args = { isqap: 1, slot: 'miniapp' };
  if ((0, _index.isIDE)()) {
    args.nick = testUser.nickName;
    args.access_token = testUser.access_token;
  }
  (0, _api.api)({
    apiName: _env.ENV.userApiName,
    path: '/tc/user',
    args: args,
    callback: function callback(res) {

      var newUserInfo = {
        userNick: res.nick,
        vipFlag: res.vipflag,
        vipTime: res.order_cycle_end.split(' ')[0],
        isH: res.h,
        createDate: res.createdate,
        lastPaidTime: res.last_paid_time,
        tag: res.tag,
        renewMessage: res.vip_renew_message,
        notice: res.notice,
        renewDatas: res.renewDatas,
        sub_nick: res.sub_nick,
        user_id: res.user_id,
        newMemoSet: res.newMemoSet || 0,
        needauth: res.needauth,
        type: res.miniapp_shop_type
      };
      _callback2(newUserInfo);
      if (res.needauth == '1') {
        authLimited(res.auth);
      }
    }
  });
};

/*
 * @Description 获取用户周期剩余时间
*/
var getVipRemain = function getVipRemain(viptime) {
  return (0, _moment2.default)(viptime).diff((0, _moment2.default)(), 'day') + 1;
};

/**
 * 付了钱的用户 可以用存单高级搜索
 * @returns {boolean}
 */
function isPaidVip() {
  return (0, _userInfoChanger.getUserInfo)().vipFlag == 1 || (0, _userInfoChanger.getUserInfo)().vipFlag == 3;
};

/**
 * 是否为初级版用户
 * @returns {boolean}
 */
var isNotVip = exports.isNotVip = function isNotVip() {
  return (0, _userInfoChanger.getUserInfo)().vipFlag == 0;
};

var getMainUserName = exports.getMainUserName = function getMainUserName() {
  return (0, _userInfoChanger.getUserInfo)().userNick.split(':')[0];
};

/*
 * @Description 判断是不是h版用户
*/
var isHuser = exports.isHuser = function isHuser() {
  return (0, _userInfoChanger.getUserInfo)().isH == 1;
};

/*
 * @Description 判断是否是自动续费用户
*/
var isAutoPay = exports.isAutoPay = function isAutoPay() {
  return (0, _userInfoChanger.getUserInfo)().vipFlag == _constants.nameToFlag.AUTO_PAY;
};