"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _action = require("../action.js");

var _biz = require("../utils/biz.js");

var _index3 = require("../../utils/index.js");

var _index4 = require("../feedback/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var BannerAD = (_temp2 = _class = function (_BaseComponent) {
  _inherits(BannerAD, _BaseComponent);

  function BannerAD() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BannerAD);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BannerAD.__proto__ || Object.getPrototypeOf(BannerAD)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "_$extraClass", "_$adData", "pid", "ad", "close", "from"], _this.closeAD = function () {
      var _this$props = _this.props,
          pid = _this$props.pid,
          ad = _this$props.ad,
          close = _this$props.close;

      (0, _index4.feedbackClosed)({ adData: ad.adInfo });
      (0, _action.closeAdByPid)({ pid: pid });
      close();
    }, _this.componentWillReceiveProps = function (props) {}, _this.clickAD = function (adData) {
      (0, _biz.goClick)({ adData: adData });
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BannerAD, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(BannerAD.prototype.__proto__ || Object.getPrototypeOf(BannerAD.prototype), "_constructor", this).call(this, props);
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 关闭广告
    */


    /*
     * @Description banner点击事件
    */

  }, {
    key: "_createData",
    value: function _createData() {
      var _$adData, _$extraClass;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _props = this.__props,
          ad = _props.ad,
          from = _props.from;

      var jsx = null;
      var anonymousState__temp = !(0, _index3.isEmpty)(ad);
      if (anonymousState__temp) {
        _$adData = ad.adInfo;
        _$extraClass = '';

        if (from === 'list') {
          _$extraClass = 'full';
        } else if (from === 'detail') {
          _$extraClass = 'mini';
        }
      }
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        _$extraClass: _$extraClass,
        _$adData: _$adData
      });
      return this.__state;
    }
  }]);

  return BannerAD;
}(_index.Component), _class.$$events = ["clickAD", "closeAD"], _class.$$componentPath = "public/mapp_common/marketing/bannerAD/index", _temp2);


BannerAD.defaultProps = {
  pid: 0,
  ad: {},
  close: _index3.NOOP
};

exports.default = BannerAD;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(BannerAD));