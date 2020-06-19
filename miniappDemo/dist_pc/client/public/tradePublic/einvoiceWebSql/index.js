"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEinvoiceByTrade = exports.selectEinvoice = exports.EinvoiceWebSql = undefined;

var _index = require("../../tradePolyfills/index.js");

var _consts = require("../consts.js");

var _index2 = require("../tradeDataCenter/index.js");

var _sqlHelper = require("../../mapp_common/utils/sqlHelper.js");

var _logger = require("../../mapp_common/utils/logger.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * @description 电子发票信息表
                                                                                                                                                                                                     * @author hcy
                                                                                                                                                                                                     * @Data 2019-04-11
                                                                                                                                                                                                     */


var EinvoiceWebSql = exports.EinvoiceWebSql = {
  selectAllForText: function selectAllForText() {
    try {
      (0, _sqlHelper.doSql)({
        sql: "SELECT * FROM einvoice_new",
        callback: function callback(res) {
          _logger.Logger.log("%c websql全部内容 ", "color:white;background:red", res);
        }
      });
    } catch (e) {
      _logger.Logger.error('EinvoiceWebSql createWebsql catch error', e);
    }
  },
  // 创建电子发票信息表
  init: function init() {
    if ((0, _index.getUserInfo)() && (0, _index.getUserInfo)().type == 'C') {
      return;
    }
    try {
      (0, _sqlHelper.doSql)({
        sql: "CREATE TABLE IF NOT EXISTS einvoice_new (\n\t\t\t\t\t\ttid text NOT NULL,\n\t\t\t\t\t\tinvoice_type text NOT NULL,\n\t\t\t\t\t\tinvoice_name text NOT NULL,\n\t\t\t\t\t\tinvoice_kind text NOT NULL,\n\t\t\t\t\t\tmodified datetime NOT NULL,\n\t\t\t\t\t\tpayer_register_no text NOT NULL,\n\t\t\t\t\t\tPRIMARY KEY (tid)\n\t\t\t\t\t)",
        callback: function callback(res) {
          EinvoiceWebSql.deleteOnTime();
        },
        errCallback: function errCallback(rsp) {
          _logger.Logger.error('创建发票信息表失败了', rsp);
        }
      });
    } catch (e) {
      _logger.Logger.error('EinvoiceWebSql createWebsql catch error', e);
    }
  },
  // 删除上一个电子发票信息表
  deleteLastTable: function deleteLastTable() {
    try {
      window.db.transaction(function (context) {
        context.executeSql("DROP TABLE einvoice", [], function (ctx, rsp) {}, function (ctx, error) {});
      });
    } catch (e) {
      _logger.Logger.error('EinvoiceWebSql deleteLastTable catch error', e);
    }
  },
  // 发票信息表定期清理
  deleteOnTime: function deleteOnTime() {
    try {
      new Promise(function (resolve) {
        // 筛选出过期订单（插入时间在当前时间的15天前）
        var delTime = (0, _index.moment)().subtract(15, 'd').format('YYYY-MM-DD');

        (0, _sqlHelper.doSql)({
          sql: "SELECT tid FROM einvoice_new WHERE modified < (?)",
          params: [delTime],
          callback: function callback(res) {
            resolve(res);
          },
          errCallback: function errCallback(rsp) {
            _logger.Logger.error('创建发票信息表失败了', rsp);
          }
        });
      }).then(function (delTid) {
        if (delTid.length == 0) {
          return;
        }
        // 删除过期订单
        var selSql = "DELETE FROM einvoice_new WHERE tid IN (";
        delTid.forEach(function (item, index) {
          if (index == delTid.length - 1) {
            selSql += item + ")";
          } else {
            selSql += item + ",";
          }
        });

        (0, _sqlHelper.doSql)({
          sql: selSql,
          callback: function callback(res) {},
          errCallback: function errCallback(rsp) {
            _logger.Logger.error('删除过期订单失败了', rsp);
          }
        });
      });
    } catch (e) {
      _logger.Logger.error('EinvoiceWebSql deleteOnTime catch error', e);
    }
  },
  // 调用接口批量获取电子发票信息
  batchEinvoice: function batchEinvoice(_ref) {
    var tid = _ref.tid,
        _callback = _ref.callback;

    (0, _index.api)({
      method: '/router/einvoice',
      apiName: 'aiyong.trade.order.einvoce.batchget',
      mode: 'json',
      args: {
        method: 'alibaba.einvoice.apply.get',
        'value[platform_tid]': tid
      },
      callback: function callback(rsp) {
        var einvoiceData = [];
        var eTid = []; // 用来存储有发票信息的tid数组
        if (!rsp.length) {
          _callback([]);
          return;
        }
        rsp.forEach(function (item) {
          if (!(0, _index.isEmpty)(item.alibaba_einvoice_apply_get_response)) {
            var _apply = {};
            _apply.tid = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].platform_tid;
            _apply.invoice_type = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].invoice_type;
            _apply.invoice_name = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].payer_name;
            _apply.invoice_kind = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].invoice_kind;
            _apply.payer_register_no = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].payer_register_no;
            einvoiceData.push(_apply);
            eTid.push(_apply.tid);
          }
          // 测试数据
          var apply = {};
          apply.tid = tid[0];
          apply.invoice_type = 111;
          apply.invoice_name = 222;
          apply.invoice_kind = 333;
          apply.payer_register_no = 444;
          einvoiceData.push(apply);
          eTid.push(apply.tid);
        });
        var noEtid = tid.filter(function (item) {
          return eTid.indexOf(item) == -1;
        });
        noEtid.forEach(function (item) {
          var apply = {};
          apply.tid = item;
          apply.invoice_type = '';
          apply.invoice_name = '';
          apply.invoice_kind = '';
          apply.payer_register_no = '';
          einvoiceData.push(apply);
        });
        einvoiceData.forEach(function (item) {
          EinvoiceWebSql.insertData({ data: item });
        });
        _callback(einvoiceData);
      },
      errCallback: function errCallback(error) {
        _logger.Logger.error('einvoice 接口调用失败', error);
      }
    });
  },
  // 根据 tid 插入电子发票信息
  insertData: function insertData(_ref2) {
    var data = _ref2.data,
        _ref2$callback = _ref2.callback,
        callback = _ref2$callback === undefined ? _consts.NOOP : _ref2$callback,
        _ref2$errCallback = _ref2.errCallback,
        errCallback = _ref2$errCallback === undefined ? _consts.NOOP : _ref2$errCallback;

    var modified = (0, _index.moment)().format('YYYY-MM-DD');
    try {

      (0, _sqlHelper.doSql)({
        sql: "INSERT INTO einvoice_new (tid,invoice_type,invoice_name,invoice_kind,modified,payer_register_no) VALUES (?,?,?,?,?,?)",
        params: [data.tid, data.invoice_type, data.invoice_name, data.invoice_kind, modified, data.payer_register_no],
        callback: function callback(res) {
          _logger.Logger.log("%c 发票信息表 插入成功 ", "color:white;background:red", res);
        },
        errCallback: function errCallback(rsp) {
          _logger.Logger.error('发票信息表 插入失败', rsp);
        }
      });
    } catch (e) {
      _logger.Logger.error('EinvoiceWebSql insertData catch error', e);
    }
  },
  // 根据 tid 查出电子发票信息
  // tid[Array]
  selectData: function selectData(_ref3) {
    var tid = _ref3.tid,
        _ref3$callback = _ref3.callback,
        _callback2 = _ref3$callback === undefined ? function () {} : _ref3$callback,
        _ref3$errCallback = _ref3.errCallback,
        _errCallback = _ref3$errCallback === undefined ? function () {} : _ref3$errCallback;

    if (tid.length == 0) {
      _callback2();
      return;
    }
    var selSql = "SELECT tid,invoice_type,invoice_name,invoice_kind,payer_register_no FROM einvoice_new WHERE tid IN (";
    tid.forEach(function (item, index) {
      if (index == tid.length - 1) {
        selSql += item + ")";
      } else {
        selSql += item + ",";
      }
    });
    try {
      (0, _sqlHelper.doSql)({
        sql: selSql,
        callback: function callback(res) {
          _logger.Logger.log("%c 发票信息表 查询成功 ", "color:white;background:red", res);
          _callback2(res);
        },
        errCallback: function errCallback(rsp) {
          _logger.Logger.log('发票信息表 查询失败', rsp);
          _errCallback();
        }
      });
    } catch (e) {
      _logger.Logger.error('EinvoiceWebSql selectData catch error', e);
      _errCallback();
    }
  }

};

