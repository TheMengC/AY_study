import { CHECK_ADDRESS_CUSTOM_PHRASE_CHOICE,
    CHECK_ADDRESS_PHRASE,
    DEFAULT_MEMO_PHRASE,
    DEFAULT_RATE_PHRASE,
    WW_RUSH_PAY_CUSTOM_PHRASE_PAYTYPE,
    WW_RUSH_PAY_DEFAULT_PHRASE_MAP,
    WW_RUSH_RATE_PHRASE } from "./consts";
import { api, getUserInfo, isEmpty, NOOP } from "tradePolyfills";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { getFlatTrades } from "tradePublic/tradeDataCenter";
import { getTradeAddress } from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { getDataDeferred } from "tradePublic/utils";

export const memoPhraseGet = ({ callback = NOOP, errCallback = handleError }) => {
    api({
        apiName:'aiyong.user.settings.phrase.bytype.get',
        method: '/iytrade2/getFast',
        args: { types: 'fast_beiw' },
        callback: (res) => {
            let phraseArr = res.split('\n');
            let customPhraseArr = phraseArr.filter((value) => {
                return !DEFAULT_MEMO_PHRASE.includes(value);
            });
            callback(customPhraseArr);
        },
        errCallback: errCallback,
    });
};

let memoCustomPhrases = [];
/**
 * 初始化备注短语的信息
 * @type {function({params?: *}=): Promise<any>}
 */
const initMemoCustomPhrases = getDataDeferred(memoPhraseGet,
    data => memoCustomPhrases = data);

/**
 * 获取所有备注短语
 * @returns {Promise<*[]>}
 */
export async function getMemoPhrases ({ refresh = false } = {}) {
    await initMemoCustomPhrases({ refresh });
    return [...memoCustomPhrases, ...DEFAULT_MEMO_PHRASE];
}

export async function getMemoCustomPhrases ({ refresh = false } = {}) {
    await initMemoCustomPhrases({ refresh });
    return [...memoCustomPhrases];
}

export const memoPhraseSet = ({ value, callback = NOOP, errCallback = handleError }) => {
    // 过滤Array中的空值并拼接
    let text = value.filter(Boolean).join(';');
    api({
        apiName:'aiyong.user.settings.phrase.bytype.save',
        method: '/iytrade2/setFast',
        args: {
            text,
            types: 'fast_beiw',
        },
        callback: (res) => {
            memoCustomPhrases = value;
            callback(res);
        },
        errCallback: errCallback,
    });
};

export const ratePhraseGet = ({ callback = NOOP, errCallback = handleError }) => {
    api({
        apiName:'aiyong.user.settings.phrase.bytype.get',
        method: '/iytrade2/getFast',
        args: { types: 'fast_rate' },
        callback: (res) => {
            let phraseArr = res.split('\n');
            let customPhraseArr = phraseArr.filter((value) => {
                return !DEFAULT_RATE_PHRASE.includes(value);
            });
            callback(customPhraseArr);
        },
        errCallback: errCallback,
    });
};

let rateCustomPhrases = [];

const initRateCustomPhrases = getDataDeferred(ratePhraseGet,
    data => rateCustomPhrases = data);

/**
 * 获取所有评价短语
 * @returns {Promise<*[]>}
 */
export async function getRatePhrases ({ refresh = false } = {}) {
    await initRateCustomPhrases({ refresh });
    return [...rateCustomPhrases, ...DEFAULT_RATE_PHRASE];
}

/**
 * 获取自定义评价短语
 * @param refresh
 * @returns {Promise<*[]>}
 */
export async function getRateCustomPhrases ({ refresh = false } = {}) {
    await initRateCustomPhrases({ refresh });
    return [...rateCustomPhrases];
}

