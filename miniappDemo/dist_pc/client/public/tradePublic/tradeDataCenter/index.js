"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFlatTrades = getFlatTrades;
exports.getOrderPayFee = getOrderPayFee;
exports.getOrderOuterId = getOrderOuterId;

var _index = require("../../tradePolyfills/index.js");

function getFlatTrades(trades) {
  if (!trades) {
    return [];
  }
  !Array.isArray(trades) && (trades = [trades]);
  trades = trades.filter(Boolean);
  var flatTrades = [];
  trades.map(function (trade) {
    if (trade.mergeTid) {
      Array.prototype.push.apply(flatTrades, trade.trades);
    } else {
      flatTrades.push(trade);
    }
  });
  return flatTrades;
}

/**
 * 获取订单的payFee
 * @param order
 * @return {string}
 */
function getOrderPayFee(order) {
  return (Number(order.price) + Number(order.adjust_fee) - Number(order.discount_fee)).toFixed(2);
}

/**
 * 获取订单的商家编码
 * @param order
 * @return {string|*}
 */
function getOrderOuterId(order) {
  if (!(0, _index.isEmpty)(order.outer_sku_id)) {
    return order.outer_sku_id;
  } else if (!(0, _index.isEmpty)(order.outer_iid)) {
    return order.outer_iid;
  }
  return '';
}