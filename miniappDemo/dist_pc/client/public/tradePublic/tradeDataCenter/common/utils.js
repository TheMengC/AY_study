"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusByTab = exports.getDiffFormatTime = exports.getTimeMax = exports.sum = undefined;
exports.getOrderLabel = getOrderLabel;

var _index = require("../../../tradePolyfills/index.js");

var _consts = require("../../consts.js");

var _resolveTrade = require("../biz/resolveTrade.js");

var _consts2 = require("../../../../constants/consts.js");

var sum = exports.sum = function sum(arr) {
  var _sum = 0;
  arr.map(function (item) {
    var num = parseFloat(item);
    if (isFinite(num)) {
      _sum += num;
    }
  });
  return _sum;
};
var getTimeMax = exports.getTimeMax = function getTimeMax(times) {
  var maxtime = times[0];
  return maxtime;
  times.map(function (time) {
    var a = (0, _index.moment)(time);
    var b = (0, _index.moment)(maxtime);
    if (a.isAfter(b)) {
      maxtime = time;
    };
  });
  return maxtime;
};

// 计算两个时间差 返回天/时/分/秒
var getDiffFormatTime = exports.getDiffFormatTime = function getDiffFormatTime(firstTime, lastTime) {
  firstTime = (0, _index.isEmpty)(firstTime) ? (0, _index.moment)() : (0, _index.moment)(firstTime);
  lastTime = (0, _index.isEmpty)(lastTime) ? (0, _index.moment)() : (0, _index.moment)(lastTime);
  var diff = lastTime.diff(firstTime) / 1000;
  var diffDay = Math.floor(diff / 3600 / 24);
  var diffHour = Math.floor((diff - diffDay * 3600 * 24) / 3600);
  var diffMinute = Math.floor((diff - diffDay * 3600 * 24 - diffHour * 3600) / 60);
  var diffSecond = Math.floor(diff - diffDay * 3600 * 24 - diffHour * 3600 - diffMinute * 60);
  return {
    diffDay: diffDay,
    diffHour: diffHour,
    diffMinute: diffMinute,
    diffSecond: diffSecond
  };
};

// 这里获得的状态是订单的主状态，和tab的状态名一致
var getStatusByTab = exports.getStatusByTab = function getStatusByTab(trade) {
  if (!trade) {
    return "";
  }
  var status = trade.status;

  if (trade.status == 'TRADE_CLOSED' || trade.status == "TRADE_CLOSED_BY_TAOBAO") {
    return 'ALL_CLOSED';
  }
  var tradeTabStatus = !(0, _index.isEmpty)(_consts.statusMap[status]) ? _consts.statusMap[status] : 'WAIT_SELLER_SEND_GOODS';
  if (status === 'TRADE_FINISHED') {
    var diff = (0, _index.moment)((0, _index.moment)()).diff(trade.end_time, 'days');
    if (diff < 15 && !trade.seller_rate) {
      tradeTabStatus = 'NEED_RATE';
    }
  }
  if (trade.has_refunding || trade.is_refunding) {
    tradeTabStatus = 'TRADE_REFUND';
  }

  return tradeTabStatus;
};

/**
 * 获取order的label状态
 * @param order
 * @param trade
 */
function getOrderLabel(_ref) {
  var order = _ref.order,
      trade = _ref.trade,
      _ref$currentTab = _ref.currentTab,
      currentTab = _ref$currentTab === undefined ? '' : _ref$currentTab;

  var orderStatus = (0, _resolveTrade.getStatusLabel)({
    trade: order,
    type: 'order',
    currentTab: currentTab
  });
  if (trade) {
    var tradeStatus = (0, _resolveTrade.getStatusLabel)({
      trade: trade,
      type: 'trade',
      currentTab: currentTab
    });
    if (orderStatus.status != tradeStatus.status) {};
  }
  _consts2.INDEX_TRADE_TABS[orderStatus];
}

/**
 * 获取trade的label状态
 */
// export function getTradeStatusLabel (trade, tabStaus) {
//
// }