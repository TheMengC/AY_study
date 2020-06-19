"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../public/mapp_common/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var OrderCard = (_temp2 = _class = function (_BaseComponent) {
  _inherits(OrderCard, _BaseComponent);

  function OrderCard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, OrderCard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = OrderCard.__proto__ || Object.getPrototypeOf(OrderCard)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp5", "anonymousState__temp6", "order", "anonymousState__temp3"], _this.goRefundDetail = function () {}, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(OrderCard, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(OrderCard.prototype.__proto__ || Object.getPrototypeOf(OrderCard.prototype), "_constructor", this).call(this, props);
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "_createDiscountMsgData",
    value: function _createDiscountMsgData(_$uid) {
      var _this2 = this;

      return function () {
        var order = _this2.props.order;

        var anonymousState__temp4 = (0, _index3.isEmpty)(order);
        if (anonymousState__temp4) {
          return null;
        }
        var discount_fee = order.discount_fee * 1;
        var adjust_fee = order.adjust_fee * 1;
        var anonymousState__temp = discount_fee != 0 ? Math.abs(discount_fee) : null;
        var anonymousState__temp2 = adjust_fee != 0 ? Math.abs(adjust_fee) : null;
        return {
          anonymousState__temp: anonymousState__temp,
          anonymousState__temp2: anonymousState__temp2,
          anonymousState__temp4: anonymousState__temp4,
          discount_fee: discount_fee,
          adjust_fee: adjust_fee,
          order: order
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

      var order = this.__props.order;


      var anonymousState__temp3 = this._createDiscountMsgData(__prefix + "dfzzzzzzzz")();

      var anonymousState__temp5 = !(0, _index3.isEmpty)(order.outer_sku_id);
      var anonymousState__temp6 = !(0, _index3.isEmpty)(order.outer_iid);
      Object.assign(this.__state, {
        anonymousState__temp5: anonymousState__temp5,
        anonymousState__temp6: anonymousState__temp6,
        order: order,
        anonymousState__temp3: anonymousState__temp3
      });
      return this.__state;
    }
  }]);

  return OrderCard;
}(_index.Component), _class.$$events = [], _class.$$componentPath = "components/refundManagement/orderCard/index", _temp2);


OrderCard.defaultProps = {
  className: '',
  order: {}
};
exports.default = OrderCard;

Component(require('../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(OrderCard));