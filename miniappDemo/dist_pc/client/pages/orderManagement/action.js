"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeTab = exports.getState = exports.dispatch = undefined;

var _index = require("../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _config = require("./config.js");

var _soldGet = require("../../public/tradePublic/tradeDataCenter/api/soldGet.js");

var _config2 = require("../../public/tradePublic/tradeDataCenter/config.js");

var _resolveTopResponse = require("../../public/tradePublic/tradeDataCenter/common/resolveTopResponse.js");

var _taobaoRefundGet = require("../../public/tradePublic/taobaoRefundGet.js");

var _taobaoRefundGet2 = _interopRequireDefault(_taobaoRefundGet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var app = _index2.default.getApp();
/**
 *
 * @param json
 */
var dispatch = exports.dispatch = function dispatch(json) {
  app.store.dispatch(json);
};
/**
 *
 * @returns {any|*|Promise<NavigationPreloadState>}
 */
var getState = exports.getState = function getState() {
  return app.store.getState();
};

var changeTab = exports.changeTab = function changeTab(tabkey, pageNo, pageSize, searchVal) {
  dispatch({
    type: _config.REFUND_CHANGE,
    data: {
      activeTabKey: tabkey,
      pageNo: pageNo,
      pageSize: pageSize,
      list: [],
      isLoading: true
    }
  });
  (0, _soldGet.soldGet)({
    fields: _config2.fullinfoget_all_fields,
    status: tabkey,
    pageNo: pageNo,
    pageSize: pageSize,
    buyerNnick: searchVal,
    useHasNext: false,
    callback: function callback(rsp) {
      var list = rsp.trades;
      dispatch({
        type: _config.REFUND_CHANGE,
        data: {
          activeTabKey: tabkey,
          list: [].concat(_toConsumableArray(list)),
          tradeCounts: rsp.totalResults
        }
      });
      Promise.all(list.filter(function (trade) {
        return ['WAIT_BUYER_PAY', 'WAIT_SELLER_SEND_GOODS'].includes(trade.refund.status);
      }).map(function (trade) {
        return new Promise(function (resolve, reject) {
          (0, _taobaoRefundGet2.default)({
            query: {
              refund_id: trade.refund.refund_id
            },
            callback: function callback(res) {
              res = (0, _resolveTopResponse.resolveTopResponse)(res);
              trade.refund = res.refund;
              resolve();
            },
            errCallback: function errCallback(err) {
              resolve();
            }
          });
        });
      })).then(function () {
        dispatch({
          type: _config.REFUND_CHANGE,
          data: {
            activeTabKey: tabkey,
            list: [].concat(_toConsumableArray(list)),
            tradeCounts: rsp.totalResults,
            isLoading: false
          }
        });
      });
    }
  });
};