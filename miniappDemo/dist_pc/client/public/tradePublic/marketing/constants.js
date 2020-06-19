'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _switchPid, _navigatorConst;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NO_AD_PID = exports.NO_AD_PID = 0;

/*
 * @Description 强中弱提示统一pid存储位置
*/
var CONST_PIDS = exports.CONST_PIDS = {
  'item': {
    'Android': {
      'high': {
        'index': 1733,
        'detail': 1734,
        'list': 1735
      },
      'high_free': {
        'index': 1774,
        'detail': 1775,
        'list': 1776
      },
      'middle': {
        'index': 1718,
        'detail': 1719,
        'list': 1720
      },
      'middle_free': {
        'index': 1771,
        'detail': 1772,
        'list': 1773
      },
      'marketing': {
        'index': 3460,
        'detail': 3456,
        'list': 3458
      },
      'banner': {
        'index': 3461,
        'detail': 3457,
        'list': 3459
      },
      'coupon': { 'index': 3695 },
      'banner_newuser': {
        'index': 3658,
        'detail': 3660,
        'list': 3659
      }
    },
    'iOS': {
      'high': {
        'index': 3442,
        'detail': 3441,
        'list': 3440
      },
      'high_free': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'middle': {
        'index': 3445,
        'detail': 3444,
        'list': 3443
      },
      'middle_free': {
        'index': 1771,
        'detail': 1772,
        'list': 1773
      },
      'marketing': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'banner': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'coupon': { 'index': 3696 },
      'banner_newuser': {
        'index': 3665,
        'detail': 3666,
        'list': 3667
      }
    },
    'pc': {
      'high': {
        'index': 1726,
        'detail': 1727,
        'list': 3827
      },
      'high_free': {
        'index': 1767,
        'detail': 1768,
        'list': 3830
      },
      'middle': {
        'index': 1721,
        'detail': 1722,
        'list': 3828
      },
      'middle_free': {
        'index': 1762,
        'detail': 1763,
        'list': 3831
      },
      'marketing': {
        'index': 436,
        'detail': 437,
        'list': 3829
      },
      'banner': {
        'index': 415,
        'detail': 435,
        'list': 3824
      },
      'middle_card': 3943,
      'coupon': { index: 3786 },
      'banner_newuser': {}
    }
  },
  'trade': {
    'Android': {
      'high': {
        'index': 1730,
        'detail': 1731,
        'list': 1732
      },
      'high_free': {
        'index': 1749,
        'detail': 1750,
        'list': 1751
      },
      'middle': {
        'index': 1715,
        'detail': 1716,
        'list': 1717
      },
      'middle_free': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'marketing': {
        'index': 3471,
        'detail': 3467,
        'list': 3469
      },
      'banner': {
        'index': 3472,
        'detail': 3468,
        'list': 3470
      },
      'coupon': { 'index': 3694 },
      'banner_newuser': {
        'index': 3622,
        'detail': 3637,
        'list': 3636
      }
    },
    'iOS': {
      'high': {
        'index': 3385,
        'detail': 3384,
        'list': 3383
      },
      'high_free': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'middle': {
        'index': 3388,
        'detail': 3387,
        'list': 3386
      },
      'middle_free': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'marketing': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'banner': {
        'index': NO_AD_PID,
        'detail': NO_AD_PID,
        'list': NO_AD_PID
      },
      'coupon': { 'index': 3697 },
      'banner_newuser': {
        'index': 3641,
        'detail': 3643,
        'list': 3642
      }
    },
    'pc': {
      'high': {
        'index': 1728,
        'detail': 1729
      },
      'high_free': {
        'index': 1752,
        'detail': 1753
      },
      'middle': {
        'index': 1724,
        'detail': 1725
      },
      'middle_free': {
        'index': 1747,
        'detail': 1748
      },
      'marketing': {
        'index': 439,
        'detail': 447
      },
      'banner': {
        'index': 438,
        'detail': 446
      },
      'middle_card': 3942,
      'coupon': { index: 3789 },
      'banner_newuser': {}
    }
  }
};

/*
 * @Description 运营埋点字段
*/
var MARKET_BEACON_CONST = exports.MARKET_BEACON_CONST = {
  show: 'show',
  click: 'click',
  second: 'second'
};

/*
 * @Description 续费续签的强中弱显示时间区间
*/
var RENEW_RULES = exports.RENEW_RULES = {
  'item': {
    'high': [1, 15],
    'middle': [16, 30],
    'low': [1, 45]
  },
  'trade': {
    'high': [1, 7],
    'middle': [8, 15],
    'low': [1, 30]
  }
};

