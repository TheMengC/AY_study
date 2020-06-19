"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("../npm/redux/lib/redux.js");

var _reducer = require("../public/mapp_common/marketing/reducer.js");

var _reducer2 = require("../pages/refundManagement/reducer.js");

var _reducer3 = require("../pages/orderManagement/reducer.js");

exports.default = (0, _redux.combineReducers)({
  marketingAdInfoReducer: _reducer.marketingAdInfoReducer,
  refundListReducer: _reducer2.refundListReducer,
  orderListReducer: _reducer3.orderListReducer
});