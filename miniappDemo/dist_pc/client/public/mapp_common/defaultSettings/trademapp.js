'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultSettings_trademapp = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _public = require('./public.js');

var defaultSettings_trademapp = exports.defaultSettings_trademapp = _extends({
  nickMock: {
    enabled: false,
    nick: '',
    sellerId: ''
  },
  tradeListErrorMock: 0,
  pgSendErrorMock: 0,
  routerBatchErrorMock: 0,
  editApiTest: 0,
  send: {
    style: 'offline',
    lastCompanyName: {
      offline: '',
      online: ''
    }
  },
  tradeListSort: {
    ALL_CLOSED: 'create_time_desc',
    TRADE_FINISHED: 'create_time_desc',
    NEED_RATE: 'create_time_desc',
    TRADE_REFUND: 'create_time_desc',
    WAIT_BUYER_CONFIRM_GOODS: 'create_time_desc',
    WAIT_SELLER_SEND_GOODS: 'create_time_desc',
    WAIT_BUYER_PAY: 'create_time_desc',
    THREE_MONTH: 'create_time_desc'
  },
  lastSendParam: { // 上次发货选择的物流公司
    logisticsCompany: '',
    sendType: 'offline'
  },
  sendTypeMap: { // 上次发货选择的方式对应的物流公司
    offline: '',
    online: ''
  },
  tradeListConfigConst: {
    miniSearch: true, // 高级搜索是否收起
    pageSize: 20
  },
  batchPrintListConfigConst: {
    miniSearch: true, // 高级搜索是否收起
    cardType: 'simple',
    tradeListSort: {
      WAIT_SELLER_SEND_GOODS: 'create_time_desc',
      WAIT_BUYER_CONFIRM_GOODS: 'create_time_desc'
    },
    pageSize: 20
  },
  tradeManagementShowClosedTrade: false,
  changeRefundLastSendText: '亲，请您修改下退款原因哈，方便售后及时为您确认申请退款哈，点击链接：\n (#链接发送后自动生成#)，\n后点击修改申请红色按钮,退款原因为修改为：多拍/拍错/不想要,售后同学会第一时间处理退款申请的哈。',
  defaultPrinter: {
    CN: "",
    PDD: ""
  },
  printElecFaceTypeRecord: {},
  batchPrintGetCodeErrorMock: 0,
  elecfaceFinishSend: false,
  memoBatchDefaultOption: 'append', // 修改备注的方式
  memoHistoryOn: true,
  autoSend: false, // 发货页面的连续发货开关
  sendRiskTradeTipsDialog: {},
  searchHistoriesMb: []
}, _public.defaultSettings_public);