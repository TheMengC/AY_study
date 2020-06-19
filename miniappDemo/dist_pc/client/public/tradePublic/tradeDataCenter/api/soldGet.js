"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.soldGet = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require("../config.js");

var _consts = require("../consts.js");

var _index = require("../../../tradePolyfills/index.js");

var _handleError = require("../common/handleError.js");

var _resolveTopResponse = require("../common/resolveTopResponse.js");

var _qnRouter = require("../../qnRouter.js");

var _qnRouter2 = _interopRequireDefault(_qnRouter);

var _resolveTrade = require("../biz/resolveTrade.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function soldGet(_ref) {
  var _ref$fields = _ref.fields,
      fields = _ref$fields === undefined ? _config.soldget_all_fields : _ref$fields,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? _config.soldget_all_type : _ref$type,
      _ref$pageSize = _ref.pageSize,
      pageSize = _ref$pageSize === undefined ? 20 : _ref$pageSize,
      _ref$pageNo = _ref.pageNo,
      pageNo = _ref$pageNo === undefined ? 1 : _ref$pageNo,
      status = _ref.status,
      _ref$source = _ref.source,
      source = _ref$source === undefined ? _consts.SOLDGET_SOURCE.aiyong : _ref$source,
      _ref$callback = _ref.callback,
      _callback = _ref$callback === undefined ? _index.NOOP : _ref$callback,
      _ref$errCallback = _ref.errCallback,
      _errCallback = _ref$errCallback === undefined ? _handleError.handleError : _ref$errCallback,
      rest = _objectWithoutProperties(_ref, ["fields", "type", "pageSize", "pageNo", "status", "source", "callback", "errCallback"]);

  return new Promise(function (resolve, reject) {
    var params = _extends({
      fields: fields,
      page_no: pageNo,
      page_size: pageSize,
      type: type
    }, rest);
    if (status) {
      params.status = status;
    }
    if ((0, _index.getWindow)().downGrade && (0, _index.getWindow)().downGrade.top_sold_get_use_has_next) {
      params.use_has_next = true;
    }
    (0, _qnRouter2.default)({
      api: 'taobao.trades.sold.get',
      tag: 'TDC-soldGet',
      source: source,
      params: params,
      callback: function callback(rsp) {
        var trades = [];
        rsp = (0, _resolveTopResponse.resolveTopResponse)(rsp);
        if (rsp) {
          trades = (0, _resolveTopResponse.getTrades)(rsp);
        }
        var totalResults = rsp.total_results;
        var has_next = rsp.has_next;
        if (has_next == undefined) {
          has_next = trades.length == pageSize;
        }
        trades = trades.map(function (trade) {
          return (0, _resolveTrade.resolveTrade)(trade);
        });
        _callback({ trades: trades, totalResults: totalResults, has_next: has_next });
        resolve({ trades: trades, totalResults: totalResults, has_next: has_next });
      },
      errCallback: function errCallback(error) {
        _errCallback(error);
        reject(error);
      }
    });
  });
}
exports.soldGet = soldGet;