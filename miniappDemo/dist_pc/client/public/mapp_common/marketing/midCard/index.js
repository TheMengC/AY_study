"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../utils/index.js");

var _userInfoChanger = require("../../utils/userInfoChanger.js");

var _env = require("../../../../constants/env.js");

var _biz = require("../utils/biz.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _index4 = require("../feedback/index.js");

var _action = require("../action.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var MidCard = (_temp2 = _class = function (_BaseComponent) {
  _inherits(MidCard, _BaseComponent);

  function MidCard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MidCard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MidCard.__proto__ || Object.getPrototypeOf(MidCard)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "_$hotSpace", "_$anonymousState__temp", "_$anonymousState__temp2", "_$anonymousState__temp3", "_$anonymousState__temp4", "loopArray15", "isEmpty", "_$anonymousState__temp5", "ad", "pid", "close"], _this.getHotSpace = function (ad) {
      var hotData = [];
      if (!(0, _index3.isEmpty)(ad) && !(0, _index3.isEmpty)(ad.adInfo) && !(0, _index3.isEmpty)(ad.adInfo.user_define) && !(0, _index3.isEmpty)(ad.adInfo.user_define.body)) {
        var body = ad.adInfo.user_define.body;
        var hotspace = body.hotspace;

        for (var i = 1; i <= hotspace; i++) {
          var space = body["hotspace" + i];
          if (!(0, _index3.isEmpty)(space)) {
            hotData.push({
              left: space.split(',')[0] *= 0.72,
              top: space.split(',')[1] *= 0.72,
              width: space.split(',')[2] *= 0.72,
              height: space.split(',')[3] *= 0.72,
              url: body["hotspace" + i + "-url"]
            });
          }
        }
      }
      return hotData;
    }, _this.onClickHotSpace = function (customUrl) {
      var ad = _this.props.ad;

      (0, _biz.goClick)({
        customType: _constants.AD_TYPE.FUWU_ORDER,
        customUrl: customUrl,
        adData: ad.adInfo
      });
      _this.closeAD();
    }, _this.closeAD = function () {
      var _this$props = _this.props,
          pid = _this$props.pid,
          ad = _this$props.ad,
          close = _this$props.close;

      (0, _index4.feedbackClosed)({ adData: ad.adInfo });
      (0, _action.closeAdByPid)({ pid: pid });
      close();
    }, _this.startTimer = function () {
      if ((0, _index3.isEmpty)(_this.timer)) {
        _this.timer = setTimeout(function () {
          _this.closeAD();
        }, 30000);
      }
    }, _this.anonymousFunc0Map = {}, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MidCard, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(MidCard.prototype.__proto__ || Object.getPrototypeOf(MidCard.prototype), "_constructor", this).call(this, props);
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 获取处理后的坐标
    */


    /*
     * @Description 点击热区
    */


    /*
     * @Description 关闭广告
    */


    /*
     * @Description 开启一个倒计时，30秒之后自动关闭
    */

  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      var _$hotSpace, _$anonymousState__temp, _$anonymousState__temp2, _$anonymousState__temp3, _$anonymousState__temp4, _$anonymousState__temp5;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;
      var loopArray15 = void 0;

      var ad = this.__props.ad;

      var anonymousState__temp = !(0, _index3.isEmpty)(ad);
      if (anonymousState__temp) {
        _$hotSpace = this.getHotSpace(ad);

        var img_path = ad.adInfo.img_path;

        this.startTimer();
        _$anonymousState__temp = (0, _index.internal_inline_style)({ backgroundImage: "url(" + img_path + ")" });
        _$anonymousState__temp2 = (0, _userInfoChanger.getUserInfo)().avatar;
        _$anonymousState__temp3 = (0, _userInfoChanger.getUserInfo)().userNick;
        _$anonymousState__temp4 = _env.ENV.appName + "\u9AD8\u7EA7\u7248 \u5269\u4F59" + (0, _userInfoChanger.getUserInfo)().vipRemain + "\u5929\u5230\u671F\uFF0C\u8D2D\u4E70\u540E\u6709\u6548\u671F\u987A\u5EF6";
        _$anonymousState__temp5 = !(0, _index3.isEmpty)(_$hotSpace);
        loopArray15 = !(0, _index3.isEmpty)(_$hotSpace) ? _$hotSpace.map(function (hotItem, __index0) {
          hotItem = {
            $original: (0, _index.internal_get_original)(hotItem)
          };
          var $loopState__temp7 = !(0, _index3.isEmpty)(_$hotSpace) ? (0, _index.internal_inline_style)({
            position: 'absolute',
            cursor: 'pointer',
            top: hotItem.$original.top,
            left: hotItem.$original.left,
            height: hotItem.$original.height,
            width: hotItem.$original.width
          }) : null;

          var _$indexKey = "chzzz" + __index0;

          _this2.anonymousFunc0Map[_$indexKey] = function () {
            _this2.onClickHotSpace(hotItem.$original.url);
          };

          return {
            img_path: img_path,
            $loopState__temp7: $loopState__temp7,
            _$indexKey: _$indexKey,
            $original: hotItem.$original
          };
        }) : [];
      }
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        _$hotSpace: _$hotSpace,
        _$anonymousState__temp: _$anonymousState__temp,
        _$anonymousState__temp2: _$anonymousState__temp2,
        _$anonymousState__temp3: _$anonymousState__temp3,
        _$anonymousState__temp4: _$anonymousState__temp4,
        loopArray15: loopArray15,
        isEmpty: _index3.isEmpty,
        _$anonymousState__temp5: _$anonymousState__temp5
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(_$indexKey) {
      var _anonymousFunc0Map;

      ;

      for (var _len2 = arguments.length, e = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        e[_key2 - 1] = arguments[_key2];
      }

      return this.anonymousFunc0Map[_$indexKey] && (_anonymousFunc0Map = this.anonymousFunc0Map)[_$indexKey].apply(_anonymousFunc0Map, e);
    }
  }]);

  return MidCard;
}(_index.Component), _class.$$events = ["closeAD", "anonymousFunc0"], _class.$$componentPath = "public/mapp_common/marketing/midCard/index", _temp2);
exports.default = MidCard;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(MidCard));