exports.default = EinvoiceWebSql;

// 获取电子发票 拆分tid

var selectEinvoice = exports.selectEinvoice = function selectEinvoice() {
  var tid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var getByAfterEnd = arguments[1];

  return new Promise(function (resolve) {
    if ((0, _index.getUserInfo)() && (0, _index.getUserInfo)().type == 'C') {
      resolve();
      return;
    }
    EinvoiceWebSql.selectData({
      tid: tid,
      callback: function callback(selRsp) {
        // 将没有的查到信息的 tid 取出
        var noTidArr = [];
        if ((0, _index.isEmpty)(selRsp)) {
          noTidArr = tid;
        } else {

          var selTid = selRsp.map(function (item) {
            return item.tid;
          });
          noTidArr = tid.filter(function (item) {
            return selTid.indexOf(item) == -1;
          });
        }

        // 获取一遍单号
        if (!(0, _index.isEmpty)(noTidArr) && getByAfterEnd) {
          // 拆分为20单一组
          var sliceLength = Math.ceil(noTidArr.length / 20);
          var sliceTidArr = [];
          for (var i = 0; i < sliceLength; i++) {
            sliceTidArr.push(noTidArr.slice(20 * i, 20 * (i + 1)));
          }
          var sliceBatchArr = sliceTidArr.map(function (item) {
            return new Promise(function (sliceBatchResolve) {
              EinvoiceWebSql.batchEinvoice({
                tid: item,
                callback: function callback(einvoiceRsp) {
                  selRsp = [].concat(_toConsumableArray(selRsp), _toConsumableArray(einvoiceRsp));
                  sliceBatchResolve();
                },
                errCallback: function errCallback() {
                  sliceBatchResolve();
                }
              });
            });
          });
          Promise.all(sliceBatchArr).then(function () {
            resolve(selRsp);
          });
        } else {
          resolve(selRsp);
        }
      },
      errCallback: function errCallback() {
        resolve();
      }
    });
  });
};

