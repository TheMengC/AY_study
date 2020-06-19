"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doSql = doSql;
exports.doSqlAsync = doSqlAsync;
exports.canUseSql = canUseSql;

var _index = require("./index.js");

var _logger = require("./logger.js");

/**
 * 执行sql
 * @param sql
 * @param params
 * @param callback
 * @param errCallback
 */
function doSql(_ref) {
  var sql = _ref.sql,
      _ref$params = _ref.params,
      params = _ref$params === undefined ? [] : _ref$params,
      _ref$callback = _ref.callback,
      callback = _ref$callback === undefined ? _index.NOOP : _ref$callback,
      _ref$errCallback = _ref.errCallback,
      errCallback = _ref$errCallback === undefined ? function (e) {
    return console.error(e);
  } : _ref$errCallback;

  _logger.Logger.debug('dosql-start', sql, params);
  try {
    var env = canUseSql();
    if (!env) {
      errCallback('websql没有实现');
      return;
    }
    if (env == 'h5') {
      window.db.transaction(function (context) {
        context.executeSql(sql, params, callback, errCallback);
      });
      return;
    }
    if (env == 'qn') {
      _logger.Logger.log('dosql-execSql');
      my.qn.database({
        method: "execSql",
        sql: [sql, params],
        success: function success(res) {
          _logger.Logger.debug('dosql-success', res);
          // drop table 时 res没有数据
          if ((0, _index.isEmpty)(res)) {
            callback(res);
          } else if (Boolean(res.success) == true) {
            var data = "";
            try {
              data = JSON.parse(res.data);
            } catch (error) {
              //这里报错。一般都是 {success: "true", data: ""} 这种情况下，转化data造成的，这种情况不处理,剩下的情况进入失败回调
            }
            callback(data);
          } else {
            errCallback(res);
          }
        },
        fail: function fail(res) {
          _logger.Logger.warn('dosql-fail', res);
          errCallback(res);
        }
      });
    }
  } catch (e) {
    errCallback(e);
  }
}

/**
 * promise方式调用sql (上面函数的promise包装)
 * @param sql
 * @param params
 * @returns {Promise<unknown>}
 */
function doSqlAsync(_ref2) {
  var sql = _ref2.sql,
      _ref2$params = _ref2.params,
      params = _ref2$params === undefined ? [] : _ref2$params;

  return new Promise(function (resolve, reject) {
    doSql({
      sql: sql,
      params: params,
      callback: resolve,
      errCallback: reject
    });
  });
}
/**
 * 判断websql是否可用
 * @returns {}
 */
function canUseSql() {
  if (window && window.db && window.db.transaction) {
    return 'h5';
  }
  if (my && my.qn && my.qn.database) {
    return 'qn';
  }
  return false;
}

var sqlHelper = {
  canUseSql: canUseSql,
  doSql: doSql,
  doSqlAsync: doSqlAsync
};
exports.default = sqlHelper;