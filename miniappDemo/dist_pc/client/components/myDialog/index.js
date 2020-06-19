"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var MyDialog = (_temp2 = _class = function (_BaseComponent) {
  _inherits(MyDialog, _BaseComponent);

  function MyDialog() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MyDialog);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MyDialog.__proto__ || Object.getPrototypeOf(MyDialog)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "title", "closeable", "content", "hasFooter", "cancelText", "hasCancel", "confirmText", "onCancelClose", "onOkClose", "closeOnClickOverlay", "wrapperClassName", "className", "children", "wrapperStyle", "visible"], _this.onCloseClick = function () {
      _this.props.onClose();
    }, _this.onCancel = function () {
      (0, _index3.isFunction)(_this.props.onCancel) && _this.props.onCancel();
      if (_this.props.onCancelClose) {
        _this.onClose();
      }
    }, _this.onOk = function () {
      (0, _index3.isFunction)(_this.props.onOk) && _this.props.onOk();
      if (_this.props.onOkClose) {
        _this.onClose();
      }
    }, _this.onClose = function () {
      _this.props.onClose();
    }, _this.handleClickOverlay = function () {
      if (_this.props.closeOnClickOverlay) {
        _this.onClose();
      }
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MyDialog, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(MyDialog.prototype.__proto__ || Object.getPrototypeOf(MyDialog.prototype), "_constructor", this).call(this, props);
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

      var _props = this.__props,
          wrapperClassName = _props.wrapperClassName,
          hasFooter = _props.hasFooter,
          className = _props.className,
          title = _props.title,
          children = _props.children,
          content = _props.content,
          closeable = _props.closeable,
          cancelText = _props.cancelText,
          confirmText = _props.confirmText,
          hasCancel = _props.hasCancel,
          wrapperStyle = _props.wrapperStyle;

      var anonymousState__temp = (0, _index3.classNames)('at-modal--active my-dialog-wrapper', wrapperClassName);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(wrapperStyle);

      // return (
      //
      //     <AtModal isOpened className={'my-dialog ' + wrapperClassName} onClose={onClose} closeOnClickOverlay={closeOnClickOverlay}>
      //         <View className={className}>
      //             {
      //                 title &&
      //                 <View className='dialog-title'><Text className='dialog-title-text'>{ title }</Text></View>
      //             }
      //             <View className='dialog-content'>
      //                 { children }
      //             </View>
      //             {
      //                 hasFooter &&
      //                 <View className='dialog-bottom'>
      //                     {locale.ok && <Button className='btn-cancel' onClick={this.onOk}>{locale.ok}</Button>}
      //                     {locale.cancel && <Button type='primary' onClick={this.onCancel}>{locale.cancel}</Button>}
      //                 </View>
      //             }
      //         </View>
      //     </AtModal>
      // );
      var anonymousState__temp3 = (0, _index3.classNames)('at-modal__container', className, { hidden: !this.__props.visible });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        title: title,
        closeable: closeable,
        content: content,
        hasFooter: hasFooter,
        cancelText: cancelText,
        hasCancel: hasCancel,
        confirmText: confirmText
      });
      return this.__state;
    }
  }]);

  return MyDialog;
}(_index.Component), _class.$$events = ["handleClickOverlay", "onCloseClick", "onCancel", "onOk"], _class.$$componentPath = "components/myDialog/index", _temp2);


MyDialog.defaultProps = {
  visible: true,
  wrapperClassName: '',
  content: null,
  closeOnClickOverlay: false,
  cancelText: '取消',
  confirmText: '确认',
  className: '',
  title: null,
  children: null,
  hasFooter: false,
  onClose: _index3.NOOP,
  onCancel: _index3.NOOP,
  onOk: _index3.NOOP,
  hasCancel: true,
  closeable: true,
  onCancelClose: true,
  onOkClose: true

};

exports.default = MyDialog;

Component(require('../../npm/_tarojs/taro-alipay/index.js').default.createComponent(MyDialog));