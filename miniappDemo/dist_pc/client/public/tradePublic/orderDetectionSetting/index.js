"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modifyAddressWarningContent = exports.modifyAddressWarningSwitchStatus = exports.getAddressWarningContent = exports.getAddressWarningSwitchStatus = exports.initAddressWarningInfo = exports.setDetectionSetting = exports.orderDetectionSettingStatusSet = exports.orderDetectionSettingStatusGet = undefined;

/**
 * 获取地址预警的开关状态
 * @param refresh
 * @returns {Promise<boolean>}
 */
var getAddressWarningSwitchStatus = exports.getAddressWarningSwitchStatus = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return initAddressWarningInfo({ refresh: refresh });

          case 2:
            return _context.abrupt("return", addressWarningSwitchStatus);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getAddressWarningSwitchStatus() {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * 获取地址预警的内容
 * @param refresh
 * @returns {Promise<string>}
 */


var getAddressWarningContent = exports.getAddressWarningContent = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return initAddressWarningInfo({ refresh: refresh });

          case 2:
            return _context2.abrupt("return", addressWarningContent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getAddressWarningContent() {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * 获取地址预警的开关和内容
 * @param refresh
 * @returns {Promise<string>}
 */


exports.getAddressWarningSet = getAddressWarningSet;
exports.getWarnAddress = getWarnAddress;

var _index = require("../../tradePolyfills/index.js");

var _handleError = require("../tradeDataCenter/common/handleError.js");

var _utils = require("../utils.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var orderDetectionSettingStatusGet = exports.orderDetectionSettingStatusGet = function orderDetectionSettingStatusGet(_ref) {
  var _ref$callback = _ref.callback,
      _callback = _ref$callback === undefined ? _index.NOOP : _ref$callback,
      _ref$errCallback = _ref.errCallback,
      _errCallback = _ref$errCallback === undefined ? _handleError.handleError : _ref$errCallback;

  (0, _index.api)({
    apiName: 'aiyong.user.settings.orderdetect.set',
    method: '/set/updateDetectSet',
    args: { type: 'get' },
    callback: function callback(res) {
      if (res.code === 200) {
        _callback(res.result);
      } else {
        _errCallback('code != 200');
      }
    },
    errCallback: function errCallback(msg) {
      _errCallback(msg);
    }
  });
};

var orderDetectionSettingStatusSet = exports.orderDetectionSettingStatusSet = function orderDetectionSettingStatusSet(_ref2) {
  var data = _ref2.data,
      _ref2$callback = _ref2.callback,
      _callback2 = _ref2$callback === undefined ? _index.NOOP : _ref2$callback,
      _ref2$errCallback = _ref2.errCallback,
      _errCallback2 = _ref2$errCallback === undefined ? _handleError.handleError : _ref2$errCallback;

  (0, _index.api)({
    apiName: 'aiyong.user.settings.orderdetect.set',
    method: '/set/updateDetectSet',
    args: {
      type: 'save',
      json: data
    },
    callback: function callback(res) {
      if (res.code === 200) {
        _callback2(res.result);
      } else {
        _errCallback2('code != 200');
      }
    },
    errCallback: function errCallback(msg) {
      _errCallback2(msg);
    }
  });
};

var setDetectionSetting = exports.setDetectionSetting = (0, _utils.getDebounce)(orderDetectionSettingStatusSet, 800);

var addressWarningSwitchStatus = false;
var addressWarningContent = '';

/**
 *
 * @param callback
 * @param errCallback
 */
function addressWarningInoGet(_ref3) {
  var _ref3$callback = _ref3.callback,
      callback = _ref3$callback === undefined ? _index.NOOP : _ref3$callback,
      _ref3$errCallback = _ref3.errCallback,
      errCallback = _ref3$errCallback === undefined ? _handleError.handleError : _ref3$errCallback;

  (0, _index.api)({
    apiName: 'aiyong.user.settings.specialaddress.get',
    method: '/iytrade2/getuserglsz',
    callback: callback,
    errCallback: errCallback
  });
}

var initAddressWarningInfo = exports.initAddressWarningInfo = (0, _utils.getDataDeferred)(addressWarningInoGet, function (res) {
  if (res.tsdz) {
    var data = res.tsdz.split(';');
    addressWarningSwitchStatus = data[0] === 'on';
    addressWarningContent = data[1];
  }
});function getAddressWarningSet() {
  return {
    addressWarningSwitchStatus: addressWarningSwitchStatus,
    addressWarningContent: addressWarningContent
  };
}

/**
 * 保存地址预警信息
 * @param switchStatus
 * @param content
 * @param callback
 * @param errCallback
 */
function addressWarningInfoSet(_ref6) {
  var switchStatus = _ref6.switchStatus,
      content = _ref6.content,
      _ref6$callback = _ref6.callback,
      callback = _ref6$callback === undefined ? _index.NOOP : _ref6$callback,
      _ref6$errCallback = _ref6.errCallback,
      errCallback = _ref6$errCallback === undefined ? _handleError.handleError : _ref6$errCallback;

  (0, _index.api)({
    apiName: 'aiyong.user.settings.addresswarning.save',
    method: '/iytrade2/saveglsz',
    args: { tsdz: (switchStatus ? 'on' : 'off') + ";" + content },
    callback: callback,
    errCallback: errCallback
  });
}

/**
 * 修改地址预警开关
 * @param switchStatus
 * @param callback
 * @param errCallback
 */
function modifyAddressWarningSwitchStatus(_ref7) {
  var switchStatus = _ref7.switchStatus,
      _ref7$callback = _ref7.callback,
      _callback3 = _ref7$callback === undefined ? _index.NOOP : _ref7$callback,
      _ref7$errCallback = _ref7.errCallback,
      errCallback = _ref7$errCallback === undefined ? _handleError.handleError : _ref7$errCallback;

  addressWarningInfoSet({
    switchStatus: switchStatus,
    content: addressWarningContent,
    callback: function callback(res) {
      addressWarningSwitchStatus = switchStatus;
      _callback3(res);
    },
    errCallback: errCallback
  });
}

/**
 * 修改地址预警内容
 * @param content
 * @param callback
 * @param errCallback
 */
exports.modifyAddressWarningSwitchStatus = modifyAddressWarningSwitchStatus;
function modifyAddressWarningContent(_ref8) {
  var content = _ref8.content,
      _ref8$callback = _ref8.callback,
      _callback4 = _ref8$callback === undefined ? _index.NOOP : _ref8$callback,
      _ref8$errCallback = _ref8.errCallback,
      errCallback = _ref8$errCallback === undefined ? _handleError.handleError : _ref8$errCallback;

  content = content.split('，');
  content = content.join(',');
  addressWarningInfoSet({
    switchStatus: addressWarningSwitchStatus,
    content: content,
    callback: function callback(res) {
      addressWarningContent = content;
      _callback4(res);
    },
    errCallback: errCallback
  });
}

/**
 * 传入地址获取风险地址
 * @param address
 * @returns {{addrObj: object}}
 * addrObj:是一个对象，key为地址，value是否为风险地址
 */
exports.modifyAddressWarningContent = modifyAddressWarningContent;
function getWarnAddress(address) {
  var warnAddress = {};

  var addressWarning = getAddressWarningSet();
  if (!addressWarning.addressWarningSwitchStatus) {
    return warnAddress;
  }

  // 将风险地址切割成数组，在地址中寻找关键词的下标
  var warnContArr = addressWarning.addressWarningContent.split(',');
  var splitIndex = [];
  warnContArr.forEach(function (cont) {
    var index = address.indexOf(cont);
    if (index > -1) {
      splitIndex = [].concat(_toConsumableArray(splitIndex), [index, index + cont.length]);
    }
  });

  // 地址中没有关键词
  if ((0, _index.isEmpty)(splitIndex)) {
    return warnAddress;
  }

  // 地址中含有关键词
  splitIndex = [0].concat(_toConsumableArray(splitIndex));
  splitIndex.forEach(function (item, index) {
    var nextItem = splitIndex[index + 1] ? splitIndex[index + 1] : -1;
    var addrChip = address.slice(item, nextItem);
    warnAddress[addrChip] = warnContArr.indexOf(addrChip) > -1;
  });
  return warnAddress;
}