/**
 * 这个文件主要是放静态变量 尽量不要引用别的文件到这里面 容易出现循环引用的问题
 *
 */
export const TRADE_LIST_BATCH_ACTIONS = {
    MEMO: {
        name: '批量备注',
        key: 'MEMO',
        pid:742,
    },
    CLOSE: {
        name: '批量关闭',
        key: 'CLOSE',
    },
    FREE_POST: {
        name: '批量免邮',
        key: 'FREE_POST',
    },
    PAYMENT: {
        name: '批量催付',
        key: 'PAYMENT',
    },
    SEND: {
        name: '批量发货',
        key: 'SEND',
        pid:740,
    },
    PRINT_LOGISTICS: {
        name: '打快递单',
        key: 'PRINT_LOGISTICS',
        pid:724,
    },
    PRINT_ELECFACE: {
        name: '打印面单',
        key: 'PRINT_ELECFACE',
        pid:1374,
    },
    PRINT_DELIVERY: {
        name: '打发货单',
        key: 'PRINT_DELIVERY',
        pid:725,
    },
    RATE: {
        name: '批量评价',
        key: 'RATE',
        pid:1337,
    },
};
export const BATCH_PRINT_BATCH_ACTION = {
    PRINT_LOGISTICS: {
        name: '批量打印快递单',
        key: 'PRINT_LOGISTICS',
        pid:847,
    },
    PRINT_ELECFACE: {
        name: '批量打印面单',
        key: 'PRINT_ELECFACE',
        pid:849,
    },
    PRINT_DELIVERY: {
        name: '批量打印发货单',
        key: 'PRINT_DELIVERY',
        pid:848,
    },
    SEND: {
        name: '批量发货',
        key: 'SEND',
        pid:846,
    },
};
export const WHAT_I_NEED = {
    WAIT_BUYER_PAY: {
        key: 'WAIT_BUYER_PAY',
        name: '待付款',
        labelClassName: 'label-wait',
        type: 'dfk',
    },
    WAIT_SELLER_SEND_GOODS: {
        key: 'WAIT_SELLER_SEND_GOODS',
        name: '待发货',
        labelClassName: 'label-info',
        type: 'dfh',
    },
};
export const statusNameMap = {
    WAIT_BUYER_PAY: {
        key:'WAIT_BUYER_PAY',
        name: '待付款',
        labelClassName: 'label-wait',
        type: 'dfk',
    },
    TRADE_NO_CREATE_PAY: {
        key:'TRADE_NO_CREATE_PAY',
        name: '待付款',
        labelClassName: 'label-wait',
        type: 'dfk',
    },
    PAY_PENDING: {
        key:'PAY_PENDING',
        name: '外卡支付',
        labelClassName: 'label-nomore',
        type: 'dfk',
    },
    WAIT_SELLER_SEND_GOODS: {
        key:'WAIT_SELLER_SEND_GOODS',
        name: '待发货',
        labelClassName: 'label-info',
        type: 'dfh',
    },
    SELLER_CONSIGNED_PART: {
        key:'SELLER_CONSIGNED_PART',
        name: '部分发货',
        labelClassName: 'label-info',
        type: 'dfh',
    },
    PAID_FORBID_CONSIGN: {
        key:'PAID_FORBID_CONSIGN',
        name: '已冻结',
        labelClassName: 'label-info',
        type: 'dfh',
    },
    WAIT_BUYER_CONFIRM_GOODS: {
        key:'WAIT_BUYER_CONFIRM_GOODS',
        name: '已发货',
        labelClassName: 'label-primary',
        type: 'yfh',
    },
    TRADE_BUYER_SIGNED: {
        key:'TRADE_BUYER_SIGNED',
        name: '已签收',
        labelClassName: 'label-primary',
        type: 'yfh',
    },
    TRADE_FINISHED: {
        key:'TRADE_FINISHED',
        name: '已成功',
        labelClassName: 'label-success',
        type: 'ycg',
    },
    TRADE_CLOSED: {
        key:'TRADE_CLOSED',
        name: '已关闭',
        labelClassName: 'label-nomore',
        type: 'ygb',
    },
    TRADE_CLOSED_BY_TAOBAO: {
        key:'TRADE_CLOSED_BY_TAOBAO',
        name: '已关闭',
        labelClassName: 'label-nomore',
        type: 'ygb',
    },
    TRADE_REFUND:{
        key:'TRADE_REFUND',
        name:'退款中',
        type: 'tkz',
    },
};
export const STATUS_IS_SENDED = {
    'WAIT_BUYER_PAY': 0,
    'TRADE_FINISHED': 1,
    'WAIT_BUYER_CONFIRM_GOODS': 1,
    'WAIT_SELLER_SEND_GOODS': 0,
};
export const TRADE_SORT_BY = {
    pay_time_asc: { name:"付款时间从远到近", key:'pay_time_asc' },    // 付款时间
    pay_time_desc: { name:"付款时间从近到远", key:'pay_time_desc' },
    consign_time_asc: { name:"发货时间从远到近", key:'consign_time_asc' }, // 发货时间
    consign_time_desc: { name:"发货时间从近到远", key:'consign_time_desc' },
    create_time_asc: { name:"拍下时间从远到近", key:'create_time_asc' }, // 下单时间
    create_time_desc: { name:"拍下时间从近到远", key:'create_time_desc' },
};
export const REFUND_TABS = {
    ALL:{
        key: 'ALL',
        name: '所有退款',
    },
    WAIT_SELLER_AGREE:{
        key: 'WAIT_SELLER_AGREE',
        name: '新申请待处理',
        label: '新申请，待处理',
        class: 'label-wait',
    },
    WAIT_BUYER_RETURN_GOODS:{
        key: 'WAIT_BUYER_RETURN_GOODS',
        name: '等待买家退货',
        label: '等待买家退货',
        class: 'label-return',
    },
    WAIT_SELLER_CONFIRM_GOODS:{
        key: 'WAIT_SELLER_CONFIRM_GOODS',
        name: '已退货待确认',
        label: '已退货，待确认',
        class: 'label-confirm',
    },
    SELLER_REFUSE_BUYER:{
        key: 'SELLER_REFUSE_BUYER',
        name: '已拒绝退款',
        label: '已拒绝退款',
        class: 'label-refuse',
    },
    CLOSED:{
        key: 'CLOSED',
        name: '退款关闭',
        label: '退款关闭',
        class: 'label-close',
    },
    SUCCESS:{
        key: 'SUCCESS',
        name: '退款成功',
        label: '退款成功',
        class: 'label-success',
    },

}
export const TRADE_TABS = {
    THREE_MONTH: {
        key: 'THREE_MONTH',
        name: '近三个月',
        query_status: '',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        sortType:[
            TRADE_SORT_BY.create_time_desc.key,
            TRADE_SORT_BY.create_time_asc.key,
        ],
        // 因为后端有bug暂时把近三个月的合单选项禁用掉
        donotSearch: {
            tag: {
                key: 'tag',
                value: ['merged_trade'],
            },
        },
    },
    WAIT_BUYER_PAY: {
        key: 'WAIT_BUYER_PAY',
        name: '待付款',
        query_status: 'ALL_WAIT_PAY',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.CLOSE,
            TRADE_LIST_BATCH_ACTIONS.FREE_POST,
            // TRADE_LIST_BATCH_ACTIONS.PAYMENT,
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        sortType:[
            TRADE_SORT_BY.create_time_desc.key,
            TRADE_SORT_BY.create_time_asc.key,
        ],
        donotSearch: {
            timeFilterBy: {
                key: 'timeFilterBy',
                value: ['pay_time', 'consign_time'],
            },
            hasPrintLogistics: { key: 'hasPrintLogistics' },
            hasPrintDelivery: { key: 'hasPrintDelivery' },
            logisticsCompany: { key: 'logisticsCompany' },
            promiseService: { key: 'promiseService' },
            tag: {
                key: 'tag',
                value: ['normal', 'merged_trade', 'consign_time', 'cod', 'seller_consigned_part', 'refunding', 'forbid_consign', 'timing_promise'],
            },
        },
    },
    WAIT_SELLER_SEND_GOODS: {
        key: 'WAIT_SELLER_SEND_GOODS',
        name: '待发货',
        query_status: 'WAIT_SELLER_SEND_GOODS',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.SEND,
            TRADE_LIST_BATCH_ACTIONS.PRINT_DELIVERY,
            TRADE_LIST_BATCH_ACTIONS.PRINT_ELECFACE,
            TRADE_LIST_BATCH_ACTIONS.PRINT_LOGISTICS,
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        batchPrintBatchAction: [
            BATCH_PRINT_BATCH_ACTION.PRINT_LOGISTICS,
            BATCH_PRINT_BATCH_ACTION.PRINT_ELECFACE,
            BATCH_PRINT_BATCH_ACTION.PRINT_DELIVERY,
            BATCH_PRINT_BATCH_ACTION.SEND,
        ],
        sortType:[
            TRADE_SORT_BY.create_time_desc.key,
            TRADE_SORT_BY.create_time_asc.key,
            TRADE_SORT_BY.pay_time_desc.key,
            TRADE_SORT_BY.pay_time_asc.key,
        ],
        donotSearch: {
            timeFilterBy: {
                key: 'timeFilterBy',
                value: ['consign_time'],
            },
        },
    },
    WAIT_BUYER_CONFIRM_GOODS: {
        key: 'WAIT_BUYER_CONFIRM_GOODS',
        name: '已发货',
        query_status: 'WAIT_BUYER_CONFIRM_GOODS',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.PRINT_DELIVERY,
            TRADE_LIST_BATCH_ACTIONS.PRINT_ELECFACE,
            TRADE_LIST_BATCH_ACTIONS.PRINT_LOGISTICS,
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        batchPrintBatchAction: [
            BATCH_PRINT_BATCH_ACTION.PRINT_LOGISTICS,
            BATCH_PRINT_BATCH_ACTION.PRINT_ELECFACE,
            BATCH_PRINT_BATCH_ACTION.PRINT_DELIVERY,
        ],
        sortType:[
            TRADE_SORT_BY.create_time_desc.key,
            TRADE_SORT_BY.create_time_asc.key,
            TRADE_SORT_BY.pay_time_desc.key,
            TRADE_SORT_BY.pay_time_asc.key,
            TRADE_SORT_BY.consign_time_desc.key,
            TRADE_SORT_BY.consign_time_asc.key,
        ],
        donotSearch: {
            tag: {
                key: 'tag',
                value: ['forbid_consign', 'seller_consigned_part'],
            },
        },
    },

    TRADE_REFUND: {
        key: 'TRADE_REFUND',
        name: '退款中',
        query_status:'TRADE_REFUND',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        sortType:[],
        donotSearch: {
            tag: {
                key: 'tag',
                value: ['seller_consigned_part'],
            },
        },
    },

    NEED_RATE: {
        key: 'NEED_RATE',
        name: '待评价',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.RATE,
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        sortType:[
            TRADE_SORT_BY.create_time_desc.key,
            TRADE_SORT_BY.create_time_asc.key,
            TRADE_SORT_BY.pay_time_desc.key,
            TRADE_SORT_BY.pay_time_asc.key,
            TRADE_SORT_BY.consign_time_desc.key,
            TRADE_SORT_BY.consign_time_asc.key,
        ],
        donotSearch: {
            tag: {
                key: 'tag',
                value: ['merged_trade', 'seller_consigned_part', 'forbid_consign'],
            },
        },
    },

    TRADE_FINISHED: {
        key: 'TRADE_FINISHED',
        name: '已成功',
        query_status: 'TRADE_FINISHED',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        sortType:[
            TRADE_SORT_BY.create_time_desc.key,
            TRADE_SORT_BY.create_time_asc.key,
            TRADE_SORT_BY.pay_time_desc.key,
            TRADE_SORT_BY.pay_time_asc.key,
            TRADE_SORT_BY.consign_time_desc.key,
            TRADE_SORT_BY.consign_time_asc.key,
        ],
        donotSearch: {
            tag: {
                key: 'tag',
                value: ['merged_trade', 'seller_consigned_part', 'forbid_consign'],
            },
        },
    },

    ALL_CLOSED: {
        key: 'ALL_CLOSED',
        name: '已关闭',
        query_status: 'ALL_CLOSED',
        batchActions: [
            TRADE_LIST_BATCH_ACTIONS.MEMO,
        ],
        sortType:[],
        donotSearch: {
            timeFilterBy: {
                key: 'timeFilterBy',
                value: ['pay_time', 'consign_time'],
            },
            tag: {
                key: 'tag',
                value: ['normal', 'merged_trade', 'cod', 'seller_consigned_part', 'refunding', 'forbid_consign', 'timing_promise'],
            },
        },
    },
};

