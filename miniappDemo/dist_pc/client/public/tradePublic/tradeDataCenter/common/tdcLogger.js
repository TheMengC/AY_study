"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TdcLogger = exports.logLevel = undefined;
exports.log = log;

var _index = require("../../../tradePolyfills/index.js");

var logLevel = exports.logLevel = 4;
var TdcLogger = exports.TdcLogger = { error: _index.NOOP, warning: _index.NOOP, info: _index.NOOP, debug: _index.NOOP };
var logMap = {
  0: { method: 'error', style: 'color:white;background-color:red' },
  1: { method: 'warning', style: 'color:white;background-color:orange' },
  2: { method: 'info', style: 'color:white;background-color:green' },
  3: { method: 'debug', style: 'color:white;background-color:#87939a' }
};
Object.keys(logMap).map(function (item) {
  TdcLogger[logMap[item].method] = log.bind(null, item);
});
function log(level, name) {
  if (level <= logLevel) {
    for (var _len = arguments.length, str = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      str[_key - 2] = arguments[_key];
    }

    _index.Logger.log.apply(null, ["%c[" + logMap[level].method + "]%c" + name + ":", logMap[level].style, "color: white;background-color:blue"].concat(str));
  }
}