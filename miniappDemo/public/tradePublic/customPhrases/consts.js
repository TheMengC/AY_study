export const DEFAULT_MEMO_PHRASE = [
    '缺货',
    '周末不收货',
    '发EMS',
    '老客户',
    '送赠品',
];

export const DEFAULT_RATE_PHRASE = [
    '谢谢，很好的买家！',
    '谢谢，欢迎下次惠顾小店！',
    '谢谢亲的支持！欢迎下次惠顾！',
    '期待您的下次光临，我们会做得更好！',
    '谢谢您的光临，新款随时上请继续关注小店！',
];

/**
 * 默认旺旺催付短语
 */
export const WW_RUSH_PAY_CUSTOM_PHRASE_PAYTYPE = '0';
export const WW_RUSH_PAY_DEFAULT_PHRASE_MAP = {
    1: '我们仓库是四点前统一发货的哦，您四点前方便付款么，我们可以及时给您安排发货，这样您就能早一天收到我们的产品和礼物哦。<订单链接>',
    2: '亲爱的<买家姓名>您今日在我们店铺拍下的订单还没有付款哦，我们是下午5点发货的，晚了可能就要拖到明天发了哦。<订单链接>',
    11: '亲，您在我们店拍下的宝贝已经确认，亲现在我们每天前200名付款买家有精美赠品送哦，您现在付款还来得及哦~ <订单链接>',
    12: '您好，看到您这边没有支付，我们这边是7天无理由退换，还帮您购买了运费保险，收到以后包您满意，如果不满意也没有后顾之忧。<订单链接>',
    21: '亲爱的<买家姓名>,我是<卖家旺旺>，我看到了您在我们店里拍下了您要的宝贝哦，您已经是我们的老顾客了，所以会首先安排您的订单先发出的哦。<订单链接>',
    22: '您好，您在<卖家旺旺>店铺拍下的商品还没有付款，因为您是我们的老顾客了，我给店长申请了这次给您个超级会员价格，比您拍的时候少了很多哦。   <订单链接>',
    31: '您拍下的那小家伙，怕您不要了她们了，正哭哭啼啼的闹个不停，您快去看下吧！<订单链接>',
    32: '呜呜，粑粑麻麻你真的不要偶们了吗？赶紧来付款把我们带回家吧！不然又要回到一堆怪蜀黍的怀里了！<订单链接>',
};

/**
 * 发货催付模板
 * @type {{老顾客超级优惠版: number[], 发货催付模板: number[], 卖萌版: number[], 打折催付版: number[]}}
 */
export const WW_RUSH_PAY_PHRASE_GROUP = {
    '发货催付模板' :[1, 2],
    '打折催付版':[11, 12],
    '老顾客超级优惠版':[21, 22],
    '卖萌版':[31, 32],
};

export const WW_RUSH_PAY_PHRASE_SPAN = [
    { key: '<买家姓名>', value: 'receiver_name' },
    { key: '<买家旺旺>', value: 'buyer_nick' },
    { key: '<卖家旺旺>', value: 'seller_nick' },
    { key: '<下单时间>', value: 'created' },
    { key: '<订单编号>', value: 'tid' },
    { key: '<订单链接>', value: 'order_link' },
];

export const CHECK_ADDRESS_CUSTOM_PHRASE_CHOICE = '2';
export const CHECK_ADDRESS_PHRASE = {
    '0': '亲，请核对下地址哦：\n买家姓名：<买家姓名>\n收货地址：<收货地址>\n联系方式：<联系方式>\n买家邮编：<买家邮编>',
    '1': '亲爱的<买家姓名>，请核对下地址哦：\n收货地址：<收货地址>\n联系方式：<联系方式>\n买家邮编：<买家邮编>',
};

export const CHECK_ADDRESS_PHRASE_SPAN = [
    '<收货地址>', '<买家姓名>', '<联系方式>', '<买家邮编>', '<商品属性+数量>', '<买家留言>', '<卖家备注>',
];

export const WW_EMOJI_SPAN = [
    { key:'<吐舌头>', value:'/:Q', image:'//q.aiyongbao.com/trade/web/images/qn1.gif?qntag=2' },
    { key:'<微笑>', value:'/:^_^', image:'//q.aiyongbao.com/trade/web/images/qn2.gif?qntag=2' },
    { key:'<爱慕>', value:'/:809', image:'//q.aiyongbao.com/trade/web/images/qn3.gif?qntag=2' },
    { key:'<飞吻>', value:'/:087', image:'//q.aiyongbao.com/trade/web/images/qn4.gif?qntag=2' },
    { key:'<天使>', value:'/:065', image:'//q.aiyongbao.com/trade/web/images/qn5.gif?qntag=2' },
    { key:'<红唇>', value:'/:lip', image:'//q.aiyongbao.com/trade/web/images/qn6.gif?qntag=2' },
    { key:'<花痴>', value:'/:814', image:'//q.aiyongbao.com/trade/web/images/qn7.gif?qntag=2' },
];

export const WW_RUSH_RATE_PHRASE = {
    '0':'亲，您对宝贝还满意么？任何不满意请联系我们～别忘记给我们亮起五颗小星星哦～\n手机端点击：<手机端评价链接>\n电脑端点击：<电脑端评价链接>',
    '1':'您好，看亲这边已经确认签收了，如果满意的话请您帮帮忙好评下哦，只需点亮十五颗星星，不需要打字的，我也是刚出来兼职的学生想挣点生活费，咱们有两元现金给您哦～\n手机端点击：<手机端评价链接>\n电脑端点击：<电脑端评价链接>',
};

export const WW_RUSH_RATE_PHRASE_SPAN = [
    '<买家姓名>', '<买家昵称>', '<手机端评价链接>', '<电脑端评价链接>',
];