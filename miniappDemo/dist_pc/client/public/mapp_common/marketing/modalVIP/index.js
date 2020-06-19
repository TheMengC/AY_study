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

var _api = require("../../utils/api.js");

var _env = require("../../../../constants/env.js");

var _storage = require("../../utils/storage.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var ModalVIP = (_dec = (0, _index3.connect)(function (store) {
  return store.marketingAdInfoReducer;
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(ModalVIP, _BaseComponent);

  function ModalVIP() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ModalVIP);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ModalVIP.__proto__ || Object.getPrototypeOf(ModalVIP)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp4", "ad", "showAutoPayDialog", "_$_$anonymousState__temp", "current"], _this.componentWillMount = function () {
      _this.updateModalVipState(_this.props);
    }, _this.updateModalVipState = function (props) {
      var ad = props[_constants.MARKETING_TYPE.modalVip];

      if (!(0, _index4.isEmpty)(ad) && ad.state !== _constants.AD_STATE.NOT_SHOW && !(0, _index4.isEmpty)(ad.adInfo)) {
        ad.adInfo.map(function (item, index) {
          if (item.pid == ad.currentPid && !(0, _index4.isEmpty)(item.adData)) {
            // 如果是指定的pid
            _this.state.current = index;
            _this.ad = item.adData;
          }
        });
      }
    }, _this.onClickBtn = function (url) {
      _this.closeAD(1);
      var adData = Object.assign({}, _this.ad, { pid: _constants.MARKETING_TYPE.modalVip, modalVipPid: _this.ad.pid });
      (0, _biz.goClick)({
        customType: _constants.AD_TYPE.FUWU_ORDER,
        adData: adData,
        customUrl: url
      });
    }, _this.enterAutoPayIntro = function (linkUrl) {
      (0, _api.api)({
        apiName: 'aiyong.user.autorenew.status.get',
        domain: _env.ENV.hosts.trade,
        method: '/iytrade2/checkAutoRenewConditions',

        callback: function callback(rsp) {
          if (rsp.code == 200) {
            var matchConditions = rsp.data.matchConditions;
            _storage.storage.setItemSync('matchConditions', matchConditions);
            if (matchConditions) {
              _this.pendingLink = linkUrl;
              _this.setState({ showAutoPayDialog: true });
            } else {
              _this.onClickBtn(linkUrl);
            }
          }
        }
      });
    }, _this.clickAutoPayBtn = function (isAuto) {
      if (isAuto) {
        _this.setState({ showAutoPayDialog: false });
      } else {
        // 点了「不了谢谢」
        _this.onClickBtn(_this.pendingLink);
      }
    }, _this.closeAD = function (isBuy) {
      (0, _index5.feedbackClosed)({ adData: _this.ad });
      (0, _action.closeAdByPid)({ pid: _constants.MARKETING_TYPE.modalVip, still: true });
      if (isBuy !== 1 && _index4.TAB_BAR_PAGES.includes((0, _index4.getCurrentPageName)())) {
        (0, _index4.showTabBar)();
      }
    }, _this.anonymousFunc0Map = {}, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ModalVIP, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ModalVIP.prototype.__proto__ || Object.getPrototypeOf(ModalVIP.prototype), "_constructor", this).call(this, props);

      this.state = {
        current: 0,
        showAutoPayDialog: false // 自动续费引导流程弹窗
      };

      this.ad = {}; // 存放点进来的那个广告的广告信息
      this.pendingLink = undefined; // 进入自动续费流程后，把原有link保留一下，以便用户不走自动续费流程后跳转服务市场
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

      return function (current, ad) {
        var anonymousState__temp5 = (0, _index4.isEmpty)(ad.adInfo[current]) || (0, _index4.isEmpty)(ad.adInfo[current].adData);

        if (anonymousState__temp5) {
          return null;
        }
        var body = ad.adInfo[current].adData.user_define.body;
        var loopArray13 = [2, 3, 4].map(function (item, __index0) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };

          var extraClass = '';
          var isAutoRenew = false;
          if (item.$original == body['re-button2']) {
            extraClass = {
              background: "url(" + body['button-image2'] + ")",
              backgroundSize: '100% 100%'
            };
          }
          // if (!isEmpty(body[`btn-type${item}`]) && body[`btn-type${item}`] === '1') {
          //     isAutoRenew = true;
          // }
          var $loopState__temp2 = (0, _index.internal_inline_style)(extraClass);

          var _$indexKey = "cfzzz" + __index0;

          _this2.anonymousFunc0Map[_$indexKey] = function () {
            {
              _this2.onClickBtn(body["btn" + item.$original + "-android-url"]);
            }
          };

          return {
            extraClass: extraClass,
            isAutoRenew: isAutoRenew,
            $loopState__temp2: $loopState__temp2,
            _$indexKey: _$indexKey,
            $original: item.$original
          };
        });
        return {
          loopArray13: loopArray13,
          anonymousState__temp5: anonymousState__temp5,
          body: body
        };
      };
    }

    /*
     * @Description 进入自动续费流程
    */

    /*
     * @Description 点击自动续费引导按钮
    */


    /*
     * @Description 关闭广告
    */

  }, {
    key: "_createData",
    value: function _createData() {
      var _this3 = this;

      var _$_$anonymousState__temp;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var ad = this.__props[_constants.MARKETING_TYPE.modalVip];

      var jsx = null;
      var anonymousState__temp4 = !((0, _index4.isIOS)() || (0, _index4.isEmpty)(ad) || ad.state === _constants.AD_STATE.NOT_SHOW || (0, _index4.isEmpty)(ad.adInfo));
      if (anonymousState__temp4) {
        (0, _index4.hideTabBar)();
        var _state = this.__state,
            current = _state.current,
            showAutoPayDialog = _state.showAutoPayDialog;

        if (showAutoPayDialog) {} else {
          _$_$anonymousState__temp = undefined;
          _$_$anonymousState__temp = this._createBtnsData(__prefix + "cgzzzzzzzz")(current, ad);

          this.anonymousFunc1 = function (a) {
            _this3.setState({ current: a.currentTarget.current });
          };
        }
      }
      Object.assign(this.__state, {
        anonymousState__temp4: anonymousState__temp4,
        ad: ad,
        _$_$anonymousState__temp: _$_$anonymousState__temp
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
  }, {
    key: "anonymousFunc1",
    value: function anonymousFunc1(e) {
      ;
    }
  }]);

  return ModalVIP;
}(_index.Component), _class2.$$events = ["anonymousFunc0", "clickAutoPayBtn", "anonymousFunc1", "closeAD"], _class2.$$componentPath = "public/mapp_common/marketing/modalVIP/index", _temp2)) || _class);
exports.default = ModalVIP;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(ModalVIP));