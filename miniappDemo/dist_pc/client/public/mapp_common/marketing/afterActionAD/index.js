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

var _constants = require("../../../tradePublic/marketing/constants.js");

var _action = require("../action.js");

var _index4 = require("../feedback/index.js");

var _userInfoChanger = require("../../utils/userInfoChanger.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var AfterActionAD = (_temp2 = _class = function (_BaseComponent) {
  _inherits(AfterActionAD, _BaseComponent);

  function AfterActionAD() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AfterActionAD);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AfterActionAD.__proto__ || Object.getPrototypeOf(AfterActionAD)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "flag_image", "isModal", "symbol", "anonymousState__temp", "anonymousState__temp2", "canClose", "close_icon", "later_float", "title", "caption", "later_text", "state", "pid", "ad", "close"], _this.goLink = function (url) {
      _this.closeAD();
      (0, _biz.goClick)({
        customType: _constants.AD_TYPE.FUWU_ORDER,
        adData: _this.ad,
        customUrl: url
      });
    }, _this.goToBall = function () {
      (0, _action.triggerAdInfoByPid)({
        pid: _this.props.pid,
        state: _constants.AD_STATE.AFTER_ACTION_BALL,
        type: _constants.MARKETING_TYPE.afterAction
      });
    }, _this.backToModal = function () {
      _this.canClose = true;
      (0, _action.triggerAdInfoByPid)({
        pid: _this.props.pid,
        state: _constants.AD_STATE.AFTER_ACTION_MODAL,
        type: _constants.MARKETING_TYPE.afterAction
      });
    }, _this.closeAD = function () {
      var _this$props = _this.props,
          pid = _this$props.pid,
          ad = _this$props.ad,
          close = _this$props.close;

      (0, _index4.feedbackClosed)({ adData: ad.adInfo });
      (0, _action.closeAdByPid)({ pid: pid });
      close();
    }, _this.anonymousFunc0Map = {}, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AfterActionAD, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AfterActionAD.prototype.__proto__ || Object.getPrototypeOf(AfterActionAD.prototype), "_constructor", this).call(this, props);

      this.shouldRenderLongBtn = false;
      this.ad = undefined;
      this.canClose = false;
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var userInfo = (0, _userInfoChanger.getUserInfo)();
      if (userInfo.vipflag == 3) {
        return;
      }
    }

    /*
     * @Description 渲染事后续费的图片
    */

  }, {
    key: "_createMiddleImgData",
    value: function _createMiddleImgData(_$uid) {
      var _this2 = this;

      return function () {
        var _ad$user_define$body = _this2.ad.user_define.body,
            icon1 = _ad$user_define$body.icon1,
            icon1_title = _ad$user_define$body.icon1_title,
            icon2 = _ad$user_define$body.icon2,
            icon2_title = _ad$user_define$body.icon2_title,
            icon3 = _ad$user_define$body.icon3,
            icon3_title = _ad$user_define$body.icon3_title;

        icon1 = (0, _index3.removeImgHttp)(icon1);
        icon2 = (0, _index3.removeImgHttp)(icon2);
        icon3 = (0, _index3.removeImgHttp)(icon3);
        var imgArr = [{
          Image: icon1,
          title: icon1_title
        }, {
          Image: icon2,
          title: icon2_title
        }, {
          Image: icon3,
          title: icon3_title
        }];
        return {
          imgArr: imgArr
        };
      };
    }

    /*
     * @Description 渲染事后续费的按钮
    */

  }, {
    key: "_createModalBtnsData",
    value: function _createModalBtnsData(_$uid) {
      var _this3 = this;

      return function () {
        var btnArr = void 0;
        var _ad$user_define$body2 = _this3.ad.user_define.body,
            btn1_text = _ad$user_define$body2.btn1_text,
            btn1_url = _ad$user_define$body2.btn1_url,
            btn2_text = _ad$user_define$body2.btn2_text,
            btn2_url = _ad$user_define$body2.btn2_url,
            long_btn_text = _ad$user_define$body2.long_btn_text,
            long_btn_url = _ad$user_define$body2.long_btn_url;

        if (_this3.shouldRenderLongBtn) {
          btnArr = [{
            text: long_btn_text,
            url: long_btn_url
          }];
        } else {
          btnArr = [{
            text: btn2_text,
            url: btn2_url
          }, {
            text: btn1_text,
            url: btn1_url
          }];
        }
        var loopArray9 = btnArr.map(function (item, __index0) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };

          var _$indexKey = "bizzz" + __index0;

          _this3.anonymousFunc0Map[_$indexKey] = function () {
            return _this3.goLink(item.$original.url);
          };

          return {
            _$indexKey: _$indexKey,
            $original: item.$original
          };
        });
        return {
          loopArray9: loopArray9,
          btnArr: btnArr
        };
      };
    }

    /*
     * @Description 点击按钮事件
    */

    /*
     * @Description 从弹窗广告缩到球球，并且记录状态
    */


    /*
     * @Description 从球球还原成弹窗广告
    */


    /*
     * @Description 完全关闭弹窗
    */

  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      var canClose = this.canClose;
      var ad = this.__props.ad;

      var anonymousState__temp5 = (0, _index3.isEmpty)(ad);
      if (anonymousState__temp5) {
        return null;
      }
      var state = ad.state;
      var adInfo = ad.adInfo;

      this.ad = adInfo;
      var adData = adInfo.user_define.body;
      var caption = adData.caption,
          close_icon = adData.close_icon,
          btn2_url = adData.btn2_url,
          flag_image = adData.flag_image,
          later_text = adData.later_text,
          symbol = adData.symbol,
          title = adData.title,
          later_float = adData.later_float,
          long_btn_text = adData.long_btn_text;

      var isModal = state === _constants.AD_STATE.AFTER_ACTION_MODAL;
      var suggest = null;
      flag_image = (0, _index3.removeImgHttp)(flag_image);
      close_icon = (0, _index3.removeImgHttp)(close_icon);
      symbol = (0, _index3.removeImgHttp)(symbol);
      var anonymousState__temp3 = !(0, _index3.isEmpty)(flag_image);
      if (anonymousState__temp3) {}
      this.shouldRenderLongBtn = !(0, _index3.isEmpty)(long_btn_text);
      var anonymousState__temp = isModal ? this._createMiddleImgData(__prefix + "bjzzzzzzzz")() : null;
      var anonymousState__temp2 = isModal ? this._createModalBtnsData(__prefix + "cazzzzzzzz")() : null;
      var anonymousState__temp4 = isModal ? !(0, _index3.isEmpty)(suggest) && !this.shouldRenderLongBtn ? suggest : null : null;
      Object.assign(this.__state, {
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        flag_image: flag_image,
        isModal: isModal,
        symbol: symbol,
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        canClose: canClose,
        close_icon: close_icon,
        later_float: later_float,
        title: title,
        caption: caption,
        later_text: later_text,
        state: state
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

  return AfterActionAD;
}(_index.Component), _class.$$events = ["anonymousFunc0", "closeAD", "goToBall", "backToModal"], _class.$$componentPath = "public/mapp_common/marketing/afterActionAD/index", _temp2);


AfterActionAD.defaultProps = {
  pid: 0,
  ad: {},
  close: _index3.NOOP
};

exports.default = AfterActionAD;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(AfterActionAD));