export const promiseService = [
    {
        label: '全部',
        value: 'all',
    },
    {
        label: '当天发货',
        value: 'deliver_today',
    },
    {
        label: '24h发货',
        value: 'deliver_in24h',
    },
    {
        label: '当日达',
        value: 'arrive_today',
    },
    {
        label: '次日达',
        value: 'arrive_tomorrow',
    },
];

export const FOOT_PAGE_SIZE = {
    tradeManagement: [
        20, 40, 80, 100,
    ],
    batchPrint: [
        20, 40, 80, 100, 200,
    ],
};

// 地址筛选
export const addrState = ['辽宁省', '湖北省', '山西省', '福建省', '青海省', '江西省', '河南省', '宁夏回族自治区', '澳门特别行政区', '浙江省', '新疆维吾尔自治区', '吉林省', '安徽省', '内蒙古自治区', '台湾', '海南省', '香港特别行政区', '云南省', '贵州省', '江苏省', '西藏自治区', '北京', '四川省', '黑龙江省', '广西壮族自治区', '陕西省', '天津', '广东省', '重庆', '河北省', '湖南省', '甘肃省', '山东省', '海外', '上海'];
let addrSourceChildren = [];
for(let state of addrState) {
    addrSourceChildren.push({
        label:state,
        value:state,
    });
}
export const addrSource = [
    {
        label:'',
        children:[
            {
                label:'所有省份',
                value:'all',
            },
            {
                label:'江浙沪',
                value:'江浙沪',
            }, {
                label:'珠三角',
                value:'珠三角',
            }, {
                label:'京津冀',
                value:'京津冀',
            }, {
                label:'东三省',
                value:'东三省',
            }, {
                label:'港澳台',
                value:'港澳台',
            },
        ],
    },
    {
        // label:(<div style = {{border: "1px dashed #999",marginLeft:" -10px",width: "130%"}}></div>),
        children: addrSourceChildren,
    },
];

