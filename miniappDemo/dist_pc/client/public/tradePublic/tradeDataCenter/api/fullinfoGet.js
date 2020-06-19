"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._aiyongRouterBatch = exports.fullinfoGetBatch = exports.fullinfoGet = undefined;
exports._taobaoTradeFullInfoBatchGetQN = _taobaoTradeFullInfoBatchGetQN;

var _config = require("../config.js");

var _index = require("../../../tradePolyfills/index.js");

var _qnRouter = require("../../qnRouter.js");

var _qnRouter2 = _interopRequireDefault(_qnRouter);

var _consts = require("../consts.js");

var _tdcLogger = require("../common/tdcLogger.js");

var _handleError = require("../common/handleError.js");

var _resolveTopResponse = require("../common/resolveTopResponse.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fullinfoGet(_ref) {
  var tid = _ref.tid,
      source = _ref.source,
      _ref$fields = _ref.fields,
      fields = _ref$fields === undefined ? _config.fullinfoget_all_fields : _ref$fields,
      _ref$fallback = _ref.fallback,
      fallback = _ref$fallback === undefined ? true : _ref$fallback,
      _ref$callback = _ref.callback,
      _callback = _ref$callback === undefined ? _index.NOOP : _ref$callback,
      _ref$errCallback = _ref.errCallback,
      _errCallback = _ref$errCallback === undefined ? _handleError.handleError : _ref$errCallback,
      _ref$tag = _ref.tag,
      tag = _ref$tag === undefined ? '' : _ref$tag;

  return new Promise(function (resolve, reject) {
    (0, _qnRouter2.default)({
      api: 'taobao.trade.fullinfo.get',
      tag: tag,
      source: source,
      params: { tid: tid, fields: fields },
      callback: function callback(rsp) {
        rsp = (0, _resolveTopResponse.resolveTopResponse)(rsp);
        if (rsp.trade) {
          _callback(rsp.trade);
          resolve(rsp.trade);
        } else {
          reject(rsp);
          _errCallback(rsp);
        }
      },
      errCallback: function errCallback(error) {
        reject(error);
        _errCallback(error);
      }
    });
  });
}
/**
 * 获得fullinfo的方法 可以选择aiyong的router/batch或者前端的qn.invoke作为数据源
 * 目前 初级版用户统一走前端qn.invoke 高级版用户可以使用router/batch接口 在router/batch挂掉的时候也fallback到qn.invoke
 * @param tids
 * @param source
 * @param fields
 * @param fallback
 * @param callback
 * @param errCallback
 * @returns {Promise<Array>}
 */

exports.fullinfoGet = fullinfoGet;
function fullinfoGetBatch(_ref2) {
  var tids = _ref2.tids,
      source = _ref2.source,
      _ref2$fields = _ref2.fields,
      fields = _ref2$fields === undefined ? _config.fullinfoget_all_fields : _ref2$fields,
      _ref2$fallback = _ref2.fallback,
      fallback = _ref2$fallback === undefined ? true : _ref2$fallback,
      _ref2$callback = _ref2.callback,
      _callback2 = _ref2$callback === undefined ? _index.NOOP : _ref2$callback,
      _ref2$errCallback = _ref2.errCallback,
      _errCallback2 = _ref2$errCallback === undefined ? _handleError.handleError : _ref2$errCallback,
      _ref2$tag = _ref2.tag,
      tag = _ref2$tag === undefined ? '' : _ref2$tag;

  if (!source) {
    if ((0, _index.getUserInfo)().vipFlag != 0) {
      source = _consts.FULLINFO_SOURCE.aiyong;
    } else {
      source = _consts.FULLINFO_SOURCE.top;
    }
  }

  return new Promise(function (resolve, reject) {
    if (tids.length == 0) {
      resolve([]);
      _callback2([]);
      return;
    }
    var getFullinfoFromQn = function getFullinfoFromQn() {
      _taobaoTradeFullInfoBatchGetQN({
        fields: fields,
        tids: tids,
        tag: tag,
        callback: function callback(res) {
          _tdcLogger.TdcLogger.info('fullinfoGetBatch-QN', res);
          var trades = formatResponse(res);
          _callback2(trades);
          resolve(trades);
        },
        errCallback: function errCallback(err) {
          _tdcLogger.TdcLogger.info('fullinfoGetBatch-QN', err);
          _errCallback2(err);
          resolve(err);
        }
      });
    };
    switch (source) {
      case _consts.FULLINFO_SOURCE.aiyong:
        return _aiyongRouterBatch({
          tids: tids,
          fields: fields,
          callback: function callback(res) {
            _tdcLogger.TdcLogger.info('fullinfoGetBatch-aiyong', res);
            var trades = formatResponse(res);
            _callback2(trades);
            resolve(trades);
          },
          errCallback: function errCallback(err) {
            _tdcLogger.TdcLogger.error('fullinfoGetBatch-aiyong', err);
            if (fallback
            //&& (isEmpty(err.sub_code)||  //没有sub_code不知道是什么鬼问题 就走前端调吧
            //	err.sub_code=='20005'|| //初级版用户 走前端调用
            //  err.sub_code=='20004') //用户授权失效,需要前端自己查接口
            //剩下的几个sub_code就是
            ) {
                if (err.sub_code == '20004') {
                  showErrorDialog("授权失效 请重新授权");
                }
                getFullinfoFromQn();
              } else {
              _errCallback2(err);
              resolve(err);
            }
          }
        });
        break;
      case _consts.FULLINFO_SOURCE.top:
        getFullinfoFromQn();
        break;

    }
  });

  function formatResponse(response) {
    return response.map(function (item) {
      return (0, _resolveTopResponse.resolveTopResponse)(item).trade;
    });
  }
}
/**
 * 调用自己的router/batch方法
 * @param tids
 * @param fields
 * @param callback
 * @param errCallback
 * @returns {Promise<any>}
 */