// 过滤广告统一规则
var NO_AD_RULES = exports.NO_AD_RULES = {
  'banner': {
    'H': true,
    'vipflag': [3]
  }
};

// 广告类型字符串
var AD_TYPE = exports.AD_TYPE = {
  JUMP_FUNC: '1',
  FUWU_ORDER: '2',
  CONTACT_KEFU: '3',
  QIANNIU_RADIO: '4'
};

/*
 * @Description 广告状态字符串
*/
var AD_STATE = exports.AD_STATE = {
  SHOULD_SHOW: 'show',
  NOT_SHOW: false,
  AFTER_ACTION_MODAL: 'modal',
  AFTER_ACTION_BALL: 'ball'
};

/*
 * @Description 广告信息在缓存中的键名
*/
var MARKETING_STORAGE_KEY = exports.MARKETING_STORAGE_KEY = 'marketingAdInfo';

/*
 * @Description 广告的类型
*/
var MARKETING_TYPE = exports.MARKETING_TYPE = {
  modal: 'MODAL_AD',
  banner: 'BANNER_AD',
  afterAction: 'AFTER_ACTION',
  midCoupon: 'MID_COUPON',
  midModal: 'MID_MODAL',
  notice: 'NOTICE',
  commonModal: 'COMMON_MODAL',
  modalVip: 'MODAL_VIP',
  midCard: 'MID_CARD'
};

/*
 * @Description 手机页面通用mask广告预留位
*/
var COMMON_MARKETING_MASK = exports.COMMON_MARKETING_MASK = [MARKETING_TYPE.modal, MARKETING_TYPE.afterAction, MARKETING_TYPE.midCoupon, MARKETING_TYPE.midModal, MARKETING_TYPE.modalVip];

/*
 * @Description PC页面通用mask广告预留位
*/
var PC_COMMON_MARKETING_MASK = exports.PC_COMMON_MARKETING_MASK = [MARKETING_TYPE.modal, MARKETING_TYPE.afterAction, MARKETING_TYPE.midCoupon, MARKETING_TYPE.modalVip];

/*
 * @Description 功能点列表
*/
var MODAL_VIP_LIST = exports.MODAL_VIP_LIST = {
  trade: {
    renew: {
      iOS: ['3401', '3406', '3404', '3414', '3410', '3415', '3417'],
      Android: ['751', '756', '754', '767', '763', '772', '775'],
      pc: []
    },
    upgrade: {
      iOS: ['3406', '3404', '3414', '3410', '3415', '3417', '3400'],
      Android: ['750', '756', '754', '767', '763', '772', '775'],
      pc: []
    }
  },
  item: {
    renew: {
      iOS: ['3320', '3335', '3345', '3328', '3322', '3327', '3321', '3336', '3348', '3357', '3362', '3360', '3370', '3366'],
      Android: ['954', '968', '974', '963', '956', '962', '955', '969', '976', '1326', '1345', '1334', '1976', '1561'],
      pc: []
    },
    upgrade: {
      iOS: ['3319', '3335', '3345', '3328', '3322', '3327', '3321', '3336', '3348', '3357', '3362', '3360', '3370', '3366'],
      Android: ['953', '968', '974', '963', '956', '962', '955', '969', '976', '1326', '1345', '1334', '1976', '1561'],
      pc: []
    }
  }
};

/*
 * @Description 兜底广告
*/
var backupAd = exports.backupAd = {
  trade: {},
  item: {}
};

