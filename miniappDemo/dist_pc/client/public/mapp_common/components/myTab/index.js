"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require("../../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../npm/prop-types/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../npm/classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var ENV = _index2.default.getEnv();
var MIN_DISTANCE = 100;
var MAX_INTERVAL = 10;
var objectToString = function objectToString(style) {
  if (style && (typeof style === "undefined" ? "undefined" : _typeof(style)) === 'object') {
    var styleStr = '';
    Object.keys(style).forEach(function (key) {
      var lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      styleStr += lowerCaseKey + ":" + style[key] + ";";
    });
    return styleStr;
  } else if (style && typeof style === 'string') {
    return style;
  }
  return '';
};

function mergeStyle(style1, style2) {
  if (style1 && (typeof style1 === "undefined" ? "undefined" : _typeof(style1)) === 'object' && style2 && (typeof style2 === "undefined" ? "undefined" : _typeof(style2)) === 'object') {
    return Object.assign({}, style1, style2);
  }
  return objectToString(style1) + objectToString(style2);
}

var MyTabs = (_temp2 = _class = function (_BaseComponent) {
  _inherits(MyTabs, _BaseComponent);

  function MyTabs() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MyTabs);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MyTabs.__proto__ || Object.getPrototypeOf(MyTabs)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "loopArray20", "tabList", "dotNum", "rootCls", "scroll", "_tabId", "scrollX", "scrollY", "_scrollTop", "_scrollIntoView", "scrollFollow", "swipeable", "tabDirection", "current", "customStyle", "className", "height", "animated", "children"], _this.updateState = function (key) {
      if (_this.props.scrollFollow) {
        _this.setState({ _scrollIntoView: "tab" + key });
      }
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MyTabs, [{
    key: "_constructor",
    value: function _constructor() {
      _get(MyTabs.prototype.__proto__ || Object.getPrototypeOf(MyTabs.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        //       _scrollLeft: '',
        _scrollTop: '',
        _scrollIntoView: ''
      };
      this._tabId = (Math.random() * 100000).toFixed(0);
      // 触摸时的原点
      this._touchDot = 0;
      // 定时器
      this._timer = null;
      // 滑动时间间隔
      this._interval = 0;
      // 是否已经在滑动
      this._isMoving = false;
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      var _props;

      (_props = this.props).onClick.apply(_props, arguments);
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(e) {
      var _this2 = this;

      var _props2 = this.props,
          swipeable = _props2.swipeable,
          tabDirection = _props2.tabDirection;

      if (!swipeable || tabDirection === 'vertical') {
        return;
      } // 获取触摸时的原点
      this._touchDot = e.touches[0].pageX;
      // 使用js计时器记录时间
      this._timer = setInterval(function () {
        _this2._interval++;
      }, 100);
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(e) {
      var _props3 = this.props,
          swipeable = _props3.swipeable,
          tabDirection = _props3.tabDirection,
          current = _props3.current,
          tabList = _props3.tabList;

      if (!swipeable || tabDirection === 'vertical') {
        return;
      }var touchMove = e.touches[0].pageX;
      var moveDistance = touchMove - this._touchDot;
      var maxIndex = tabList.length;

      if (!this._isMoving && this._interval < MAX_INTERVAL && this._touchDot > 20) {
        // 向左滑动
        if (current + 1 < maxIndex && moveDistance <= -100) {
          this._isMoving = true;
          this.handleClick(current + 1);

          // 向右滑动
        } else if (current - 1 >= 0 && moveDistance >= MIN_DISTANCE) {
          this._isMoving = true;
          this.handleClick(current - 1);
        }
      }
    }
  }, {
    key: "handleTouchEnd",
    value: function handleTouchEnd() {
      var _props4 = this.props,
          swipeable = _props4.swipeable,
          tabDirection = _props4.tabDirection;

      if (!swipeable || tabDirection === 'vertical') {
        return;
      }clearInterval(this._timer);
      this._interval = 0;
      this._isMoving = false;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.scroll !== this.props.scroll) {
        //  this.getTabHeaderRef();
      }
      if (nextProps.current !== this.props.current) {
        this.updateState(nextProps.current);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      //    this.getTabHeaderRef();
      this.updateState(this.props.current);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.tabHeaderRef = null;
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _classNames;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      var _tabId = this._tabId;
      var _props5 = this.__props,
          customStyle = _props5.customStyle,
          className = _props5.className,
          height = _props5.height,
          tabDirection = _props5.tabDirection,
          animated = _props5.animated,
          tabList = _props5.tabList,
          scroll = _props5.scroll,
          current = _props5.current,
          dotNum = _props5.dotNum;
      var _state = this.__state,
          _scrollTop = _state._scrollTop,
          _scrollIntoView = _state._scrollIntoView;


      var heightStyle = { height: height };
      var underlineStyle = {
        height: tabDirection === 'vertical' ? tabList.length * 100 + "%" : '1PX',
        width: tabDirection === 'horizontal' ? tabList.length * 100 + "%" : '1PX'
      };
      var bodyStyle = {};
      var transformStyle = "translate3d(0px, -" + current * 100 + "%, 0px)";
      if (tabDirection === 'horizontal') {
        transformStyle = "translate3d(-" + current * 100 + "%, 0px, 0px)";
      }
      Object.assign(bodyStyle, {
        'transform': transformStyle,
        '-webkit-transform': transformStyle
      });
      if (!animated) {
        bodyStyle.transition = 'unset';
      }

      var rootCls = (0, _index6.default)((_classNames = {
        'at-tabs': true,
        'at-tabs--scroll': scroll
      }, _defineProperty(_classNames, "at-tabs--" + tabDirection, true), _defineProperty(_classNames, "at-tabs--" + ENV, true), _defineProperty(_classNames, 'my-tabs', true), _classNames), className);
      var scrollX = tabDirection === 'horizontal';
      var scrollY = tabDirection === 'vertical';

      var anonymousState__temp = (0, _index.internal_inline_style)(mergeStyle(heightStyle, customStyle));
      var anonymousState__temp2 = scroll ? (0, _index.internal_inline_style)(heightStyle) : null;
      var anonymousState__temp3 = (0, _index.internal_inline_style)(mergeStyle(bodyStyle, heightStyle));
      var anonymousState__temp4 = (0, _index.internal_inline_style)(underlineStyle);
      var loopArray20 = tabList.map(function (item, _anonIdx) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        var itemCls = (0, _index6.default)({
          'at-tabs__item': true,
          'at-tabs__item--active': current === item.$original.key
        });

        return {
          itemCls: itemCls,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        loopArray20: loopArray20,
        tabList: tabList,
        dotNum: dotNum,
        rootCls: rootCls,
        scroll: scroll,
        _tabId: _tabId,
        scrollX: scrollX,
        scrollY: scrollY
      });
      return this.__state;
    }
  }]);

  return MyTabs;
}(_index.Component), _class.$$events = ["handleClick", "handleTouchStart", "handleTouchEnd", "handleTouchMove"], _class.$$componentPath = "public/mapp_common/components/myTab/index", _temp2);


MyTabs.defaultProps = {
  isTest: false,
  customStyle: '',
  className: '',
  tabDirection: 'horizontal',
  height: '',
  current: 0,
  swipeable: true,
  scroll: false,
  animated: true,
  tabList: [],
  onClick: function onClick() {}
};

MyTabs.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  isTest: _index4.default.bool,
  height: _index4.default.string,
  tabDirection: _index4.default.oneOf(['horizontal', 'vertical']),
  current: _index4.default.string,
  swipeable: _index4.default.bool,
  scroll: _index4.default.bool,
  animated: _index4.default.bool,
  tabList: _index4.default.array,
  onClick: _index4.default.func
};
exports.default = MyTabs;

Component(require('../../../../npm/_tarojs/taro-alipay/index.js').default.createComponent(MyTabs));