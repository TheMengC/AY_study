"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/_tarojs/redux/index.js");

var _consts = require("../../public/tradePublic/consts.js");

var _action = require("./action.js");

var _systemInfo = require("../../public/mapp_common/utils/systemInfo.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var ReturnManagement = (_dec = (0, _index3.connect)(function (store) {
  return {
    searchVal: store.refundListReducer.searchVal,
    activeTabKey: store.refundListReducer.activeTabKey,
    pageNo: store.refundListReducer.pageNo,
    pageSize: store.refundListReducer.pageSize,
    tradeCounts: store.refundListReducer.tradeCounts,
    list: store.refundListReducer.list
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(ReturnManagement, _BaseComponent);

  function ReturnManagement() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReturnManagement);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReturnManagement.__proto__ || Object.getPrototypeOf(ReturnManagement)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "$compid__21", "$compid__22", "scrollHeight", "searchVal", "pageNo", "pageSize", "activeTabKey", "list", "tradeCounts"], _this.onPageChange = function (type, v) {
      var _this$props = _this.props,
          activeTabKey = _this$props.activeTabKey,
          pageNo = _this$props.pageNo,
          pageSize = _this$props.pageSize,
          searchVal = _this$props.searchVal;

      if (type === 'pageNo') {
        (0, _action.changeTab)(activeTabKey, v, pageSize, searchVal);
      } else {
        (0, _action.changeTab)(activeTabKey, pageNo, v, searchVal);
      }
    }, _this.onTabChange = function (v) {
      var pageSize = _this.props.pageSize;

      (0, _action.changeTab)(v, 1, pageSize, '');
    }, _this.customComponents = ["MyTabs", "RefundList", "MyPagination"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReturnManagement, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ReturnManagement.prototype.__proto__ || Object.getPrototypeOf(ReturnManagement.prototype), "_constructor", this).call(this, props);
      this.state = { scrollHeight: 0 };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _props = this.props,
          pageNo = _props.pageNo,
          pageSize = _props.pageSize,
          searchVal = _props.searchVal;

      this.setState({ scrollHeight: 500 });
      (0, _action.changeTab)('ALL', pageNo, pageSize, searchVal);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__21"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__21 = _genCompid2[0],
          $compid__21 = _genCompid2[1];

      var _genCompid3 = (0, _index.genCompid)(__prefix + "$compid__22"),
          _genCompid4 = _slicedToArray(_genCompid3, 2),
          $prevCompid__22 = _genCompid4[0],
          $compid__22 = _genCompid4[1];

      var _props2 = this.__props,
          activeTabKey = _props2.activeTabKey,
          list = _props2.list,
          searchVal = _props2.searchVal,
          tradeCounts = _props2.tradeCounts;

      var tabList = Object.keys(_consts.REFUND_TABS).map(function (key) {
        return { title: _consts.REFUND_TABS[key].name, key: key };
      });
      var scrollHeight = this.__state.scrollHeight;

      var PAGE_SIZE_LIST = [20, 40, 80, 100];
      var anonymousState__temp = (0, _index.internal_inline_style)({ height: (0, _systemInfo.getSystemInfo)().windowHeight - 60 - 50 });
      this.anonymousFunc0 = _action.onSearch;
      propsManager.set({
        "className": "trade-tab custom-tab grid-item24",
        "current": activeTabKey,
        "tabList": tabList,
        "scroll": true,
        "dotNum": tradeCounts,
        "onClick": this.onTabChange
      }, $compid__21, $prevCompid__21);
      propsManager.set({
        "total": tradeCounts,
        "pageNo": this.__props.pageNo,
        "pageSizeSelector": "dropdown",
        "pageSize": this.__props.pageSize,
        "pageSizeList": PAGE_SIZE_LIST,
        "onPageSizeChange": this.onPageChange.bind(this, 'pageSize'),
        "onPageNoChange": this.onPageChange.bind(this, 'pageNo')
      }, $compid__22, $prevCompid__22);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        $compid__21: $compid__21,
        $compid__22: $compid__22,
        searchVal: searchVal
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }]);

  return ReturnManagement;
}(_index.Component), _class2.$$events = ["changeSearch", "anonymousFunc0"], _class2.$$componentPath = "pages/refundManagement/index", _temp2)) || _class);
exports.default = ReturnManagement;

Component(require('../../npm/_tarojs/taro-alipay/index.js').default.createComponent(ReturnManagement));