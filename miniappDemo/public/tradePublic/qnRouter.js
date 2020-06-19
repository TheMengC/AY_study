import { api,
    Logger,
    getCurrentVersionNum,
    getUserInfo,
    getWindow,
    isEmpty,
    NOOP,
    qnapi,
    Tools, ENV } from 'tradePolyfills';
import { pgApiHost } from "tradePublic/tradeDataCenter/consts";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { showErrorDialog } from "tradePublic/utils";

const pgApiGetList = {
    // 拉单部分接口 在下面的路由中只调一次 要么调淘宝的要么调后端存单的 如果后端存单跪了 再调淘宝的
    'taobao.trade.fullinfo.get':{ path: '/order/getOrderInfoBySingle', apiName:'aiyong.trade.order.orderinfo.get' },             // 单笔fullinfo
    'taobao.trade.fullinfo.get.customization':{ path: '/order/getOrderInfoBySingle', apiName:'aiyong.trade.order.orderinfo.get' },             // hold单 单笔fullinfo
    'taobao.trades.sold.get':{ path: '/tradeList/soldGet', apiName:'aiyong.trade.order.sold.get' },                         // 订单列表
    'taobao.trades.sold.increment.get':{ path: '/tradeList/incrementGet', apiName:'aiyong.trade.order.increment.get' },           // increment.get
    'taobao.trade.get':{ path: '/order/getOrderInfoBySingle', apiName:'aiyong.trade.order.orderinfo.get' },                          // 另一个fullinfo
};

const pgApiSaveList = {
    // 双存接口, 在掉完淘宝接口以后 再调一次双存接口, 只要双存 就要调两次 跟上面的拉单接口不同.
    'taobao.trade.close':{ path:'/order/closeOrder', apiName:'aiyong.trade.order.close.save' },                              // 关闭订单
    'taobao.trade.receivetime.delay':{ path:'/order/delay', apiName:'aiyong.trade.order.receivetimedelay.save' },                        // 延长交易收货时间
    'taobao.logistics.consign.resend':{ path:'/order/logisticsConsignResend', apiName:'aiyong.trade.order.resend.save' },     // 修改物流公司和运单号
    'taobao.logistics.dummy.send':{ path:'/order/logisticsDummySend', apiName:'aiyong.trade.order.send.dummy.save' },             // 无需物流（虚拟）发货处理
    'taobao.logistics.online.send':{ path:'/order/logisticsOnlineSend', apiName:'aiyong.trade.order.send.online.save' },           // 在线订单发货处理（支持货到付款)
    'taobao.logistics.offline.send':{ path:'/order/logisticsOfflineSend', apiName:'aiyong.trade.order.send.offline.save' },         // 自己联系物流（线下物流）发货
    'taobao.trade.memo.update':{ path:'/order/modifyMemo', apiName:'aiyong.trade.order.memo.update' },                        // 修改商家备注与旗帜
    'taobao.trade.postage.update':{ path:'/order/postageUpdate', apiName:'aiyong.trade.order.postageupdate.save' },                  // 修改交易邮费价格
    'taobao.refund.refuse':{ path:'/order/refundRefuse', apiName:'' },                          // 卖家拒绝退款
    'taobao.trade.ordersku.update':{ path:'/order/skuUpdate', apiName:'aiyong.trade.order.skuupdate.save' },                     // 修改交易的销售属性
    'taobao.traderate.add':{ path:'/order/traderateAdd', apiName:'aiyong.trade.order.rate.save' },                          // 新增单个评价
    'taobao.traderate.list.add':{ path:'/order/traderateListAdd', apiName:'aiyong.trade.rate.list.save' },                 // 针对父子订单新增批量评价
    // 'taobao.trade.shippingaddress.update': '/order/updateAddress',          // 更改交易的收货地址 v1废弃 统一使用v2接口
};
const apiCost = {
    'taobao.trade.fullinfo.get':1,
    'taobao.trade.fullinfo.get.customization':1,
    'taobao.trades.sold.get':1,
    'taobao.trades.sold.increment.get':1,
    'taobao.trade.get':1,
    'taobao.traderates.get': 3,
    'taobao.trade.memo.update':1,
    'taobao.logistics.trace.search':1,
    'taobao.item.seller.get':1,
};

