"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogisticsWebSql = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getTradeLogisticsInfo = getTradeLogisticsInfo;
exports.getFake = getFake;
exports.getTradeLogisticsInfoWithoutRequest = getTradeLogisticsInfoWithoutRequest;
exports.getPackageInfoByTrade = getPackageInfoByTrade;
exports.logisticsInfoCanChange = logisticsInfoCanChange;

var _index = require("../../tradePolyfills/index.js");

var _qnRouter = require("../qnRouter.js");

var _index2 = require("../tradeDataCenter/index.js");

var _resolveTopResponse = require("../tradeDataCenter/common/resolveTopResponse.js");

var _consts = require("../consts.js");

var _logger = require("../../mapp_common/utils/logger.js");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logistics_orders_detail_get_fields = 'tid,order_code,seller_nick,buyer_nick,delivery_start,delivery_end,out_sid,item_title,receiver_name,created,modified,status,type,freight_payer,seller_confirm,company_name,sub_tids,is_split';

/**
 * 获取物流信息和转运信息
 * 这个返回promise 结束以后trade会被加上一个logisticsInfo的字段
 * @param trade
 * @param callback
 * @param errCallback
 * @returns {Promise}
 */
function getTradeLogisticsInfo(trade, refresh) {
  var _this = this;

  if ((0, _resolveTopResponse.getOrders)(trade).every(function (order) {
    return !_consts.STATUS_IS_SENDED[order.status];
  })) {
    return Promise.resolve();
  }

  // getWebsql_data modieif
  return Promise.all((0, _index2.getFlatTrades)(trade).map(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subTrade) {
      var res, dataSql;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(0, _resolveTopResponse.getOrders)(trade).every(function (order) {
                return !order.invoice_no;
              })) {
                _context.next = 3;
                break;
              }

              subTrade.logisticsInfo = [{
                company_name: '无需物流',
                out_sid: '',
                tid: subTrade.tid,
                trace_list: { transit_step_info: [] }
              }];
              return _context.abrupt("return");

            case 3:
              if (!refresh) {
                _context.next = 6;
                break;
              }

              _logger.Logger.log("物流信息强制刷新 - 调api");
              return _context.abrupt("return", getByApi(subTrade));

            case 6:
              res = void 0;

              if (!(_index.sqlHelper.canUseSql() && LogisticsWebSql.enabled)) {
                _context.next = 18;
                break;
              }

              _context.prev = 8;
              _context.next = 11;
              return LogisticsWebSql.getByTid(subTrade.tid);

            case 11:
              dataSql = _context.sent;

              res = dataSql[0];
              _logger.Logger.log('datasql', res);
              _context.next = 18;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](8);

            case 18:
              if (!res) {
                _context.next = 29;
                break;
              }

              if (!(0, _index.moment)().isAfter(_index.moment.unix(res.created).add(12, 'hours'))) {
                _context.next = 24;
                break;
              }

              _logger.Logger.log("taobaoLogisticsTraceSearch时间到了 用api", res);
              return _context.abrupt("return", getByApi(subTrade));

            case 24:
              /**
               * 终于可以使用sql里面的数据了
               */
              _logger.Logger.log("taobaoLogisticsTraceSearch时间没有到 用缓存", res);
              subTrade.logisticsInfo = JSON.parse(res.storage);
              return _context.abrupt("return");

            case 27:
              _context.next = 34;
              break;

            case 29:
              if (!(0, _index.moment)(subTrade.consign_time).add(2, 'h').isAfter((0, _index.moment)())) {
                _context.next = 32;
                break;
              }

              getFake(subTrade);
              return _context.abrupt("return");

            case 32:
              /**
               * sql里面没有只能调接口
               */
              _logger.Logger.log("taobaoLogisticsTraceSearch没有取到 用api", res);
              return _context.abrupt("return", getByApi(subTrade));

            case 34:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this, [[8, 16]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }())).then(function () {
    _logger.Logger.log("taobaoLogisticsTraceSearch好啦");
    // 合单 把包裹信息去重拼起来
    if (trade.mergeTid) {
      var logisticsInfoIndexedByVoice = {};
      trade.trades.map(function (subTrade) {
        subTrade.logisticsInfo.map(function (logisticsItem) {
          logisticsInfoIndexedByVoice[logisticsItem.invoice_no] = logisticsItem;
        });
      });
      trade.logisticsInfo = (0, _index.Object_values)(logisticsInfoIndexedByVoice);
    }
  });

  /**
   * 从api获取
   * @returns {Promise<[]>}
   */
  function getByApi(subTrade) {
    return new Promise(function (resolve) {
      var packageInfo = getPackageInfoByTrade(subTrade);
      subTrade.logisticsInfo = [];
      Promise.all(packageInfo.map(function (packageInfoItem) {
        return new Promise(function (resolve) {
          var query = {
            tid: subTrade.tid,
            seller_nick: subTrade.seller_nick
          };
          if (packageInfoItem.is_split == 1) {
            query.is_split = 1;
            query.sub_tid = packageInfoItem.oid;
          }
          (0, _qnRouter.qnRouter)({
            api: 'taobao.logistics.trace.search',
            params: query,
            callback: function callback(rsp) {
              rsp = (0, _resolveTopResponse.resolveTopResponse)(rsp);
              rsp = _extends({}, packageInfoItem, rsp);
              if (Array.isArray(rsp.trace_list)) {
                rsp.trace_list = { transit_step_info: rsp.trace_list };
              }
              rsp.trace_list.transit_step_info.reverse();
              subTrade.logisticsInfo.push(rsp);
              resolve();
            },
            errCallback: function errCallback(error) {
              _logger.Logger.error(error);
              resolve();
            }
          });
        });
      })).then(function () {
        if (subTrade.logisticsInfo.length > 0) {
          LogisticsWebSql.insertByTrade(subTrade);
        }
        resolve();
      });
    });
  }
}

