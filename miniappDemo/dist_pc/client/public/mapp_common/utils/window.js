"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _window = {
  console: console,
  get location() {}
};
var getWindow = exports.getWindow = function getWindow() {
  if (window) {
    return window;
  } else {
    return _window;
  }
};