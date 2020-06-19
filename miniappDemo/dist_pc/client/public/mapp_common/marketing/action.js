"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.togglePayResult = exports.couponStartCount = exports.setLastCloseTime = exports.getLastCloseTime = exports.closeAdByPid = exports.updateReduxAdByPid = exports.triggerAdInfoByPid = exports.marketing_getState = exports.marketing_dispatch = exports.marketingReduxInit = undefined;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../utils/index.js");

var _storage = require("../utils/storage.js");

var _constants = require("../../tradePublic/marketing/constants.js");

var _moment = require("../utils/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _env = require("../../../constants/env.js");

var _systemInfo = require("../utils/systemInfo.js");

var _index4 = require("./feedback/index.js");

var _index5 = require("../../tradePublic/marketing/index.js");

var _index6 = require("./utils/index.js");

var _utils = require("../../tradePublic/utils.js");

var _userInfoChanger = require("../utils/userInfoChanger.js");

var _userInfo = require("../utils/userInfo.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * @Description 首次进入插件时，把localStorage中的广告信息同步到redux里
*/
var marketingReduxInit = exports.marketingReduxInit = function marketingReduxInit() {
  var localInfo = marketing_getStorage();
  if (!(0, _index3.isEmpty)(localInfo)) {
    marketing_dispatch(localInfo);
  }
};

/*
 * @Description 生成符合redux的marketing结构的数据
*/
var createAdData = function createAdData(pid, adInfo, state, type) {
  var ad = {
    pid: pid,
    lastCloseTime: state === false ? (0, _utils.getToday)() : undefined,
    page: (0, _index3.getCurrentPageName)(),
    state: state,
    adInfo: adInfo,
    type: type
  };
  return ad;
};

/*
 * @Description 更新redux中的广告信息
*/
var marketing_dispatch = exports.marketing_dispatch = function marketing_dispatch(data) {
  (0, _index6.marketConsole)('log', '同步marketing的缓存到redux惹', data);
  _index2.default.getApp().store.dispatch({ type: "UPDATE_AD_INFO", data: data });
};

/*
 * @Description 获取redux中的所有广告信息
*/
var marketing_getState = exports.marketing_getState = function marketing_getState() {
  return _index2.default.getApp().store.getState().marketingAdInfoReducer;
};

/*
 * @Description 取缓存中的广告数据
*/
var marketing_getStorage = function marketing_getStorage() {
  return _storage.storage.getItemSync(_constants.MARKETING_STORAGE_KEY);
};

/*
 * @Description 把广告数据丢到缓存里
*/
var marketing_setStorage = function marketing_setStorage(data) {
  var storageData = (0, _index3.deepCopyObj)(data);
  Object.keys(storageData).forEach(function (key) {
    storageData[key].adInfo = undefined;
    storageData[key].showPayResult = undefined;
  });
  _storage.storage.setItemSync(_constants.MARKETING_STORAGE_KEY, storageData);
};

/*
 * @Description 判断是否需要展示广告
*/
var judgeShow = function judgeShow(adInfo) {
  if ((0, _index3.isEmpty)(adInfo)) {
    (0, _index6.marketConsole)('log', '≠≠≠这个广告啥信息都没有，赶紧获取他~≠≠≠');
    return true;
  }
  if (adInfo.type === _constants.MARKETING_TYPE.modalVip) {
    (0, _index6.marketConsole)('log', '≠≠≠功能点广告的每次都弹弹弹~~~≠≠≠');
    return true;
  }
  var lastCloseTime = adInfo.lastCloseTime,
      type = adInfo.type;

  var today = (0, _utils.getToday)();
  var shouldShow = true;
  (0, _index6.marketConsole)('log', "\u2260\u2260\u2260\u8FD9\u662F\u4E2A" + type + "\u5E7F\u544A\u2260\u2260\u2260");
  if (lastCloseTime === today) {
    (0, _index6.marketConsole)('log', '≠≠≠今天已经弹过啦≠≠≠');
    shouldShow = false;
  }
  (0, _index6.marketConsole)('log', "\u2260\u2260\u2260\u5BF9\u8FD9\u4E2A\u5E7F\u544A\u7684\u5206\u6790\u7ED3\u679C\u662F\uFF1A" + (shouldShow ? '弹他！' : '放过孩子吧') + "\u2260\u2260\u2260");
  return shouldShow;
};

/*
 * @Description 用来控制要不要展现广告，调试用
*/
var shouldShowAd = true;

/*
 * @Description 根据pid获取redux中的广告信息
*/
var triggerAdInfoByPid = exports.triggerAdInfoByPid = function triggerAdInfoByPid(_ref) {
  var pid = _ref.pid,
      _ref$state = _ref.state,
      state = _ref$state === undefined ? _constants.AD_STATE.SHOULD_SHOW : _ref$state,
      type = _ref.type,
      _ref$callback = _ref.callback,
      _callback = _ref$callback === undefined ? _index3.NOOP : _ref$callback;

  {}
  (0, _index6.marketConsole)('log', "\u2260\u2260\u2260\u5F00\u59CB\u8FDB\u5165" + pid + "\u5E7F\u544A\u66F4\u65B0\u8FDB\u7A0B\u2260\u2260\u2260");
  if (pid === _constants.NO_AD_PID) {
    (0, _index6.marketConsole)('log', "\u2260\u2260\u2260\u786E\u8BA4\u8FC7\u773C\u795E\uFF0C\u662F\u4E0D\u9700\u8981\u5F39\u5E7F\u544A\u7684\u60C5\u51B5~peace out~\u2260\u2260\u2260");
    return;
  }
  var tempKey = (0, _utils.getKeyName)(pid);
  if (type === _constants.MARKETING_TYPE.modalVip) {
    // 功能点广告的话，pid=modalvip
    tempKey = _constants.MARKETING_TYPE.modalVip;
  }
  var adInfo = marketing_getState()[tempKey];
  var shouldShow = judgeShow(adInfo);
  // 触发更新广告里的redux数据
  if (shouldShow) {
    if ((0, _index3.isEmpty)(adInfo) || (0, _index3.isEmpty)(adInfo.adInfo) || adInfo.type === _constants.MARKETING_TYPE.modalVip) {
      // 如果redux里压根没有这个pid的所有信息，或者有pid的信息，但是没有广告内容（从缓存中搬到redux的）
      // 这个时候直接获取新的广告信息就行
      (0, _index6.marketConsole)('log', "\u2260\u2260\u2260\u6B64\u65F6\u9700\u8981\u83B7\u53D6\u4E00\u4E0Bpid\uFF1A" + pid + "\u7684\u6700\u65B0\u7684\u5E7F\u544A\u4FE1\u606F~\u2260\u2260\u2260");
      switch (type) {
        case _constants.MARKETING_TYPE.notice:
          {
            // 获取公告and弱提示的内容
            var _getUserInfo = (0, _userInfoChanger.getUserInfo)(),
                notice = _getUserInfo.notice,
                renewDatas = _getUserInfo.renewDatas,
                renewMessage = _getUserInfo.renewMessage;

            var renderContent = {};
            if (!(0, _index3.isEmpty)(notice)) {
              renderContent.notice = notice;
            }
            if (!(0, _userInfo.isHuser)() && !(0, _userInfo.isAutoPay)() && renewMessage && renewMessage.low && renewDatas && !(0, _index3.isEmpty)(renewDatas.lowData)) {
              // 非H版、非自动续费用户才可以拥有弱提示
              renderContent.lowData = renewDatas.lowData;
            }
            if ((0, _index3.isEmpty)(renderContent)) {
              return null;
            }
            var data = createAdData(pid, renderContent, _constants.AD_STATE.SHOULD_SHOW, _constants.MARKETING_TYPE.notice);
            (0, _index4.feedbackShowed)({ adData: data.adInfo });
            updateReduxAdByPid({ pid: pid, data: data });
            _callback(shouldShow);
            break;
          }
        case _constants.MARKETING_TYPE.modalVip:
          {
            var pidList = _constants.MODAL_VIP_LIST[_env.ENV.app][(0, _userInfoChanger.getUserInfo)().vipflag == 1 ? 'renew' : 'upgrade'][(0, _systemInfo.getSystemInfo)().platform];
            if ((0, _index3.isIOS)() || (0, _index3.isPC)()) {
              pidList = [pid];
            } else {
              if (!pidList.includes(pid.toString())) {
                pidList.push(pid);
              }
            }
            var marketingPromiseList = pidList.map(function (item) {
              return new Promise(function (resolve) {
                (0, _index5.getAd)({
                  pid: item,
                  callback: function callback(adData) {
                    resolve({ pid: item, adData: adData.result });
                  }
                });
              });
            });
            Promise.all(marketingPromiseList).then(function (adData) {
              adData.map(function (item) {
                if (item.pid == pid) {
                  (0, _index4.feedbackShowed)({ adData: item.adData });
                }
              });
              var data = createAdData(type, adData, state, type);
              data.currentPid = pid;
              (0, _index6.marketConsole)('log', "\u2260\u2260\u2260" + type + "\u5E7F\u544A\u51B2\u51B2\u51B2~\u2260\u2260\u2260");
              updateReduxAdByPid({ pid: type, data: data });
              _callback(shouldShow);
            });
            break;
          }
        case _constants.MARKETING_TYPE.afterAction:
          {
            if (!(0, _utils.judgeRenew)('high') || (0, _userInfo.isAutoPay)()) {
              // 只有强提示阶段的非自动续费用户需要显示事后续费
              _callback(false);
              return;
            }
            // 先获得广告，然后把页面&pid放到redux里
            (0, _index5.getAd)({
              pid: pid,
              callback: function callback(adData) {
                var data = createAdData(pid, adData.result, state, type);
                (0, _index6.marketConsole)('log', "\u2260\u2260\u2260" + pid + "\u5E7F\u544A\u51B2\u51B2\u51B2~\u2260\u2260\u2260");
                (0, _index4.feedbackShowed)({ adData: adData.result });
                updateReduxAdByPid({ pid: pid, data: data });
                recordAfterActionAdInfo(pid);
                _callback(shouldShow);
              }
            });
            break;
          }
        default:
          {
            if ((0, _userInfo.isHuser)()) {
              (0, _index6.marketConsole)('log', "\u2260\u2260\u2260\u8FD9\u662F\u4E2Ah\u7248\u7528\u6237\uFF0C\u6E9C\u4E86\u6E9C\u4E86\u2260\u2260\u2260");
              _callback(false);
              return;
            }
            (0, _index5.getAd)({
              pid: pid,
              callback: function callback(adData) {
                // 如果是重新获取的广告信息，那肯定是没有redux结构的，让我们来建造一下
                var data = createAdData(pid, adData.result, state, type);
                if (type !== _constants.MARKETING_TYPE.midModal) {
                  if (!(0, _index3.isEmpty)(adData.result)) {
                    // 中提示弹窗的时间反馈应该是在点击广告之后，所以这里不触发feedback
                    (0, _index4.feedbackShowed)({ adData: adData.result });
                  }
                }
                (0, _index6.marketConsole)('log', "\u2260\u2260\u2260" + pid + "\u5E7F\u544A\u51B2\u51B2\u51B2~\u2260\u2260\u2260");
                updateReduxAdByPid({ pid: pid, data: data });
                _callback(shouldShow);
              }
            });
          }
      }
    } else {
      // 如果redux里有广告信息，那就直接提交redux里的广告信息，不用重新获取了
      (0, _index6.marketConsole)('log', "\u2260\u2260\u2260redux\u91CC\u6709" + pid + "\u5E7F\u544A\u5185\u5BB9\uFF0C\u6211\u53EA\u9700\u8981\u66F4\u65B0\u4E00\u4E0Bstate\u5C31\u53EF\u4EE5\u60F9\u2260\u2260\u2260");
      adInfo.state = state;
      if (state !== _constants.AD_STATE.NOT_SHOW && type === _constants.MARKETING_TYPE.modalVip) {
        // 如果是打开的modalvip，需要重新记录一下显示事件
        adInfo.adInfo.map(function (item) {
          if (item.pid == pid) {
            (0, _index4.feedbackShowed)({ adData: item.adData });
          }
        });
      }
      updateReduxAdByPid({ pid: pid, data: adInfo });
      _callback(shouldShow);
    }
  } else {
    (0, _index6.marketConsole)('log', "\u2260\u2260\u2260\u4E0D\u9700\u8981\u5C55\u793A" + pid + "\u5E7F\u544A\uFF0C\u544A\u8F9E\u2260\u2260\u2260");
  }
};

/*
 * @Description 根据pid更新广告状态
*/
var updateReduxAdByPid = exports.updateReduxAdByPid = function updateReduxAdByPid(_ref2) {
  var pid = _ref2.pid,
      data = _ref2.data;

  var key = void 0;
  if (pid === _constants.MARKETING_TYPE.modalVip) {
    key = pid;
  } else {
    key = (0, _utils.getKeyName)(pid);
  }
  saveNewToRedux({ key: key, data: data });
};

/*
 * @Description 记录当前页面的事后续费情况
*/
var recordAfterActionAdInfo = function recordAfterActionAdInfo(pid) {
  var data = _defineProperty({}, (0, _index3.getCurrentPageName)(), pid);
  saveNewToRedux({ key: 'afterActionInfo', data: data });
};

var saveNewToRedux = function saveNewToRedux(_ref3) {
  var key = _ref3.key,
      data = _ref3.data;

  var oldState = marketing_getState();
  var oldAdInfo = (0, _index3.deepCopyObj)(oldState[key]);
  var newAdInfo = Object.assign({}, oldAdInfo, data);
  var newState = Object.assign({}, oldState, _defineProperty({}, key, newAdInfo));
  marketing_setStorage(newState);
  _index2.default.getApp().store.dispatch({ type: "UPDATE_AD_INFO", data: newState });
};

/*
 * @Description 关闭某个广告
*/
var closeAdByPid = exports.closeAdByPid = function closeAdByPid(_ref4) {
  var pid = _ref4.pid,
      _ref4$still = _ref4.still,
      still = _ref4$still === undefined ? false : _ref4$still;

  var data = {
    state: false,
    lastCloseTime: still ? undefined : (0, _utils.getToday)()
  };
  updateReduxAdByPid({ pid: pid, data: data });
};

/*
 * @Description 获取指定广告的上次关闭时间
*/
var getLastCloseTime = exports.getLastCloseTime = function getLastCloseTime(pid) {
  var keyName = (0, _utils.getKeyName)(pid);
  var adState = marketing_getState()[keyName];
  return adState ? adState['lastCloseTime'] : '';
};

/*
 * @Description 仅修改某个广告的最后关闭时间
*/
var setLastCloseTime = exports.setLastCloseTime = function setLastCloseTime(pid) {
  updateReduxAdByPid({
    pid: pid,
    data: { lastCloseTime: (0, _utils.getToday)() }
  });
};

/*
 * @Description 中提示优惠券开始计时啦
*/
var couponStartCount = exports.couponStartCount = function couponStartCount(pid) {
  var startTime = (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss');
  var data = { startTime: startTime };
  updateReduxAdByPid({ pid: pid, data: data });
  return startTime;
};

/*
 * @Description 更改付款后二次确认弹窗状态
*/
var togglePayResult = exports.togglePayResult = function togglePayResult(_ref5) {
  var pid = _ref5.pid,
      state = _ref5.state,
      _ref5$url = _ref5.url,
      url = _ref5$url === undefined ? undefined : _ref5$url,
      _ref5$isRenew = _ref5.isRenew,
      isRenew = _ref5$isRenew === undefined ? undefined : _ref5$isRenew;

  if ((0, _index3.isIOS)()) {
    return;
  } else {
    var showPayResult = { state: state, url: url, isRenew: isRenew };
    var data = { showPayResult: showPayResult };
    updateReduxAdByPid({ pid: pid, data: data });
  }
};