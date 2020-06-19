"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../utils/index.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _action = require("../action.js");

var _moment = require("../../utils/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _biz = require("../utils/biz.js");

var _index4 = require("../feedback/index.js");

var _utils = require("../../../tradePublic/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var MidCouponPC = (_temp2 = _class = function (_BaseComponent) {
  _inherits(MidCouponPC, _BaseComponent);

  function MidCouponPC() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MidCouponPC);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MidCouponPC.__proto__ || Object.getPrototypeOf(MidCouponPC)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "$compid__29", "anonymousState__temp2", "num", "adState", "ad", "pid", "close"], _this.clickCoupon = function () {
      var ad = _this.props.ad;

      if (ad.adInfo.user_define && ad.adInfo.user_define.body.add == '有') {
        _this.setState({ adState: 'modal' }, function () {});
      } else {
        (0, _biz.goClick)({
          adData: ad.adInfo,
          customType: _constants.AD_TYPE.FUWU_ORDER,
          customUrl: ad.adInfo.user_define.body['hotspace1-url']
        });
        _this.closeModal();
      }
    }, _this.closeModal = function () {
      var _this$props = _this.props,
          pid = _this$props.pid,
          ad = _this$props.ad,
          close = _this$props.close;

      (0, _index4.feedbackClosed)({ adData: ad.adInfo });
      (0, _action.closeAdByPid)({ pid: pid });
      close();
    }, _this.startCount = function () {
      if ((0, _index3.isEmpty)(_this.timer)) {
        _this.timer = setInterval(function () {
          if (_this.leftSeconds <= 0) {
            clearInterval(_this.timer);
            _this.closeModal();
          } else {
            _this.setState({});
          }
        }, 1000);
      }
    }, _this.getCountTime = function (fullTime) {
      var endTime = void 0;
      var nowTime = (0, _moment2.default)();
      if ((0, _index3.isEmpty)(_this.endTime)) {
        // 如果没有得到结束时间，证明还没有算过，那就来算一次吧
        var _this$props2 = _this.props,
            pid = _this$props2.pid,
            ad = _this$props2.ad;

        var startTime = void 0;
        if ((0, _index3.isEmpty)(ad.startTime) || ad.startTime.split(' ')[0] !== (0, _utils.getToday)()) {
          startTime = (0, _action.couponStartCount)(pid);
        } else {
          startTime = ad.startTime;
        }
        endTime = (0, _moment2.default)(startTime).add(fullTime, 'm');
        _this.endTime = endTime;
      } else {
        endTime = _this.endTime;
      }
      if (endTime > nowTime) {
        // 证明倒计时还没结束，倒计时走起~
        var seconds = endTime.diff(nowTime, 'seconds');
        var min = parseInt(seconds / 60, 10).toString().padStart(2, '0');
        var s = parseInt(seconds % 60, 10).toString().padStart(2, '0');
        _this.leftSeconds = seconds;
        return min + ":" + s;
      } else {
        // 如果结束时间小于现在，证明今天已经结束了，不要显示啦
        return false;
      }
    }, _this.customComponents = ["Marketing"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MidCouponPC, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(MidCouponPC.prototype.__proto__ || Object.getPrototypeOf(MidCouponPC.prototype), "_constructor", this).call(this, props);

      this.state = {
        adState: 'coupon'
      };

      this.endTime = undefined; // 根据这个变量判断优惠券的结束时间
      this.timer = undefined; // 优惠券倒计时的定时器
      this.leftSeconds = undefined; // 倒计时剩余秒数
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 点击优惠券事件
    */


    /*
     * @Description 关闭广告
    */


    /*
     * @Description 开始倒计时惹
    */


    /*
     * @Description 获取需要展示的倒计时数字
    */

  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__29"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__29 = _genCompid2[0],
          $compid__29 = _genCompid2[1];

      var _props = this.__props,
          ad = _props.ad,
          pid = _props.pid;
      var adState = this.__state.adState;

      var anonymousState__temp2 = (0, _index3.isEmpty)(ad);
      if (anonymousState__temp2) {
        return null;
      }
      var body = ad.adInfo.user_define.body;
      var count_down = body.count_down,
          tip_image = body.tip_image;

      var num = this.getCountTime(count_down);
      if (!num) {
        return null;
      }
      this.startCount();
      var anonymousState__temp = adState == 'coupon' ? (0, _index.internal_inline_style)({ backgroundImage: "url(" + tip_image + ")" }) : null;
      !(adState == 'coupon') && propsManager.set({
        "type": _constants.MARKETING_TYPE.commonModal,
        "pid": pid
      }, $compid__29, $prevCompid__29);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        $compid__29: $compid__29,
        anonymousState__temp2: anonymousState__temp2,
        num: num
      });
      return this.__state;
    }
  }]);

  return MidCouponPC;
}(_index.Component), _class.$$events = ["clickCoupon"], _class.$$componentPath = "public/mapp_common/marketing/midCoupon/midCouponPC", _temp2);


MidCouponPC.defaultProps = {
  pid: 0,
  ad: {},
  close: _index3.NOOP
};

exports.default = MidCouponPC;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(MidCouponPC));