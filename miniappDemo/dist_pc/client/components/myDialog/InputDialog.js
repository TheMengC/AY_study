"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../public/mapp_common/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var InputDialog = (_temp2 = _class = function (_BaseComponent) {
  _inherits(InputDialog, _BaseComponent);

  function InputDialog() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InputDialog);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InputDialog.__proto__ || Object.getPrototypeOf(InputDialog)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "$compid__41", "placeholder", "value", "labelName", "cancelText", "confirmText", "title", "width"], _this.state = {
      value: ''
    }, _this.onchangeInput = function (e) {
      _this.setState({ value: e.detail.value });
    }, _this.onCancel = function () {
      _this.props.onClose();
    }, _this.onOK = function () {
      var value = _this.state.value;

      _this.props.onOk(value);
      _this.props.onClose();
    }, _this.customComponents = ["MyDialog"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InputDialog, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(InputDialog.prototype.__proto__ || Object.getPrototypeOf(InputDialog.prototype), "_constructor", this).call(this, props);

      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__41"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__41 = _genCompid2[0],
          $compid__41 = _genCompid2[1];

      var value = this.__state.value;
      var _props = this.__props,
          title = _props.title,
          labelName = _props.labelName,
          placeholder = _props.placeholder,
          cancelText = _props.cancelText,
          confirmText = _props.confirmText,
          width = _props.width;

      var anonymousState__temp = (0, _index.internal_inline_style)({ width: width + 'px' });
      propsManager.set({
        "className": "input-dialog",
        "title": title,
        "onClose": this.__props.onClose
      }, $compid__41, $prevCompid__41);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        $compid__41: $compid__41,
        placeholder: placeholder,
        labelName: labelName,
        cancelText: cancelText,
        confirmText: confirmText
      });
      return this.__state;
    }
  }]);

  return InputDialog;
}(_index.Component), _class.$$events = ["onchangeInput", "onCancel", "onOK"], _class.$$componentPath = "components/myDialog/InputDialog", _temp2);


InputDialog.defaultProps = {
  title: null,
  labelName: '输入',
  placeholder: '',
  width: 100,
  onClose: _index3.NOOP,
  onCancel: _index3.NOOP,
  onOk: _index3.NOOP,
  cancelText: '取消',
  confirmText: '确认'
};

exports.default = InputDialog;

Component(require('../../npm/_tarojs/taro-alipay/index.js').default.createComponent(InputDialog));