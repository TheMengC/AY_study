"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRealPid = exports.showAfterAction = exports.showModalVIP = exports.goClick = exports.goPage = exports.goFunc = exports.goLink = undefined;

/**
 * 跳转付费
 * @param url
 * @returns {Promise<void>}
 */
var goLink = exports.goLink = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var contactContent;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contactContent = "\u6211\u60F3\u8BA2\u8D2D" + _env.ENV.appName + "\u9AD8\u7EA7\u7248\u529F\u80FD \uFF0C\u94FE\u63A5\uFF1A" + url;

            if (!(0, _index3.isIOS)()) {
              _context.next = 5;
              break;
            }

            _logger.Logger.log('ios不能跳转，只能联系客服了');

            (0, _openChat.contactCustomerService)(contactContent);
            return _context.abrupt("return");

          case 5:
            if (!(url.length < 50)) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return convertShortLink(url);

          case 8:
            url = _context.sent;

          case 9:

            if (url && url.indexOf("fuwu.taobao.com") > 0) {

              try {
                my.qn.navigateToWebPage({ url: url });
              } catch (e) {
                _logger.Logger.error('安卓 但是跳转出错了，只能联系客服了', e);
                (0, _openChat.contactCustomerService)(contactContent);
              }
            } else {
              _logger.Logger.error('安卓 但是取到的链接不对 不能跳转，只能联系客服了');
              (0, _openChat.contactCustomerService)(contactContent);
            }
            // }
            // my.navigateToMiniProgram({
            //     appId: '3000000002140711',
            //     path:'/pages/service-detail/service-detail?serviceCode=FW_GOODS-1827490&tracelog=plugin',
            //     success: (res) => {
            //         marketConsole('log', JSON.stringify(res));
            //     },
            //     fail: (res) => {
            //         marketConsole('log', JSON.stringify(res));
            //     },
            // });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function goLink(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.convertShortLink = convertShortLink;

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../utils/index.js");

var _index4 = require("../feedback/index.js");

