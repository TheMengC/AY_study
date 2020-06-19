"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMemoWithHistoryStr = exports.getStatusLabel = exports.mergeTradeSameFields = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.resolveTrade = resolveTrade;
exports.splitSkuPropertys = splitSkuPropertys;
exports.resolveMergeTrade = resolveMergeTrade;
exports.initTrade = initTrade;
exports.setRefundFlag = setRefundFlag;
exports.setTradesLoadingState = setTradesLoadingState;
exports.setTradeLoadingState = setTradeLoadingState;
exports.updateTrade = updateTrade;
exports.updateWayBills = updateWayBills;
exports.getTradeAddress = getTradeAddress;
exports.getCanMergeTrade = getCanMergeTrade;

var _index = require("../../../tradePolyfills/index.js");

var _index2 = require("../index.js");

var _utils = require("../common/utils.js");

var _resolveTopResponse = require("../common/resolveTopResponse.js");

var _soldGet2 = require("../api/soldGet.js");

var _config = require("../config.js");

var _consts = require("../consts.js");

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function resolveTrade(trade) {
  initTrade(trade);
  if (trade.mergeTid) {
    resolveMergeTrade(trade);
  }
  if (trade.num == undefined) {
    trade.num = (0, _resolveTopResponse.getOrders)(trade).map(function (order) {
      return order.num;
    }).reduce(function (a, b) {
      return a + b;
    }, 0); //单行求和大法
  }
  setRefundFlag(trade);
  if (_index.ENV && _index.ENV.platform == 'mapp') {
    (0, _index2.getFlatTrades)(trade).map(function (subTrade) {
      (0, _resolveTopResponse.washTradesWithArray)(subTrade);
      splitSkuPropertys(subTrade);
    });
  }
  if (trade.checked == undefined) {
    trade.checked = false;
  }

  return trade;
}
function splitSkuPropertys(trade) {
  (0, _resolveTopResponse.getOrders)(trade).map(function (order) {
    if (order.sku_properties_name) {
      order.sku_properties_values = order.sku_properties_name.split(';').map(function (item) {
        return item.split(':')[1];
      });
    }
  });
}

var mergeTradeSameFields = exports.mergeTradeSameFields = ['buyer_nick', 'seller_nick', 'receiver_address', 'receiver_city', 'receiver_country', 'receiver_district', 'receiver_mobile', 'receiver_name', 'receiver_phone', 'receiver_state', 'receiver_town', 'receiver_zip', 'buyer_alipay_no'
//'status',
];

