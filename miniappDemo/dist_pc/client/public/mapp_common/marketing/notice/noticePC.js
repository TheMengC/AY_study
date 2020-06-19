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

var _index3 = require("../../utils/index.js");

var _biz = require("../utils/biz.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _index4 = require("../feedback/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var NoticePC = (_temp2 = _class = function (_BaseComponent) {
  _inherits(NoticePC, _BaseComponent);

  function NoticePC() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, NoticePC);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NoticePC.__proto__ || Object.getPrototypeOf(NoticePC)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "textList", "pid", "ad", "close"], _this.closeNotice = function () {
      var _this$props = _this.props,
          pid = _this$props.pid,
          ad = _this$props.ad,
          close = _this$props.close;

      (0, _index4.feedbackClosed)({ adData: ad.adInfo });
      (0, _action.closeAdByPid)({ pid: pid });
      close();
    }, _this.clickNotie = function () {
      var adData = _this.adData;
      adData.payUrl = adData.link;
      adData.cid = adData.cid ? adData.cid.split('|')[0] : '';
      adData.pid = _constants.MARKETING_TYPE.notice;
      adData.type = _constants.NOTICE_TYPE.LOW;
      (0, _biz.goClick)({
        customType: _constants.AD_TYPE.FUWU_ORDER,
        customUrl: adData.link,
        adData: adData,
        needFeedback: false
      });
    }, _this.returnShowMessage = function (adInfo) {
      var lowData = adInfo.lowData;

      var renderContent = {};
      if (!(0, _index3.isEmpty)(lowData)) {
        var content = lowData.content,
            ios_content = lowData.ios_content,
            link = lowData.link,
            span = lowData.span,
            talk_content = lowData.talk_content;

        var notice_info = (0, _index3.isIOS)() ? ios_content : content + span;
        if ((0, _index3.isEmpty)(notice_info)) {
          return null;
        }
        renderContent = {
          type: _constants.NOTICE_TYPE.LOW,
          content: notice_info,
          link: link,
          talk_content: talk_content
        };
        _this.adData = lowData;
      }
      return renderContent;
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NoticePC, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(NoticePC.prototype.__proto__ || Object.getPrototypeOf(NoticePC.prototype), "_constructor", this).call(this, props);

      this.state = {};
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 关闭公告
    */


    /*
     * @Description 点击弱提示跳转
    */


    /*
     * @Description 拼接需要展示的数据
    */

  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var ad = this.__props.ad;

      var anonymousState__temp2 = (0, _index3.isEmpty)(ad);
      if (anonymousState__temp2) {
        return null;
      }
      var textList = this.returnShowMessage(ad.adInfo);
      var anonymousState__temp = !(0, _index3.isEmpty)(textList);
      if (anonymousState__temp) {}
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        textList: textList
      });
      return this.__state;
    }
  }]);

  return NoticePC;
}(_index.Component), _class.$$events = ["clickNotie", "closeNotice"], _class.$$componentPath = "public/mapp_common/marketing/notice/noticePC", _temp2);
exports.default = NoticePC;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(NoticePC));