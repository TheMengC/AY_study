'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntryArgs = exports.setEntryArgs = exports.setEntry = exports.getEntry = undefined;
exports.setEntryTriggered = setEntryTriggered;
exports.getEntryTriggered = getEntryTriggered;

var _index = require('../../tradePolyfills/index.js');

var _entry = 'index';
var _args = {};
var _entry_triggered = false;
var getEntry = exports.getEntry = function getEntry() {
  return _entry;
};

var setEntry = exports.setEntry = function setEntry(newEntry) {
  _entry = newEntry;
  return _entry;
};

var setEntryArgs = exports.setEntryArgs = function setEntryArgs(args) {
  _args = args;
  return _args;
};

var getEntryArgs = exports.getEntryArgs = function getEntryArgs() {
  return _args;
};

function setEntryTriggered(val) {
  _index.Logger.log('setEntryTriggered', val);
  _entry_triggered = val;
}

function getEntryTriggered() {
  _index.Logger.log('getEntryTriggered');
  return _entry_triggered;
}