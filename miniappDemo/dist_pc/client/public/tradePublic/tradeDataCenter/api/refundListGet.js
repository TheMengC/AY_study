"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRefundList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getRefundListTop = getRefundListTop;

var _config = require("../config.js");

var _taobaoRefundsReceiveGet = require("../../taobaoRefundsReceiveGet.js");

var _taobaoRefundsReceiveGet2 = _interopRequireDefault(_taobaoRefundsReceiveGet);

var _taobaoRefundGet = require("../../taobaoRefundGet.js");

var _taobaoRefundGet2 = _interopRequireDefault(_taobaoRefundGet);

var _fullinfoGet = require("./fullinfoGet.js");

var _resolveTrade = require("../biz/resolveTrade.js");

var _index = require("../../../tradePolyfills/index.js");

var _resolveTopResponse = require("../common/resolveTopResponse.js");

var _handleError = require("../common/handleError.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function getRefundList(_ref) {
  var _ref$fields = _ref.fields,
      fields = _ref$fields === undefined ? _config.refund_simple_fields : _ref$fields,
      _ref$buyerNnick = _ref.buyerNnick,
      buyerNnick = _ref$buyerNnick === undefined ? '' : _ref$buyerNnick,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? _config.soldget_all_type : _ref$type,
      _ref$useHasNext = _ref.useHasNext,
      useHasNext = _ref$useHasNext === undefined ? true : _ref$useHasNext,
      _ref$pageSize = _ref.pageSize,
      pageSize = _ref$pageSize === undefined ? 40 : _ref$pageSize,
      _ref$pageNo = _ref.pageNo,
      pageNo = _ref$pageNo === undefined ? 1 : _ref$pageNo,
      source = _ref.source,
      _ref$fallback = _ref.fallback,
      fallback = _ref$fallback === undefined ? true : _ref$fallback,
      _ref$callback = _ref.callback,
      _callback = _ref$callback === undefined ? _index.NOOP : _ref$callback,
      _ref$errCallback = _ref.errCallback,
      _errCallback = _ref$errCallback === undefined ? _handleError.handleError : _ref$errCallback,
      rest = _objectWithoutProperties(_ref, ["fields", "buyerNnick", "type", "useHasNext", "pageSize", "pageNo", "source", "fallback", "callback", "errCallback"]);

  var query = _extends({
    fields: fields,
    buyer_nick: buyerNnick,
    type: type,
    page_no: pageNo,
    page_size: pageSize,
    use_has_next: useHasNext
  }, rest);
  var has_next = false;
  var totalResults = 0;

  return new Promise(function (resolve, reject) {
    (0, _taobaoRefundsReceiveGet2.default)({
      query: query,
      callback: function callback(rsp) {
        rsp = (0, _resolveTopResponse.resolveTopResponse)(rsp);
        var refunds = (0, _resolveTopResponse.getArrayByKey)('refund', rsp);
        if (refunds) {
          has_next = rsp.has_next;
        }
        totalResults = rsp.total_results;
        resolve({ refunds: refunds });
      },
      errCallback: function errCallback(error) {
        reject(error);
        _errCallback(error);
      }
    });
  }).then(function (_ref2) {
    var refunds = _ref2.refunds;

    var refundsGroupByTid = {};
    refunds.map(function (refund) {
      if (!refundsGroupByTid[refund.tid]) {
        refundsGroupByTid[refund.tid] = [];
      }
      refundsGroupByTid[refund.tid].push(refund);
    });
    return new Promise(function (resolve, reject) {
      (0, _fullinfoGet.fullinfoGetBatch)({
        tids: Object.keys(refundsGroupByTid),
        callback: function callback(rsp) {
          var list = [];
          var trades = rsp.filter(Boolean);
          trades.map(function (trade) {
            refundsGroupByTid[trade.tid].map(function (refund) {
              var order = (0, _resolveTopResponse.getOrders)(trade).find(function (order) {
                return order.oid === refund.oid;
              });
              var newTrade = JSON.parse(JSON.stringify(trade));
              newTrade.orders.order = [order];
              newTrade.refund = refund;
              (0, _resolveTrade.resolveTrade)(newTrade);
              list.push(newTrade);
            });
          });
          resolve({ totalResults: totalResults, trades: list, has_next: has_next });
          _callback({ totalResults: totalResults, trades: list, has_next: has_next });
        }
      });
    });
  });
}

