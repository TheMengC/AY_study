import { SEARCH_INP } from "tradePublic/consts";

export const FLAG_COLOR_MAP = {
    0: "#989898",
    1: "#FF0000",
    2: "#FBF700",
    3: "#00FF00",
    4: "#004DFF",
    5: "#F700FF",
};

// 搜索页面的搜索项
export const SEARCH_PAGE_SEARCH_TYPE = {
    buyerNick: {
        name: '买家昵称',
        key: 'buyerNick',
    },
    receiverAddress: {
        name: '收件人信息',
        key: 'receiverAddress',
    },
    receiverMobile: {
        name: '手机号',
        key: 'receiverMobile',
    },
    waybillNum: {
        name: '运单号',
        key: 'waybillNum',
    },
    tid: {
        name: '订单号',
        key: 'tid',
    },
    titleKey: {
        name: '宝贝标题',
        key: 'titleKey',
    },
    skuId:{
        name:'商家编码',
        key:'skuId',
    },
    sellerMemo:{
        name:'卖家备注',
        key:'sellerMemo',
    },
    buyerMessage:{
        name:'买家留言',
        key:'buyerMessage',
    },
};
export const TAG_SEARCH_TYPE = {
    sellerFlag: FLAG_COLOR_MAP,
    startTime: '',
    endTime: '',
    hasBuyerSellerMemo: [
        {
            label: '有备注',
            value: 'seller',
        },
        {
            label: '有留言',
            value: 'buyer',
        },
        {
            label: '有备注或有留言',
            value: 'any',
        },
        {
            label: '无备注且无留言',
            value: 'none',
        },
    ],
    timeFilterBy:SEARCH_INP.timeFilterBy.dataSource,
    fastTime: {
        today: {
            value: 'today',
            label: '今日',
            startTimediff: 0,
            endTimediff: 0,
        },
        yesterday: {
            value: 'yesterday',
            label: '昨日',
            startTimediff: 1,
            endTimediff: 1,
        },
        lastWeek: {
            value: 'lastWeek',
            label: '近7天',
            startTimediff: 6,
            endTimediff: 0,
        },
        lastMonth: {
            value: 'lastMonth',
            label: '近30天',
            startTimediff: 30,
            endTimediff: 0,
        },
    },
    tag: [
        {
            label: '普通订单',
            value: 'normal',
        },
        {
            label: '合并的订单',
            value: 'merged_trade',
        },
        {
            label: '货到付款',
            value: 'cod',
        },
        {
            label: '部分发货',
            value: 'seller_consigned_part',
        },
        {
            label: '退款中',
            value: 'refunding',
        },
    ],
};

export const STATUS_LABEL_COLOR = {
    WAIT_BUYER_PAY: '#F5A953',
    WAIT_SELLER_SEND_GOODS: '#26C4D1',
    WAIT_BUYER_CONFIRM_GOODS: '#69ACFA',
    TRADE_REFUND: '#FF6161',
    NEED_RATE: '#D231F4',
    TRADE_FINISHED: '#64BB01',
    ALL_CLOSED: '#DDDDDD',
};

