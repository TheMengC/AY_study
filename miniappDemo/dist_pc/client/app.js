"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./npm/_tarojs/async-await/index.js");

var _index = require("./npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./npm/_tarojs/redux/index.js");

var _settings = require("./public/mapp_common/utils/settings.js");

var _index4 = require("./store/index.js");

var _index5 = _interopRequireDefault(_index4);

var _entry = require("./public/mapp_common/utils/entry.js");

var _selectRegion = require("./public/mapp_common/utils/selectRegion.js");

var _userInfo = require("./public/mapp_common/utils/userInfo.js");

var _elecfaceData = require("./public/tradePublic/print/elecface/elecfaceData.js");

var _action = require("./public/mapp_common/marketing/action.js");

var _index6 = require("./public/tradePublic/einvoiceWebSql/index.js");

var _index7 = _interopRequireDefault(_index6);

var _taobaoLogisticsCompaniesGet = require("./public/tradePublic/taobaoLogisticsCompaniesGet.js");

var _storage = require("./public/mapp_common/utils/storage.js");

var _qnapi = require("./public/mapp_common/utils/qnapi.js");

var _qnRouter = require("./public/tradePublic/qnRouter.js");

var _qnRouter2 = _interopRequireDefault(_qnRouter);

var _api = require("./public/mapp_common/utils/api.js");

var _cainiaoCloudprintMystdtemplatesGet = require("./public/tradePublic/cainiaoCloudprintMystdtemplatesGet.js");

var _index8 = require("./public/tradePublic/logisticsInfo/index.js");

var _logger = require("./public/mapp_common/utils/logger.js");

var _cloud = require("./public/mapp_common/utils/cloud.js");

var _index9 = require("./public/tradePublic/orderDetectionSetting/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

var propsManager = my.propsManager;
var store = (0, _index5.default)();

(0, _index3.setStore)(store);

if (_index3.ReduxContext.Provider) {
  _index3.ReduxContext.Provider({
    store: store
  });
  _index3.ReduxContext.Provider({
    store: store
  });
}

var _App = function (_BaseComponent) {
  _inherits(_App, _BaseComponent);

  function _App() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _App.__proto__ || Object.getPrototypeOf(_App)).call.apply(_ref, [this].concat(args))), _this), _this.store = store, _this.config = {
      pages: ['pages/index/index'],
      window: {
        backgroundTextStyle: 'light',
        backgroundColor: '#F2F2F2',
        // navigationBarBackgroundColor: '#f57745',
        navigationBarTitleText: 'WeChat',
        navigationBarTextStyle: 'black'
      }

    }, _this.platform = 'pc', _this.Settings = (0, _settings.settingManagerInit)(), _this.debugger = {
      storage: _storage.storage,
      qnapi: _qnapi.qnapi,
      qnRouter: _qnRouter2.default,
      api: _api.api,
      authorize: _userInfo.authorize
    }, _this.cloud = (0, _cloud.getCloud)(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  //  cloud = cloud


  _createClass(_App, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var query = this.$router.params.query;

      if (query && query.event) {
        if (query.event == 'tradeDetail' || query.event == 'refundDetail') {
          (0, _entry.setEntry)('detail');
        } else if (query.event == 'tradeList') {
          (0, _entry.setEntry)('list');
        }
      }
      (0, _userInfo.userInfoInit)();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _action.marketingReduxInit)();
      (0, _elecfaceData.initElecfaceTemplateInfo)();
      _index7.default.init();
      (0, _selectRegion.logisticsAddressAreaInit)();
      (0, _taobaoLogisticsCompaniesGet.aiyongLogisticsCompaniesInit)();
      (0, _cainiaoCloudprintMystdtemplatesGet.cainiaoCloudprintMystdtemplatesGet)();
      _index8.LogisticsWebSql.init();
      (0, _index9.initAddressWarningInfo)({ refresh: true });
      _storage.storage.removeItem('taobao.logistics.address.search');
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {}
  }, {
    key: "componentDidHide",
    value: function componentDidHide() {}
  }, {
    key: "componentDidCatchError",
    value: function componentDidCatchError(error) {
      _logger.Logger.error('页面错误', error);
    }

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数

  }, {
    key: "_createData",
    value: function _createData() {}
  }]);

  return _App;
}(_index.Component);

exports.default = _App;

App(require('./npm/_tarojs/taro-alipay/index.js').default.createApp(_App));
_index2.default.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "375": 0.5,
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});