let ADDR_SOURCE_CHILDREN = JSON.parse(JSON.stringify(addrSourceChildren));
export const ADDR_SOURCES = addrSource[0].children.filter(item => item.value != 'all').concat(ADDR_SOURCE_CHILDREN);

export const SEARCH_TYPE = {
    DATETIME: 'DATETIME', // 日期
    INPUTMORE: 'INPUTMORE', //  一个输入框中处理两种搜索内容
    // 输入框 receiverName receiverMobile receiverAddress waybillNum skuId sellerMemo buyerMessage
    INPUT: 'INPUT',
    INPUTNUM: 'INPUTNUM', //  数字输入框
    SELECT: 'SELECT', // tag按钮 和 下拉框
    SORTSELECT: 'SORTSELECT', // 时间排序选择框
    CHECKBOX: 'CHECKBOX', // 旗帜选择
    THREEBTN: 'THREEBTN', // 三个按钮搜索项
};

const SEARCH_LEVEL = {
    NORMAL: 0,  // 普通搜索
    VIP: 1,     // 高级搜索
};

export const SEARCH_INP = {
    status: {
        key: 'status',
        level: SEARCH_LEVEL.NORMAL,
    },
    tidNick: {
        key: 'tidNick',
        level: SEARCH_LEVEL.NORMAL,
        type: SEARCH_TYPE.INPUTMORE,
    },
    tid: {
        key: 'tid',
        level: SEARCH_LEVEL.NORMAL,
    },
    buyerNick: {
        key: 'buyerNick',
        level: SEARCH_LEVEL.NORMAL,
    },
    titleKey: {
        key: 'titleKey',
        level: SEARCH_LEVEL.VIP,
    },
    numIid: {
        key: 'numIid',
        level: SEARCH_LEVEL.VIP,
    },
    babyKey: {
        key: 'babyKey',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUTMORE,
    },
    receiverName: {
        key: 'receiverName',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUT,
    },
    receiverMobile: {
        key: 'receiverMobile',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUT,
    },
    receiverAddress: {
        key: 'receiverAddress',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUT,
    },
    waybillNum: {
        key: 'waybillNum',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUT,
    },
    skuId: {
        key:'skuId',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUT,
    },
    sellerMemo: {
        key: 'sellerMemo',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUT,
    },
    buyerMessage: {
        key: 'buyerMessage',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUT,
    },
    timeFilterBy: {
        key: 'timeFilterBy',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.SORTSELECT,
        dataSource: [
            {
                label: '下单时间',
                value: 'create_time',
                disabled: false,
            },
            {
                label: '付款时间',
                value: 'pay_time',
                disabled: false,
            },
            {
                label: '发货时间',
                value: 'consign_time',
                disabled: false,
            },
        ],
    },
    startTime: {
        key: 'startTime',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.DATETIME,
    },
    endTime: {
        key: 'endTime',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.DATETIME,
    },
    firstPayment: {
        key: 'firstPayment',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUTNUM,
    },
    lastPayment: {
        key: 'lastPayment',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUTNUM,
    },
    firstNum: {
        key: 'firstNum',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUTNUM,
    },
    lastNum: {
        key: 'lastNum',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.INPUTNUM,
    },
    sellerFlag: {
        key: 'sellerFlag',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.CHECKBOX,
    },
    hasBuyerSellerMemo: {
        key: 'hasBuyerSellerMemo',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.SELECT,
        dataSource: [
            {
                label:'全部',
                value: 'all',
                disabled: false,
            }, {
                label:'有备注或有留言',
                value: 'any',
                disabled: false,
            }, {
                label:'无备注且无留言',
                value: 'none',
                disabled: false,
            },
            {
                label:'有留言',
                value: 'buyer',
                disabled: false,
            },
            {
                label:'有备注',
                value: 'seller',
                disabled: false,
            },
        ],
    },
    hasPrintLogistics: {
        key: 'hasPrintLogistics',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.THREEBTN,
        dataSource: [
            {
                label:'全部',
                value: 'all',
                disabled: false,
            }, {
                label:'待打印',
                value: '0',
                disabled: false,
            }, {
                label:'已打印',
                value: '1',
                disabled: false,
            },
        ],
    },
    hasPrintDelivery: {
        key: 'hasPrintDelivery',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.THREEBTN,
        dataSource: [
            {
                label:'全部',
                value: 'all',
                disabled: false,
            }, {
                label:'待打印',
                value: '0',
                disabled: false,
            }, {
                label:'已打印',
                value: '1',
                disabled: false,
            },
        ],
    },
    receiverArea: {
        key: 'receiverArea',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.SELECT,
    },
    logisticsCompany: {
        key: 'logisticsCompany',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.SELECT,
    },
    promiseService: {
        key: 'promiseService',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.SELECT,
    },
    sortBy: {
        key: 'sortBy',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.SELECT,
    },
    tag: {
        key: 'tag',
        level: SEARCH_LEVEL.VIP,
        type: SEARCH_TYPE.SELECT,
        dataSource: [
            {
                label:'全部',
                value: 'all',
                disabled: false,
            },
            {
                label:'普通订单',
                value:'normal',
                disabled: false,
            },
            {
                label:'合并的订单',
                value:'merged_trade',
                disabled: false,
            },
            {
                label:'货到付款',
                value:'cod',
                disabled: false,
            },
            {
                label:'部分发货',
                value:'seller_consigned_part',
                disabled: false,
            },
            {
                label:'退款中',
                value:'refunding',
                disabled: false,
            },
            {
                label:'冻结中',
                value:'forbid_consign',
                disabled: false,
            },
            {
                label:'时效订单',
                value:'timing_promise',
                disabled: false,
            },
        ],
    },
};

