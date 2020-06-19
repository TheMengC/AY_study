export const DEFAULT_REASON = ['差评师', '好评率低的用户', '刷单用户', '同行卖家', '需要店铺返现买家'];
export const SWITCH_ARR = ["neutralon", "publicon", "badon", "handon", "goodrate", "bigmoney", "carnumless", "carnum", "smallmoney", "babynumless", "babynum", "credit", "noalipay", "regdays", "conon", "wwon", "areaon", "babyon", "whiteon", "conditions", "addblack"];
export const INTERCEPT_SWITCH_DATASOURCE = {
    denfenon: false,                     // 总开关
    switchArr:{                         // 所有的子开关
        'neutralon':{
            switchName: 'neutralon',     // 中评开关
            type: 'relaxNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'on',
                HarassMode:'on',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'publicon':{
            switchName: 'publicon',     // 云黑名单开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'badon':{
            switchName: 'badon',        // 差评开关
            type: 'relaxNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'on',
                HarassMode:'on',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'handon':{
            switchName: 'handon',       // 旺旺黑名单
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'goodrate':{
            switchName: 'goodrate', // 好评率开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'bigmoney':{
            switchName: 'bigmoney',  // 订单金额大于开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'carnumless':{
            switchName: 'carnumless',  // 订单件数小于开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'carnum':{
            switchName: 'carnum',     // 订单件数大于开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'smallmoney':{
            switchName: 'smallmoney', // 订单金额小于开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'babynumless':{
            switchName: 'babynumless',  // 订单中同一个宝贝数小于开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'babynum':{
            switchName: 'babynum',   // 订单中同一个宝贝数大于开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'credit':{
            switchName: 'credit',   // 信用分开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'noalipay':{
            switchName: 'noalipay',  // 没有绑定支付宝的买家
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'regdays':{
            switchName: 'regdays',  // 买家注册天数小于开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'conon':{
            switchName: 'conon',   // 收件人拦截开关
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'wwon':{
            switchName: 'wwon',    // 旺旺白名单
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'areaon':{
            switchName: 'areaon',  // 区域拦截
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'babyon':{
            switchName: 'babyon',   // 宝贝白名单
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'whiteon':{
            switchName: 'whiteon',  // 黑名单中的买家依旧拦截
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'conditions':{
            switchName: 'conditions',  // 关键字开关
            type: 'relaxNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'on',
                HarassMode:'on',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'addblack':{
            switchName: 'addblack',   // 符合拦截的条件的用户自动添加到黑名单
            type: 'strictNum',
            checked: false,
            value:'',
            defaultStatus:{              // 不同模式下的默认值
                relaxMode:'off',
                HarassMode:'off',
                strictMode:'on',
                definedMode:'off',
            },
        },
        'sendsms':{
            switchName: 'sendsms',   // 拦截短信通知开关
            type: 'no',
            checked: false,
        },
        'addbiew':{
            switchName: 'addbiew',   // 将关闭交易的真实的拦截原因添加到备注
            type: 'no',
            checked: false,
        },
    },
    sellernote: 0,                // 交易时卖家解释当前选择
    receivePhone: '',             // 接受手机号
    modeNum:{                       // 模型数量
        strictNum: 0,
        relaxNum: 0,
    },
};
export const INTERCEPT_RADIOARR = [    // 模式切换数组
    {
        value: 'HarassMode',
        text: '防拍单骚扰模式',
    },
    {
        value: 'relaxMode',
        text: '宽松拦截模式',
    },
    {
        value: 'strictMode',
        text: '严格拦截模式',
    },
    {
        value: 'definedMode',
        text: '自定义拦截模式',
    },
];

export const INTERCEPT_BUYER_REASON = ['未及时付款', '买家不想买了', '买家信息填写错误，重新拍', '恶意买家，同行捣乱', '缺货', '买家拍错了', '同城见面交易'];   // 交易时卖家解释

export const INTERCEPT_DEFAULT_KEY_WORDS = '联系QQ,活刷,皇冠,不降权,不扣分,不封店,爆款,刷钻,刷粉刷店铺,宝贝收藏,天猫关注,开团提醒,u站喜欢,企业QQ,动态平分,微淘关注,教程';  // 默认的关键字

export const INTERCEPT_MODE_ARR = ['HarassMode', 'relaxMode', 'strictMode', 'definedMode'];   // 模式数组

export const INTERCEPT_WHITE_REASON = ['好评率高的用户', '老顾客', '态度很好', '同城买家', 'VIP'];


export const INTERCEPT_TABLE_HEAD_TITLE = {
    'wwWhiteList': [
        { title: '买家旺旺', grid: 6 },
        { title: '放行时间', grid: 5 },
        { title: '添加原因', grid: 10 },
        { title: '操作', grid: 3 },
    ],
    'interceptRecord': [
        { title: '买家旺旺', grid: 5, fieldName: 'buyernick' },
        { title: '拦截时间', grid: 5, fieldName: 'optime' },
        { title: '订单号', grid: 5, fieldName: 'tid' },
        { title: '拦截结果', grid: 2, fieldName: 'result' },
        { title: '原因', grid: 7, fieldName: 'msg' },
    ],
    'interceptLog': [
        { title: '操作人', grid: 7, fieldName: 'operator' },
        { title: '操作时间', grid: 4, fieldName: 'optime' },
        { title: '操作内容', grid: 13, fieldName: 'reason' },
    ],
    'babyList': [
        { title: '宝贝', grid: 13 },
        { title: '添加时间', grid: 8 },
        { title: '操作', grid: 3 },
    ],
    'wwBlackList': [
        { title: '买家旺旺', grid: 5, fieldName: 'buyernicklist' },
        { title: '拉黑时间', grid: 5, fieldName: 'optime' },
        { title: '拉黑原因', grid: 11, fieldName: 'reason' },
        { title: '操作', grid: 3, fieldName: '' },
    ],
    'importRecord': [
        { title: '店铺名称', grid: 5, fieldName: 'nick' },
        { title: '添加时间', grid: 5, fieldName: 'saveTime' },
        { title: '数据来源', grid: 11, fieldName: 'dataSource' },
        { title: '导入数据', grid: 3, fieldName: 'source' },
    ],
    'interceptReceiverList': [
        { title: '姓名', grid: 3 },
        { title: '手机', grid: 3 },
        { title: '电话', grid: 3 },
        { title: '地址', grid: 4 },
        { title: '添加原因', grid: 4 },
        { title: '添加时间', grid: 5 },
        { title: '操作', grid: 2 },
    ],
    'regionList': [
        { title: '省', grid: 3 },
        { title: '市', grid: 3 },
        { title: '区', grid: 3 },
        { title: '添加时间', grid: 6 },
        { title: '添加原因', grid: 7 },
        { title: '操作', grid: 2 },
    ],
    'addBabyList': [
        { title: '选择', grid: 2 },
        { title: '宝贝信息', grid: 22 },
    ],
};
