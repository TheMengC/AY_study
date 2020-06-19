"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _biz = require("../utils/biz.js");

var _index3 = require("../../utils/index.js");

var _action = require("../action.js");

var _index4 = require("../feedback/index.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _systemInfo = require("../../utils/systemInfo.js");

var _env = require("../../../../constants/env.js");

var _beacon = require("../../utils/beacon.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var ModalAD = (_temp2 = _class = function (_BaseComponent) {
  _inherits(ModalAD, _BaseComponent);

  function ModalAD() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ModalAD);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ModalAD.__proto__ || Object.getPrototypeOf(ModalAD)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp5", "_$anonymousState__temp3", "_$_$anonymousState__temp", "_$_$anonymousState__temp2", "adInfo", "countdown", "pid", "ad", "close", "from", "type", "width", "height"], _this.closeModal = function (isClick) {
      var _this$props = _this.props,
          pid = _this$props.pid,
          ad = _this$props.ad,
          close = _this$props.close;

      (0, _index4.feedbackClosed)({ adData: ad.adInfo });
      (0, _action.closeAdByPid)({ pid: pid });
      close();
      if (isClick !== 1 || (0, _index3.isIOS)()) {
        (0, _index3.showTabBar)();
      }
    }, _this.highAdBeacon = function (type) {
      var _this$props2 = _this.props,
          pid = _this$props2.pid,
          from = _this$props2.from;
      var app = _env.ENV.app;

      var _getSystemInfo = (0, _systemInfo.getSystemInfo)(),
          platform = _getSystemInfo.platform;

      var level = 'high';
      if (_constants.CONST_PIDS[app][platform]['high'][from] == pid) {
        if (type === _constants.MARKET_BEACON_CONST.show && _this.hadBeacon === 0) {
          _this.hadBeacon = 1;
          (0, _beacon.marketingBeacon)(type, pid, level);
          // 顺便把tabbar藏起来~
          (0, _index3.hideTabBar)();
        } else if (type === _constants.MARKET_BEACON_CONST.click) {
          (0, _beacon.marketingBeacon)(type, pid, level);
        }
      }
    }, _this.midAdBeacon = function () {
      var pid = _this.props.pid;

      (0, _beacon.marketingBeacon)(_constants.MARKET_BEACON_CONST.second, pid, 'midModal');
    }, _this.handleClickAD = function () {
      if (_this.ad && _this.ad.user_define && _this.ad.user_define.body.hotspace) {
        // 有hotspace时就是热区广告来了，图片就点击不了
        return;
      }
      var type = _this.props.type;

      var goClickArgs = {
        adData: _this.ad,
        callback: function callback() {
          // 如果是ios用户，不要显示付款提示框哦
          _this.closeModal(!(0, _index3.isIOS)());
        }
      };
      if (type === _constants.MARKETING_TYPE.commonModal && (0, _index3.isIOS)()) {
        goClickArgs.customType = _constants.AD_TYPE.CONTACT_KEFU;
        goClickArgs.customContent = _this.ad.user_define.body.talk_content;
        _this.midAdBeacon();
      }
      _this.highAdBeacon(_constants.MARKET_BEACON_CONST.click);
      (0, _biz.goClick)(goClickArgs);
    }, _this.anonymousFunc0Map = {}, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ModalAD, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ModalAD.prototype.__proto__ || Object.getPrototypeOf(ModalAD.prototype), "_constructor", this).call(this, props);
      this.state = { countdown: -1 };
      this.hadBeacon = 0;
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 关闭弹窗
    */

  }, {
    key: "_createCloseBoxData",


    /*
     * @Description 渲染关闭按钮
    */

    value: function _createCloseBoxData(_$uid) {
      var _this2 = this;

      return function (countdown) {
        if (countdown) {
          setTimeout(function () {
            _this2.setState({ countdown: --countdown });
          }, 1000);
        }
        return {
          countdown: countdown
        };
      };
    }

    /*
     * @Description 强提示埋点
    */

    /*
     * @Description 中提示二次弹窗的埋点
    */


    /*
     * @Description 点击广告事件
    */

  }, {
    key: "_createButsData",


    /*
     * @Description 根据request渲染按钮
    */

    value: function _createButsData(_$uid) {
      var _this3 = this;

      return function () {
        var _$coordata;

        var anonymousState__temp7 = (0, _index3.isEmpty)(_this3.ad);

        if (anonymousState__temp7) {
          return null;
        }
        var bodyData = _this3.ad.user_define.body;
        var hotSpace = bodyData.hotspace ? bodyData.hotspace : 0;
        if (!hotSpace) {
          return null;
        }
        var hotSpaceNumArr = [];
        for (var i = 1; i <= hotSpace; i++) {
          hotSpaceNumArr.push(i);
        }
        var loopArray5 = hotSpaceNumArr.map(function (item, __index0) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };
          var $loopState__temp2 = null;

          var _$indexKey = "bczzz" + __index0;

          _this3.anonymousFunc0Map[_$indexKey] = function () {
            _this3.highAdBeacon(_constants.MARKET_BEACON_CONST.click);
            (0, _biz.goClick)({
              customUrl: bodyData["hotspace" + item.$original + "-url"],
              adData: _this3.ad,
              callback: function callback() {
                _this3.closeModal();
              }
            });
          };

          if (bodyData["hotspace" + item.$original]) {
            _$coordata = bodyData["hotspace" + item.$original].split(','); // 坐标和按钮的尺寸数据

            $loopState__temp2 = (0, _index.internal_inline_style)({
              position: 'absolute',
              left: _$coordata[0] + "rpx",
              top: _$coordata[1] + "rpx",
              width: _$coordata[2] + "rpx",
              height: _$coordata[3] + "rpx"
            });
          }
          return {
            $loopState__temp2: $loopState__temp2,
            _$indexKey: _$indexKey,
            $original: item.$original
          };
        });
        return {
          loopArray5: loopArray5,
          anonymousState__temp7: anonymousState__temp7,
          hotSpace: hotSpace,
          hotSpaceNumArr: hotSpaceNumArr,
          bodyData: bodyData
        };
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _$anonymousState__temp3, _$_$anonymousState__temp, _$_$anonymousState__temp2, _$showCount;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _props = this.__props,
          width = _props.width,
          height = _props.height,
          ad = _props.ad;

      var jsx = null;
      var adInfo = {};
      var anonymousState__temp5 = !(0, _index3.isEmpty)(ad);
      if (anonymousState__temp5) {
        _$_$anonymousState__temp2 = undefined;

        this.highAdBeacon(_constants.MARKET_BEACON_CONST.show);
        adInfo = ad.adInfo;
        var countdown = adInfo.user_define.body.countdown;
        var currentCount = this.__state.countdown;

        _$showCount = undefined;

        if (countdown == 0 || currentCount === -1) {
          // 此时还没开始倒计时/不需要倒计时，使用广告信息中的倒计时
          _$showCount = countdown;
        } else {
          // 证明倒计时结束啦
          _$showCount = currentCount;
        }
        this.ad = adInfo;
        _$_$anonymousState__temp = this._createButsData(__prefix + "bdzzzzzzzz")();
        _$_$anonymousState__temp2 = this._createCloseBoxData(__prefix + "bezzzzzzzz")(_$showCount);
        _$anonymousState__temp3 = (0, _index.internal_inline_style)({ width: width + "rpx", height: height + "rpx" });
      }
      Object.assign(this.__state, {
        anonymousState__temp5: anonymousState__temp5,
        _$anonymousState__temp3: _$anonymousState__temp3,
        _$_$anonymousState__temp: _$_$anonymousState__temp,
        _$_$anonymousState__temp2: _$_$anonymousState__temp2,
        adInfo: adInfo
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

  return ModalAD;
}(_index.Component), _class.$$events = ["closeModal", "anonymousFunc0", "handleClickAD"], _class.$$componentPath = "public/mapp_common/marketing/modalAD/index", _temp2);


ModalAD.defaultProps = {
  pid: 0,
  width: 600,
  height: 720,
  close: _index3.NOOP
};

exports.default = ModalAD;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(ModalAD));