export const ratePhraseSet = ({ value, callback = NOOP, errCallback = handleError }) => {
    // 过滤Array中的空值并拼接
    let text = value.filter(Boolean).join(';');
    api({
        apiName:'aiyong.user.settings.phrase.bytype.save',
        method: '/iytrade2/setFast',
        args: {
            text,
            types: 'fast_rate',
        },
        callback: (res) => {
            rateCustomPhrases = value;
            callback(res);
        },
        errCallback: errCallback,
    });
};

export const wwRushPayPhraseGet = ({ callback = NOOP, errCallback = handleError }) => {
    api({
        apiName:'aiyong.user.settings.phrase.wwrushpay.get',
        method: '/iytrade2/fastpay',
        callback: (res) => {
            callback(res);
        },
        errCallback: errCallback,
    });
};

export const generateWwRushPayPhraseContent = (rushPayPhrase, trade) => {
    return rushPayPhrase.replace(/<买家姓名>/g, trade.receiver_name)
        .replace(/<买家旺旺>/g, trade.buyer_nick)
        .replace(/<卖家旺旺>/g, trade.seller_nick)
        .replace(/<下单时间>/g, trade.created)
        .replace(/<订单编号>/g, trade.tid)
        .replace(/<订单链接>/g, 'http://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=' + trade.tid + '\t');
};

let wwRushPayCustomPhrase;
let wwRushPayDefaultPhrasePaytype;

const initWwRushPayPhrases = getDataDeferred(wwRushPayPhraseGet, data => {
    wwRushPayCustomPhrase = data.fastpay;
    wwRushPayDefaultPhrasePaytype = data.fastpaytype;
});

/**
 * 获取默认的旺旺催付短语
 * @param refresh
 * @returns {Promise<void>}
 */
export async function getWwRushPayDefaultPhrase ({ refresh = false } = {}) {
    await initWwRushPayPhrases({ refresh });
    if (wwRushPayDefaultPhrasePaytype === WW_RUSH_PAY_CUSTOM_PHRASE_PAYTYPE) {
        return wwRushPayCustomPhrase;
    }else{
        return WW_RUSH_PAY_DEFAULT_PHRASE_MAP[wwRushPayDefaultPhrasePaytype];
    }
}

/**
 * 获取旺旺催付自定义短语
 * @param refresh
 * @returns {Promise<*>}
 */
export async function getWwRushPayCustomPhrase ({ refresh = false } = {}) {
    await initWwRushPayPhrases({ refresh });
    return wwRushPayCustomPhrase;
}

/**
 * 获取旺旺催付默认短语 paytype
 * @param refresh
 * @returns {Promise<*>}
 */
export async function getWwRushPayDefaultPhrasePaytype ({ refresh = false } = {}) {
    await initWwRushPayPhrases({ refresh });
    return wwRushPayDefaultPhrasePaytype;
}

/**
 * 修改旺旺催付自定义短语
 * @param value 自定义短语的值
 * @param callback
 */
export const wwRushPayCustomPhraseSet = ({ value, callback = NOOP, errCallback = handleError }) => {
    api({
        apiName:'aiyong.user.settings.phrase.wwrushpay.save',
        method: '/iytrade2/savefastpay',
        args: {
            type: 'best',
            fastpay: value,
        },
        callback: (res) => {
            if (res == 1) {
                wwRushPayCustomPhrase = value;
                callback(res);
            } else{
                errCallback(res);
            }
        },
        errCallback: errCallback,
    });
};

/**
 * 修改旺旺催付默认短语
 * @param value 默认短语的 paytype
 * @param callback
 */
export const wwRushPayDefaultPhraseSet = ({ value, callback = NOOP, errCallback = handleError }) => {
    api({
        apiName:'aiyong.user.settings.phrase.wwrushpay.default.save',
        method: '/iytrade2/saveReminder',
        args: {
            type: 'best',
            paytype: value,
        },
        callback: (res) => {
            if (res == 1) {
                wwRushPayDefaultPhrasePaytype = value;
                callback(res);
            } else{
                errCallback(res);
            }
        },
        errCallback: errCallback,
    });
};

