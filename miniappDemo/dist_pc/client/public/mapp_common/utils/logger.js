"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.record = exports.Logger = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.remoteLogSend = remoteLogSend;
exports._log = _log;
exports.clearRecordLog = clearRecordLog;
exports.getLogRecord = getLogRecord;
exports.recordLog = recordLog;

var _qnProxy = require("./qnProxy.js");

var _settings = require("./settings.js");

var _index = require("./index.js");

var _systemInfo = require("./systemInfo.js");

var LEVELS = {
  error: 0,
  warn: 1,
  log: 2,
  debug: 3
};
var Logger = exports.Logger = {
  debug: function debug() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // 这边的重复是为了ide的补全
    _log.apply(undefined, ['debug'].concat(args));
  },
  log: function log() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _log.apply(undefined, ['log'].concat(args));
  },
  warn: function warn() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _log.apply(undefined, ['warn'].concat(args));
  },
  error: function error() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _log.apply(undefined, ['error'].concat(args));
  },
  alert: function alert() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    (0, _index.showConfirmModal)({
      title: '出错了',
      content: JSON.stringify(args),
      showCancel: false
    });
    _log('error', args);
  }
};

/**
 * remoteLog发送内容
 * @param strs
 */
function remoteLogSend(args) {
  (0, _qnProxy.proxySend)(_extends({ category: "LOG" }, args));
}

/**
 * 日志输出方法
 * @param func
 * @param strs
 * @private
 */
function _log(func) {
  for (var _len6 = arguments.length, strs = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    strs[_key6 - 1] = arguments[_key6];
  }

  var _console = console;
  var systemInfo = (0, _systemInfo.getSystemInfo)();
  if (!(systemInfo.system.startsWith('9.') && systemInfo.platform == 'iOS')) {
    // ios9不能console.log.apply
    _console[func].apply(null, [].concat(strs));
  }

  if ((0, _qnProxy.getRemoteLogEnabled)()) {
    (0, _qnProxy.getProxyDeferred)().then(function () {
      remoteLogSend({ type: func, content: strs });
    });
  }
  if (LEVELS[func] <= LEVELS[(0, _settings.getSettings)().proxy.logRecordLevel]) {
    recordLog.apply(undefined, [func].concat(strs));
  }
}
var record = exports.record = {
  log: [],
  actionQueueUploadedLength: 0
};

function clearRecordLog() {
  record.log = [];
}
/**
 * 拿到log
 */
function getLogRecord() {
  return record;
}

/**
 * 记录日志
 * @param level
 * @param args
 */
function recordLog(level) {
  for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    args[_key7 - 1] = arguments[_key7];
  }

  record.log.push({ level: level, content: args });
}