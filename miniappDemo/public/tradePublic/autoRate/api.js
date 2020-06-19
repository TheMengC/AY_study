import { NOOP, RATE_API_QUERY } from '../consts';
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { soldGet } from "tradePublic/tradeDataCenter/api/soldGet";
import { api, ENV, moment } from "tradePolyfills";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { DEFAULT_AUTO_RATE_DATASOURCE } from "tradePublic/autoRate/consts";

// 查询卖家信息
export default function getSellerInfo (callback = NOOP, errorCallback = NOOP) {
    qnRouter({
        api: 'taobao.user.seller.get',
        params: { fields: 'type,nick,seller_credit,user_id' },
        callback: res => {
            res = resolveTopResponse(res);
            callback(res);
        },
        errCallback: error => {
            errorCallback(error);
        },
    });
}

// 获取店铺名
export function getShopInfo (callback = NOOP, errorCallback = NOOP) {
    console.log(callback)
    qnRouter({
        api: 'taobao.shop.seller.get',
        params: { fields: 'pic_path,title,sid' },
        callback: res => {
            res = resolveTopResponse(res);
            console.log(res)
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取买家各评价数并计算好评率
export function getRatesRatio (callback = NOOP, errorCallback = NOOP) {
    let buyer = RATE_API_QUERY.buyer;
    let getRate = (rate) => {
        return new Promise((resolve, reject) => {
            qnRouter({
                api: buyer.method,
                params: {
                    fields: buyer.fields,
                    rate_type: buyer.rate_type,
                    role: buyer.role,
                    result: rate,
                },
                callback: res => {
                    res = resolveTopResponse(res);
                    resolve(res);
                },
                errCallback: error => {
                    reject(error);
                    errorCallback(error);
                },
            });
        });

    };

    Promise.all([getRate("good"), getRate('neutral'), getRate('bad')])
        .then(([good, neutral, bad]) => {
            callback({ good, neutral, bad });
        });
}

// 获取卖家给买家的评价数
export function getSellerToBuyer (callback = NOOP, errorCallback = NOOP) {
    let seller = RATE_API_QUERY.seller;
    qnRouter({
        api: seller.method,
        params: {
            fields: seller.fields,
            rate_type: seller.rate_type,
            role: seller.role,
            page_size: seller.page_size,
        },
        callback: res => {
            res = resolveTopResponse(res);
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取买家给卖家的评价内容
export function getRateContent (rate_type, role, result, page_no, page_size, callback = NOOP, errorCallback = NOOP) {
    qnRouter({
        api: 'taobao.traderates.get',
        params: {
            fields: 'tid,nick,created,item_title,item_price,content,oid,result,valid_score,rated_nick',
            rate_type,
            role,
            result,
            page_no,
            page_size,
        },
        callback: res => {
            res = resolveTopResponse(res);
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取近30天漏评
export function getOmissionRates (callback = NOOP, errorCallback = NOOP) {
    soldGet({
        pageSize: 100,
        start_created: moment().add(-90, 'days').format('YYYY-MM-DD hh:mm:ss'),
        status: 'TRADE_FINISHED',
        rate_status: 'RATE_UNSELLER',
        callback: (res) => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取待处理差评和待处理中评数量
export function getToEvaCount (page_no, page_size, callback = NOOP, errorCallback = NOOP) {
    let rateStartTime = moment().add(-2, 'days').format('YYYY-MM-DD hh:mm:ss');
    let getEvaCount = (result) => {
        return new Promise((resolve, reject) => {
            qnRouter({
                api: 'taobao.traderates.get',
                params: {
                    fields: "tid,nick,created,item_title,item_price,content,oid,result,valid_score",
                    rate_type: 'get',
                    role: 'buyer',
                    result,
                    start_date: rateStartTime,
                    page_no,
                    page_size,
                },
                callback: res => {
                    res = resolveTopResponse(res);
                    resolve(res);
                },
                errCallback: err => {
                    errorCallback(err);
                },
            });
        });
    };

    Promise.all([getEvaCount('bad'), getEvaCount('neutral')])
        .then(([bad, neutral]) => {
            callback({ bad, neutral });
        });
}

// 获取黑名单用户
export function getBlackListUser (page, callback = NOOP, errorCallback = NOOP) {
    return api({
        apiName:'aiyong.trade.rate.auto.settings.blacklist.get',
        method: '/iytrade2/ratebalckname',
        args: { page },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 删除黑名单用户
export function delBlackListUser (buyerNick, callback = NOOP, errorCallback = NOOP) {
    return api({
        apiName:'aiyong.trade.rate.auto.blacklist.delete',
        method: '/iytrade2/delblackname',
        args: { yooz: buyerNick },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 添加黑名单用户
export function addBlackListUser (blacknick, blackreason, callback = NOOP, errorCallback = NOOP) {
    return api({
        apiName:'aiyong.trade.rate.auto.blacklist.add',
        host: ENV.hosts.trade,
        method: '/iytrade2/addblackname',
        args: {
            blacknick,
            blackreason,
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

export function getAutoRateDataSource (callback = NOOP, errCallback = NOOP) {
    return api({
        apiName:'aiyong.trade.rate.auto.status.get',
        host: ENV.hosts.trade,
        method: '/iytrade2/showzdrate',
        callback: res => {
            callback(res);
        },
        errCallback: error => {
            errCallback(error);
        },
    });
}

// 获取手机号信息
export function getTelInfo (callback = NOOP, errorCallback = NOOP) {
    return api({
        apiName:'aiyong.sms.onoffstatus.get',
        method: '/sms/getSmsonoff',
        callback: data => {
            callback(data);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取中差评提醒接口
export function getBadReminder (callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.sms.inform.settings.get',
        method: '/sms/getSmsSet',
        args:{ type: 'smsbad' },
        callback: data => {
            callback(data);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 为切换中差评按钮调的接口
export function getSmsonoff (callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.sms.onoffstatus.get',
        method: '/sms/getSmsonoff',
        callback: data => {
            callback(data);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 修改评价方式
export function changeEvaStyle (check, callback = NOOP, errorCallback = NOOP) {
    return api({
        apiName:'aiyong.trade.rate.auto.state.group.set',
        method: '/iytrade2/check_pj',
        args: { check },
        callback: data => {
            callback(data);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 修改手机号
export function changePhoneNum (telphone, callback = NOOP, errorCallback = NOOP) {
    return api({
        apiName:'aiyong.trade.rate.auto.informphone.save',
        method: '/iytrade2/savesmstel',
        args: { telphone },
        callback: data => {
            callback(data);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取评价短语
export function handleRateData (data) {
    let defaultData = [];
    let customData = [];
    let customCount = 0;
    customData = [...DEFAULT_AUTO_RATE_DATASOURCE];
    data.forEach((item) => {
        let index = DEFAULT_AUTO_RATE_PHRASE.indexOf(item.content);
        if (index < 0) {
            item.title = `自定义${++customCount}`;
            customData.push(item);
        } else {
            item.isdefault = true;
            defaultData.push(item);
        }
        item.checked = item.ischecked == '1';
    });
    return [...defaultData, ...customData];
}

export const DEFAULT_AUTO_RATE_PHRASE = [
    '谢谢，很好的买家！',
    '谢谢，欢迎下次惠顾小店！',
    '谢谢亲的支持！欢迎下次惠顾！',
    '期待您的下次光临，我们会做得更好！',
    '谢谢您的光临，新款随时上请继续关注小店！',
];

/**
 * 修改自动评价短语
 * @param id
 * @param ischecked
 * @param content
 * @param callback
 * @param errCallback
 */
export function autoRatePhraseModify ({ id, ischecked, content, callback = NOOP, errCallback = handleError }) {
    return api({
        apiName:'aiyong.trade.rate.auto.phrase.save',
        host: ENV.hosts.trade,
        method: '/iytrade2/editRateText',
        args: { id, ischecked: ischecked ? '1' : '0', content },
        callback: res => {
            callback(res);
        },
        errCallback: errCallback,
    });
}

/**
 * 删除自动评价短语
 * @param id
 * @param callback
 * @param errCallback
 */
export function autoRatePhraseRemove ({ id, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.trade.rate.auto.phrase.delete',
        host: ENV.hosts.trade,
        method: '/iytrade2/del',
        args: { yooz: id },
        callback: callback,
        errCallback: errCallback,
    });
}

// 切换评价状态可能需要id
export async function getIdByContent (content, callback = NOOP, errorCallback = NOOP) {
    return new Promise((resolve, reject) => {
        api({
            apiName:'aiyong.trade.rate.auto.phrase.add',
            host: ENV.hosts.trade,
            method: '/iytrade2/add',
            args: { content },
            callback: res => {
                resolve(res);
                callback(res);
            },
            errCallback: error => {
                errorCallback(error);
            },
        });
    });
}


// 获取评价记录
export function getRateRecords (data, callback = NOOP, errorCallback = NOOP) {
    return api({
        apiName:data.apiName,
        method: data.url,
        args: {
            page: data.hasLoaded ? data.page : 1,
            status: data.type,
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

export async function getTmc () {
    return new Promise((resolve, reject) => {
        qnRouter({
            api: 'taobao.tmc.user.permit',
            callback: res => {
                res = resolveTopResponse(res);
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
}

// 开启关闭自动评价
export async function openAutoEva (value, callback = NOOP, errorCallback = NOOP) {
    // 开启自动评价
    if (value) {
        let tmc = await getTmc();
        if (tmc.is_success) {
            changeAutoRateValue(
                value,
                res => {
                    callback(res);
                },
                err => {
                    errorCallback(err);
                }
            );
        }
    } else {
        changeAutoRateValue(
            value,
            res => {
                callback(res);
            },
            err => {
                errorCallback(err);
            }
        );
    }
}

function changeAutoRateValue (value, callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.trade.rate.auto.state.set',
        method: '/iytrade2/pjsz',
        args:{ sel: value ? 'on' : 'off' },
        callback:res => {
            callback(res);
        },
        errCallback:err => {
            errorCallback(err);
        },
    });
}
