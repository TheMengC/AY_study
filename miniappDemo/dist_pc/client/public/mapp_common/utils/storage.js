"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storage = undefined;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = undefined;

var storage = exports.storage = {
  setItem: function setItem(key, value) {
    return _index2.default.setStorage({ key: key, data: value });
  },
  setItemSync: function setItemSync(key, value) {
    return _index2.default.setStorageSync(key, value);
  },
  getItem: function getItem(key) {
    return _index2.default.getStorage({ key: key }).then(function (res) {
      return res.data;
    });
  },
  getItemSync: function getItemSync(key) {
    return _index2.default.getStorageSync(key);
  },
  removeItem: function removeItem(key) {
    return _index2.default.removeStorage({ key: key });
  },
  clear: function clear() {
    return _index2.default.clearStorage();
  },
  getInfo: function getInfo() {
    return _index2.default.getStorageInfo();
  },
  getInfoSync: function getInfoSync() {
    return _index2.default.getStorageInfoSync();
  },
  getAll: function getAll() {
    var res = _index2.default.getStorageInfoSync();
    return res.keys.map(_this.getItemSync);
  }
};