/**
 * 如果发货时间跟当前时间过于接近,则不获取物流信息,搞一个假的物流信息来迷惑敌人
 */
function getFake(subTrade) {
  // 按运单号分组
  var logisticsInfo = getPackageInfoByTrade(subTrade).map(function (packageInfoItem) {
    packageInfoItem.trace_list = {
      transit_step_info: [{
        action: "X_WAIT_ALLOCATION",
        status_desc: "您的订单待配货",
        status_time: packageInfoItem.consign_time
      }]
    }, packageInfoItem.tid = subTrade.tid;
    packageInfoItem.seller_nick = subTrade.seller_nick;
    return packageInfoItem;
  });
  subTrade.logisticsInfo = logisticsInfo;
  return logisticsInfo;
}

/**
 * 获取订单的物流信息（不掉接口）
 * @param trade
 */
function getTradeLogisticsInfoWithoutRequest(trade) {
  if (trade.mergeTid) {
    trade.trades.map(function (subTrade) {
      return getFake(subTrade);
    });
  } else {
    getFake(trade);
  }
}

/**
 * 根据订单的发货公司和运单号计算包裹信息
 * @param trade
 * @returns {{company_name: *, out_sid: *, oid}[]}
 */
function getPackageInfoByTrade(trade) {

  var orders = (0, _resolveTopResponse.getOrders)(trade);
  orders = orders.filter(function (order) {
    return _consts.statusMap[order.status] !== 'ALL_CLOSED';
  });
  if (orders.every(function (order) {
    return !_consts.STATUS_IS_SENDED[order.status];
  })) {
    return [];
  }
  if (orders.every(function (order) {
    return !order.invoice_no;
  })) {
    return [{
      company_name: '无需物流',
      out_sid: '',
      oid: orders.map(function (order) {
        return order.oid;
      }),
      consign_time: orders[0].consign_time
    }];
  }
  var packageInfo = [];
  // 按运单号分组
  var ordersIndexByInvoiceNo = {};
  orders.map(function (order) {
    if (!order.invoice_no) {
      return;
    }
    if (!ordersIndexByInvoiceNo[order.invoice_no]) {
      ordersIndexByInvoiceNo[order.invoice_no] = [];
    }
    ordersIndexByInvoiceNo[order.invoice_no].push(order);
  });
  packageInfo = Object.keys(ordersIndexByInvoiceNo).map(function (invoice_no) {
    var orderGroup = ordersIndexByInvoiceNo[invoice_no];
    return {
      company_name: orderGroup[0].logistics_company,
      out_sid: orderGroup[0].invoice_no,
      oid: orderGroup.map(function (order) {
        return order.oid;
      }),
      consign_time: orderGroup[0].consign_time,
      is_split: +(orderGroup.length !== orders.length)
    };
  });
  return packageInfo;
}

