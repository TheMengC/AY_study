"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newUserTasks_dispatch = exports.newUserTasks_getState = exports.checkIn_dispatch = exports.checkIn_getState = undefined;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkIn_getState = exports.checkIn_getState = function checkIn_getState() {
  var app = _index2.default.getApp();
  return app.store.getState().updateNewUserVillageReducer.checkInData;
};
/*
 * @Description 更新redux中的签到信息
*/
var checkIn_dispatch = exports.checkIn_dispatch = function checkIn_dispatch(data) {
  var app = _index2.default.getApp();
  console.log('同步新手村的数据到redux里', data);
  app.store.dispatch({ type: "UPDATE_CHECKIN_DATA", data: data });
};

// 返回redux里最新的任务数据
var newUserTasks_getState = exports.newUserTasks_getState = function newUserTasks_getState() {
  var app = _index2.default.getApp();
  return app.store.getState().updateNewUserVillageReducer.tasksData;
};

var newUserTasks_dispatch = exports.newUserTasks_dispatch = function newUserTasks_dispatch(data) {
  var app = _index2.default.getApp();
  console.log('同步新手任务的数据到redux里', data);
  app.store.dispatch({ type: "UPDATE_NEWUSERTASKS_DATA", data: data });
};