function resolveMergeTrade(mergeTrade) {
  var orders = [];
  mergeTrade.trades.map(function (subTrade) {
    return Array.prototype.push.apply(orders, (0, _resolveTopResponse.getOrders)(subTrade));
  });
  if (_index.ENV && _index.ENV.platform == 'mapp') {
    mergeTrade.orders = orders;
  } else {
    mergeTrade.orders = { order: orders };
  }
  mergeTrade.tid = mergeTrade.trades.map(function (trade) {
    return trade.tid;
  }).join(',');
  var sameContent = {};
  mergeTrade.payment = 0;
  mergeTrade.post_fee = 0;
  mergeTrade.total_fee = 0;
  mergeTrade.trades.map(function (subTrade) {
    Object.keys(subTrade).map(function (key) {

      if (!sameContent[key]) {
        sameContent[key] = { content: [] };
      }
      sameContent[key].content.push(subTrade[key]);
    });
    !(0, _index.isEmpty)(subTrade.payment) && (mergeTrade.payment += parseFloat(subTrade.payment));
    !(0, _index.isEmpty)(subTrade.post_fee) && (mergeTrade.post_fee += parseFloat(subTrade.post_fee));
    !(0, _index.isEmpty)(subTrade.total_fee) && (mergeTrade.total_fee += parseFloat(subTrade.total_fee));
    //subTrade.buyer_rate&&(mergeTrade.buyer_rate=true)
    //subTrade.seller_rate&&(mergeTrade.seller_rate=true)
    //subTrade.is_daixiao&&(mergeTrade.is_daixiao=true)
  });
  Object.keys(sameContent).map(function (key) {
    var set = new Set(sameContent[key].content.map(function (str) {
      return str.replace ? str.replace(/\s/g, '') : str;
    }));
    sameContent[key].set = set;
  });
  mergeTradeSameFields.map(function (key) {
    if (!sameContent[key]) {
      sameContent[key] = {};
      //sameContent[key].isError = true;
      return;
    }
    mergeTrade[key] = sameContent[key].content[0];
    sameContent[key].isError = sameContent[key].set.size != 1;
  });
  ['payment', 'post_fee', 'total_fee', 'num'].map(function (key) {
    if (!sameContent[key]) {
      return;
    }
    if (key === 'num') {
      mergeTrade[key] = (0, _utils.sum)(sameContent[key].content).toFixed(0);
    } else {
      mergeTrade[key] = (0, _utils.sum)(sameContent[key].content).toFixed(2);
    }
  });
  if (sameContent.yfx_fee) {
    mergeTrade.has_yfx = true;
    mergeTrade.yfx_fee = (0, _utils.sum)(sameContent.yfx_fee.content).toFixed(2);
  }
  var wayBillMap = new Map();
  var printState = {
    courier: false,
    invoice: false,
    surface: false
  };
  mergeTrade.has_buyer_message = false;
  mergeTrade.trades.map(function (subTrade) {
    printState.courier = printState.courier || subTrade.printState.courier;
    printState.invoice = printState.invoice || subTrade.printState.invoice;
    printState.surface = printState.surface || subTrade.printState.surface;
    mergeTrade.has_buyer_message |= subTrade.has_buyer_message;
    subTrade.wayBill.map(function (waybill) {
      wayBillMap.set(JSON.stringify(waybill), waybill);
    });
  });
  mergeTrade.wayBill = [].concat(_toConsumableArray(wayBillMap.values()));
  mergeTrade.printState = printState;

  ['created', 'pay_time', 'consign_time', 'modified', 'end_time', 'timeout_action_time'].map(function (key) {
    if (sameContent[key]) {
      mergeTrade[key] = (0, _utils.getTimeMax)(sameContent[key].content);
    }
  });
  var errorFields = Object.keys(sameContent).filter(function (key) {
    return sameContent[key].isError;
  });
  if (errorFields.length) {
    console.error('合单列数据错误' + errorFields.join(','), errorFields.map(function (key) {
      return sameContent[key].content;
    }));
    return false;
  }
  return true;
}

/**
 * 对刚进来的订单数据做一些初始化 将waybill等东西放进去 避免之后提前取的时候undefined问题
 */
function initTrade(trade) {
  (0, _index2.getFlatTrades)(trade).map(function (trade) {
    if (!trade.wayBill) {
      trade.wayBill = [];
    }
    if (!trade.printState) {
      trade.printState = {};
    }
  });
}

function setRefundFlag(trade) {
  (0, _index2.getFlatTrades)(trade).map(function (subTrade) {
    var orders = (0, _resolveTopResponse.getOrders)(subTrade);
    orders.map(function (order) {
      if (order.refund) {
        order.refund_id = order.refund.refund_id;
        order.refund_status = order.refund.status;
      }
      if (order.refund_id && order.refund_status && order.refund_status != "CLOSED" && order.refund_status != "SUCCESS") {
        order.is_refunding = true;
      } else {
        order.is_refunding = false;
      }
    });
    subTrade.has_refunding = (0, _resolveTopResponse.getOrders)(subTrade).some(function (order) {
      return order.is_refunding;
    });
  });
  if (trade.mergeTid) {
    trade.has_refunding = trade.trades.some(function (subTrade) {
      return subTrade.has_refunding;
    });
  }
}

function setTradesLoadingState(trades, loadingState) {
  trades.map(function (trade) {
    setTradeLoadingState(trade, loadingState);
  });
}