export const INDEX_TRADE_TABS = {
    WAIT_BUYER_PAY: {
        key: 'WAIT_BUYER_PAY',
        beacon: 'waitBuyerPay',
        listTab: 1,
        icon: 'order_pay',
        name: '待付款',
        label: STATUS_LABEL_COLOR['WAIT_BUYER_PAY'],
        countdown: {
            text: '还剩@自动关闭',
            startTime: '',
            endTime: 'timeout_action_time',
        },
        tradeDetail: { iconUrl: '//q.aiyongbao.com/miniapp/trade/img/mobile/trade_detail_wait_pay.png' },
    },
    WAIT_SELLER_SEND_GOODS: {
        key: 'WAIT_SELLER_SEND_GOODS',
        beacon: 'waitSellerSendGoods',
        listTab: 2,
        icon: 'order_prepare',
        name: '待发货',
        label: STATUS_LABEL_COLOR['WAIT_SELLER_SEND_GOODS'],
        countdown: {
            text: '已付款@',
            startTime: 'pay_time',
            endTime: '',
        },
        tradeDetail: { iconUrl: '//q.aiyongbao.com/miniapp/trade/img/mobile/trade_detail_wait_send_good.png' },
    },
    WAIT_BUYER_CONFIRM_GOODS: {
        key: 'WAIT_BUYER_CONFIRM_GOODS',
        beacon: 'waitBuyerConfirmGoods',
        listTab: 3,
        icon: 'order_deliver',
        name: '已发货',
        label: STATUS_LABEL_COLOR['WAIT_BUYER_CONFIRM_GOODS'],
        countdown: {
            text: '剩余@自动确认收货',
            startTime: '',
            endTime: 'timeout_action_time',
        },
        tradeDetail: { iconUrl: '//q.aiyongbao.com/miniapp/trade/img/mobile/trade_detail_wait_confirm_good.png' },
    },
    TRADE_REFUND: {
        key: 'TRADE_REFUND',
        beacon: 'tradeRefund',
        listTab: 4,
        icon: 'order_refund',
        name: '退款中',
        label: STATUS_LABEL_COLOR['TRADE_REFUND'],
        tradeDetail: { iconUrl: '//q.aiyongbao.com/miniapp/trade/img/mobile/trade_detail_refund.png' },
    },
    NEED_RATE: {
        key: 'NEED_RATE',
        beacon: 'needRate',
        listTab: 5,
        icon: 'order_comment',
        name: '待评价',
        label: STATUS_LABEL_COLOR['NEED_RATE'],
        countdown: { text: '@后默认好评' },
        tradeDetail: { iconUrl: '//q.aiyongbao.com/miniapp/trade/img/mobile/trade_detail_need_rate.png' },
    },
    TRADE_FINISHED: {
        key: 'TRADE_FINISHED',
        beacon: 'tradeFinished',
        listTab: 6,
        name: '已成功',
        label: STATUS_LABEL_COLOR['TRADE_FINISHED'],
        tradeDetail: { iconUrl: '//q.aiyongbao.com/miniapp/trade/img/mobile/trade_detail_finished.png' },
    },
    ALL_CLOSED: {
        key: 'ALL_CLOSED',
        beacon: 'allClosed',
        listTab: 7,
        name: '已关闭',
        label: STATUS_LABEL_COLOR['ALL_CLOSED'],
        tradeDetail: { iconUrl: '//q.aiyongbao.com/miniapp/trade/img/mobile/trade_detail_closed.png' },
    },
};
export const SELLER_TOOLS_MAP = {
    tradePrint: {
        name: '订单打印',
        // page: '/pages/tradePrint/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_printorder@2x.png',
        qapPage:'BluetoothList',
    },
    customPrint: {
        name: '自由打印',
        // page: '/pages/customPrint/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_printfree@2x.png',
        qapPage:'CustomPrint',
    },
    autoRate: {
        name: '自动评价',
        page: '/pages/autoRate/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_autocomment@2x.png',
        beacon: 'autoRate',
    },
    intercept: {
        name: '差评拦截',
        page: '/pages/intercept/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_prevent@2x.png',
        beacon: 'intercept',
    },
    batchSendOrder: {
        name: '批量发货',
        page: '/pages/batchSendOrder/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_delivermore@2x.png',
        beacon: 'batchSendOrder',
    },
    batchRate: {
        name: '批量评价',
        page: '/pages/batchRate/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_commentmore@2x.png',
        beacon: 'batchRate',
    },
    rateManagement: {
        name: '评价管理',
        page: '/pages/rateManagement/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_comentmanagment@2x.png',
        beacon: 'rateManagement',
    },
    // logisticsManagement: {
    //     name: '物流管理',
    //     page: '/pages/LogisticsManagement/index',
    //     imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_delivermanagment@2x.png',
    // },
    // wwRushPay: {
    //     name: '旺旺催付',
    //     page: '/pages/wwRushPay/index',
    //     imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_wangwang@2x.png',
    // },
    // checkAddress: {
    //     name: '核对地址',
    //     page: '/pages/checkAddress/index',
    //     imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_addressconfirm@2x.png',
    // },
    smsCare: {
        name: '短信关怀',
        // page: '/pages/smsCare/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_msgcare@2x.png',
        qapPage:'SmsCare',
    },
    smsInform: {
        name: '通知短信',
        // page: '/pages/smsInform/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_msgnotice@2x.png',
        qapPage:'SmsNotice',
    },
    pickGoods: {
        name: '拣货单',
        // page: '/pages/pick/index',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_pick@2x.png',
        qapPage:'OrderBlank',
    },
    abnormalLogistics:{
        name: '异常物流',
        imgSrc: '//q.aiyongbao.com/trade/web/images/qap_img/mobile/wgcjc_0505.png',
        qapPage: "AbNLogistics",

    },
};
export const USE_SETTING_MAP = {
    deliverLogistics: {
        name: '默认物流',
        page: '/pages/logisticsSettings/commonlyLogistics',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_deliverdefault@2x.png',
    },
    address: {
        name: '地址库',
        page: '/pages/logisticsSettings/logisticsAddress',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_address@2x.png',
    },
    phrase: {
        name: '常用短语',
        page: 'my',
        imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_hello@2x.png',
    },
    // authorise: {
    //     name: '重新授权',
    //     page: '',
    //     imgSrc: '//q.aiyongbao.com/miniapp/trade/img/mobile/home_authorise@2x.png',
    // },
};
export const RATE_GRADE_MAP = {
    'good': {
        text: '好评',
        icon: 'order_comment1',
    },
    'neutral': {
        text: '中评',
        icon: 'order_comment2',
    },
    'bad': {
        text: '差评',
        icon: 'order_comment2 bad-rate',
    },
};

export const REFUND_GOODS_STATUS_MAP = {
    'BUYER_NOT_RECEIVED': '买家未收到货',
    'BUYER_RECEIVED': '买家已收到货',
    'BUYER_RETURNED_GOODS': '买家已退货',
}