/**
 * 获取核对地址短语的相关数据
 * @param callback
 * @param errCallback
 */
export function checkAddressPhraseGet ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.phrase.checkaddress.get',
        method: '/set/getCheckAddress',
        callback: res => {
            if(res.result.choice == 'newUser') {
                res.result.choice = '0';
            }
            callback(res);
        },
        errCallback:errCallback,
    });
}

let checkAddressCustomPhrase;
let checkAddressDefaultChoice;

const initCheckAddressPhrase = getDataDeferred(checkAddressPhraseGet, res => {
    checkAddressCustomPhrase = res.result.content;
    checkAddressDefaultChoice = res.result.choice;
});

/**
 * 获取核对地址的自定义短语
 * @param refresh
 * @returns {Promise<string>}
 */
export async function getCheckAddressCustomPhrase ({ refresh = false } = {}) {
    await initCheckAddressPhrase({ refresh });
    return checkAddressCustomPhrase;
}

/**
 * 获取核对地址默认短语的choice
 * @param refresh
 * @returns {Promise<*>}
 */
export async function getCheckAddressDefaultChoice ({ refresh = false } = {}) {
    await initCheckAddressPhrase({ refresh });
    return checkAddressDefaultChoice;
}

/**
 * 获取默认的核对地址短语
 * @param refresh
 * @returns {Promise<*>}
 */
export async function getCheckAddressDefaultPhrase ({ refresh = false } = {}) {
    await initCheckAddressPhrase({ refresh });
    if(checkAddressDefaultChoice == CHECK_ADDRESS_CUSTOM_PHRASE_CHOICE) {
        return checkAddressCustomPhrase;
    }else{
        return CHECK_ADDRESS_PHRASE[checkAddressDefaultChoice];
    }
}

/**
 * 设置默认核对地址短语
 * @param value
 * @param callback
 * @param errCallback
 */
export function checkAddressDefaultChoiceSet ({ value, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.phrase.checkaddress.default.save',
        method:'/set/checkAddressDefaultChoiceSet',
        args:{ choice:value },
        callback: res => {
            checkAddressDefaultChoice = value;
            callback(res);
        },
        errCallback:errCallback,
    });
}

/**
 * 设置核对地址自定义短语
 * @param value
 * @param callback
 * @param errCallback
 */
export function checkAddressCustomPhraseSet ({ value, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.phrase.checkaddress.save',
        method:'/set/checkAddressCustomPhraseSet',
        args:{ content:value },
        callback: res => {
            checkAddressCustomPhrase = value;
            callback(res);
        },
        errCallback:errCallback,
    });
}

/**
 * 生成核对地址短语内容
 * @param checkAddressPhrase
 * @param trade
 */
