"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../npm/_tarojs/redux/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var OrderList = (_dec = (0, _index3.connect)(function (store) {
  return {
    activeTabKey: store.orderListReducer.activeTabKey,
    list: store.orderListReducer.list,
    isLoading: store.orderListReducer.isLoading
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(OrderList, _BaseComponent);

  function OrderList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, OrderList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = OrderList.__proto__ || Object.getPrototypeOf(OrderList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray22", "$compid__38", "list", "isLoading", "activeTabKey"], _this.customComponents = ["EmptyPage", "OrderCard"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(OrderList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(OrderList.prototype.__proto__ || Object.getPrototypeOf(OrderList.prototype), "_constructor", this).call(this, props);
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.activeTabKey != nextProps.activeTabKey) {}
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__38"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__38 = _genCompid2[0],
          $compid__38 = _genCompid2[1];

      var _props = this.__props,
          list = _props.list,
          activeTabKey = _props.activeTabKey,
          isLoading = _props.isLoading;

      var loopArray22 = list.map(function (trade, _anonIdx) {
        trade = {
          $original: (0, _index.internal_get_original)(trade)
        };

        var _genCompid3 = (0, _index.genCompid)(__prefix + "dbzzzzzzzz" + _anonIdx, true),
            _genCompid4 = _slicedToArray(_genCompid3, 2),
            $prevCompid__37 = _genCompid4[0],
            $compid__37 = _genCompid4[1];

        propsManager.set({
          "trade": trade.$original,
          "activeTabKey": activeTabKey,
          "list": list
        }, $compid__37, $prevCompid__37);
        return {
          $compid__37: $compid__37,
          $original: trade.$original
        };
      });
      list.length == 0 && !isLoading && propsManager.set({
        "text": "\u5F53\u524D\u6CA1\u6709\u4EFB\u4F55\u8BA2\u5355"
      }, $compid__38, $prevCompid__38);
      Object.assign(this.__state, {
        loopArray22: loopArray22,
        $compid__38: $compid__38,
        list: list,
        isLoading: isLoading
      });
      return this.__state;
    }
  }]);

  return OrderList;
}(_index.Component), _class2.$$events = [], _class2.$$componentPath = "components/orderManagement/orderList/index", _temp2)) || _class);
exports.default = OrderList;

Component(require('../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(OrderList));