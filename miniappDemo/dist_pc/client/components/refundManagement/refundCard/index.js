"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _utils = require("../../../public/tradePublic/tradeDataCenter/common/utils.js");

var _resolveTrade = require("../../../public/tradePublic/tradeDataCenter/biz/resolveTrade.js");

var _resolveTopResponse = require("../../../public/tradePublic/tradeDataCenter/common/resolveTopResponse.js");

var _moment = require("../../../public/mapp_common/utils/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _consts = require("../../../public/tradePublic/consts.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var RefundCard = (_temp2 = _class = function (_BaseComponent) {
  _inherits(RefundCard, _BaseComponent);

  function RefundCard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RefundCard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RefundCard.__proto__ || Object.getPrototypeOf(RefundCard)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp2", "anonymousState__temp3", "loopArray23", "anonymousState__temp4", "anonymousState__temp5", "trade", "anonymousState__temp", "REFUND_TABS", "$anonymousCallee__0", "activeTabKey"], _this.goRefundDetail = function (refund) {}, _this.customComponents = ["OrderCard"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RefundCard, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(RefundCard.prototype.__proto__ || Object.getPrototypeOf(RefundCard.prototype), "_constructor", this).call(this, props);
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {}
  }, {
    key: "_createcountDownData",
    value: function _createcountDownData(_$uid) {
      return function (endTime) {
        var timeStr = '';
        if (endTime) {
          var diffTime = (0, _utils.getDiffFormatTime)((0, _moment2.default)(), endTime);
          timeStr = diffTime.diffDay != 0 ? diffTime.diffDay + "\u5929" : '';
          timeStr += diffTime.diffHour != 0 ? diffTime.diffHour + "\u65F6" : '';
          timeStr += diffTime.diffMinute != 0 ? diffTime.diffMinute + "\u5206" : '';
          timeStr += diffTime.diffSecond > 0 ? diffTime.diffSecond + "\u79D2" : '';
        }

        return {
          timeStr: timeStr
        };
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var trade = this.__props.trade;
      var activeTabKey = this.__props.activeTabKey;

      var anonymousState__temp = trade.refund.refund_remind_timeout ? this._createcountDownData(__prefix + "dczzzzzzzz")(trade.refund.refund_remind_timeout.timeout) : null;
      var anonymousState__temp2 = Number(trade.payment).toFixed(2);
      var anonymousState__temp3 = (0, _resolveTrade.getTradeAddress)(trade, { needContact: true });
      var $anonymousCallee__0 = (0, _resolveTopResponse.getOrders)(trade);
      var anonymousState__temp4 = { text: trade.buyer_nick, msg: '复制成功' };
      var anonymousState__temp5 = { text: trade.refund.refund_id, msg: '复制成功' };
      var loopArray23 = (0, _resolveTopResponse.getOrders)(trade).map(function (order, _anonIdx) {
        order = {
          $original: (0, _index.internal_get_original)(order)
        };

        var _genCompid = (0, _index.genCompid)(__prefix + "ddzzzzzzzz" + _anonIdx, true),
            _genCompid2 = _slicedToArray(_genCompid, 2),
            $prevCompid__43 = _genCompid2[0],
            $compid__43 = _genCompid2[1];

        propsManager.set({
          "trade": trade,
          "order": order.$original
        }, $compid__43, $prevCompid__43);
        return {
          $compid__43: $compid__43,
          $original: order.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        loopArray23: loopArray23,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        trade: trade,
        anonymousState__temp: anonymousState__temp,
        REFUND_TABS: _consts.REFUND_TABS,
        $anonymousCallee__0: $anonymousCallee__0,
        activeTabKey: activeTabKey
      });
      return this.__state;
    }
  }]);

  return RefundCard;
}(_index.Component), _class.$$events = ["copyText", "goRefundDetail", "checkAddress"], _class.$$componentPath = "components/refundManagement/refundCard/index", _temp2);
exports.default = RefundCard;

Component(require('../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(RefundCard));