export function generateCheckAddressPhraseContent (checkAddressPhrase, trade) {

    let content = checkAddressPhrase.replace(/<买家姓名>/g, trade.receiver_name)
        .replace(/<联系方式>/g, trade.receiver_mobile + ' ' + trade.receiver_phone)
        .replace(/<收货地址>/g,   getTradeAddress(trade))
        .replace(/<买家邮编>/g,   trade.receiver_zip);
    // 商品属性\+数量
    let sku_num = '';
    if (checkAddressPhrase.indexOf('<商品属性+数量>') != -1) {
        trade.orders.filter(checkOrderFilter).map(order => {
            if (order.sku_properties_name) {
                sku_num += order.sku_properties_name;
            }
            sku_num += `(数量${order.num})\n`;
        });
    }
    content = content.replace(/<商品属性\+数量>/g, sku_num);

    let flatTrades = getFlatTrades(trade);
    if (trade.buyer_message == '' || trade.buyer_message == 'undefined' || trade.buyer_message == undefined || trade.buyer_message == '暂无留言') {
        content = content.replace('\n买家留言：', '');
        content = content.replace(/<买家留言>/g, '');
    } else{
        let new_buyer_message = flatTrades.map(trade => trade.buyer_message).join(',');
        if (isEmpty(new_buyer_message)) {
            content = content.replace('\n买家留言：', '');
            content = content.replace(/<买家留言>/g, '');
        } else{
            content = content.replace(/<买家留言>/g, new_buyer_message);
        }
    }

    if (trade.seller_memo == '' || trade.seller_memo == 'undefined' || trade.seller_memo == undefined || trade.seller_memo == '暂无备注') {
        content = content.replace('\n卖家备注：', '');
        content = content.replace(/<卖家备注>/g, '');
    } else {
        let new_seller_memo = flatTrades.map(trade => trade.seller_memo).join(',');
        if(isEmpty(new_seller_memo)) {
            content = content.replace('\n卖家备注：', '');
            content = content.replace(/<卖家备注>/g, '');
        }else{
            content = content.replace(/<卖家备注>/g, new_seller_memo);
        }
    }

    return content.replace(/<吐舌头>/g, '/:Q')
        .replace(/<微笑>/g, '/:^_^')
        .replace(/<花痴>/g, '/:814')
        .replace(/<红唇>/g, '/:lip')
        .replace(/<天使>/g, '/:065')
        .replace(/<飞吻>/g, '/:087')
        .replace(/<爱慕>/g, '/:809')
        .replace(/undefined/g, '')
        .replace(/\n\n/g, '');
}

/**
 * 获取旺旺催评短语相关信息
 */
function wwRushRatePhraseGet ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.phrase.wwrushrate.get',
        method: '/iytrade2/getWWPraise',
        args: { sellernick: getUserInfo().userNick },
        callback: callback,
        errCallback:errCallback,
    });
}

let wwRushRateCustomPhrases = {};
let wwRushRateDefaultPhraseChoice;

const initWwRushRatePhrases = getDataDeferred(wwRushRatePhraseGet, res => {
    wwRushRateDefaultPhraseChoice = res.choice || 0; // res.choice 为空时做一下容错
    wwRushRateCustomPhrases = {};
    if (res.customContent !== '' && res.customContent !== '[]') {
        let customContent = JSON.parse(JSON.parse(`"${res.customContent}"`));
        customContent.map(item => wwRushRateCustomPhrases[item.customNumber] = item.content);
    }
});

/**
 * 获取默认旺旺催评短语
 * @return {Promise<string>}
 */
export async function getWwRushRateDefaultPhrase ({ refresh = false } = {}) {
    await initWwRushRatePhrases({ refresh });
    return { ...WW_RUSH_RATE_PHRASE, ...wwRushRateCustomPhrases }[wwRushRateDefaultPhraseChoice];
}

/**
 * 获取旺旺催评自定义短语
 * @param refresh
 * @returns {Promise<{}>}
 */
export async function getWwRushRateCustomPhrases ({ refresh = false } = {}) {
    await initWwRushRatePhrases({ refresh });
    return { ...wwRushRateCustomPhrases };
}

/**
 * 获取旺旺默认短语的choice
 * @param refresh
 * @returns {Promise<*>}
 */
export async function getWwRushRateDefaultPhraseChoice ({ refresh = false } = {}) {
    await initWwRushRatePhrases({ refresh });
    return wwRushRateDefaultPhraseChoice;
}

/**
 * 修改旺旺催评自定义短语
 * @param choice
 * @param customPhrases
 * @param callback
 * @param errCallback
 */
export function WwRushRateCustomPhrasesModify ({ customPhrases, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.phrase.wwrushrate.save',
        method: '/iytrade2/saveWWPraise',
        args: {
            sellernick: getUserInfo().userNick,
            choice:wwRushRateDefaultPhraseChoice,
            customContent: JSON.stringify(Object.keys(customPhrases).
                map(key => {return { customNumber:key, content:customPhrases[key] };})),
        },
        callback: res => {
            wwRushRateCustomPhrases = customPhrases;
            callback(res);
        },
        errCallback:errCallback,
    });
}