var defaultLoadingState = {
  fullinfo: false,
  printBrief: false,
  printWayBill: false,
  refundMessage: false,
  logistics: false
};

function setTradeLoadingState(trade, loadingState) {
  loadingState = Object.assign({}, defaultLoadingState, loadingState);
  Object.assign(trade, {
    loadingState: loadingState
  });
  return trade;
}

/**
 * 合并两个订单，返回一个新创建的对象 如果要修改dataSource 请把这个对象重新用Index设回去 如 dataSource[index]=updateTrade(new,old) 然后更新dataSource
 * 这个函数主要是可以接受一个不完整的newTrade并和之前的oldTrade进行拼接 将对应的字段更新掉
 * 这个方法不支持合单
 * @param oldTrade
 * @param newTrade
 * @param mutable 是否改变原有对象 默认不改变并返回生成的新对象
 * @returns {*}
 */
function updateTrade(oldTrade, newTrade) {
  var mutable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var orders = newTrade.orders,
      wayBill = newTrade.wayBill,
      printState = newTrade.printState,
      trades = newTrade.trades,
      rest = _objectWithoutProperties(newTrade, ["orders", "wayBill", "printState", "trades"]);

  var trade = {};
  if (!mutable) {
    trade = Object.assign({}, oldTrade, rest);
  } else {
    trade = Object.assign(oldTrade, rest);
  }
  orders = (0, _resolveTopResponse.getOrders)(newTrade);
  if (orders) {
    var oldOrders = (0, _resolveTopResponse.getOrders)(trade);
    if (oldOrders) {
      var oldOrderIndexedByOid = {};
      var resultOrders = [];
      oldOrders.map(function (oldOrder) {
        oldOrderIndexedByOid[oldOrder.oid] = oldOrder;
      });
      orders.map(function (newOrder) {
        var oldOrder = oldOrderIndexedByOid[newOrder.oid];
        delete oldOrderIndexedByOid[newOrder.oid];
        if (oldOrder) {
          resultOrders.push(Object.assign({}, oldOrder, newOrder));
        } else {
          resultOrders.push(newOrder);
        }
      });
      Array.prototype.push.apply(resultOrders, (0, _index.Object_values)(oldOrderIndexedByOid));
      if (_index.ENV && _index.ENV.platform == 'mapp') {
        trade.orders = resultOrders;
      } else {
        trade.orders.order = resultOrders;
      }
    } else {
      if (_index.ENV && _index.ENV.platform == 'mapp') {
        trade.orders = orders;
      } else {
        trade.orders = {
          order: orders
        };
      }
    }
  }
  if (wayBill) {
    trade.wayBill = updateWayBills(oldTrade.wayBill, wayBill);
  }
  if (printState) {
    trade.printState.courier = trade.printState.courier || printState.courier;
    trade.printState.invoice = trade.printState.invoice || printState.invoice;
    trade.printState.surface = trade.printState.surface || printState.surface;
    trade.printState.invoicesPart = trade.printState.invoicesPart || printState.invoicesPart;
  }
  return trade;
}

function updateWayBills(oldWaybills, newWaybills) {
  if (!oldWaybills) {
    oldWaybills = [];
  }
  var wayBillMap = new Map();

  newWaybills.map(function (item) {
    wayBillMap.set(JSON.stringify(item), item);
  });
  oldWaybills.map(function (item) {
    wayBillMap.set(JSON.stringify(item), item);
  });
  var waybillAfterMerge = [].concat(_toConsumableArray(wayBillMap.values()));
  /**
   * isNative这个是标记着是打印后直接修改数据进行绑定的 不是从接口取的
   * 如果这些直接绑定的在newWaybills里面不存在 是要手动给他添加上去的 因为getPrintWeightHistory可能有一定的延迟 先以这个为准
   */
  waybillAfterMerge = waybillAfterMerge.filter(function (item) {
    if (item.isNative) {
      if (waybillAfterMerge.find(function (item2) {
        return item2.voice == item.voice && !item2.isNative;
      })) {
        return false;
      }
      ;
    }
    return true;
  });
  return waybillAfterMerge;
}