/**
 * 这个退款中是有够复杂的 先是用refund.receive.get取所有的退款中订单 这个返回的单位是order
 * 用这个接口返回的refund_id放到refund.get查退款详情 里面有退款过期时间
 *  然后把上面这些order里面的tid去重然后查fullinfo
 * @returns {Promise<{refunds: *} | never>}
 */
exports.getRefundList = getRefundList;
function getRefundListTop(_ref3) {
  var args = _objectWithoutProperties(_ref3, []);

  var query = _extends({}, args);
  query.page_no = 1;
  query.page_size = 40;
  query.use_has_next = true;
  query.end_modified = (0, _index.moment)().format('YYYY-MM-DD HH:mm:ss');
  query.start_modified = (0, _index.moment)().subtract(45, 'days').format('YYYY-MM-DD') + ' 00:00:00';
  query.type = _config.soldget_all_type;
  var has_next = false;
  return new Promise(function (resolve, reject) {
    var allRefunds = [];
    var refundGet = function refundGet() {
      (0, _taobaoRefundsReceiveGet2.default)({
        query: query,
        callback: function callback(rsp) {
          rsp = (0, _resolveTopResponse.resolveTopResponse)(rsp);
          var refunds = (0, _resolveTopResponse.getArrayByKey)('refund', rsp);
          if (refunds) {
            has_next = rsp.has_next;
            refunds = refunds.filter(function (trade) {
              return trade.status != 'SUCCESS' && trade.status != 'CLOSED';
            });
            Array.prototype.push.apply(allRefunds, refunds);
          }
          if (rsp.has_next) {
            query.page_no++;
            refundGet();
          } else {
            resolve({ refunds: allRefunds });
          }
        },
        errCallback: function errCallback(error) {
          if (error.msg == 'App Call Limited') {
            setTimeout(refundGet, 1000);
            return;
          }
          reject();
        }
      });
    };
    refundGet();
  }).then(function (_ref4) {
    var refunds = _ref4.refunds;

    return new Promise(function (resolve, reject) {
      var refundGetPromiseArr = refunds.map(function (refund) {
        return new Promise(function (resolveRefundGet, reject1) {
          (0, _taobaoRefundGet2.default)({
            query: {
              refund_id: refund.refund_id
            },
            callback: function callback(res) {
              resolveRefundGet((0, _resolveTopResponse.resolveTopResponse)(res).refund);
            }
          });
        });
      });
      Promise.all(refundGetPromiseArr).then(function (refundGets) {
        var refundsGroupByTid = {}; //分组 请求fullinfo
        var refundsIndexedByOid = {};
        refundGets.map(function (refund) {
          if (refundsGroupByTid[refund.tid]) {
            refundsGroupByTid[refund.tid] = [];
          }
          refundsGroupByTid[refund.tid] = refund;
          refundsIndexedByOid[refund.oid] = refund;
        });
        return (0, _fullinfoGet.fullinfoGetBatch)({
          tids: Object.keys(refundsGroupByTid),
          callback: function callback(rsp) {
            var trades = rsp.filter(Boolean);
            trades.map(function (trade) {
              (0, _resolveTopResponse.getOrders)(trade).map(function (order) {
                if (refundsIndexedByOid[order.oid]) {
                  order.refund = refundsIndexedByOid[order.oid];
                }
              });
              (0, _resolveTrade.resolveTrade)(trade);
              Object.assign(trade, {
                loadingState: {
                  fullinfo: true,
                  printBrief: false,
                  printWayBill: false,
                  refundMessage: false
                }
              });
            });
            resolve({ totalResults: trades.length, trades: trades, has_next: has_next });
          }
        });
      });
    });
  });
}