export const SEARCH_DATE_TYPE = {
    today: {
        key: 'today',
        value: '今日',
        startTimediff: 0,
        endTimediff: 0,
    },
    yesterday: {
        key: 'yesterday',
        value: '昨日',
        startTimediff: 1,
        endTimediff: 1,
    },
    lastWeek: {
        key: 'lastWeek',
        value: '近7天',
        startTimediff: 6,
        endTimediff: 0,
    },
    lastMonth: {
        key: 'lastMonth',
        value: '近30天',
        startTimediff: 30,
        endTimediff: 0,
    },
};

export const TRADE_STATUS_TO_TAB_STATUS_MAP = {
    WAIT_BUYER_PAY:TRADE_TABS.WAIT_BUYER_PAY.key, // 待付款
    PAY_PENDING:TRADE_TABS.WAIT_BUYER_PAY.key,
    TRADE_NO_CREATE_PAY:TRADE_TABS.WAIT_BUYER_PAY.key,

    WAIT_SELLER_SEND_GOODS:TRADE_TABS.WAIT_SELLER_SEND_GOODS.key, // 待发货
    PAID_FORBID_CONSIGN:TRADE_TABS.WAIT_SELLER_SEND_GOODS.key,
    SELLER_CONSIGNED_PART:TRADE_TABS.WAIT_SELLER_SEND_GOODS.key,

    WAIT_BUYER_CONFIRM_GOODS:TRADE_TABS.WAIT_BUYER_CONFIRM_GOODS.key, // 待收货
    TRADE_BUYER_SIGNED:TRADE_TABS.WAIT_BUYER_CONFIRM_GOODS.key,

    TRADE_FINISHED:TRADE_TABS.TRADE_FINISHED.key, // 已成功

    TRADE_CLOSED:TRADE_TABS.ALL_CLOSED.key, // 已关闭
    TRADE_CLOSED_BY_TAOBAO: TRADE_TABS.ALL_CLOSED.key,
};

