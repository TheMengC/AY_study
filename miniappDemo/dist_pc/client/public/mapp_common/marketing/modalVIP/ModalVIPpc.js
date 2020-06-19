"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../npm/_tarojs/redux/index.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _action = require("../action.js");

var _index4 = require("../../utils/index.js");

var _index5 = require("../feedback/index.js");

var _biz = require("../utils/biz.js");

var _env = require("../../../../constants/env.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var titleContent = {
  trade: '*升级高级版可享受爱用交易所有高级功能，无需二次付费（短信除外)',
  item: '*升级高级版可享受爱用商品所有高级功能，无需二次付费'
};

var ModalVIPpc = (_dec = (0, _index3.connect)(function (store) {
  return store.marketingAdInfoReducer;
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(ModalVIPpc, _BaseComponent);

  function ModalVIPpc() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ModalVIPpc);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ModalVIPpc.__proto__ || Object.getPrototypeOf(ModalVIPpc)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp6", "loopArray12", "titleContent", "ENV", "tradePcVipList", "ad", "_$_$anonymousState__temp", "_$_$anonymousState__temp2"], _this.componentWillMount = function () {
      _this.updateModalVipState(_this.props);
    }, _this.updateModalVipState = function (props) {
      var ad = props[_constants.MARKETING_TYPE.modalVip];

      if (!(0, _index4.isEmpty)(ad) && ad.state !== _constants.AD_STATE.NOT_SHOW && !(0, _index4.isEmpty)(ad.adInfo)) {
        ad.adInfo.map(function (item) {
          if (item.pid == ad.currentPid && !(0, _index4.isEmpty)(item.adData)) {
            // 如果是指定的pid
            _this.ad = item.adData;
          }
        });
      }
    }, _this.onClickBtn = function (url) {
      _this.closeAD();
      var adData = Object.assign({}, _this.ad, { pid: _constants.MARKETING_TYPE.modalVip });
      (0, _biz.goClick)({
        customType: _constants.AD_TYPE.FUWU_ORDER,
        adData: adData,
        customUrl: url
      });
    }, _this.closeAD = function () {
      (0, _index5.feedbackClosed)({ adData: _this.ad });
      (0, _action.closeAdByPid)({ pid: _constants.MARKETING_TYPE.modalVip, still: true });
    }, _this.changeAd = function (index, pid) {
      if (pid == _this.ad.pid) {
        return;
      }
      (0, _biz.showModalVIP)(pid);
    }, _this.anonymousFunc0Map = {}, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ModalVIPpc, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ModalVIPpc.prototype.__proto__ || Object.getPrototypeOf(ModalVIPpc.prototype), "_constructor", this).call(this, props);

      this.ad = {}; // 存放点进来的那个广告的广告信息
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      this.updateModalVipState(props);
    }

    /*
     * @Description 更新currentpid方法
    */


    /*
     * @Description 支付按钮点击事件
    */

  }, {
    key: "_createBtnsData",


    /*
     * @Description 渲染售卖按钮
    */

    value: function _createBtnsData(_$uid) {
      var _this2 = this;

      return function (adInfo) {
        var body = adInfo.adData.user_define.body;
        var loopArray11 = [2, 3, 4].map(function (item, __index0) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };

          var extraClass = '';
          if (item.$original - 1 == body['re-button']) {
            extraClass = {
              background: "url(" + body['button-image'] + ")",
              backgroundSize: '100% 100%',
              backgroundColor: 'unset'
            };
          }

          var $loopState__temp2 = (0, _index.internal_inline_style)(extraClass);

          var _$indexKey = "cczzz" + __index0;

          _this2.anonymousFunc0Map[_$indexKey] = function () {
            _this2.onClickBtn(body["btn" + item.$original + "-url"]);
          };

          var $loopState__temp10 = (0, _index4.isEmpty)(body["btn" + item.$original + "-text"]);
          return {
            extraClass: extraClass,
            $loopState__temp2: $loopState__temp2,
            _$indexKey: _$indexKey,
            $loopState__temp10: $loopState__temp10,
            $original: item.$original
          };
        });
        return {
          loopArray11: loopArray11,
          body: body
        };
      };
    }

    /*
     * @Description 关闭广告
    */

  }, {
    key: "_createAdImgData",
    value: function _createAdImgData(_$uid) {
      return function (adInfo) {
        if ((0, _index4.isEmpty)(adInfo.adData)) {
          // 兜底广告上！
          var userDefine = '{"body":{"service":"我要订购，52元/季度 https://tb.cn/4P2hmbw \\r\\n  138元/年 https://tb.cn/Wdwgmbw\\r\\n","re-button":"0","btn2-text":"52元/季度","btn2-url":"https://tb.cn/4P2hmbw","btn3-text":"138元/年","btn3-url":"https://tb.cn/Wdwgmbw","ad-text":"升级高级版","button-image":""}}';
          adInfo.adData = {
            'img_path': 'http://q.aiyongbao.com/trade/web/images/Intelligence.png',
            'creative_name': '兜底创意',
            'img_size': '500*400',
            'user_define': JSON.parse(userDefine),
            pid: '10101',
            creative_id: '0000',
            open_id: '000000' // 埋点要用的
          };
        }
        var _adInfo$adData = adInfo.adData,
            img_size = _adInfo$adData.img_size,
            img_path = _adInfo$adData.img_path;

        var width = !(0, _index4.isEmpty)(img_size) ? img_size.split('*')[0] + 'px' : 500;
        var height = !(0, _index4.isEmpty)(img_size) ? img_size.split('*')[1] + 'px' : 400;
        var anonymousState__temp3 = (0, _index.internal_inline_style)({ width: width, height: height });
        return {
          anonymousState__temp3: anonymousState__temp3,
          img_path: img_path
        };
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _$_$adInfo, _$_$anonymousState__temp, _$_$anonymousState__temp2;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;
      var loopArray12 = void 0;

      var ad = this.__props[_constants.MARKETING_TYPE.modalVip];

      var jsx = null;
      var anonymousState__temp6 = !((0, _index4.isEmpty)(ad) || ad.state === _constants.AD_STATE.NOT_SHOW || (0, _index4.isEmpty)(ad.adInfo));
      if (anonymousState__temp6) {
        _$_$anonymousState__temp2 = undefined;
        _$_$adInfo = ad.adInfo[0];
        _$_$anonymousState__temp = this._createAdImgData(__prefix + "cdzzzzzzzz")(_$_$adInfo);
        _$_$anonymousState__temp2 = this._createBtnsData(__prefix + "cezzzzzzzz")(_$_$adInfo);
        loopArray12 = _constants.tradePcVipList.map(function (item, index) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };
          var $loopState__temp8 = (0, _index.internal_inline_style)({ color: item.$original.pid == ad.currentPid ? 'rgb(74, 144, 226)' : 'black' });
          return {
            _$adInfo: _$_$adInfo,
            _$anonymousState__temp: _$_$anonymousState__temp,
            _$anonymousState__temp2: _$_$anonymousState__temp2,
            $loopState__temp8: $loopState__temp8,
            $original: item.$original
          };
        });
      }
      Object.assign(this.__state, {
        anonymousState__temp6: anonymousState__temp6,
        loopArray12: loopArray12,
        titleContent: titleContent,
        ENV: _env.ENV,
        tradePcVipList: _constants.tradePcVipList,
        ad: ad,
        _$_$anonymousState__temp: _$_$anonymousState__temp,
        _$_$anonymousState__temp2: _$_$anonymousState__temp2
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

  return ModalVIPpc;
}(_index.Component), _class2.$$events = ["anonymousFunc0", "closeAD", "changeAd"], _class2.$$componentPath = "public/mapp_common/marketing/modalVIP/ModalVIPpc", _temp2)) || _class);
exports.default = ModalVIPpc;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(ModalVIPpc));