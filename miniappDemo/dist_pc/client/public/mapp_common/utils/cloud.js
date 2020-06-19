"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCloud = getCloud;

var _index = require("../../../npm/_tbmp/mp-cloud-sdk/index.js");

var cloud = new _index.Cloud();
cloud.init({
  // env: 'test',
  cloudId: 'v0jj5jyrnvry'
});

/**
 * 取到cloud
 * @returns {Cloud}
 */
function getCloud() {
  return cloud;
}