export const CLOSE_REASON_MAP = {
    TRADE_CLOSED:'交易自动关闭',
    TRADE_CLOSED_BY_TAOBAO:'卖家或买家主动关闭交易',
};

export const RATE_API_QUERY = {
    'buyer':{   // 买家给卖家的评价
        method:'taobao.traderates.get',
        fields:'tid,nick,created,item_title,item_price,content,oid,result,valid_score',
        rate_type:'get',
        role:'buyer',
    },
    'seller':{  // 卖家给买家的评价
        method:'taobao.traderates.get',
        fields:'tid,nick,created,item_title,item_price,content,oid,result,valid_score',
        rate_type:'give',
        role:'seller',
        page_size: 150,
    },
};

export const ORDER_DETECTION_SETTING_OPTIONS = [
    {
        key:'dangerTrade',
        title:'留言中包含有害信息，疑似诈骗',
    },
    {
        key:'addrKeyWord',
        title:'收货地址中包含敏感关键字',
    },
    {
        key:'buyerToMeBad',
        title:'该买家给过你中差评',
    },
    {
        key:'moreBad',
        title:'云黑名单中该买家发出的中差评数高于5个',
    },
];

export const NOOP = () => {};

// 淘宝订单状态根据tab转换成我们的
export const statusMap = {
    'WAIT_BUYER_PAY': 'WAIT_BUYER_PAY',
    'TRADE_NO_CREATE_PAY': 'WAIT_BUYER_PAY',
    'PAY_PENDING': 'WAIT_BUYER_PAY',
    'WAIT_SELLER_SEND_GOODS': 'WAIT_SELLER_SEND_GOODS',
    'SELLER_CONSIGNED_PART': 'WAIT_SELLER_SEND_GOODS',
    'PAID_FORBID_CONSIGN': 'WAIT_SELLER_SEND_GOODS',
    'WAIT_BUYER_CONFIRM_GOODS': 'WAIT_BUYER_CONFIRM_GOODS',
    'TRADE_BUYER_SIGNED': 'WAIT_BUYER_CONFIRM_GOODS',
    'TRADE_FINISHED': 'TRADE_FINISHED',
    'TRADE_CLOSED': 'ALL_CLOSED',
    'TRADE_CLOSED_BY_TAOBAO': 'ALL_CLOSED',
};
export const CLOSE_TRADE_REASONS = [
    '未及时付款',
    '买家不想买了',
    '买家信息填写错误，重新拍',
    '恶意买家/同行捣乱',
    '缺货',
    '买家拍错了',
    '同城见面交易',
];
export const TRADE_ORDER_TYPE = [
    {
        key: 'all',
        name: '所有订单',
    },
    {
        key: '0',
        name: '淘宝订单',
    },
    {
        key: '1',
        name: '拼多多订单',
    },
    {
        key: '2',
        name: '自由打印订单',
    },
];
export const TRADE_BILL_TYPE = [
    {
        key: '所有类型',
        name: '所有类型',
    },
    {
        key: 'Expface',
        name: '快递单',
    },
    {
        key: 'Eleface',
        name: '面单',
    },
];
export const STATUS_NAME_MAP = {
    WAIT_BUYER_PAY: '待付款',
    TRADE_NO_CREATE_PAY: '待付款',
    PAY_PENDING: '外卡支付',
    WAIT_SELLER_SEND_GOODS: '待发货',
    SELLER_CONSIGNED_PART: '部分发货',
    PAID_FORBID_CONSIGN: '已冻结',
    WAIT_BUYER_CONFIRM_GOODS: '已发货',
    TRADE_BUYER_SIGNED: '已签收',
    TRADE_FINISHED: '已成功',
    ALL_CLOSED: '已关闭',
    TRADE_CLOSED: '已关闭',
    TRADE_CLOSED_BY_TAOBAO: '已关闭',
    TRADE_REFUND: '退款中',
    NEED_RATE: '待评价',
};
