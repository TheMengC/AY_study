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

var _biz = require("../utils/biz.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;
var NoticeBallon = (_temp2 = _class = function (_BaseComponent) {
  _inherits(NoticeBallon, _BaseComponent);

  function NoticeBallon() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, NoticeBallon);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NoticeBallon.__proto__ || Object.getPrototypeOf(NoticeBallon)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["showNotice", "hadShown", "notice", "close"], _this.hideBallon = function () {
      _this.setState({ hadShown: true });
      _this.props.close();
    }, _this.onClickNotice = function (notice) {
      if (!(0, _index3.isEmpty)(notice.adlink)) {
        (0, _biz.goPage)(notice.adlink);
      }
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NoticeBallon, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(NoticeBallon.prototype.__proto__ || Object.getPrototypeOf(NoticeBallon.prototype), "_constructor", this).call(this, props);

      this.state = {
        hadShown: false,
        showNotice: true
      };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ showNotice: nextProps.showNotice });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _state = this.__state,
          showNotice = _state.showNotice,
          hadShown = _state.hadShown;
      var notice = this.__props.notice;


      this.anonymousFunc0 = function () {
        _this2.onClickNotice(notice);
      };

      Object.assign(this.__state, {
        notice: notice
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }]);

  return NoticeBallon;
}(_index.Component), _class.$$events = ["hideBallon", "anonymousFunc0"], _class.$$componentPath = "public/mapp_common/marketing/notice/pcNoticeBallon", _temp2);
exports.default = NoticeBallon;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(NoticeBallon));