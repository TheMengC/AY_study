"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showDialog = showDialog;

var _eventManager = require("../../public/mapp_common/utils/eventManager.js");

var _index = require("../../public/mapp_common/utils/index.js");

/**
 * 显示对话框的api
 * @param args
 */
function showDialog() {
  if ((0, _index.isObject)(arguments.length <= 0 ? undefined : arguments[0])) {
    _eventManager.events.showDialog.emit(arguments.length <= 0 ? undefined : arguments[0]);
  } else {
    _eventManager.events.showDialog.emit({
      name: arguments.length <= 0 ? undefined : arguments[0],
      props: arguments.length <= 1 ? undefined : arguments[1]
    });
  }
}

exports.default = showDialog;