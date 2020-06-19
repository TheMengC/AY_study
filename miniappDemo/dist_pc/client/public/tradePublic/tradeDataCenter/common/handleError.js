"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleError = handleError;

var _tdcLogger = require("./tdcLogger.js");

function handleError(error, name) {
  _tdcLogger.TdcLogger.error(name || '未知错误', error);
}