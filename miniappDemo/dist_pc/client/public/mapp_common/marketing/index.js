"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _constants = require("../../tradePublic/marketing/constants.js");

var _env = require("../../../constants/env.js");

var _systemInfo = require("../utils/systemInfo.js");

var _action = require("./action.js");

var _index3 = require("../utils/index.js");

var _index4 = require("../../../npm/_tarojs/redux/index.js");

var _biz = require("./utils/biz.js");

var _navigator = require("../../tradePublic/marketing/navigator.js");

var marketingPublic = _interopRequireWildcard(_navigator);

var _utils = require("../../tradePublic/utils.js");

var _userInfoChanger = require("../utils/userInfoChanger.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var Marketing = (_dec = (0, _index4.connect)(function (store) {
  return store.marketingAdInfoReducer;
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Marketing, _BaseComponent);

  function Marketing() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Marketing);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Marketing.__proto__ || Object.getPrototypeOf(Marketing)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["hasPid", "anonymousState__temp5", "_$_$anonymousState__temp", "showPayResult", "_$_$anonymousState__temp2", "showAD", "_$_$anonymousState__temp3", "currentPid", "from", "type", "pid", "width", "height", "key"], _this.componentWillMount = function () {
      var type = _this.props.type;

      switch (type) {
        case _constants.MARKETING_TYPE.modal:
        case _constants.MARKETING_TYPE.midModal:
        case _constants.MARKETING_TYPE.midCoupon:
        case _constants.MARKETING_TYPE.notice:
        case _constants.MARKETING_TYPE.banner:
        case _constants.MARKETING_TYPE.midCard:
          {
            _this.navigatorCommonRule();
            break;
          }
        case _constants.MARKETING_TYPE.afterAction:
          {
            _this.navigatorAfterAction();
            break;
          }
        case _constants.MARKETING_TYPE.commonModal:
          {
            _this.navigatorCommonModal();
            break;
          }
      }
    }, _this.componentWillReceiveProps = function (props) {
      var type = props.type;

      if (type === _constants.MARKETING_TYPE.modalVip) {
        _this.navigatorModalVip(props);
      } else if (type === _constants.MARKETING_TYPE.afterAction) {
        _this.showAfterAction(props);
      }
    }, _this.shouldComponentUpdate = function (newProps, newState) {
      if (_this.state.showAD === false && newState.showAD === false && newState.showPayResult === false) {
        // 如果压根就没有渲染出来，就别凑热闹啦
        return false;
      } else if ((0, _index3.isEmpty)(newState.currentPid)) {
        if ((0, _index3.isEmpty)(_this.state.currentPid)) {
          // 如果新的旧的pid都没有，那就不渲染了
          return false;
        }
      } else if (_this.props.type !== _constants.MARKETING_TYPE.modalVip) {
        // 对于非modalvip的情况，只要没动我，我就不更改
        var oldPid = _this.state.currentPid;
        var newPid = newState.currentPid;

        var oldAd = _this.props[(0, _utils.getKeyName)(oldPid)];

        var newAd = newProps[(0, _utils.getKeyName)(newPid)];

        if (oldAd == newAd) {
          // 如果俺的redux并没有变，那就别更新啦
          return false;
        }
      }
    }, _this.navigatorCommonRule = function () {
      var adRenderRule = _constants.navigatorConst[_this.props.type];
      if ((0, _index3.isEmpty)(adRenderRule)) {
        return;
      }
      var pid = marketingPublic[adRenderRule.pidFunc](_this.from);
      if (!(0, _index3.isEmpty)(pid)) {
        // 如果有pid的话，冲冲冲
        _this.openAd({
          pid: pid,
          state: adRenderRule.state,
          type: adRenderRule.type
        });
      }
    }, _this.navigatorAfterAction = function () {
      var pid = marketingPublic.shouldAfterAction(_this.props);
      if (!(0, _index3.isEmpty)(pid)) {
        _this.openAd({
          pid: pid,
          state: _constants.AD_STATE.AFTER_ACTION_BALL,
          type: _constants.MARKETING_TYPE.afterAction
        });
      }
    }, _this.navigatorCommonModal = function () {
      var pid = _this.props.pid;

      _this.openAd({
        pid: pid,
        state: _constants.AD_STATE.SHOULD_SHOW,
        type: _constants.MARKETING_TYPE.modal
      });
    }, _this.showAfterAction = function (props) {
      var adReturn = marketingPublic.triggerShowAfterAction(props, _this.state);
      if (!(0, _index3.isEmpty)(adReturn)) {
        var pid = (0, _biz.getRealPid)(adReturn.pid);
        _this.openAd({
          pid: pid,
          state: adReturn.state,
          type: _constants.MARKETING_TYPE.afterAction
        });
      }
    }, _this.navigatorModalVip = function (props) {
      var ad = props[_constants.MARKETING_TYPE.modalVip];
      var _this$state = _this.state,
          showAD = _this$state.showAD,
          currentPid = _this$state.currentPid;

      if (!(0, _index3.isEmpty)(ad) && !(0, _index3.isEmpty)(ad.adInfo) && !showAD && (0, _index3.isEmpty)(currentPid)) {
        _this.setState({
          showAD: true,
          currentPid: _constants.MARKETING_TYPE.modalVip
        });
      }
    }, _this.openAd = function (_ref2) {
      var pid = _ref2.pid,
          state = _ref2.state,
          type = _ref2.type;

      (0, _action.triggerAdInfoByPid)({
        pid: pid,
        state: state,
        type: type,
        callback: function callback(show) {
          if (show) {
            _this.setState({
              showAD: true,
              currentPid: pid
            });
          }
        }
      });
    }, _this.close = function () {
      _this.setState({ showAD: false });
    }, _this.show = function () {
      _this.setState({ showAD: true });
    }, _this.getProps = function (ad) {
      var _this$props = _this.props,
          width = _this$props.width,
          height = _this$props.height,
          from = _this$props.from;
      var _this2 = _this,
          close = _this2.close;
      var currentPid = _this.state.currentPid;

      return {
        pid: currentPid,
        width: width,
        height: height,
        close: close,
        ad: ad,
        from: from
      };
    }, _this.customComponents = ["ModalADpc", "ModalAD", "BannerADpc", "BannerAD", "AfterActionADpc", "AfterActionAD", "RenewBoxPC", "RenewBox", "MidCouponPC", "MidCoupon", "NoticePC", "Notice", "ModalVIPpc", "ModalVIP", "MidCard", "PayResultPC", "PayResult"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Marketing, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Marketing.prototype.__proto__ || Object.getPrototypeOf(Marketing.prototype), "_constructor", this).call(this, props);
      this.state = {
        showAD: false,
        currentPid: undefined // 因为部分运营类的组件可能出现「同一页面切换pid广告」的情况（如事后续费），所以pid需要可控
      };

      this.from = this.props.from;
      this.app = _env.ENV.app;
      this.platform = (0, _systemInfo.getSystemInfo)().platform;
      this.vipFlag = (0, _userInfoChanger.getUserInfo)().vipFlag;
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 克制一下渲染~
     */


    /*
     * @Description 统一的marketing的willmount逻辑
     */


    /*
     * @Description 判断事后续费的逻辑
     */


    /*
     * @Description 常规广告渲染
     */


    /*
     * @Description 展现事后续费弹窗
     */


    /*
     * @Description 渲染modalVIP逻辑
     */


    /*
     * @Description 打开相应广告
     */


    /*
     * @Description 广告的关闭事件
     */


    /*
     * @Description 广告的外部展现事件
     */

  }, {
    key: "_createMarktingModalData",


    /*
     * @Description 把广告展现出来~
     */

    value: function _createMarktingModalData(_$uid) {
      var _this3 = this;

      return function (ad) {
        var _genCompid = (0, _index.genCompid)(_$uid + "$compid__4"),
            _genCompid2 = _slicedToArray(_genCompid, 2),
            $prevCompid__4 = _genCompid2[0],
            $compid__4 = _genCompid2[1];

        var _genCompid3 = (0, _index.genCompid)(_$uid + "$compid__5"),
            _genCompid4 = _slicedToArray(_genCompid3, 2),
            $prevCompid__5 = _genCompid4[0],
            $compid__5 = _genCompid4[1];

        var _genCompid5 = (0, _index.genCompid)(_$uid + "$compid__6"),
            _genCompid6 = _slicedToArray(_genCompid5, 2),
            $prevCompid__6 = _genCompid6[0],
            $compid__6 = _genCompid6[1];

        var _genCompid7 = (0, _index.genCompid)(_$uid + "$compid__7"),
            _genCompid8 = _slicedToArray(_genCompid7, 2),
            $prevCompid__7 = _genCompid8[0],
            $compid__7 = _genCompid8[1];

        var _genCompid9 = (0, _index.genCompid)(_$uid + "$compid__8"),
            _genCompid10 = _slicedToArray(_genCompid9, 2),
            $prevCompid__8 = _genCompid10[0],
            $compid__8 = _genCompid10[1];

        var _genCompid11 = (0, _index.genCompid)(_$uid + "$compid__9"),
            _genCompid12 = _slicedToArray(_genCompid11, 2),
            $prevCompid__9 = _genCompid12[0],
            $compid__9 = _genCompid12[1];

        var _genCompid13 = (0, _index.genCompid)(_$uid + "$compid__10"),
            _genCompid14 = _slicedToArray(_genCompid13, 2),
            $prevCompid__10 = _genCompid14[0],
            $compid__10 = _genCompid14[1];

        var _genCompid15 = (0, _index.genCompid)(_$uid + "$compid__11"),
            _genCompid16 = _slicedToArray(_genCompid15, 2),
            $prevCompid__11 = _genCompid16[0],
            $compid__11 = _genCompid16[1];

        var _genCompid17 = (0, _index.genCompid)(_$uid + "$compid__12"),
            _genCompid18 = _slicedToArray(_genCompid17, 2),
            $prevCompid__12 = _genCompid18[0],
            $compid__12 = _genCompid18[1];

        var _genCompid19 = (0, _index.genCompid)(_$uid + "$compid__13"),
            _genCompid20 = _slicedToArray(_genCompid19, 2),
            $prevCompid__13 = _genCompid20[0],
            $compid__13 = _genCompid20[1];

        var _genCompid21 = (0, _index.genCompid)(_$uid + "$compid__14"),
            _genCompid22 = _slicedToArray(_genCompid21, 2),
            $prevCompid__14 = _genCompid22[0],
            $compid__14 = _genCompid22[1];

        var _genCompid23 = (0, _index.genCompid)(_$uid + "$compid__15"),
            _genCompid24 = _slicedToArray(_genCompid23, 2),
            $prevCompid__15 = _genCompid24[0],
            $compid__15 = _genCompid24[1];

        var _genCompid25 = (0, _index.genCompid)(_$uid + "$compid__16"),
            _genCompid26 = _slicedToArray(_genCompid25, 2),
            $prevCompid__16 = _genCompid26[0],
            $compid__16 = _genCompid26[1];

        var _genCompid27 = (0, _index.genCompid)(_$uid + "$compid__17"),
            _genCompid28 = _slicedToArray(_genCompid27, 2),
            $prevCompid__17 = _genCompid28[0],
            $compid__17 = _genCompid28[1];

        var _genCompid29 = (0, _index.genCompid)(_$uid + "$compid__18"),
            _genCompid30 = _slicedToArray(_genCompid29, 2),
            $prevCompid__18 = _genCompid30[0],
            $compid__18 = _genCompid30[1];

        var type = _this3.props.type;

        var jsx = null;
        var flag = (0, _index3.isPC)();
        if (type === _constants.MARKETING_TYPE.modal || type === _constants.MARKETING_TYPE.commonModal) {
          if (flag) {
            propsManager.set(_extends({
              "type": type
            }, _this3.getProps(ad)), $compid__4, $prevCompid__4);
          } else {
            propsManager.set(_extends({
              "type": type
            }, _this3.getProps(ad)), $compid__5, $prevCompid__5);
          }
        } else if (type === _constants.MARKETING_TYPE.banner) {
          if (flag) {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__6, $prevCompid__6);
          } else {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__7, $prevCompid__7);
          }
        } else if (type === _constants.MARKETING_TYPE.afterAction) {
          if (flag) {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__8, $prevCompid__8);
          } else {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__9, $prevCompid__9);
          }
        } else if (type === _constants.MARKETING_TYPE.midModal) {
          if (flag) {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__10, $prevCompid__10);
          } else {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__11, $prevCompid__11);
          }
        } else if (type === _constants.MARKETING_TYPE.midCoupon) {
          if (flag) {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__12, $prevCompid__12);
          } else {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__13, $prevCompid__13);
          }
        } else if (type === _constants.MARKETING_TYPE.notice) {
          if (flag) {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__14, $prevCompid__14);
          } else {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__15, $prevCompid__15);
          }
        } else if (type === _constants.MARKETING_TYPE.modalVip) {
          if (flag) {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__16, $prevCompid__16);
          } else {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__17, $prevCompid__17);
          }
        } else if (type === _constants.MARKETING_TYPE.midCard) {
          // 仅PC有
          if (flag) {
            propsManager.set(_extends({}, _this3.getProps(ad)), $compid__18, $prevCompid__18);
          }
        }
        return {
          $compid__4: $compid__4,
          $compid__5: $compid__5,
          $compid__6: $compid__6,
          $compid__7: $compid__7,
          $compid__8: $compid__8,
          $compid__9: $compid__9,
          $compid__10: $compid__10,
          $compid__11: $compid__11,
          $compid__12: $compid__12,
          $compid__13: $compid__13,
          $compid__14: $compid__14,
          $compid__15: $compid__15,
          $compid__16: $compid__16,
          $compid__17: $compid__17,
          $compid__18: $compid__18,
          flag: flag,
          type: type,
          MARKETING_TYPE: _constants.MARKETING_TYPE
        };
      };
    }

    /*
     * @Description 渲染付款后二次确认提示窗
     */

  }, {
    key: "_createPayResultData",
    value: function _createPayResultData(_$uid) {
      var _this4 = this;

      return function (payResultInfo) {
        var _genCompid31 = (0, _index.genCompid)(_$uid + "$compid__19"),
            _genCompid32 = _slicedToArray(_genCompid31, 2),
            $prevCompid__19 = _genCompid32[0],
            $compid__19 = _genCompid32[1];

        var _genCompid33 = (0, _index.genCompid)(_$uid + "$compid__20"),
            _genCompid34 = _slicedToArray(_genCompid33, 2),
            $prevCompid__20 = _genCompid34[0],
            $compid__20 = _genCompid34[1];

        var currentPid = _this4.state.currentPid;

        var jsx = null;
        var anonymousState__temp = (0, _index3.isPC)();
        if (anonymousState__temp) {
          propsManager.set({
            "payResultInfo": payResultInfo,
            "pid": currentPid
          }, $compid__19, $prevCompid__19);
        } else {
          propsManager.set({
            "payResultInfo": payResultInfo,
            "pid": currentPid
          }, $compid__20, $prevCompid__20);
        }
        return {
          anonymousState__temp: anonymousState__temp,
          $compid__19: $compid__19,
          $compid__20: $compid__20
        };
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _$_$anonymousState__temp, _$_$anonymousState__temp2, _$_$anonymousState__temp3;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _state = this.__state,
          showAD = _state.showAD,
          currentPid = _state.currentPid;
      var type = this.__props.type;

      var hasPid = !(0, _index3.isEmpty)(currentPid);
      var jsx = null;
      if (!hasPid) {
        return null;
      }
      // 获取当前marketing中间件所在page
      var location = this.$scope.$page.$component.$router.path.match(/\/(\S*)\/(\S*)\//)[2];
      var key = type === _constants.MARKETING_TYPE.modalVip ? _constants.MARKETING_TYPE.modalVip : location + "_" + currentPid;
      var ad = this.__props[key];

      var anonymousState__temp5 = (0, _index3.isEmpty)(ad) || (0, _index3.isEmpty)(ad.adInfo);
      if (anonymousState__temp5) {
        return null;
      }
      var showPayResult = !!(ad.showPayResult && ad.showPayResult.state !== _constants.AD_STATE.NOT_SHOW);
      if (!showPayResult && ad.state === _constants.AD_STATE.NOT_SHOW) {
        // 如果没有付款确认弹窗，并且广告状态是关闭的，那就不渲染啦
        jsx = null;
      }
      if (showAD) {
        _$_$anonymousState__temp2 = undefined;
        _$_$anonymousState__temp = this._createMarktingModalData(__prefix + "dzzzzzzzzz")(ad);
        _$_$anonymousState__temp2 = showPayResult ? this._createPayResultData(__prefix + "ezzzzzzzzz")(ad.showPayResult) : null;
      } else if (showPayResult) {
        _$_$anonymousState__temp3 = undefined;
        _$_$anonymousState__temp3 = this._createPayResultData(__prefix + "fzzzzzzzzz")(ad.showPayResult);
      }
      Object.assign(this.__state, {
        hasPid: hasPid,
        anonymousState__temp5: anonymousState__temp5,
        _$_$anonymousState__temp: _$_$anonymousState__temp,
        showPayResult: showPayResult,
        _$_$anonymousState__temp2: _$_$anonymousState__temp2,
        _$_$anonymousState__temp3: _$_$anonymousState__temp3
      });
      return this.__state;
    }
  }]);

  return Marketing;
}(_index.Component), _class2.$$events = [], _class2.$$componentPath = "public/mapp_common/marketing/index", _temp2)) || _class);
exports.default = Marketing;

Component(require('../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(Marketing));