var getEinvoiceByTrade = exports.getEinvoiceByTrade = function getEinvoiceByTrade(_ref4) {
  var trades = _ref4.trades,
      _ref4$callback = _ref4.callback,
      callback = _ref4$callback === undefined ? _consts.NOOP : _ref4$callback,
      _ref4$errCallback = _ref4.errCallback,
      errCallback = _ref4$errCallback === undefined ? _consts.NOOP : _ref4$errCallback,
      _ref4$getByAfterEnd = _ref4.getByAfterEnd,
      getByAfterEnd = _ref4$getByAfterEnd === undefined ? false : _ref4$getByAfterEnd;

  return new Promise(function (resolve) {
    if ((0, _index.getUserInfo)() && (0, _index.getUserInfo)().type == 'C') {
      errCallback();
      return;
    }
    var einvoiceKeys = ['invoice_type', 'invoice_name', 'invoice_kind', 'payer_register_no'];

    if (!Array.isArray(trades)) {
      trades = [trades];
    }
    var flatTrades = (0, _index2.getFlatTrades)(trades);
    var tids = flatTrades.map(function (trade) {
      return trade.tid;
    });
    var flatTradesIndexedByTid = {};
    flatTrades.map(function (trade) {
      flatTradesIndexedByTid[trade.tid] = trade;
    });
    selectEinvoice(tids, getByAfterEnd).then(function (rsp) {
      if (!rsp) {
        errCallback();
        resolve(trades);
        return;
      }
      rsp.map(function (einvoiceItem) {
        var trade = flatTradesIndexedByTid[einvoiceItem.tid];
        if (trade) {
          Object.assign(trade, einvoiceItem);
        }
      });
      trades.map(function (trade) {
        if (trade.mergeTid) {
          einvoiceKeys.map(function (key) {
            trade[key] = Array.from(new Set(trade.trades.map(function (subTrade) {
              return subTrade[key];
            }).filter(Boolean))).join(',');
          });
        }
      });
      callback(trades);
      resolve(trades);
    });
  });
};