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

var _action = require("../action.js");

var _index3 = require("../../utils/index.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _openChat = require("../../utils/openChat.js");

var _env = require("../../../../constants/env.js");

var _userInfo = require("../../utils/userInfo.js");

var _biz = require("../utils/biz.js");

var _userInfoChanger = require("../../utils/userInfoChanger.js");

var _loading = require("../../utils/loading.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var payResultContent = {
  payDefault: {
    header: '温馨提示',
    content: ['完成付款后，请根据您的支付情况点击下面的按钮。'],
    leftBtn: '付款遇到问题',
    leftFunc: 'problemClick',
    rightFunc: 'afterPay',
    rightBtn: '已完成付款',
    talkContent: "\u3010" + _env.ENV.appName + "\u3011\u6211\u60F3\u8BA2\u8D2D\u9AD8\u7EA7\u7248\uFF0C\u4F46\u662FpayName\u5931\u8D25\uFF0C\u6211\u8BE5\u600E\u4E48\u529E\uFF1F"
  },
  renewDefault: {
    header: '温馨提示',
    content: ['todotodotodotodo'],
    onlyBtn: '已完成续订',
    onlyFunc: 'afterPay'
  },
  payFail: {
    header: "payName\u5931\u8D25",
    content: ['尊敬的用户，您可能在支付过程中遇到以下问题', '1.您的支付宝余额不足，建议您先对您的支付宝账户进行充值，完成后再重新支付。', '2.您的手机或电脑与支付宝的网络通讯暂时不通，遇到此情况，建议您检查网络后再重新支付。', '3.如遇到支付宝已扣款，但订单状态仍显示“待付款”？这可能是银行网络传输发生故障或延时造成的，淘宝会在2个工作日内恢复金额，请耐心等待。', '4.如遇“校验错误”，可能是您有“待付款”的订单，请先完成付款，或关闭订单后重新订购。', '5.如果问题仍不能解决，请联系客服。'],
    leftBtn: '重新支付',
    rightBtn: '联系客服',
    leftFunc: 'rePay',
    rightFunc: 'problemClick',
    talkContent: '我付款但是没有成功变成高级版怎么办'
  },
  paySuccess: {
    header: "payName\u6210\u529F",
    content: ['尊敬的高级版用户，您可在手机端及pc端使用以下专属功能'],
    introImg: _env.ENV.payResultImgSource,
    onlyBtn: '立即体验',
    onlyFunc: 'reloadPlugin'
  },
  renewFail: {
    header: '续签失败',
    content: ['尊敬的用户，您可能在续签过程中出现不当操作，导致0元延期失败'],
    leftBtn: '重新操作',
    rightBtn: '联系客服',
    leftFunc: 'rePay',
    rightFunc: 'problemClick',
    talkContent: "\u3010" + _env.ENV.appName + "\u3011\u6211\u60F30\u5143\u7EED\u8BA2\u521D\u7EA7\u7248\uFF0C\u4F46\u662F\u7EED\u8BA2\u5931\u8D25\uFF0C\u6211\u8BE5\u600E\u4E48\u529E\uFF1F"
  },
  renewSuccess: {
    header: "\u7EED\u7B7E\u6210\u529F",
    content: ['尊敬的用户，恭喜您的初级版续签已订购成功。'],
    onlyBtn: '已知晓',
    onlyFunc: 'reloadPlugin'
  }
};

var PayResult = (_temp2 = _class = function (_BaseComponent) {
  _inherits(PayResult, _BaseComponent);

  function PayResult() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PayResult);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PayResult.__proto__ || Object.getPrototypeOf(PayResult)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "_$content", "_$btns", "_$btnText", "_$successType", "_$anonymousState__temp", "_$anonymousState__temp2", "loopArray19", "$compid__33", "$compid__34", "contentType", "pid", "payResultInfo"], _this.onClose = function () {
      var pid = _this.props.pid;

      (0, _index3.showTabBar)();
      (0, _action.togglePayResult)({ pid: pid, state: _constants.AD_STATE.NOT_SHOW });
      _this.state.contentType = 'payDefault';
    }, _this.problemClick = function () {
      var contentType = _this.state.contentType;
      var talkContent = payResultContent[contentType].talkContent;

      (0, _openChat.contactCustomerService)(_this.filterText(talkContent));
      // this.onClose();
    }, _this.afterPay = function () {
      var oldUserInfo = JSON.parse(JSON.stringify((0, _userInfoChanger.getUserInfo)()));
      (0, _loading.showLoading)();
      (0, _userInfo.fetchUserInfoFromTcUser)({
        callback: function callback(newUserInfo) {
          _index2.default.hideLoading();
          var contentType = void 0;
          // 如果redux中的信息里包含了续签，那就根据续签的逻辑走
          var payResultInfo = _this.props.payResultInfo;

          if (payResultInfo.isRenew) {
            // 如果和原来的时间相同，证明续签失败
            if (oldUserInfo.vipTime == newUserInfo.vipTime) {
              contentType = 'renewFail';
            } else {
              // 如果和原来的时间不同，证明续签成功
              contentType = 'renewSuccess';
            }
          } else {
            if (oldUserInfo.vipFlag == newUserInfo.vipFlag && oldUserInfo.vipTime == newUserInfo.vipTime) {
              // 如果原有用户信息和现在的保持一致，那证明续费/升级失败了
              contentType = 'payFail';
            } else {
              // 如果和原来的时间不同/vipflag不同，证明升级/续费成功啦
              if (oldUserInfo.vipTime != newUserInfo.vipTime) {
                contentType = 'paySuccess';
              }
            }
          }
          _this.setState({ contentType: contentType });
        }
      });
    }, _this.filterText = function (text) {
      return text.replace(/payName/g, (0, _userInfoChanger.getUserInfo)().showPayBtn);
    }, _this.rePay = function () {
      var payResultInfo = _this.props.payResultInfo;

      (0, _biz.goLink)(payResultInfo.url);
      _this.setState({ contentType: 'payDefault' });
    }, _this.reloadPlugin = function () {
      console.error('这个时候应该刷新整个插件嗷~');
      _this.onClose();
      (0, _index3.refreshPlugin)();
    }, _this.anonymousFunc0Map = {}, _this.customComponents = ["AtModal", "AtModalHeader", "AtModalContent", "AtModalAction"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PayResult, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PayResult.prototype.__proto__ || Object.getPrototypeOf(PayResult.prototype), "_constructor", this).call(this, props);
      this.state = { contentType: 'payDefault' };
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 关闭二次确认弹窗
    */


    /*
     * @Description 点击遇到问题按钮
    */


    /*
     * @Description 点击已完成付款按钮
    */


    /*
     * @Description 把模板话术里的部分话术根据用户信息转成相应文字
    */


    /*
     * @Description 重新支付
    */


    /*
     * @Description 立即体验功能
    */

  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      var _$content, _$btns, _$btnText, _$successType, _$anonymousState__temp, _$anonymousState__temp2;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__33"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__33 = _genCompid2[0],
          $compid__33 = _genCompid2[1];

      var _genCompid3 = (0, _index.genCompid)(__prefix + "$compid__34"),
          _genCompid4 = _slicedToArray(_genCompid3, 2),
          $prevCompid__34 = _genCompid4[0],
          $compid__34 = _genCompid4[1];

      var loopArray19 = void 0;

      var payResultInfo = this.__props.payResultInfo;

      var jsx = null;
      var anonymousState__temp = !(0, _index3.isEmpty)(payResultInfo) && payResultInfo.state !== _constants.AD_STATE.NOT_SHOW;
      if (anonymousState__temp) {
        var contentType = this.__state.contentType;

        if (contentType === 'payDefault' && payResultInfo.isRenew) {
          // 这里需要根据是不是续签判断一下默认弹窗的内容
          contentType = 'renewDefault';
        }
        (0, _index3.hideTabBar)();
        _$content = payResultContent[contentType];
        _$btns = [];
        _$btnText = [];
        _$successType = !(0, _index3.isEmpty)(_$content.onlyBtn); // 只有成功的时候仅有一个按钮，所以根据这个判断是成功的弹窗

        if (_$successType) {
          _$btnText = ['only'];
        } else {
          _$btnText = ['left', 'right'];
        }
        _$btnText.map(function (item) {
          _$btns.push({
            name: item + "Btn",
            action: _this2[_$content[item + "Func"]]
          });
        });
        _$anonymousState__temp = contentType + "-header";
        _$anonymousState__temp2 = this.filterText(_$content.header);
        loopArray19 = _$btns.map(function (item, __index0) {
          item = {
            $original: (0, _index.internal_get_original)(item)
          };

          var _$indexKey = "cjzzz" + __index0;

          _this2.anonymousFunc0Map[_$indexKey] = item.$original.action;
          return {
            _$indexKey: _$indexKey,
            $original: item.$original
          };
        });
        propsManager.set({
          "isOpened": true,
          "closeOnClickOverlay": false,
          "className": "pay-result-wrapper"
        }, $compid__33, $prevCompid__33);
        propsManager.set({
          "className": _$anonymousState__temp
        }, $compid__34, $prevCompid__34);
      }
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        _$content: _$content,
        _$btns: _$btns,
        _$btnText: _$btnText,
        _$successType: _$successType,
        _$anonymousState__temp: _$anonymousState__temp,
        _$anonymousState__temp2: _$anonymousState__temp2,
        loopArray19: loopArray19,
        $compid__33: $compid__33,
        $compid__34: $compid__34
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

  return PayResult;
}(_index.Component), _class.$$events = ["onClose", "anonymousFunc0"], _class.$$componentPath = "public/mapp_common/marketing/payResult/index", _temp2);
exports.default = PayResult;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(PayResult));