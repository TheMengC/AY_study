"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkNewUser = checkNewUser;

var _moment = require("./moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _index = require("../../tradePolyfills/index.js");

var _userInfoChanger = require("./userInfoChanger.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 判断用户新用户属性
 * 返回值：
 * 0：非纯新、非新用户
 * 1：纯新 0天用户
 * N：1-15天内的用户,返回天数
 */
function checkNewUser(createDate, callback) {
  var isRevivalCheck = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var userInfo = (0, _userInfoChanger.getUserInfo)();
  if (createDate == undefined || typeof createDate != 'string' || createDate == '') {
    // 未传入createDate 取数据 异步返回
    if (callback == undefined) {
      return 0;
    } else {
      if (!(0, _index.isEmpty)(userInfo) && userInfo.createDate != undefined && userInfo.createDate != '') {
        callback(checkNewUser(userInfo.createDate), userInfo.createDate);
      } else {
        callback(0);
      }
    }
  } else {
    // 传入createDate 同步返回数据
    try {
      // 当前日期
      var currentDateStr = (0, _moment2.default)().format('YYYY-MM-DD');
      // let todayTime = new Date().getTime();
      if (currentDateStr) {
        currentDateStr = currentDateStr.replace(/\//g, '-');
        // 判断createDate的格式 可能是2019-01-01 11:11:11的格式
        if (currentDateStr == createDate || currentDateStr == createDate.substr(0, 10)) {
          return 1;
        }
        // 判断是否是15天内 update 计算天数按照自然日算
        var diffDays = 0;
        if (createDate) {
          var todayStartTime = new Date(currentDateStr).getTime();
          var createDateStartTime = new Date(createDate.replace(/-/g, '/').substr(0, 10)).getTime();
          diffDays = Math.ceil((todayStartTime - createDateStartTime) / 1000 / 60 / 60 / 24);
        }
        if (diffDays <= 15) {
          return diffDays;
        }
      }
      // 增加复活用户的判断，有一个专用字段 revival_date 如果有这个字段说明是复活用户，再进入一次判断
      if (!isRevivalCheck) {
        if (userInfo && userInfo.revival_date && userInfo.revival_date != '') {
          return checkNewUser(userInfo.revival_date, undefined, true);
        }
      }
      return 0;
    } catch (e) {
      // 防止报错
      console.error('校验新用户出现异常！', JSON.stringify(e));
      return 0;
    }
  }
}