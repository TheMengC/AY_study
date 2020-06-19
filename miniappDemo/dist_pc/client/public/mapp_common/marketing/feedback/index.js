"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.feedbackClicked = exports.feedbackClosed = exports.feedbackShowed = undefined;

var _index = require("../../utils/index.js");

var _userInfoChanger = require("../../utils/userInfoChanger.js");

var _api = require("../../utils/api.js");

var _env = require("../../../../constants/env.js");

// import {GetUserInfo} from "../User/GetUserInfo";
// import {DoBeanWithObj} from "../DoBeacon/DoBeacon";

var FEEDBACK_TYPE_SHOWED = 1; // 展现type
var FEEDBACK_TYPE_CLICKED = 2; // 点击type
var FEEDBACK_TYPE_CLOSED = 3; // 关闭type

/*
 * @Description 反馈广告展现事件
*/
var feedbackShowed = exports.feedbackShowed = function feedbackShowed(_ref) {
  var adData = _ref.adData;

  if ((0, _index.isEmpty)(adData)) {
    return;
  }
  var open_id = adData.open_id,
      open_cid = adData.creative_id,
      pid = adData.pid;

  var _getUserInfo = (0, _userInfoChanger.getUserInfo)(),
      imei = _getUserInfo.user_id;

  feedback({ open_id: open_id, open_cid: open_cid, imei: imei, type: FEEDBACK_TYPE_SHOWED, pid: pid });
};

/*
 * @Description 反馈广告关闭事件
*/
var feedbackClosed = exports.feedbackClosed = function feedbackClosed(_ref2) {
  var adData = _ref2.adData;

  if ((0, _index.isEmpty)(adData)) {
    return;
  }
  var open_id = adData.open_id,
      open_cid = adData.creative_id,
      pid = adData.pid;

  var _getUserInfo2 = (0, _userInfoChanger.getUserInfo)(),
      imei = _getUserInfo2.user_id;

  feedback({ open_id: open_id, open_cid: open_cid, imei: imei, type: FEEDBACK_TYPE_CLOSED, pid: pid });
};

/*
 * @Description 反馈广告点击事件
*/
var feedbackClicked = exports.feedbackClicked = function feedbackClicked(_ref3) {
  var adData = _ref3.adData,
      url = _ref3.url;

  if ((0, _index.isEmpty)(adData)) {
    return;
  }
  var pid = (0, _index.isEmpty)(adData.modalVipPid) ? adData.pid : adData.modalVipPid;
  var open_id = adData.open_id,
      open_cid = adData.creative_id;

  var _getUserInfo3 = (0, _userInfoChanger.getUserInfo)(),
      imei = _getUserInfo3.user_id;

  feedback({ open_id: open_id, open_cid: open_cid, imei: imei, type: FEEDBACK_TYPE_CLICKED, pid: pid, url: url });
};

/*
 * @Description 实际的广告反馈请求
*/
function feedback(_ref4) {
  var open_id = _ref4.open_id,
      open_cid = _ref4.open_cid,
      imei = _ref4.imei,
      type = _ref4.type,
      pid = _ref4.pid,
      _ref4$url = _ref4.url,
      url = _ref4$url === undefined ? undefined : _ref4$url;

  var args = {
    open_id: open_id,
    open_cid: open_cid,
    type: type,
    imei: imei,
    pid: pid,
    source: _env.ENV.adFeedbackSource
  };

  if (!(0, _index.isEmpty)(url)) {
    args.url = encodeURIComponent(url);
  }

  (0, _api.api)({
    apiName: 'aiyong.ad.showAd.feedback',
    args: args
  });
}