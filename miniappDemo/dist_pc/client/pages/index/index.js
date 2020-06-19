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

var _eventManager = require("../../public/mapp_common/utils/eventManager.js");

var _constants = require("../../public/tradePublic/marketing/constants.js");

var _biz = require("../../public/mapp_common/marketing/utils/biz.js");

var _index3 = require("../../components/router/index.js");

var _routes = require("../../components/router/routes.js");

var _index4 = require("../../public/mapp_common/utils/index.js");

var _api = require("../../components/dialogManager/api.js");

var _api2 = _interopRequireDefault(_api);

var _openChat = require("../../public/mapp_common/utils/openChat.js");

var _logger = require("../../public/mapp_common/utils/logger.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsManager = my.propsManager;

var Index = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Index, _BaseComponent);

  function Index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["$compid__3", "currentMain", "routes", "haveNotice", "sidebarMini", "currentSub", "currentRoute", "currentChildren", "anonymousState__temp", "anonymousState__temp2", "showAD", "showNotice", "hadShownNotice"], _this.config = {
      navigationBarTitleText: '首页',
      usingComponents: { 'router-view': '../../components/miniapp-router/router-view/router-view' // 书写第三方组件的相对路径
      }
    }, _this.onLoad = function () {}, _this.showDialog = function () {
      (0, _api2.default)({
        name: 'testDialog',
        props: { text: '快看啊 有勾吧有勾吧有勾吧有勾吧' },
        isShow: true
      });
    }, _this.changeRoute = function (route, parent) {

      if (route.redirect) {
        (0, _index3.changeRoute)({ path: route.redirect });
        return;
      }
      if (route.abstract) {
        if (!Array.isArray(route.children) || route.children.length == 0) {
          _logger.Logger.error("route不合法,虚拟路由必须有子路由", route);
          return;
        }
        var child = route.children.find(function (item) {
          return item.default;
        });
        if (!child) {
          child = route.children[0];
        }
        _this.changeRoute(child, route);
        return;
      }
      var path = route.path;
      if (parent) {
        path = parent.path + path;
      }
      path = path.replace(/\/\:.+$/, '');
      (0, _index3.changeRoute)({ path: path });
    }, _this.toggleSideBarMini = function () {
      _this.setState({ sidebarMini: !_this.state.sidebarMini });
    }, _this.toggleNoticeBallon = function () {
      var showNotice = _this.state.showNotice;

      _this.setState({ showNotice: !showNotice });
    }, _this.customComponents = ["Marketing", "NoticeBallon", "RefundManagement", "OrderManagement", "Test", "DialogManager"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Index, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Index.prototype.__proto__ || Object.getPrototypeOf(Index.prototype), "_constructor", this).call(this, props);
      this.state = {
        showAD: false,
        sidebarMini: false,
        haveNotice: false,
        showNotice: false,
        hadShownNotice: false
      };

      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillMount",


    // componentWillReceiveProps (nextProps) {
    // }

    value: function componentWillMount() {
      var _this2 = this;

      (0, _index3.initRouter)(this.$scope);
      // this.$scope.$router.push('/tradeManagement');
      console.log('999999999999999999');
      _eventManager.events.userInfoCallback.subscribe(function (userInfo) {
        var state = { showAD: true };
        if (!(0, _index4.isEmpty)(userInfo.notice)) {
          state.haveNotice = true;
          state.showNotice = true;
          _this2.notice = userInfo.notice;
        }
        _this2.setState(state);
      });
      _eventManager.events.routerChanged.subscribeOnce(function () {
        _this2.forceUpdate();
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {}
  }, {
    key: "componentDidHide",
    value: function componentDidHide() {}
  }, {
    key: "_createMarketingData",


    /*
     * @Description 渲染运营相关组件
     */

    value: function _createMarketingData(_$uid) {
      var _this3 = this;

      return function (type) {
        var _genCompid = (0, _index.genCompid)(_$uid + "$compid__1"),
            _genCompid2 = _slicedToArray(_genCompid, 2),
            $prevCompid__1 = _genCompid2[0],
            $compid__1 = _genCompid2[1];

        var _genCompid3 = (0, _index.genCompid)(_$uid + "$compid__2"),
            _genCompid4 = _slicedToArray(_genCompid3, 2),
            $prevCompid__2 = _genCompid4[0],
            $compid__2 = _genCompid4[1];

        var loopArray0 = void 0;

        var showAD = _this3.state.showAD;

        if (!showAD) {
          return null;
        }
        var from = 'index';
        var jsx = null;
        if (type === 'notice') {
          propsManager.set({
            "type": _constants.MARKETING_TYPE.notice,
            "from": from
          }, $compid__1, $prevCompid__1);
        } else if (type === 'banner') {
          propsManager.set({
            "type": _constants.MARKETING_TYPE.banner,
            "from": from
          }, $compid__2, $prevCompid__2);
        } else {
          loopArray0 = [].concat(_toConsumableArray(_constants.PC_COMMON_MARKETING_MASK), [_constants.MARKETING_TYPE.midCard]).map(function (item, _anonIdx) {
            item = {
              $original: (0, _index.internal_get_original)(item)
            };

            var _genCompid5 = (0, _index.genCompid)(_$uid + "czzzzzzzzz" + _anonIdx, true),
                _genCompid6 = _slicedToArray(_genCompid5, 2),
                $prevCompid__0 = _genCompid6[0],
                $compid__0 = _genCompid6[1];

            propsManager.set({
              "type": item.$original,
              "from": from
            }, $compid__0, $prevCompid__0);
            return {
              $compid__0: $compid__0,
              $original: item.$original
            };
          });
        }
        return {
          loopArray0: loopArray0,
          $compid__1: $compid__1,
          $compid__2: $compid__2,
          showAD: showAD,
          type: type
        };
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid7 = (0, _index.genCompid)(__prefix + "$compid__3"),
          _genCompid8 = _slicedToArray(_genCompid7, 2),
          $prevCompid__3 = _genCompid8[0],
          $compid__3 = _genCompid8[1];

      var currentPath = (0, _index3.getCurrentPath)();
      var paths = currentPath.split('/').filter(Boolean);
      var currentMain = '/' + paths[0];
      var currentSub = '';
      if (paths[1]) {
        currentSub = '/' + paths[1];
      }
      var currentRoute = _routes.routes.find(function (item) {
        return item.path == currentMain;
      });
      var currentChildren = [];
      if (currentRoute && currentRoute.children) {
        currentChildren = currentRoute.children.filter(function (item) {
          return !(item.hide == true);
        });
        currentChildren.map(function (item) {
          return item.path = item.path.replace(/\/\:.+$/, '');
        });
      }
      var _state = this.__state,
          haveNotice = _state.haveNotice,
          showNotice = _state.showNotice,
          hadShownNotice = _state.hadShownNotice,
          sidebarMini = _state.sidebarMini;


      var anonymousState__temp = this._createMarketingData(__prefix + "azzzzzzzzz")('banner');

      var anonymousState__temp2 = this._createMarketingData(__prefix + "bzzzzzzzzz")();

      this.anonymousFunc0 = function () {
        (0, _biz.showModalVIP)(783);
      };

      this.anonymousFunc1 = function () {
        return (0, _openChat.contactCustomerService)('联系客服');
      };

      haveNotice && propsManager.set({
        "showNotice": showNotice,
        "notice": this.notice,
        "close": this.toggleNoticeBallon,
        "hadShownNotice": hadShownNotice
      }, $compid__3, $prevCompid__3);
      Object.assign(this.__state, {
        $compid__3: $compid__3,
        currentMain: currentMain,
        routes: _routes.routes,
        currentSub: currentSub,
        currentRoute: currentRoute,
        currentChildren: currentChildren,
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }, {
    key: "anonymousFunc1",
    value: function anonymousFunc1(e) {
      ;
    }
  }]);

  return Index;
}(_index.Component), _class.$$events = ["changeRoute", "anonymousFunc0", "anonymousFunc1", "toggleSideBarMini"], _class.$$componentPath = "pages/index/index", _temp2);
exports.default = Index;

Page(require('../../npm/_tarojs/taro-alipay/index.js').default.createComponent(Index, true));