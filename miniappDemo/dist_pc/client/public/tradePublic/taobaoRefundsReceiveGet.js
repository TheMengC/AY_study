"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qnRouter = require("./qnRouter.js");

var _qnRouter2 = _interopRequireDefault(_qnRouter);

var _utils = require("./utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultFields = 'total_results,has_next,refunds,refund_id,tid,oid,total_fee,buyer_nick,seller_nick,created,modified,order_status,status,good_status,has_good_return,refund_fee,payment,reason,desc,title,num,company_name,sid,refund_phase,refund_version,sku,attribute,outer_id,operation_contraint';
function taobaoRefundsReceiveGet(_ref) {
  var query = _ref.query,
      _callback = _ref.callback,
      _ref$errCallback = _ref.errCallback,
      _errCallback = _ref$errCallback === undefined ? undefined : _ref$errCallback;

  query.fields = query.fields ? query.fields : defaultFields;
  (0, _qnRouter2.default)({
    api: 'taobao.refunds.receive.get',
    params: query,
    callback: function callback(rsp) {
      _callback(rsp);
    },
    errCallback: function errCallback(error) {
      if (_errCallback) {
        _errCallback(error);
      } else {
        (0, _utils.showErrorDialog)('温馨提示', '获取退款详情失败，请稍候再试！', JSON.stringify(error));
      }
    }
  });
}

exports.default = taobaoRefundsReceiveGet;