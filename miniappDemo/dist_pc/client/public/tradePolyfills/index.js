"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tools = exports.Object_values = exports.Logger = exports.checkNewUser = exports.getEntry = exports.events = exports.getLastCloseTime = exports.getSystemInfo = exports.getCurrentPageName = exports.getSettings = exports.isPaidVip = exports.getUserInfo = exports.tradeBeacon = exports.loading = exports.getDeferred = exports.storage = exports.getWindow = exports.getCurrentVersionNum = exports.qnapi = exports.isIOS = exports.NOOP = exports.isEmpty = exports.beacons = exports.api = exports.ENV = exports.moment = exports.sqlHelper = exports.showConfirmModal = undefined;

var _index = require("../mapp_common/utils/index.js");

var _qnapi = require("../mapp_common/utils/qnapi.js");

var _api = require("../mapp_common/utils/api.js");

var _storage = require("../mapp_common/utils/storage.js");

var _window = require("../mapp_common/utils/window.js");

var _loading = require("../mapp_common/utils/loading.js");

var _beacon = require("../mapp_common/utils/beacon.js");

var _version = require("../mapp_common/utils/version.js");

var _userInfo = require("../mapp_common/utils/userInfo.js");

var _settings = require("../mapp_common/utils/settings.js");

var _env = require("../../constants/env.js");

var _moment = require("../mapp_common/utils/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _sqlHelper = require("../mapp_common/utils/sqlHelper.js");

var _sqlHelper2 = _interopRequireDefault(_sqlHelper);

var _logger = require("../mapp_common/utils/logger.js");

var _systemInfo = require("../mapp_common/utils/systemInfo.js");

var _action = require("../mapp_common/marketing/action.js");

var _userInfoChanger = require("../mapp_common/utils/userInfoChanger.js");

var _eventManager = require("../mapp_common/utils/eventManager.js");

var _entry = require("../mapp_common/utils/entry.js");

var _checkNewUser = require("../mapp_common/utils/checkNewUser.js");

var _utils = require("../tradePublic/utils.js");

var _resetAuthorize = require("../mapp_common/utils/resetAuthorize.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showConfirmModal = _index.showConfirmModal;
exports.sqlHelper = _sqlHelper2.default;
exports.moment = _moment2.default;
exports.ENV = _env.ENV;
exports.api = _api.api;
exports.beacons = _beacon.beacons;
exports.isEmpty = _index.isEmpty;
exports.NOOP = _index.NOOP;
exports.isIOS = _index.isIOS;
exports.qnapi = _qnapi.qnapi;
exports.getCurrentVersionNum = _version.getCurrentVersionNum;
exports.getWindow = _window.getWindow;
exports.storage = _storage.storage;
exports.getDeferred = _index.getDeferred;
exports.loading = _loading.loading;
exports.tradeBeacon = _beacon.tradeBeacon;
exports.getUserInfo = _userInfoChanger.getUserInfo;
exports.isPaidVip = _userInfo.isPaidVip;
exports.getSettings = _settings.getSettings;
exports.getCurrentPageName = _index.getCurrentPageName;
exports.getSystemInfo = _systemInfo.getSystemInfo;
exports.getLastCloseTime = _action.getLastCloseTime;
exports.events = _eventManager.events;
exports.getEntry = _entry.getEntry;
exports.checkNewUser = _checkNewUser.checkNewUser;
exports.Logger = _logger.Logger;
exports.Object_values = _index.Object_values;
// debugger
/**
 * 上面这个神奇的debugger 不要小看了他
 * 有时候在tradePublic中有一些东西从这边export出来会莫名其妙出现undefined的问题
 * 如Logger
 * 这个时候就需要把上面这个debugger激活 然后在进小程序开发工具中进行调试
 * 调试这种错误 要先把devtools里面的sourcemap关掉 因为这个是一个引用错误 需要看到__webpack_require__这个函数的调用堆栈
 * 如 Logger失效了 需要在这边看上面对于mapp_common/utils/logger.js这个module 的__webpack_require__返回值是什么 理论上返回值对象内部的Logger应该是undefined
 * 接下来就查调用堆栈
 * 这种循环引用导致的导出常量失效通常是在`mapp_common/utils/logger.js`module 中 在定义Logger常量前引用了一些东西 导致Logger还没有完成定义的时候就调用到了这个文件
 * 这时候 我们查调用堆栈通常能查到`__webpack_require__('../mapp_common/utils/logger.js')` 就印证了我们上面的猜想 是因为Logger间接引用了这个文件导致的
 * 这个时候就把间接引用的这个地方给断掉 比如mapp_common/utils/logger.js->mapp_common/utils/api.js->tradePolyfill/index.js
 * 这时候就想办法让mapp_common/utils/logger.js不依赖mapp_common/utils/api.js 就可以了
 */

var Tools = exports.Tools = {
  toDoTranslate: _resetAuthorize.resetAuthorize,
  api: _api.api,
  beacons: _beacon.beacons,
  isEmpty: _index.isEmpty,
  NOOP: _index.NOOP,
  qnapi: _qnapi.qnapi,
  getCurrentVersionNum: _version.getCurrentVersionNum,
  showErrorDialog: _utils.showErrorDialog,
  getWindow: _window.getWindow,
  storage: _storage.storage,
  getDeferred: _index.getDeferred,
  loading: _loading.loading,
  tradeBeacon: _beacon.tradeBeacon,
  getUserInfo: _userInfoChanger.getUserInfo,
  isPaidVip: _userInfo.isPaidVip,
  getSettings: _settings.getSettings,
  sqlHelper: _sqlHelper2.default,
  Logger: _logger.Logger
};