var _openChat = require("../../utils/openChat.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _action = require("../action.js");

var _goToOpenPlugin = require("../../utils/goToOpenPlugin.js");

var _goToQAP = require("../../utils/goToQAP.js");

var _index5 = require("./index.js");

var _utils = require("../../../tradePublic/utils.js");

var _env = require("../../../../constants/env.js");

var _systemInfo = require("../../utils/systemInfo.js");

var _userInfoChanger = require("../../utils/userInfoChanger.js");

var _beacon = require("../../utils/beacon.js");

var _loading = require("../../utils/loading.js");

var _api = require("../../utils/api.js");

var _logger = require("../../utils/logger.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @Description 运营相关的一些工具方法
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


function convertShortLink(url) {
  return new Promise(function (res) {
    (0, _api.api)({
      apiName: 'aiyong.tools.shortlink.convert',
      args: { url: url },
      callback: res,
      errCallback: function errCallback() {
        return res();
      }
    });
  });
};

/*
 * @Description 跳转功能
*/
var goFunc = exports.goFunc = function goFunc(url) {
  if (!(0, _index3.isEmpty)(url)) {
    //跳转到qap或mini
    var qapOrMini = 'mini';
    if (url.includes('qap:///')) {
      qapOrMini = 'qap';
    }
    //跳转到交易或商品
    var tradeOrItem = 'item';
    if (url.includes(',trade')) {
      tradeOrItem = 'trade';
    }
    //跳转到qap
    if (qapOrMini == 'qap') {
      //正则目标 'qap:///BadInterceptNegativePage.js,trade'
      var reg = /.*(?!qap:)(?=.js)/;
      var qapPage = url.match(reg)[0].split('///')[1];
      //跳转交易qap没有实现
      if (tradeOrItem == 'trade') {
        var title = "\u5047\u88C5\u8DF3\u8F6C\u8FD9\u4E2A\u9875\u9762\u4E86~~ " + url;
        _index2.default.showToast({ title: title });
      } else {
        //跳转商品qap
        (0, _goToQAP.goToQAP)({ page: qapPage, pageName: '我咋知道这个页面名字是啥' });
      }
    } else {
      //默认跳转到商品小程序
      var appkey = '21085832';
      if (tradeOrItem == 'trade') {
        //跳转到交易小程序
        appkey = '21085840';
      }
      //拆分目标例子 'pages/badWordDetection/badWordIndex/index,item'
      var directPage = url.split(',')[0];
      (0, _goToOpenPlugin.goToOpenPlugin)({
        appkey: appkey,
        directPage: { 'url': directPage }
      });
    }
  }
};

/*
 * @Description 跳转页面
*/
var goPage = exports.goPage = function goPage(url) {
  var title = "\u5047\u88C5\u8DF3\u8F6C\u8FD9\u4E2A\u9875\u9762\u4E86~~ " + url;
  // Taro.showToast({ title });
};

var goClick = exports.goClick = function goClick(_ref2) {
  var customType = _ref2.customType,
      customUrl = _ref2.customUrl,
      customContent = _ref2.customContent,
      adData = _ref2.adData,
      _ref2$callback = _ref2.callback,
      callback = _ref2$callback === undefined ? _index3.NOOP : _ref2$callback,
      _ref2$needFeedback = _ref2.needFeedback,
      needFeedback = _ref2$needFeedback === undefined ? true : _ref2$needFeedback;

  var adInfo = !(0, _index3.isEmpty)(adData.user_define) ? adData.user_define.body : {};
  var type = adInfo.type,
      service = adInfo.service; // type  1.功能跳转 2.订购插件 3.联系客服 4.千牛电台

  type = customType ? customType : type; // 如果没有从外部传type进来，那就是默认使用广告内的type
  type = type + '';
  var url = adInfo.url;

  url = customUrl ? customUrl : url; // 如果没有从外部传url进来，那就是默认使用广告内的url
  service = customContent ? customContent : service; // 如果没有从外部传话术进来，那就是默认使用广告内的话术
  // 记录一下这个广告被点击啦~
  if (needFeedback) {
    (0, _index4.feedbackClicked)({ adData: adData, url: url });
  }
  if ((0, _index3.isPC)()) {
    // 如果是PC的点击，和手机不太一样嗷
    switch (type) {
      // 1：功能跳转类型
      case _constants.AD_TYPE.JUMP_FUNC:
        goFunc(url);
        break;
      // 4: 千牛电台类型
      case _constants.AD_TYPE.QIANNIU_RADIO:
        {
          goPage(url);
          break;
        }
      // 3： 联系客服类型
      case _constants.AD_TYPE.CONTACT_KEFU:
        {
          console.error('假装我和客服聊天惹：', service);
          (0, _openChat.contactCustomerService)(service);
          break;
        }
      // 2: 订购插件类型
      case _constants.AD_TYPE.FUWU_ORDER:
      default:
        {
          // 显示付款后按钮
          var modalData = { pid: adData.pid, state: _constants.AD_STATE.SHOULD_SHOW, url: url };
          if (adData.user_define && adData.user_define.body && adData.user_define.body.freebutton) {
            modalData.isRenew = true;
          }
          (0, _action.togglePayResult)(modalData);
          beforePayBeacon(adData);
          goLink(url);
          break;
        }
    }
  } else {
    // 根据type走不同的跳转
    switch (type) {
      // 1：功能跳转类型
      case _constants.AD_TYPE.JUMP_FUNC:
        goFunc(url);
        break;
      // 4: 千牛电台类型
      case _constants.AD_TYPE.QIANNIU_RADIO:
        {
          goPage(url);
          break;
        }
      // 3： 联系客服类型
      case _constants.AD_TYPE.CONTACT_KEFU:
        {
          beforePayBeacon(adData);
          console.error('假装我和客服聊天惹：', service);
          (0, _openChat.contactCustomerService)(service);
          break;
        }
      // 2: 订购插件类型
      case _constants.AD_TYPE.FUWU_ORDER:
      default:
        {
          beforePayBeacon(adData);
          var _type = adData.type;
          if (_type !== _constants.MARKETING_TYPE.notice) {
            // 公告的跳转链接不用显示二次确认框
            // 显示付款后按钮
            var _modalData = { pid: adData.pid, state: _constants.AD_STATE.SHOULD_SHOW, url: url };
            if (adData.user_define && adData.user_define.body && adData.user_define.body.freebutton) {
              _modalData.isRenew = true;
            }
            (0, _action.togglePayResult)(_modalData);
          }
          // ios用户需要联系客服
          if ((0, _index3.isIOS)()) {
            var text = adInfo.service;
            // 如果没有话术但是有跳转链接，那就跳跳跳
            if (_type === _constants.MARKETING_TYPE.notice) {
              // 如果是公告，直接跳转链接
              goLink(url);
            } else if ((0, _index3.isEmpty)(text) && !(0, _index3.isEmpty)(adInfo) && adInfo.url.indexOf('qap:///') > -1) {
              goLink(url);
            } else {
              // 如果有话术，那就直接联系客服
              text = text.replace('【URL】', adInfo['ios-url']);
              (0, _openChat.contactCustomerService)(text);
            }
          } else {
            // 非ios用户直接跳转服务市场
            goLink(url);
          }
          break;
        }
    }
  }
  if (!(0, _index3.isEmpty)(callback)) {
    callback();
  }
};

var beforePayBeacon = function beforePayBeacon(adData) {
  console.error({ adData: adData });
  var payBeaconParent = _env.ENV.payBeaconParent,
      payBeacon = _env.ENV.payBeacon;

  var _getUserInfo = (0, _userInfoChanger.getUserInfo)(),
      userNick = _getUserInfo.userNick,
      vipFlag = _getUserInfo.vipFlag;

  var m7 = vipFlag == 0 ? 'upgrade' : '';
  var pid = adData.pid,
      cname = adData.cname,
      cid = adData.cid,
      payUrl = adData.payUrl;

  var beaconObj = {
    p: payBeaconParent,
    e: payBeacon,
    m1: pid,
    m2: cname,
    m3: cid,
    m4: (0, _systemInfo.getSystemInfo)().platform,
    n: userNick,
    m7: m7,
    m8: payUrl ? payUrl : ''
  };
  (0, _beacon.beacons)(beaconObj);
};

/*
 * @Description 展现功能点广告
*/
var showModalVIP = exports.showModalVIP = function showModalVIP(pid) {
  pid = getRealPid(pid);
  (0, _loading.showLoading)();
  (0, _action.triggerAdInfoByPid)({
    pid: pid,
    state: _constants.AD_STATE.SHOULD_SHOW,
    type: _constants.MARKETING_TYPE.modalVip,
    callback: function callback() {
      _index2.default.hideLoading();
      if ((0, _index3.isIOS)()) {
        // 如果是ios用户，那只要看到一个广告就行~
        (0, _index3.navigateTo)({
          url: '/public/mapp_common/marketing/modalVIP/ModalVIPios',
          params: { pid: pid }
        });
      }
    }
  });
};

/*
 * @Description 展现事后续费广告
*/
var showAfterAction = exports.showAfterAction = function showAfterAction(pid) {
  var pageName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var realPid = getRealPid(pid);
  var marketState = (0, _action.marketing_getState)();
  var shouldShow = true;
  if (!(0, _index3.isEmpty)(marketState.afterActionInfo)) {
    // 如果有事后续费的信息
    var pagePid = marketState.afterActionInfo[(0, _index3.isEmpty)(pageName) ? (0, _index3.getCurrentPageName)() : pageName];
    var keyName = (0, _index3.isEmpty)(pageName) ? (0, _utils.getKeyName)(pagePid) : pageName + "_" + realPid;
    if (!(0, _index3.isEmpty)(marketState[keyName])) {
      // 并且这个pid有广告信息
      var ad = marketState[keyName];
      if ((0, _utils.getToday)() === ad.lastCloseTime || ad.state !== _constants.AD_STATE.NOT_SHOW) {
        // 如果今天这个页面已经弹过了，或者还没有关，那就不弹啦，无事发生
        (0, _index5.marketConsole)('log', '今天这个页面已经弹过了，或者还没有关，那就不弹啦，无事发生');
        shouldShow = false;
      }
    }
  }
  if (shouldShow) {
    (0, _action.triggerAdInfoByPid)({
      pid: realPid,
      state: _constants.AD_STATE.AFTER_ACTION_MODAL,
      type: _constants.MARKETING_TYPE.afterAction
    });
  }
};

/*
 * @Description 把功能点广告的安卓pid转成iospid
*/
var getRealPid = exports.getRealPid = function getRealPid(pid) {
  if ((0, _index3.isIOS)()) {
    return (0, _index3.isEmpty)(_constants.switchPid[pid]) ? pid : _constants.switchPid[pid];
  } else {
    return pid;
  }
};