const pgApiList = Object.assign({}, pgApiGetList, pgApiSaveList);
getWindow().pgClosedFlag = 0;
const API_VERSION = '1.0.0';
export const QNAPI_SOURCE = {
    aiyong: 'aiyong',
    top: "top",
};
let logger = {
    log:(name, ...params) => {
        Logger.log.apply(null, [`%c${name}:`, "color: white;background-color:green", ...params]);
    },
    error:(name, ...params) => {
        Logger.log.apply(null, [`%c${name}:`, "color: white;background-color:red", ...params]);
    },
};
let currentVersion = getCurrentVersionNum();
/**
 * qnRouter这个方法本身是qnapi方法的路由部分
 * 现将qnapi方法的路由部分拆到这个方法中 使qnapi方法只负责网络请求 负责调top或者router/rest
 * 该方法抹平pg与top的差异 在source参数中可选数据来源
 * @param api
 * @param params
 * @param method
 * @param callback
 * @param errCallback
 * @param withoutTry
 * @param fallback 是否在aiyong挂了的时候调top 默认为true
 * @param source 数据源 是top还是aiyong
 * @param rest
 */
let WW_UNFINISHED_STATUS = [
    'WAIT_BUYER_PAY',
    'WAIT_SELLER_SEND_GOODS',
    'WAIT_BUYER_CONFIRM_GOODS',
    'TRADE_FINISHED',
];
export function qnRouter (
    {
        api,
        method,
        params = {},
        callback = NOOP,
        errCallback = (err) => {
            showErrorDialog('淘宝接口调用失败', err.sub_msg, err);
        },
        fallback = true,
        source,
        tag,
        pgSaveDisabled = false,
        ...rest
    }
) {
    if (!api && method) {
        api = method;
    }
    return new Promise((resolve, reject) => {
        const _callback = (res) => {
            resolve(res);
            callback(res);
        };
        const _errCallback = (err) => {
            errCallback(err);
            reject(err);


        };

        if (!source) {
            if (getUserInfo().vipFlag > 0) {
                source = QNAPI_SOURCE.aiyong;
            } else{
                source = QNAPI_SOURCE.top;
            }
        } else if (source == QNAPI_SOURCE.aiyong && getUserInfo().vipFlag == 0) {
            source = QNAPI_SOURCE.top; // 初级版用户调什么后端接口
        }
        if (getWindow().pgClosedFlag) { // 若最近存单有错误 则走top
            source = QNAPI_SOURCE.top;
        }
        if (params != undefined) {
            if (params.nick) {
                params.nick = decodeURI(params.nick);// 解决nick中文编码的影响
            }
        }
        /**
         * 首先 初级版用户不管调用什么接口都不走后端 在入口直接调top接口然后掐掉
         *
         * 下面的qnApi调用部分 分为两个部分
         *
         * 一部分是get部分 如fullinfo.get sold.get  高级版用户应该调用后端接口
         * 一部分是set部分 也就是修改订单状态之类的 如trade.close logistics.send 高级版用户需要先调用top然后调用双存接口
         */
        if (params.status && params.status == 'TRADE_FINISHED' && params.rate_status != undefined && params.rate_status != '') {
            source = QNAPI_SOURCE.top;
        }
        if (source == QNAPI_SOURCE.top) { // 直接调top 要什么自行车
            invokeInQn(_callback, _errCallback);
        } else if (source == QNAPI_SOURCE.aiyong && pgApiGetList[api]) {// get类api 默认从爱用调用
            aiyongApiGet();
        } else{
            // 其他api 先调top 若有双存api 再调双存api
            invokeInQn((res) => {
                if (pgApiSaveList[api]) {
                    let modified = getResponseModified(res); // pg存单接口需要一个modified
                    if (!pgSaveDisabled) {
                        aiyongApiSave(modified, () => {
                            /**
                                 * 这里callback不管是成功了还是失败 如果是成功了直接callback 如果是失败了 在【关闭存单接口】后callback，无论关闭成功或失败
                                 */
                            _callback(res);
                        });
                    }else{
                        _callback(res);
                    }

                    return;
                }
                _callback(res);
            },
            (error) => {
                _errCallback(error);
            }
            );
        }



        // 直接走top
        function invokeInQn (callback, errCallback) {
            qnapi({
                api: api,
                params: params,
                callback: (rsp) => {
                    logger.log(`qnRouter-QN`, api, params, rsp);
                    callback(rsp);
                },
                errCallback: (error) => {
                    if (error instanceof Error) {
                        try{
                            error = JSON.parse(error.message);
                        }catch(e) {
                            error = { msg:'unknown', sub_msg:'unknown error' };
                        }
                    }
                    if (!fullInfoGetCustomizationIfNecessary(api, params, error, callback, errCallback) // 所有特殊错误处理可以写在这里
                    // ||
                    ) {
                        Tools.beacons({
                            p: 'TopErrorLog' + ENV.planet,
                            e: api,
                            n: getUserInfo().userNick,
                            m1: encodeURI(JSON.stringify(error)),
                        });
                        logger.error(`qnRouter-QN`, api, params, error);
                        errCallback(error);
                    }
                },
            });
            //  topBeacon();
        };

        function topBeacon () {
            if (getWindow().downGrade && getWindow().downGrade.beacon_top_num_disabled) {
                return;
            }
            // 计数埋点部分 所有用户都参与埋点统计
            // 页面区分 ww和pc
            let pageName = location.pathname && location.pathname.split('/').reverse()[0] || '';
            let pathName = '';
            // 取路由hash
            let lHash = location.hash.match(/#\/(.*)\?\_/);
            if (lHash) {
                pathName = lHash[1] || '';
            }
            let cost = apiCost[api] || 0;
            Tools.beacons({
                n: getUserInfo() && getUserInfo().userNick || 'no_user',
                e: 'gettaobaonum',
                p: 'TD20170614170642',
                m1: pageName,
                m2: pathName,
                m3: api,
                m4: getUserInfo() && getUserInfo().vipFlag || '0',
                m5: tag,
                d1: currentVersion,
                d2: cost,
            }
            );

        }

        // 使用后端存单接口获取数据
        function aiyongApiGet () {
            // 几个特殊参数
            let paramsAiyong = Object.assign({}, params);
            paramsAiyong['apiVersion'] = API_VERSION;
            switch (api) {
                // fullinfo 的
                case 'taobao.trade.fullinfo.get':
                case 'taobao.trade.fullinfo.get.customization':
                case 'taobao.trade.get':
                    paramsAiyong['param[fields]'] = paramsAiyong.fields || '';
                    paramsAiyong['method'] = 'taobao.trade.fullinfo.get';
                    if (Array.isArray(paramsAiyong.tid)) {
                        paramsAiyong['tid'] = paramsAiyong.tid[0];
                    }
                    break;
                case 'taobao.trade.close':
                    if (paramsAiyong.mainTid != undefined) {
                        // 调换顺序
                        paramsAiyong['oid'] = paramsAiyong['tid'];
                        paramsAiyong['tid'] = paramsAiyong['mainTid'];
                    }
                    break;
                default:
                    break;
            }

            pgApi(api, paramsAiyong, (rspPg) => {
                if (rspPg.body) {
                    _callback(rspPg.body);
                } else{
                    _callback(rspPg);
                }
            }, (err) => {
                if (fallback) {
                    invokeInQn(_callback, _errCallback);// 调用失败 走top
                } else{
                    _errCallback(err);
                }
            });
            return;

        }

        function getResponseModified (response) {
            let modified = '';
            Object.keys(response).map(key => {
                if (key.indexOf('response') > -1) {
                    let item = response[key];
                    if (item) {
                        // 多数情况下
                        if (item.trade && item.trade.modified != undefined) {
                            modified = item.trade.modified;
                        } else if (item.trade_rate && item.trade_rate.created != undefined) {
                            // 评价用的是created字段
                            modified = item.trade_rate.created;
                        } else if (item.order && item.order.modified != undefined) {
                            // 修改属性用的是order字段的modified
                            modified = item.order.modified;
                        } else{
                            // 其他
                        }
                    }
                }
            });
            return modified;
        }

        // top成功后调用pg双存
        function aiyongApiSave (modified, callback = NOOP) {
            let paramsAiyong = { ...params, modified, apiVersion: API_VERSION };
            pgApi(api, paramsAiyong, callback, callback);
        }


    });
}

function pgApi (topApi, paramsPg, callback = NOOP, errCallback = NOOP) {
    if (!pgApiList[topApi]) {
        return;
    }

    let apiName = pgApiList[topApi].apiName;
    let method = pgApiList[topApi].path;
    let args = { method:method };
    if (apiName) {
        args.apiName = apiName;
    }

    Tools.api({
        host:pgApiHost,
        ...args,
        mode: 'json',
        args: paramsPg,
        isloading: false,
        callback: (res) => {
            // 如果正常返回中有异常需要判断出来
            if (res.code && res.code > 200) {
                logger.error(`qnRouter-pg-error`, topApi, paramsPg, res);
                if (isEmpty(res.sub_code)) {
                    // 其他错误暂时关闭存单
                    reportError(paramsPg, res, () => {
                        errCallback(res);
                    }, () => {
                        errCallback(res);
                    });
                } else{
                    switch ('' + res.sub_code) {
                        case '20004':
                            // 授权失效的暂时不需要关闭
                            showErrorDialog('温馨提示', '授权失效！请重新授权！', JSON.stringify(res));
                        case '20005':
                            // 提示初级版用户无法使用该功能表示pg存单被关闭 在5分钟内不调pg接口
                            closePgWithTimeout();
                            errCallback();
                            break;
                        default:
                            errCallback();
                    }
                }

            } else{
                logger.log(`qnRouter-pg`, topApi, paramsPg, res);
                callback(res);
            }
        },
        errCallback: (err) => {
            // 查问题的埋点
            logger.error(`qnRouter-pg-error`, topApi, paramsPg, err);
            errCallback();
        },
    });
}

let closePgTimer;

function closePgWithTimeout (second = 60 * 5) {
    logger.error(second + '秒内不调存单接口');
    getWindow().pgClosedFlag = 1;
    if (!second) {
        return;
    }
    clearTimeout(closePgTimer);
    closePgTimer = setTimeout(() => {
        logger.log('再调用存单接口试试吧');
        getWindow().pgClosedFlag = 0;
    }, second * 1000);
}

function reportError (request, response, callback = NOOP, errCallback = NOOP) {

    Tools.api({
        method: '/order/changeUserPullStatus',
        mode:'json',
        args: {
            errorMethod: pgApiList[api],
            errorParam: JSON.stringify(request),
            errorResp: JSON.stringify(response),
        },
        callback: (resp) => {
            logger.log('上报错误', resp);
            callback(resp);
        },
        errCallback: (err) => {
            logger.error('上报错误失败');
            errCallback(err);
        },
    });
}

function fullInfoGetCustomizationIfNecessary (api, params, error, callback = NOOP, errCallback) {
    if (api == 'taobao.trade.fullinfo.get' && error && error.code == 15 && error.sub_code == 'isv.trade-hold') {
        qnapi({
            api: 'taobao.trade.fullinfo.get.customization',
            params: params,
            callback: (resp) => {
                let newResp = {};
                newResp.trade_fullinfo_get_response = resolveTopResponse(resp);
                // 存起来
                let trades = [];
                trades.push(resolveTopResponse(resp).trade);
                // 替换HOLD单中坑爹的tid和oid字段
                if (typeof trades[0].tid === 'number') {
                    if (trades[0].tid_str != undefined) {
                        trades[0].tid = trades[0].tid_str;
                    }
                }
                if (trades[0].orders != undefined && trades[0].orders.order != undefined) {
                    if (Array.isArray(trades[0].orders.order)) {
                        trades[0].orders.order.forEach(item => {
                            item.oid = item.oid_str;
                        });
                    }
                }
                callback(newResp);
            },
            errCallback: (error) => {
                if (errCallback) {
                    errCallback(error);
                } else{
                    console.error(error);
                }
            },
        });
        return true;
    }
    return false;
}

export default qnRouter;