exports.fullinfoGetBatch = fullinfoGetBatch;
function _aiyongRouterBatch(_ref3) {
  var tids = _ref3.tids,
      _ref3$fields = _ref3.fields,
      fields = _ref3$fields === undefined ? _config.fullinfoget_all_fields : _ref3$fields,
      _ref3$callback = _ref3.callback,
      _callback3 = _ref3$callback === undefined ? _index.NOOP : _ref3$callback,
      _ref3$errCallback = _ref3.errCallback,
      _errCallback3 = _ref3$errCallback === undefined ? _handleError.handleError : _ref3$errCallback;

  return new Promise(function (resolve, reject) {
    var action = '/router/batch';
    var method = 'taobao.trade.fullinfo.get';
    if ((0, _index.getSettings)().routerBatchErrorMock == 1) {
      action = '/router/batch1';
    }
    (0, _index.api)({
      host: _consts.pgApiHost,
      apiName: 'aiyong.trade.order.fullinfo.batchget',
      method: action,
      mode: 'json',
      args: {
        method: method,
        'param[fields]': fields,
        'value[tid]': tids
      },
      isloading: false,
      callback: function callback(res) {
        if (res.code || res.error) {
          _errCallback3(res);
          resolve(res);
        } else {
          _callback3(res);
          resolve(res);
        }
      },
      errCallback: function errCallback(res) {
        _errCallback3(res);
        resolve(res);
      }
    });
  });
}

exports._aiyongRouterBatch = _aiyongRouterBatch;
function _taobaoTradeFullInfoBatchGetQN(_ref4) {
  var tids = _ref4.tids,
      _ref4$fields = _ref4.fields,
      fields = _ref4$fields === undefined ? _config.fullinfoget_all_fields : _ref4$fields,
      _ref4$callback = _ref4.callback,
      callback = _ref4$callback === undefined ? _index.NOOP : _ref4$callback,
      _ref4$errCallback = _ref4.errCallback,
      errCallback = _ref4$errCallback === undefined ? _handleError.handleError : _ref4$errCallback,
      tag = _ref4.tag;

  if (!tag) {
    tag = '_taobaoTradeFullInfoBatchGetQN';
  }
  return Promise.all(tids.map(function (tid, index) {
    return new Promise(function (resolve, reject) {
      (0, _qnRouter2.default)({
        api: 'taobao.trade.fullinfo.get',
        tag: tag,
        source: _qnRouter.QNAPI_SOURCE.top,
        params: { tid: tid, fields: fields },
        callback: function callback(rsp) {
          resolve(rsp);
        },
        errCallback: function errCallback(error) {
          resolve(error);
        }
      });
    });
  })).then(function (resArr) {
    callback(resArr);
  }).catch(function (errArr) {
    errCallback(errArr);
  });
}