var switchPid = exports.switchPid = (_switchPid = {
  // 功能点
  '964': '3330',
  '963': '3328',
  '2814': '3351',
  '2755': '3355',
  '3163': '3339',
  '3164': '3337',
  '1561': '3366',
  '2751': '3367',
  '2750': '3372',
  '1793': '3368',
  '2641': '3373',
  '976': '3348',
  '1976': '3370',
  '1975': '3369',
  '2753': '3361',
  '2752': '3365',
  '2754': '3358',
  '3165': '3332',
  '3166': '3329',
  '974': '3345',
  '975': '3346',
  '973': '3343',
  '957': '3323',
  '958': '3324',
  '956': '3322',
  '1478': '3364',
  '1345': '3362',
  '962': '3327',
  '960': '3325',
  '961': '3326',
  '955': '3321',
  '978': '3352',
  '977': '3349',
  '980': '3356',
  '979': '3353',
  '1327': '3359',
  '1326': '3357',
  '1334': '3360',
  '953': '3319',
  '954': '3320',
  '2815': '3350',
  '2817': '3342',
  '2816': '3344',
  '969': '3336',
  '970': '3338',
  '971': '3340',
  '966': '3333',
  '968': '3335',
  '965': '3331',
  '967': '3334',
  '2114': '3371',
  '1258': '3425',
  '1003': '3424',
  '1002': '3423',
  '987': '3422',
  '779': '3421',
  '778': '3420',
  '777': '3419',
  '776': '3418',
  '775': '3417',
  '774': '3416',
  '772': '3415',
  '767': '3414',
  '766': '3413',
  '765': '3412',
  '764': '3411',
  '763': '3410',
  '762': '3409',
  '759': '3408',
  '757': '3407',
  '756': '3406',
  '755': '3405',
  '754': '3404',
  '753': '3403',
  '752': '3402',
  '751': '3401',
  '750': '3400',
  '749': '3399',
  '748': '3398',
  '747': '3397',
  '746': '3396',
  '745': '3395',
  '744': '3394',
  '717': '3393',
  '1328': '3392',
  '1360': '3391',
  '1449': '3390',
  '1576': '3389',
  '1715': '3388',
  '1716': '3387',
  '1717': '3386',
  '1730': '3385',
  '1731': '3384',
  '1732': '3383',
  '1744': '3382',
  '1745': '3381',
  '1746': '3380',
  '1749': '3379',
  '1750': '3378',
  '1751': '3377',
  '1812': '3376',
  '1813': '3375',
  '1819': '3374',
  '1860': '3363',
  '1861': '3354',
  '3280': '3347',
  '1862': '3341',
  '3699': '3698',
  '3609': '3608',
  '3533': '3535',
  '3953': '3952',
  '3945': '3950'
}, _defineProperty(_switchPid, '1334', '3360'), _defineProperty(_switchPid, '3768', '3769'), _defineProperty(_switchPid, '3701', '3700'), _defineProperty(_switchPid, '3794', '3793'), _defineProperty(_switchPid, '3796', '3795'), _defineProperty(_switchPid, '3522', '3521'), _defineProperty(_switchPid, '1478', '3364'), _defineProperty(_switchPid, '964', '3330'), _defineProperty(_switchPid, '963', '3328'), _defineProperty(_switchPid, '3762', '3753'), _defineProperty(_switchPid, '3767', '3758'), _defineProperty(_switchPid, '3763', '3754'), _defineProperty(_switchPid, '3765', '3756'), _defineProperty(_switchPid, '3766', '3757'), _defineProperty(_switchPid, '3760', '3751'), _defineProperty(_switchPid, '3759', '3750'), _defineProperty(_switchPid, '3761', '3752'), _defineProperty(_switchPid, '3741', '3733'), _defineProperty(_switchPid, '3740', '3732'), _defineProperty(_switchPid, '3743', '3735'), _defineProperty(_switchPid, '3744', '3736'), _defineProperty(_switchPid, '3739', '3731'), _defineProperty(_switchPid, '3738', '3730'), _defineProperty(_switchPid, '3742', '3734'), _defineProperty(_switchPid, '3596', '3598'), _defineProperty(_switchPid, '3617', '3611'), _defineProperty(_switchPid, '3597', '3599'), _defineProperty(_switchPid, '3595', '3591'), _defineProperty(_switchPid, "3594", "3590"), _defineProperty(_switchPid, '975', "3346"), _defineProperty(_switchPid, '974', "3345"), _defineProperty(_switchPid, '973', "3343"), _defineProperty(_switchPid, '1326', "3357"), _defineProperty(_switchPid, '1327', "3359"), _defineProperty(_switchPid, '4017', '4016'), _defineProperty(_switchPid, '4045', '4048'), _defineProperty(_switchPid, '4046', '4049'), _defineProperty(_switchPid, '4047', '4050'), _switchPid);

/*
 * @Description 运营相关文案
*/
var defaultMarketingContent = exports.defaultMarketingContent = {
  vipName: {
    iOS: {
      0: '初级版',
      1: '高级版',
      3: '高级版'
    },
    Android: {
      0: '初级版',
      1: '高级版',
      3: '高级版'
    }
  }
};