var getStatusLabel = exports.getStatusLabel = function getStatusLabel(_ref) {
  var trade = _ref.trade,
      currentTab = _ref.currentTab,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? 'trade' : _ref$type;
  var status = trade.status;

  var cell = {};
  var statusLabelMap = {
    'WAIT_BUYER_PAY': { label: '待付款', value: 'label-wait', type: 'dfk', status: 'WAIT_BUYER_PAY' },
    'TRADE_NO_CREATE_PAY': { label: '待付款', value: 'label-wait', type: 'dfk', status: 'WAIT_BUYER_PAY' },
    'PAY_PENDING': { label: '外卡支付', value: 'label-nomore', type: 'dfk', status: 'WAIT_BUYER_PAY' },
    'WAIT_SELLER_SEND_GOODS': { label: '待发货', value: 'label-info', type: 'dfh', status: 'WAIT_SELLER_SEND_GOODS' },
    'SELLER_CONSIGNED_PART': { label: '部分发货', value: 'label-info', type: 'dfh', status: 'WAIT_SELLER_SEND_GOODS' },
    'PAID_FORBID_CONSIGN': { label: '已冻结', value: 'label-info', type: 'dfh', status: 'PAID_FORBID_CONSIGN' },
    'WAIT_BUYER_CONFIRM_GOODS': { label: '已发货', value: 'label-primary', type: 'yfh', status: 'WAIT_BUYER_CONFIRM_GOODS' },
    'TRADE_ BUYER_SIGNED': { label: '已签收', value: 'label-primary', type: 'yfh', status: 'WAIT_BUYER_CONFIRM_GOODS' },
    'TRADE_FINISHED': { label: '已成功', value: 'label-success', type: 'ycg', status: 'TRADE_FINISHED' },
    'TRADE_CLOSED': { label: '已关闭', value: 'label-nomore', type: 'ygb', status: 'ALL_CLOSED' },
    'TRADE_CLOSED_BY_TAOBAO': { label: '已关闭', value: 'label-nomore', type: 'ygb', status: 'ALL_CLOSED' }
  };
  cell = _extends({}, statusLabelMap[status]);
  switch (status) {
    case 'WAIT_BUYER_PAY':
    case 'TRADE_NO_CREATE_PAY':
      //没有创建外部交易（支付宝交易）
      if (!(0, _index.isEmpty)(trade.step_trade_status)) {
        if (trade.step_trade_status == 'FRONT_NOPAID_FINAL_NOPAID') {
          cell.label = '定金未付';
          cell.status = 'FRONT_NOPAID_FINAL_NOPAID';
        } else if (trade.step_trade_status == 'FRONT_PAID_FINAL_NOPAID') {
          cell.label = '定金已付';
          cell.status = 'FRONT_PAID_FINAL_NOPAID';
        }
      }
      break;
    case 'TRADE_FINISHED':
      //交易成功
      var diff = (0, _index.moment)((0, _index.moment)()).diff(trade.end_time, 'days');
      if (diff < 15 && !trade.seller_rate) {
        cell.label = trade.buyer_rate ? '买家已评' : '双方未评';
        cell.value = 'label-rate';
        cell.type = 'dpj';
        cell.status = 'NEED_RATE';
      }
      break;
  }
  if (type == 'trade') {
    // 在退款中type下退款订单的主状态显示退款中
    if (currentTab == 'TRADE_REFUND') {
      if (trade.has_refunding == true) {
        cell.label = '退款中';
        cell.value = 'label-refund';
        cell.type = 'tkz';
        cell.status = 'TRADE_REFUND';
        cell.mainType = statusLabelMap[status].type;
      }
    }
  } else if (type == 'order') {
    // 普通退款
    if (trade.is_refunding) {
      cell.label = '退款中';
      cell.value = 'label-refund';
      cell.type = 'tkz';
      cell.status = 'TRADE_REFUND';
    } else if (trade.refund_status == 'SUCCESS') {
      cell.label = '已关闭';
      cell.value = 'label-nomore';
      cell.type = 'ygb';
      cell.status = 'ALL_CLOSED';
    }
    // 售后退款
    if (trade.refund_status == 'NO_REFUND' && !(0, _index.isEmpty)(trade.refund_id)) {
      cell.label = '售后退款';
      cell.value = 'label-refund';
      cell.type = 'tkz';
      cell.status = 'TRADE_REFUND';
    }
  }
  return cell;
};

