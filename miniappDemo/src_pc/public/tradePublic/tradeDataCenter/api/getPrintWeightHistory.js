import { api, isEmpty } from "tradePolyfills";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { pgApiHost } from "tradePublic/tradeDataCenter/consts";

/**
 * 拆分getPrintWeightHistory请求参数，不然java哭唧唧
 * @date   2018-11-07T20:45:17+0800
 * @param  {Object}                 query            [description]
 * @param  {Function}               options.callback [description]
 * @param  {[type]}                 errCallback      [description]
 */
export function getPrintWeightHistory(
    {
        query = {},
        callback = () => {},
        errCallback = handleError
    }){
    console.log('enter getPrintWeightHistory',query);
    // query中可能包含参数也可能不包含某些参数 tid num_iid
    // 这里的拆分只用了tid 所以并不是按需传的
    // 100 个发一次请求 reSize控制
    // 最终结果
    let result = {
        bluefaildata: [],
        wayBill: {},
        cost: {},
        aiyongSend: [],
        msg: [],
        buyerRateArr: {},
        rateBadToMe: [],
        detectTradeSet: {},
        wwcf_tid: {},
        print: {
            courier: [],
            invoice: [],
            surface: [],
            couriersPart: {},
            invoicesPart: {},
            surfacesPart: {},
        },
    };
    let requestKeys = [
        'num_iid',
        'tid',
        'wayTid',
        'aiyongSend',
        'msg_tid',
        'redis_tid',
        'buyer_nick_arr',
        'blue_fail_tid',
        'wwcf_tid',
    ]
    let responseKeys = [
        'bluefaildata',
        'wayBill',
        'cost',
        'aiyongSend',
        'msg',
        'buyerRateArr',
        'rateBadToMe',
        'detectTradeSet',
    ]    // 如果请求参数为空，直接返回默认字段
    if (requestKeys.every(key => isEmpty(query[key]))){
        callback(result);
        return;
    }
    let reSize = 100;
    let reCount = Math.ceil(Math.max.apply(null,requestKeys.map(key => query[key] ? query[key].length : 0))/reSize);
    if (reCount == 0){
        callback(result);
        return;
    }
    let requestPromises = [];
    for (let i = 0; i < reCount; i++) {
        requestPromises.push(new Promise((resolve,reject) => {
            let currentGroup = {};
            requestKeys.map(key => {
                if (query[key] && Array.isArray(query[key])){
                    currentGroup[key] = query[key].slice(i*reSize,(i+1)*reSize) || []
                }
            })
            api({
                apiName:'aiyong.trade.order.orderextrainfo.get',
                host:pgApiHost,
                method: '/print/getPrintWeightHistory',
                args: currentGroup,
                isloading: false,
                mode: 'json',
                callback: (rsp) => {
                    if (rsp.code > 100){
                        console.log('注意！getPrintWeightHistory接口报错了！',rsp);
                        reject(rsp);
                        return;
                    }
                    responseKeys.map(key => {
                        if (isEmpty(rsp[key])){
                            return;
                        }
                        if (Array.isArray(result[key])){
                            Array.prototype.push.apply(result[key],rsp[key]);
                        } else{
                            Object.assign(result[key],rsp[key]);
                        }
                    });
                    if (!isEmpty(rsp.print)){
                        Object.keys(rsp.print).map(key => {
                            if (Array.isArray(rsp.print[key])) {
                                if (!isEmpty(rsp.print[key])){
                                    result.print[key] = rsp.print[key].concat(rsp.print[key]);
                                }
                            } else {
                                Object.assign(result.print[key],rsp.print[key]);
                            }
                        });
                    }
                    resolve(rsp);
                },
                errCallback: (err) => {
                    console.log('注意！getPrintWeightHistory接口报错了！',err);
                    reject(result);
                }
            });
        }));
    }

    Promise.all(requestPromises).then(() => {
        try{
            callback(result);
        } catch (e){
            throw e;
        }
    }).catch((e) => {
        console.error('eeeee',e);
        errCallback(result);
    });
}
