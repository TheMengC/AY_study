"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _env = require("../../../../constants/env.js");

var _action = require("../action.js");

var _index3 = require("../../utils/index.js");

var _biz = require("../utils/biz.js");

var _constants = require("../../../tradePublic/marketing/constants.js");

var _index4 = require("../feedback/index.js");

var _beacon = require("../../utils/beacon.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var Notice = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Notice, _BaseComponent);

  function Notice() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Notice);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Notice.__proto__ || Object.getPrototypeOf(Notice)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp3", "anonymousState__temp4", "noticeExpanded", "currentNotice", "_$_$anonymousState__temp", "current", "textList", "from", "ENV", "pid", "ad", "close"], _this.closeNotice = function () {
      var _this$props = _this.props,
          pid = _this$props.pid,
          ad = _this$props.ad,
          close = _this$props.close;

      (0, _index4.feedbackClosed)({ adData: ad.adInfo });
      (0, _action.closeAdByPid)({ pid: pid });
      close();
    }, _this.clickNotie = function (adData) {
      if ((0, _index3.isEmpty)(adData)) {
        return;
      }
      adData.pid = _constants.MARKETING_TYPE.notice;
      if (adData.type === _constants.NOTICE_TYPE.LOW) {
        _this.weakAdBeacon(_constants.MARKET_BEACON_CONST.click);
      }
      if (adData.type === _constants.NOTICE_TYPE.LOW && adData.showType == 3) {
        // 安卓和iOS用户直接跳转旺旺
        (0, _biz.goClick)({
          customType: _constants.AD_TYPE.CONTACT_KEFU,
          customContent: adData.talk_content,
          needFeedback: false,
          adData: adData
        });
      } else if (adData.type === _constants.NOTICE_TYPE.LOW && (0, _index3.isIOS)()) {
        // 如果是弱提示，ios，那联系客服
        (0, _biz.goClick)({
          customType: _constants.AD_TYPE.CONTACT_KEFU,
          customContent: adData.talk_content,
          needFeedback: false,
          adData: adData
        });
      } else {
        if (!(0, _index3.isEmpty)(adData.link)) {
          (0, _biz.goClick)({
            customType: _constants.AD_TYPE.FUWU_ORDER,
            customUrl: adData.link,
            adData: adData,
            needFeedback: false
          });
        }
      }
    }, _this.clickToExpand = function (currentNotice, current) {
      _this.setState({
        noticeExpanded: true,
        currentNotice: currentNotice,
        current: current
      });
    }, _this.clickToCollapse = function () {
      _this.setState({ noticeExpanded: false });
    }, _this.returnShowMessage = function (adInfo) {
      var notice = adInfo.notice,
          lowData = adInfo.lowData;

      var renderContent = [];
      if (!(0, _index3.isEmpty)(notice)) {
        renderContent.push({
          type: _constants.NOTICE_TYPE.NOTICE,
          content: notice.content,
          link: notice.adlink
        });
      }
      if (!(0, _index3.isEmpty)(lowData)) {
        var content = lowData.content,
            ios_content = lowData.ios_content,
            link = lowData.link,
            span = lowData.span,
            talk_content = lowData.talk_content,
            type = lowData.type;

        var notice_info = (0, _index3.isIOS)() ? ios_content : content + span;
        if (!(0, _index3.isEmpty)(notice_info)) {
          renderContent.push({
            type: _constants.NOTICE_TYPE.LOW,
            showType: type,
            content: notice_info,
            link: link,
            talk_content: talk_content
          });
        }
      }
      return renderContent;
    }, _this.weakAdBeacon = function (type) {
      var _this$props2 = _this.props,
          pid = _this$props2.pid,
          ad = _this$props2.ad;

      var level = 'weak';
      if (!(0, _index3.isEmpty)(ad.adInfo) && !(0, _index3.isEmpty)(ad.adInfo.lowData)) {
        // 到期三天的弱提示文案修改的埋点
        if (ad.adInfo.lowData.type == 3) {
          level = 'weakXiaoshou';
        }

        if (type === _constants.MARKET_BEACON_CONST.show && _this.hadBeacon === 0) {
          _this.hadBeacon = 1;
          (0, _beacon.marketingBeacon)(type, pid, level);
        } else if (type === _constants.MARKET_BEACON_CONST.click) {
          (0, _beacon.marketingBeacon)(type, pid, level);
        }
      }
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Notice, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Notice.prototype.__proto__ || Object.getPrototypeOf(Notice.prototype), "_constructor", this).call(this, props);

      this.state = {
        noticeExpanded: false,
        currentNotice: undefined,
        current: 0
      };

      this.hadBeacon = 0;
      this.$$refs = new _index2.default.RefsArray();
    }

    /*
     * @Description 关闭公告
    */


    /*
     * @Description 点击公共/弱提示跳转
    */


    /*
     * @Description 点击公告展开
    */


    /*
     * @Description 点击收起公告
    */


    /*
     * @Description 拼接需要展示的数据
    */

  }, {
    key: "_createSeeMoreData",
    value: function _createSeeMoreData(_$uid) {
      return function (currentNotice) {
        // 当且仅当有链接的时候才渲染查看详情
        var jsx = null;
        var anonymousState__temp = !(0, _index3.isEmpty)(currentNotice) && !(0, _index3.isEmpty)(currentNotice.link);
        if (anonymousState__temp) {}
        return {
          anonymousState__temp: anonymousState__temp,
          currentNotice: currentNotice
        };
      };
    }

    /*
     * @Description 弱提示埋点
    */

  }, {
    key: "_createData",
    value: function _createData() {
      var _$_$anonymousState__temp;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _props = this.__props,
          ad = _props.ad,
          from = _props.from;

      var anonymousState__temp4 = (0, _index3.isEmpty)(ad);
      if (anonymousState__temp4) {
        return null;
      }
      var _state = this.__state,
          noticeExpanded = _state.noticeExpanded,
          currentNotice = _state.currentNotice,
          current = _state.current;

      var textList = this.returnShowMessage(ad.adInfo);
      console.log('Notice-render', this);
      var anonymousState__temp3 = !(0, _index3.isEmpty)(textList);
      if (anonymousState__temp3) {
        _$_$anonymousState__temp = undefined;

        this.weakAdBeacon(_constants.MARKET_BEACON_CONST.show);
        _$_$anonymousState__temp = noticeExpanded ? this._createSeeMoreData(__prefix + "cbzzzzzzzz")(currentNotice) : null;
      }
      Object.assign(this.__state, {
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        _$_$anonymousState__temp: _$_$anonymousState__temp,
        textList: textList,
        from: from,
        ENV: _env.ENV
      });
      return this.__state;
    }
  }]);

  return Notice;
}(_index.Component), _class.$$events = ["clickNotie", "clickNotie", "clickToCollapse", "clickToExpand", "closeNotice"], _class.$$componentPath = "public/mapp_common/marketing/notice/index", _temp2);
exports.default = Notice;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(Notice));