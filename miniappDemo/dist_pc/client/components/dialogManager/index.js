"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _eventManager = require("../../public/mapp_common/utils/eventManager.js");

var _logger = require("../../public/mapp_common/utils/logger.js");

var _index3 = require("../../public/mapp_common/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var dialogs = {
  testDialog: {},
  ConfirmDialog: {},
  InputDialog: {}
};

// eslint-disable-next-line import/no-mutable-exports
var DialogManager = (_temp2 = _class = function (_BaseComponent) {
  _inherits(DialogManager, _BaseComponent);

  function DialogManager() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DialogManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DialogManager.__proto__ || Object.getPrototypeOf(DialogManager)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray3", "openDialog"], _this.getDialogProps = function (key) {
      return _extends({}, _this.state[key], {
        onClose: function onClose() {
          var props = _extends({}, _this.state[key]);
          props._isShow = false;
          if ((0, _index3.isFunction)(props.onClose)) {
            if (props.onClose()) {
              return;
            }
          }
          _this.setState(_defineProperty({}, key, props));
        }
      });
    }, _this.getDialogIsShow = function (key) {
      return _this.getDialogProps(key)._isShow;
    }, _this.customComponents = ["TestDialog", "ConfirmDialog", "InputDialog"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DialogManager, [{
    key: "_constructor",
    value: function _constructor(props) {
      var _this2 = this;

      _get(DialogManager.prototype.__proto__ || Object.getPrototypeOf(DialogManager.prototype), "_constructor", this).call(this, props);
      this.state = {};
      Object.keys(dialogs).map(function (key) {
        _this2.state[key] = { _isShow: false };
      });
      _eventManager.events.showDialog.subscribeOnce(function (_ref2) {
        var name = _ref2.name,
            props = _ref2.props,
            _ref2$isShow = _ref2.isShow,
            isShow = _ref2$isShow === undefined ? true : _ref2$isShow;

        var dialog = dialogs[name];
        if (!dialog) {
          console.error('没有找到该对话框的定义', name);
        }
        var show = function show() {
          _this2.setState(_defineProperty({}, name, _extends({}, props, {
            _isShow: isShow
          })));
        };
        // 防止被干 在有相同对话框的时候先把之前的对话框搞死
        // 不然就会出现之前pc上地址错乱的问题 是因为相同对话框渲染到一起导致的
        if (_this2.state[name]._isShow) {
          _this2.setState(_defineProperty({}, name, { _isShow: false }), show);
        } else {
          show();
        }
      });
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      _logger.Logger.log(this.props, nextProps);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this3 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var openDialog = Object.keys(dialogs).filter(function (key) {
        return _this3.__state[key]._isShow;
      });
      if (openDialog.length == 0) {
        this.grade = 0;
      }
      openDialog.sort(function (itemA, itemB) {
        return _this3.__state[itemA]._grade - _this3.__state[itemB]._grade;
      });
      var loopArray3 = openDialog.map(function (key, _anonIdx) {
        key = {
          $original: (0, _index.internal_get_original)(key)
        };

        var _genCompid = (0, _index.genCompid)(__prefix + "gzzzzzzzzz" + _anonIdx, true),
            _genCompid2 = _slicedToArray(_genCompid, 2),
            $prevCompid__24 = _genCompid2[0],
            $compid__24 = _genCompid2[1];

        'testDialog' === key.$original && propsManager.set(_extends({}, _this3.getDialogProps('testDialog')), $compid__24, $prevCompid__24);

        var _genCompid3 = (0, _index.genCompid)(__prefix + "hzzzzzzzzz" + _anonIdx, true),
            _genCompid4 = _slicedToArray(_genCompid3, 2),
            $prevCompid__25 = _genCompid4[0],
            $compid__25 = _genCompid4[1];

        propsManager.set(_extends({}, _this3.getDialogProps('ConfirmDialog')), $compid__25, $prevCompid__25);

        var _genCompid5 = (0, _index.genCompid)(__prefix + "izzzzzzzzz" + _anonIdx, true),
            _genCompid6 = _slicedToArray(_genCompid5, 2),
            $prevCompid__26 = _genCompid6[0],
            $compid__26 = _genCompid6[1];

        propsManager.set(_extends({}, _this3.getDialogProps('InputDialog')), $compid__26, $prevCompid__26);
        return {
          $compid__24: $compid__24,
          $compid__25: $compid__25,
          $compid__26: $compid__26,
          $original: key.$original
        };
      });
      Object.assign(this.__state, {
        loopArray3: loopArray3,
        openDialog: openDialog
      });
      return this.__state;
    }
  }]);

  return DialogManager;
}(_index.Component), _class.$$events = [], _class.$$componentPath = "components/dialogManager/index", _temp2);
exports.default = DialogManager;

Component(require('../../npm/_tarojs/taro-alipay/index.js').default.createComponent(DialogManager));