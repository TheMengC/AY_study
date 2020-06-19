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

var _consts = require("../../../public/tradePublic/consts.js");

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = OrderCard.__proto__ || Object.getPrototypeOf(OrderCard)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["trade", "loopArray26", "tab", "activeTabKey", "list"], _this.customComponents = ["GoodsList"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(OrderCard, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(OrderCard.prototype.__proto__ || Object.getPrototypeOf(OrderCard.prototype), "_constructor", this).call(this, props);

      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _props = this.__props,
          activeTabKey = _props.activeTabKey,
          trade = _props.trade,
          list = _props.list;

      var tab = Object.keys(_consts.WHAT_I_NEED).map(function (key) {
        if (activeTabKey && key == activeTabKey) {
          return _consts.WHAT_I_NEED[key].name;
        }
      });

      var loopArray26 = trade.orders.map(function (item, _anonIdx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        var _genCompid = (0, _index.genCompid)(__prefix + "dgzzzzzzzz" + _anonIdx, true),
            _genCompid2 = _slicedToArray(_genCompid, 2),
            $prevCompid__47 = _genCompid2[0],
            $compid__47 = _genCompid2[1];

        propsManager.set({
          "order": item.$original
        }, $compid__47, $prevCompid__47);
        return {
          $compid__47: $compid__47,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        trade: trade,
        loopArray26: loopArray26,
        tab: tab
      });
      return this.__state;
    }
  }]);

  return OrderCard;
}(_index.Component), _class.$$events = [], _class.$$componentPath = "components/orderManagement/orderCard/index", _temp2);
exports.default = OrderCard;

Component(require('../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(OrderCard));