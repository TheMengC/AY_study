'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AD_COMMON_STATE = exports.AD_COMMON_STATE = {
  pid: undefined,
  page: undefined,
  state: undefined,
  lastCloseTime: undefined,
  type: undefined
};

var INITIAL_STATE = {};

var marketingAdInfoReducer = exports.marketingAdInfoReducer = function marketingAdInfoReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments[1];
  var type = action.type,
      data = action.data;

  switch (type) {
    case 'UPDATE_AD_INFO':
      return Object.assign({}, state, data);
    default:
      return state;
  }
};