var LogisticsWebSql = exports.LogisticsWebSql = {
  enabled: true,
  init: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (_index.sqlHelper.canUseSql()) {
                _context2.next = 3;
                break;
              }

              _logger.Logger.log('websql未实现');
              return _context2.abrupt("return", Promise.resolve());

            case 3:
              _context2.prev = 3;
              _context2.next = 6;
              return _index.sqlHelper.doSqlAsync({
                sql: "CREATE TABLE IF NOT EXISTS 'logistics_info' ('tid' varchar(32) NOT NULL,\n                                                    'created' BIGINT NOT NULL,\n                                                    'storage' text NOT NULL,\n                                                    PRIMARY KEY ('tid'))"
              });

            case 6:
              _context2.next = 8;
              return this.clearTimeout();

            case 8:
              _context2.next = 14;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](3);

              _logger.Logger.error(_context2.t0);
              this.enabled = false;

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[3, 10]]);
    }));

    function init() {
      return _ref2.apply(this, arguments);
    }

    return init;
  }(),
  getByTid: function getByTid(tid) {
    var sql = 'SELECT * from logistics_info where tid=?';
    return _index.sqlHelper.doSqlAsync({
      sql: sql,
      params: [tid]
    });
  },
  insertByTrade: function insertByTrade(trade) {
    if (!_index.sqlHelper.canUseSql()) {
      _logger.Logger.log('websql未实现');
      return Promise.resolve();
    }
    var params = {
      tid: trade.tid,
      created: (0, _index.moment)().unix(),
      storage: JSON.stringify(trade.logisticsInfo)
    };
    var sql = "REPLACE into logistics_info (" + Object.keys(params).join(',') + ") values(" + Object.keys(params).map(function () {
      return '?';
    }).join(',') + ")";
    return _index.sqlHelper.doSqlAsync({
      sql: sql,
      params: (0, _index.Object_values)(params)
    });
  },
  clearAll: function clearAll() {
    return _index.sqlHelper.doSqlAsync({ sql: 'DELETE FROM logistics_info' });
  },
  clearTimeout: function clearTimeout() {
    var time = (0, _index.moment)().subtract(12, 'h').unix();
    _logger.Logger.log('clearTimeout', time);
    return _index.sqlHelper.doSqlAsync({ sql: 'DELETE FROM logistics_info where created<?', params: [time] });
  },
  count: function count() {
    return _index.sqlHelper.doSqlAsync({ sql: 'SELECT count(*) FROM logistics_info' });
  },
  getAll: function getAll() {
    return _index.sqlHelper.doSqlAsync({ sql: 'SELECT * FROM logistics_info' });
  }
};

/**
 * 物流信息是否可以修改
 * @param logisticsInfo
 * @returns {*}
 */
function logisticsInfoCanChange(logisticsInfo) {
  return (0, _index.moment)(logisticsInfo.consign_time).add('1', 'day').isAfter((0, _index.moment)());
}