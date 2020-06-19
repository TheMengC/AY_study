'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var aiyongApiList = exports.aiyongApiList = {
  soldGet: {
    key: 'soldGet',
    apiName: 'aiyong.trade.order.baselist.get',
    url: '/aiyongTrade/base.list.get',
    fallbackTimeout: 10,
    requestTimeout: 10,
    enabled: true,
    trying: false,
    functionName: '合单、排序',
    needSync: false // 是否需要同步订单
  },
  advancedSearch: {
    key: 'advancedSearch',
    apiName: 'aiyong.trade.order.searchlist.get',
    url: '/aiyongTrade/search.list.get',
    fallbackTimeout: 10,
    requestTimeout: 30,
    enabled: true,
    trying: false,
    functionName: "高级搜索"
  },
  detailInfoGet: {
    key: 'detailInfoGet',
    url: '/aiyongTrade/detail.info.get',
    apiName: 'aiyong.trade.order.detail.get',
    fallbackTimeout: 0,
    requestTimeout: 10,
    enabled: true,
    trying: false,
    functionName: "订单详情"
  },
  receiverAreaGet: {
    key: 'receiverAreaGet',
    url: '/aiyongTrade/receiver.area.list.get',
    apiName: 'aiyong.trade.order.receiverareas.get',
    fallbackTimeout: 10,
    requestTimeout: 5,
    enabled: true,
    trying: false,
    functionName: "地区数量统计"
  },
  saveOrderProcess: {
    key: 'saveOrderProcess',
    url: '/newuser/saveOrderCourse',
    apiName: 'aiyong.trade.order.syncprogress.get',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "获取存单进度"
  },
  customMergeCountGet: {
    key: 'customMergeCountGet',
    url: '/tradeList/trade.order.merge.number.get',
    apiName: 'aiyong.trade.order.mergable.number.batchget',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "手动合单"
  },
  memoHistoryGet: {
    key: "memoHistoryGet",
    url: "/memo/batchQueryCount",
    apiName: 'aiyong.trade.order.memohistory.count.batchget',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "备注记录"
  },
  memoHistoryGetS: {
    key: "memoHistoryGetS",
    url: "/memo/queryCount",
    apiName: 'aiyong.trade.order.memohistory.count.get',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "单个获取备注记录"
  },
  memoListGet: {
    key: "memoListGet",
    url: "/memo/list",
    apiName: 'aiyong.trade.order.memohistory.list.get',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "获取历史备注记录列表"
  },
  memoAdd: {
    key: "memoAdd",
    url: "/memo/add",
    apiName: 'aiyong.trade.order.memohistory.add',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "添加备注信息"
  },
  memoSetUpdate: {
    key: "memoSetUpdate",
    url: "/iytrade2/saveMemoSet",
    apiName: 'aiyong.trade.order.memohistory.status.set',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "备注记录显示的开关状态更改"
  },
  memoSetGet: {
    key: "memoSetGet",
    url: "/iytrade2/getMemoSet",
    apiName: 'aiyong.trade.order.memohistory.status.get',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "获取备注记录显示的开关状态"
  },
  mergeNumberGet: {
    key: "mergeNumberGet",
    url: "/tradeList/trade.order.merge.list.get",
    apiName: 'aiyong.trade.order.mergable.trades.get',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "获取可合单数量"
  },
  manuallyMergeTrade: {
    key: "manuallyMergeTrade",
    url: "/tradeList/trade.order.manually.merge",
    apiName: 'aiyong.trade.order.mergable.merge',
    fallbackTimeout: 0,
    requestTimeout: 0,
    enabled: true,
    trying: false,
    functionName: "手动合并订单"
  }
};

var FULLINFO_SOURCE = exports.FULLINFO_SOURCE = {
  aiyong: 'aiyong',
  top: 'top'
};
var SOLDGET_SOURCE = exports.SOLDGET_SOURCE = {
  aiyong: 'aiyong',
  top: 'top'
};
var ADVANCEDSEARCH_SOURCE = exports.ADVANCEDSEARCH_SOURCE = {
  aiyong: 'aiyong',
  top: 'top',
  fullinfo: 'fullinfo'
};
var SEARCH_ERROR_TYPE = exports.SEARCH_ERROR_TYPE = {
  searchAlert: "searchAlert",
  dialogAlert: "dialogAlert"
};

var pgApiHost = exports.pgApiHost = 'https://trade.aiyongbao.com';