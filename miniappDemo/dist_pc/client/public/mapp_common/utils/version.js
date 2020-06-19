"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentVersionNum = undefined;

var _env = require("../../../constants/env.js");

var getCurrentVersionNum = exports.getCurrentVersionNum = function getCurrentVersionNum() {
  return _env.ENV.version;
};