/**
 * 获取完整的收货地址
 * @param trade
 * @param needContact {boolean} 是否需要联系方式
 * @param showZip {true|false|'auto'} 是否需要邮编
 * @returns {string}
 */
function getTradeAddress(trade) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$needContact = _ref2.needContact,
      needContact = _ref2$needContact === undefined ? false : _ref2$needContact,
      _ref2$showZip = _ref2.showZip,
      showZip = _ref2$showZip === undefined ? 'auto' : _ref2$showZip;

  // 拼接收货地址
  var contact = '';
  var addrWithoutContact = [trade.receiver_state, trade.receiver_city, trade.receiver_district, trade.receiver_country, trade.receiver_address].filter(Boolean).join('，');

  if (showZip !== false) {
    // 邮编
    if (trade.receiver_zip !== '000000' && showZip === 'auto' || showZip === true) {
      addrWithoutContact += '，' + trade.receiver_zip;
    }
  }

  if (needContact) {
    contact = [trade.receiver_name, trade.receiver_mobile, trade.receiver_phone].filter(Boolean).join('，');
    return contact + '，' + addrWithoutContact;
  } else {
    return addrWithoutContact;
  }
}

var getMemoWithHistoryStr = exports.getMemoWithHistoryStr = function getMemoWithHistoryStr(trade) {
  var memo = trade.seller_memo;
  if (trade.memoHistory && trade.memoHistory.newest) {
    var newest = trade.memoHistory.newest;
    if (newest.memoContent === trade.seller_memo && newest.flag === trade.seller_flag && (0, _index.getUserInfo)().newMemoSet == 1) {
      var tag = getSubUserNick(newest.subNick);
      if (!tag) {
        tag = newest.sellerNick ? newest.sellerNick : '';
      }
      if (tag) {
        tag += ' ';
      }
      tag += newest.modify || "";
      // 带备注人和时间的备注
      memo = newest.memoContent + " \u3010" + tag + "\u3011";
    }
  }

  return memo;
};

function getSubUserNick(nick) {
  if (!nick) {
    return '';
  }
  var arr = nick.split(":");
  if (arr[1]) {
    return arr[1];
  }
  return arr[0];
}

/* 返回和当前订单信息一致的订单，即可合单的订单(max=40) */
function getCanMergeTrade(trade) {
  return new Promise(function (resolve, reject) {
    var _soldGet = (0, _soldGet2.soldGet)({
      fields: _config.fullinfoget_all_fields,
      source: _consts.SOLDGET_SOURCE.top,
      status: 'WAIT_SELLER_SEND_GOODS', // 等待卖家发货
      type: _config.soldget_all_type,
      buyer_nick: trade.buyer_nick, // 买家nick
      pageSize: 40,
      pageNo: 1
    }),
        trades = _soldGet.trades,
        totalResults = _soldGet.totalResults;

    var mergeTrades = [];
    if (totalResults > 1) {
      // 将可合并的订单进行处理
      mergeTrades = trades.filter(function (item) {
        return item.tid != trade.tid && item.receiver_name == trade.receiver_name && item.receiver_mobile == trade.receiver_mobile && item.receiver_city == trade.receiver_city && item.receiver_district == trade.receiver_district && item.receiver_town == trade.receiver_town && item.receiver_address == trade.receiver_address;
      });
    }

    resolve(mergeTrades);
  });
}