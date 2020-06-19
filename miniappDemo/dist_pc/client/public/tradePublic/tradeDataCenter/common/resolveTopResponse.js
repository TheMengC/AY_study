"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSellerCats = exports.getItems = exports.getOrders = exports.getTrades = undefined;
exports.resolveTopResponse = resolveTopResponse;
exports.resolveTopResult = resolveTopResult;
exports.getArrayByKey = getArrayByKey;
exports.washTradesWithArray = washTradesWithArray;
exports.getArrayInWrapper = getArrayInWrapper;
exports.integrationDate = integrationDate;

var _index = require("../../../tradePolyfills/index.js");

var _index2 = require("../../../mapp_common/utils/index.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function resolveTopResponse(response) {

  if (response.request_id) {
    return response;
  }
  var key = Object.keys(response).find(function (item) {
    return (/_response$/.test(item)
    );
  });
  if (key) {
    return response[key];
  }
  return {};
}

/**
 * 同上面方法相同意思 🙄
 * @param result
 * @returns {{}|*}
 */
function resolveTopResult(result) {
  var key = Object.keys(result).find(function (item) {
    return (/_result$/.test(item)
    );
  });
  if (key) {
    return result[key];
  } else {
    return result;
  }
}

/**
 * 我干死阿里这帮狗日的
 * pc的top请求的所有数组都会被包一层对象 如 trade.orders.order
 * 但是从小程序走的top请求就不是 直接是 trade.orders
 * 我他妈的居然还要兼容这种狗币东西 真他妈的醉了
 *
 */
function getArrayByKey(key, obj) {
  var keyS = key + 's';

  if (!obj || !key) {
    return [];
  }
  if (!obj[keyS]) {
    return [];
  }

  if (Array.isArray(obj[keyS])) {
    return obj[keyS];
  } else if (Array.isArray(obj[keyS][key])) {
    return obj[keyS][key];
  }
}

var getTrades = exports.getTrades = getArrayByKey.bind(null, 'trade');
var getOrders = exports.getOrders = getArrayByKey.bind(null, 'order');
var getItems = exports.getItems = getArrayByKey.bind(null, 'item');
var getSellerCats = exports.getSellerCats = getArrayByKey.bind(null, 'seller_cat');

/**
 * 清洗一个trade 把里面的orders.order换成orders
 * @param trade
 * @returns {*}
 */
function washTradesWithArray(trade) {
  trade.orders = getOrders(trade);
}

/**
 * 上面那个函数的更加暴力的版本
 * 我们认为阿里的傻逼数组封装里面这个对象一定只有一个key 所以只要把这个key对应的array拿出来就行了 并不需要知道这个key的名字是什么
 * @param obj
 * @returns {*[]|*}
 */
function getArrayInWrapper(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }
  if ((0, _index2.isObject)(obj)) {
    if (Object.keys(obj).length != 1) {
      _index.Logger.error('getArrayByGress长度!=1', obj);
      return [];
    }
    var key = Object.keys(obj)[0];
    return obj[key];
  }
  return [];
}

/**
 * 将小程序的接口返回数据转化与原来数据一致
 * res 接口返回数据 resolveTopResponse 这个方法处理过的
 * type 增加的缺少对象
 * isTotal 是否有总数处理
 */
function integrationDate(res, type, isTotal) {
  var types = type + 's';
  var rsp = _defineProperty({}, types, {});
  if (res[types] && !res[types][type]) {
    rsp[types][type] = res[types];
    if (isTotal) {
      rsp.total_results = res.total_results;
    }
  } else {
    rsp = res;
  }
  return rsp;
}