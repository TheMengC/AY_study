'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orderListReducer = orderListReducer;

var _config = require('./config.js');

var defalutStates = {
  searchVal: '',
  activeTabKey: 'WAIT_BUYER_PAY',
  tradeCounts: {},
  pageSize: 20,
  pageNo: 1,
  list: [],
  isLoading: true
};

function orderListReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defalutStates;
  var action = arguments[1];

  switch (action.type) {
    case _config.REFUND_CHANGE:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}