/**
 * 修改默认的旺旺催评短语
 * @param choice
 * @param callback
 * @param errCallback
 */
export function WwRushRateDefaultPhraseChoiceModify ({ choice, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.phrase.wwrushrate.save',
        method: '/iytrade2/saveWWPraise',
        args: {
            sellernick: getUserInfo().userNick,
            choice:choice,
            customContent: JSON.stringify(Object.keys(wwRushRateCustomPhrases).
                map(key => {return { customNumber:key, content:wwRushRateCustomPhrases[key] };})),
        },
        callback: res => {
            wwRushRateDefaultPhraseChoice = choice;
            callback(res);
        },
        errCallback:errCallback,
    });
}

/**
 * 生成旺旺催评短语
 * @param wwRushRatePhrase
 * @param trade
 * @return {string}
 */
export function generateWwRushPhraseContent (wwRushRatePhrase, trade) {

    return wwRushRatePhrase.replace(/<买家姓名>/g, trade.receiver_name)
        .replace(/<买家昵称>/g, trade.buyer_nick)
        .replace(/<手机端评价链接>/g, 'https://h5.m.taobao.com/app/rate/www/rate-add/index.html?orderId=' + trade.tid + '&_wx_tpl=https%3A%2F%2Fh5.m.taobao.com%2Fapp%2Frate%2Fwww%2Frate-add%2Findex.js')
        .replace(/<电脑端评价链接>/g, 'https://rate.taobao.com/remarkSeller.jhtml?tradeID=' + trade.tid);
}

/**
 * 生成核对订单短语
 * @param trade
 * @return {string}
 */
export function generateCheckTradePhraseContent (trade) {
    let content = '亲，请核对您购买的宝贝信息';

    trade.orders.filter(checkOrderFilter).map(order => {
        if(order.sku_properties_name == undefined) {
            order.sku_properties_name = "暂无";
        }
        content += `\n标题：${order.title}\n属性：${order.sku_properties_name}\n数量:${order.num}`;
    });
    content += `\n买家姓名：${trade.receiver_name}`;
    content += '\n收货地址：';
    let addrArr = [];
    let numberArr = [];
    trade.receiver_state && addrArr.push(trade.receiver_state);
    trade.receiver_city && addrArr.push(trade.receiver_city);
    trade.receiver_district && addrArr.push(trade.receiver_district);
    trade.receiver_address && addrArr.push(trade.receiver_address);

    content += addrArr.join(',');
    content += '\n联系方式：';
    trade.receiver_mobile && numberArr.push(trade.receiver_mobile);
    trade.receiver_phone && numberArr.push(trade.receiver_phone);

    content += numberArr.join(',');

    content += `\n买家邮编：${trade.receiver_zip}`;
    return content;
}

/**
 * 生成发送物流的类容
 * @param logisticsInfo
 * @returns {string}
 */
export function generateLogisticsInfoPhraseContent ({ logisticsInfo, needTrace = false }) {
    if (logisticsInfo.company_name === '无需物流') {
        return `物流信息：无需物流`;
    }
    let content = `物流公司：${logisticsInfo.company_name}\n运单号：${logisticsInfo.out_sid}\n物流信息：\n`;
    if (needTrace) {
        content += logisticsInfo.trace_list.transit_step_info.slice(0, 1).map(item => `${item.status_time ? item.status_time + '\n' : ''}${item.status_desc}`).join('\n');
    }
    return content;
}

function checkOrderFilter (order) {
    return order.status == 'WAIT_SELLER_SEND_GOODS' || order.status == 'WAIT_BUYER_PAY' || order.status == 'TRADE_NO_CREATE_PAY';
}
