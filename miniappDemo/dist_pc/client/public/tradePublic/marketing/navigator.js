"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerShowAfterAction = exports.shouldAfterAction = exports.getMidCardPid = exports.getBannerPid = exports.shouldRenderNotice = exports.getMidCouponPid = exports.getMidModalPid = exports.getModalPid = undefined;

var _index = require("../../tradePolyfills/index.js");

var _constants = require("./constants.js");

var _env = require("../../../constants/env.js");

var _utils = require("../utils.js");

/*
 * @Description 根据广告的不同type做不同预处理
 */
var app = _env.ENV.app;
var platform = (0, _index.getSystemInfo)().platform;

/*
 * @Description 获取真实的modaladpid
 */
var getModalPid = exports.getModalPid = function getModalPid(from) {
  if (from !== (0, _index.getEntry)()) {
    // 证明不是入口广告，不弹
    return undefined;
  }
  var vipFlag = (0, _index.getUserInfo)().vipFlag;
  var createDate = (0, _index.getUserInfo)().createDate;
  var today = (0, _utils.getToday)();
  // 获取运营广告的pid
  var marketingPid = _constants.CONST_PIDS[app][platform]['marketing'][from];
  // 获取运营广告上次展示时间
  var marketingLastTime = (0, _index.getLastCloseTime)(marketingPid);
  // 获取强提示的pid
  var highPid = _constants.CONST_PIDS[app][platform][vipFlag > 0 ? 'high' : 'high_free'][from];
  // 获取强提示上次展示时间
  var highLastTime = (0, _index.getLastCloseTime)(highPid);
  var pid = void 0;
  // 通常情况下的广告是不需要要在逻辑里判断要不要展示的，但是由于强提示和运营广告有递进关系，所以需要在这里判断一下
  if ((0, _utils.judgeRenew)('high') && highLastTime !== today && highPid !== _constants.NO_AD_PID) {
    // 获取指定平台、插件下的强提示pid
    pid = highPid;
  } else if (marketingLastTime !== today && marketingPid !== _constants.NO_AD_PID) {
    pid = marketingPid;
  }
  // 临时增加纯新用户的弹窗 android & ios
  console.log((0, _index.checkNewUser)(createDate) + 'checkNewUser(createDate)');
  if ((0, _index.checkNewUser)(createDate) == 1) {
    pid = (0, _index.isIOS)() ? 3645 : 3625;
    return pid;
  }
  return pid;
};

/*
 * @Description 获取真实的中提示pid
 */
var getMidModalPid = exports.getMidModalPid = function getMidModalPid(from) {
  if (from !== (0, _index.getEntry)()) {
    // 证明不是入口广告，不弹
    return undefined;
  }
  var pid = void 0;
  if ((0, _utils.judgeRenew)('middle')) {
    var vipFlag = (0, _index.getUserInfo)().vipFlag;
    pid = _constants.CONST_PIDS[app][platform][vipFlag > 0 ? 'middle' : 'middle_free'][from];
  }
  return pid;
};

/*
 * @Description 获取真实的角标中提示pid
 */
var getMidCouponPid = exports.getMidCouponPid = function getMidCouponPid(from) {
  var pid = void 0;
  var vipFlag = (0, _index.getUserInfo)().vipFlag;
  if ((0, _utils.judgeRenew)('middle') && vipFlag === _constants.nameToFlag.COMMON_VIP) {
    pid = _constants.CONST_PIDS[app][platform]['coupon'][from];
  }
  return pid;
};

/*
 * @Description 判断要不要渲染公告
 */
var shouldRenderNotice = exports.shouldRenderNotice = function shouldRenderNotice() {
  var _getUserInfo = (0, _index.getUserInfo)(),
      notice = _getUserInfo.notice,
      renewMessage = _getUserInfo.renewMessage;

  if (!(0, _index.isEmpty)(notice) || !(0, _index.isEmpty)(renewMessage) && renewMessage.low) {
    return _constants.MARKETING_TYPE.notice;
  }
};

/*
 * @Description 获取真实的banner的pid
 */
var getBannerPid = exports.getBannerPid = function getBannerPid(from) {
  var pid = void 0;
  pid = _constants.CONST_PIDS[app][platform]['banner'][from];
  var createDate = (0, _index.getUserInfo)().createDate;
  if ((0, _index.checkNewUser)(createDate)) {
    pid = _constants.CONST_PIDS[app][platform]['banner_newuser'][from];
  }
  return pid;
};

/*
 * @Description 获取中提示卡片pid
 */
var getMidCardPid = exports.getMidCardPid = function getMidCardPid() {
  var pid = void 0;
  var vipFlag = (0, _index.getUserInfo)().vipFlag;
  if ((0, _utils.judgeRenew)('middle') && vipFlag === _constants.nameToFlag.COMMON_VIP) {
    pid = _constants.CONST_PIDS[app][platform]['middle_card'];
  }
  return pid;
};

/*
 * @Description 判断事后续费的逻辑
 */
var shouldAfterAction = exports.shouldAfterAction = function shouldAfterAction(props) {
  var afterActionInfo = props.afterActionInfo;

  if (!(0, _index.isEmpty)(afterActionInfo)) {
    var pid = afterActionInfo[(0, _index.getCurrentPageName)()];
    var ad = props[(0, _utils.getKeyName)(pid)];

    if (!(0, _index.isEmpty)(ad) && ad.state !== _constants.AD_STATE.NOT_SHOW) {
      return pid;
    }
  }
  return null;
};

/*
 * @Description 触发展现事后续费弹窗
 */
var triggerShowAfterAction = exports.triggerShowAfterAction = function triggerShowAfterAction(props, state) {
  var afterActionInfo = props.afterActionInfo;

  if (!(0, _index.isEmpty)(afterActionInfo)) {
    var pid = afterActionInfo[(0, _index.getCurrentPageName)()];
    if (!(0, _index.isEmpty)(pid)) {
      var keyName = (0, _utils.getKeyName)(pid);
      var ad = props[keyName];
      var showAD = state.showAD,
          currentPid = state.currentPid;

      if (!(0, _index.isEmpty)(ad) && !(0, _index.isEmpty)(ad.adInfo) && ad.state !== _constants.AD_STATE.NOT_SHOW && !showAD && currentPid !== pid) {
        return {
          pid: pid,
          state: ad.state ? ad.state : _constants.AD_STATE.AFTER_ACTION_MODAL
        };
      }
    }
  }
  return null;
};