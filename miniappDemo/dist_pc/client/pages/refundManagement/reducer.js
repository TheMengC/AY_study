'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refundListReducer = refundListReducer;

var _config = require('./config.js');

var initState = {
  searchVal: '',
  activeTabKey: 'ALL',
  tradeCounts: {},
  pageSize: 20,
  pageNo: 1,
  list: [],
  isLoading: true
};

function refundListReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments[1];

  switch (action.type) {
    case _config.REFUND_CHANGE:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}