/*
 * @Description 用来给marketing老大哥组件的willmount执行的固定参数
*/
var navigatorConst = exports.navigatorConst = (_navigatorConst = {}, _defineProperty(_navigatorConst, MARKETING_TYPE.modal, {
  pidFunc: 'getModalPid',
  state: AD_STATE.SHOULD_SHOW,
  type: MARKETING_TYPE.modal
}), _defineProperty(_navigatorConst, MARKETING_TYPE.midModal, {
  pidFunc: 'getMidModalPid',
  state: AD_STATE.SHOULD_SHOW,
  type: MARKETING_TYPE.midModal
}), _defineProperty(_navigatorConst, MARKETING_TYPE.midCoupon, {
  pidFunc: 'getMidCouponPid',
  state: AD_STATE.SHOULD_SHOW,
  type: MARKETING_TYPE.midCoupon
}), _defineProperty(_navigatorConst, MARKETING_TYPE.notice, {
  pidFunc: 'shouldRenderNotice',
  state: AD_STATE.SHOULD_SHOW,
  type: MARKETING_TYPE.notice
}), _defineProperty(_navigatorConst, MARKETING_TYPE.banner, {
  pidFunc: 'getBannerPid',
  state: AD_STATE.SHOULD_SHOW,
  type: MARKETING_TYPE.banner
}), _defineProperty(_navigatorConst, MARKETING_TYPE.midCard, {
  pidFunc: 'getMidCardPid',
  state: AD_STATE.SHOULD_SHOW,
  type: MARKETING_TYPE.midCard
}), _navigatorConst);

var NOTICE_TYPE = exports.NOTICE_TYPE = {
  NOTICE: 'NOTICE',
  LOW: 'LOW'
};
/*
 * @Description 用户版本对应flag
*/
var nameToFlag = exports.nameToFlag = {
  NOT_PAY: 0,
  COMMON_VIP: 1,
  UNUSED: 2,
  AUTO_PAY: 3,
  NEW_USER: 4
};

var tradePcVipList = exports.tradePcVipList = [{
  title: '爱用交易',
  pid: 783,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_aiyong.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_aiyong_high.png'
}, {
  title: '打单发货',
  pid: 726,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_batchPrint.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_batchPrint_high.png'
}, {
  title: '差评拦截',
  pid: 823,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_negativeCommentRefuse.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_negativeCommentRefuse_high.png'
}, {
  title: '自动评价',
  pid: 807,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_evaluate.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_evaluate_high.png'
}, {
  title: '高级搜索',
  pid: 780,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_evaluate.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_evaluate_high.png'
}, {
  title: '旺旺催付',
  pid: 787,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_wwExpediting.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_wwExpediting_high.png'
}, {
  title: '批量发货',
  pid: 706,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_batchDelivery.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_batchDelivery_high.png'
}, {
  title: '批量评价',
  pid: 1337,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_batchEvaluation.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_batchEvaluation_high.png'
}, {
  title: '订单管理',
  pid: 3525,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_tradeManagement.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_tradeManagement_high.png'
}, {
  title: '自由打印',
  pid: 3526,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_tradeManagement.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_tradeManagement_high.png'
}];
var itemPcVipList = exports.itemPcVipList = [{
  title: '爱用商品',
  pid: 888,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_item_aiyong.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_item_aiyong_high.png'
}, {
  title: '促销水印',
  pid: 3142,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_item_aiyong.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_item_aiyong_high.png'
}, {
  title: '自动上下架',
  pid: 917,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_autoAdjustment.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_autoAdjustment_high.png'
}, {
  title: '批量修改',
  pid: 905,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_batchUpdate.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_batchUpdate_high.png'
}, {
  title: '手机详情',
  pid: 915,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_phoneDetails.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_phoneDetails_high.png'
}, {
  title: '标题优化',
  pid: 919,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_titleSeo.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_titleSeo_high.png'
}, {
  title: '关联销售',
  pid: 941,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_relatedSales.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_relatedSales_high.png'
}, {
  title: '主图视频',
  pid: 944,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_masterVideo.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_masterVideo_high.png'
}, {
  title: '复制宝贝',
  pid: 940,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_copyGood.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_copyGood_high.png'
}, {
  title: '库存预警',
  pid: 894,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_stockWarn.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_stockWarn_high.png'
}, {
  title: '违规词检测',
  pid: 947,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_illegalWord.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_illegalWord_high.png'
}, {
  title: '分享宝贝',
  pid: 1655,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_showGood.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_showGood_high.png'
}, {
  title: '活动页推广',
  pid: 925,
  imgPath: '//q.aiyongbao.com/trade/ad_img/ad_activePage.png',
  imgPath_high: '//q.aiyongbao.com/trade/ad_img/ad_activePage_high.png'
}];