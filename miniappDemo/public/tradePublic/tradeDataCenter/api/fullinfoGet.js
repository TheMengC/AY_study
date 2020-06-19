import { fullinfoget_all_fields } from "tradePublic/tradeDataCenter/config";
import { api, getSettings, getUserInfo, NOOP } from "tradePolyfills";
import qnRouter, { QNAPI_SOURCE } from "tradePublic/qnRouter";
import { FULLINFO_SOURCE, pgApiHost } from "tradePublic/tradeDataCenter/consts";
import { TdcLogger } from "tradePublic/tradeDataCenter/common/tdcLogger";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

export function fullinfoGet(
    {
        tid,
        source, //初级版用户请不要指定为FULLINFO_SOURCE.aiyong 因为router/batch对初级版用户不开放
        fields = fullinfoget_all_fields,
        fallback = true, //是否在router/batch失效的时候切换到qn.invoke
        callback = NOOP,
        errCallback = handleError,
        tag = ''
    }
){
    return new Promise((resolve,reject) => {
        qnRouter({
            api: 'taobao.trade.fullinfo.get',
            tag: tag,
            source:source,
            params: {tid,fields},
            callback: (rsp) => {
                rsp = resolveTopResponse(rsp);
                if (rsp.trade){
                    callback(rsp.trade);
                    resolve(rsp.trade);
                } else{
                    reject(rsp);
                    errCallback(rsp);
                }
            },
            errCallback: (error) => {
                reject(error);
                errCallback(error)
            }
        })
    })
}
/**
 * 获得fullinfo的方法 可以选择aiyong的router/batch或者前端的qn.invoke作为数据源
 * 目前 初级版用户统一走前端qn.invoke 高级版用户可以使用router/batch接口 在router/batch挂掉的时候也fallback到qn.invoke
 * @param tids
 * @param source
 * @param fields
 * @param fallback
 * @param callback
 * @param errCallback
 * @returns {Promise<Array>}
 */

export function fullinfoGetBatch(
    {
        tids,//必须是数组
        source, //初级版用户请不要指定为FULLINFO_SOURCE.aiyong 因为router/batch对初级版用户不开放
        fields = fullinfoget_all_fields,
        fallback = true, //是否在router/batch失效的时候切换到qn.invoke
        callback = NOOP,
        errCallback = handleError,
        tag = ''
    }){
    if (!source){
        if (getUserInfo().vipFlag != 0){
            source = FULLINFO_SOURCE.aiyong;
        } else{
            source = FULLINFO_SOURCE.top;
        }
    }

    return new Promise((resolve,reject) => {
        if (tids.length == 0){
            resolve([])
            callback([]);
            return;
        }
        let getFullinfoFromQn = () => {
            _taobaoTradeFullInfoBatchGetQN(
                {
                    fields: fields,
                    tids: tids,
                    tag: tag,
                    callback: (res) => {
                        TdcLogger.info('fullinfoGetBatch-QN',res);
                        let trades = formatResponse(res);
                        callback(trades);
                        resolve(trades);
                    },
                    errCallback: (err) => {
                        TdcLogger.info('fullinfoGetBatch-QN',err);
                        errCallback(err);
                        resolve(err);
                    }
                }
            )
        }
        switch (source){
            case FULLINFO_SOURCE.aiyong:
             return   _aiyongRouterBatch({
                    tids,
                    fields,
                    callback: (res) => {
                        TdcLogger.info('fullinfoGetBatch-aiyong',res);
                        let trades = formatResponse(res);
                        callback(trades);
                        resolve(trades);
                    },
                    errCallback: (err) => {
                        TdcLogger.error('fullinfoGetBatch-aiyong',err);
                        if (fallback
                        //&& (isEmpty(err.sub_code)||  //没有sub_code不知道是什么鬼问题 就走前端调吧
                        //	err.sub_code=='20005'|| //初级版用户 走前端调用
                        //  err.sub_code=='20004') //用户授权失效,需要前端自己查接口
                        //剩下的几个sub_code就是
                        ){
                            if (err.sub_code == '20004'){
                                showErrorDialog("授权失效 请重新授权")
                            }
                            getFullinfoFromQn();
                        } else{
                            errCallback(err);
                            resolve(err);
                        }
                    }
                })
                break;
            case FULLINFO_SOURCE.top:
                getFullinfoFromQn();
                break;

        }
    });

    function formatResponse(response){
        return response.map(item => resolveTopResponse(item).trade)
    }
}
/**
 * 调用自己的router/batch方法
 * @param tids
 * @param fields
 * @param callback
 * @param errCallback
 * @returns {Promise<any>}
 */
export function _aiyongRouterBatch(
    {
        tids,//必须是数组
        fields = fullinfoget_all_fields,
        callback = NOOP,
        errCallback = handleError
    }){
    return new Promise((resolve,reject) => {
        let action = '/router/batch';
        let method = 'taobao.trade.fullinfo.get';
        if (getSettings().routerBatchErrorMock == 1){
            action = '/router/batch1';
        }
        api({
            host:pgApiHost,
            apiName:'aiyong.trade.order.fullinfo.batchget',
            method: action,
            mode: 'json',
            args: {
                method: method,
                'param[fields]': fields,
                'value[tid]': tids
            },
            isloading: false,
            callback: (res) => {
                if (res.code || res.error){
                    errCallback(res);
                    resolve(res);
                } else{
                    callback(res);
                    resolve(res);
                }
            },
            errCallback: (res) => {
                errCallback(res);
                resolve(res);
            }
        });
    })
}

export function _taobaoTradeFullInfoBatchGetQN(
    {
        tids,//必须是数组
        fields = fullinfoget_all_fields,
        callback = NOOP,
        errCallback = handleError,
        tag
    }){
    if (!tag){
        tag = '_taobaoTradeFullInfoBatchGetQN';
    }
    return Promise.all(tids.map((tid,index) => {
            return new Promise((resolve,reject) => {
                qnRouter({
                    api: 'taobao.trade.fullinfo.get',
                    tag: tag,
                    source: QNAPI_SOURCE.top,
                    params: {tid,fields},
                    callback: (rsp) => {
                        resolve(rsp);
                    },
                    errCallback: (error) => {
                        resolve(error);
                    }
                })
            })
        })
    ).then((resArr) => {
        callback(resArr);
    }).catch(errArr => {
        errCallback(errArr);
    });
}
