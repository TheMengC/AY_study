import { fullinfoget_all_fields } from "tradePublic/tradeDataCenter/config";
import { aiyongApiList, FULLINFO_SOURCE } from "tradePublic/tradeDataCenter/consts";
import TDC from "tradePublic/tradeDataCenter/index";
import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";
import { fullinfoGet, fullinfoGetBatch } from "tradePublic/tradeDataCenter/api/fullinfoGet";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTrade } from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { getUserInfo, isEmpty, NOOP } from "tradePolyfills/index";

/**
 * 订单详情
 * 这个是v2接口 比fullinfo多打印状态 然后可以取合单
 * @param mergeTid
 * @param tid
 * @param callback
 * @param errCallback
 * @returns {Promise<any>}
 */
export function detailInfoGet ( //
    {
        mergeTid,
        tid,
        callback = NOOP,
        source = FULLINFO_SOURCE.aiyong,
        errCallback = handleError,
        fields = fullinfoget_all_fields,
    }) {
    let query = {};
    if (mergeTid) {
        query.mergeTid = mergeTid;
    } else if (tid) {  // 如果有mergeTid 就先不管tid了 要是请求失败了再用
        query.taoTid = tid;
    }
    let errAiyong;
    return new Promise((resolve, reject) => {
        if (getUserInfo().vipFlag == 0) {
            source = FULLINFO_SOURCE.top;
        }
        if (source == FULLINFO_SOURCE.aiyong) {
            detailInfoGetAiyong();
        }else{
            detailInfoGetTop();
        }

        function detailInfoGetAiyong () {
            pgApi({
                api: aiyongApiList.detailInfoGet,
                args: { ...query, fields },
                callback: (res) => {
                    let trade = res.body.detailInfoResponse.trade;
                    if (isEmpty(trade)) {
                        errAiyong = { msg: '未找到该订单' };
                        detailInfoGetTop();
                        return;
                    }
                    if (trade) {
                        resolveTrade(trade);
                    }
                    callback(trade);
                    resolve(trade);
                },
                errCallback: (err) => {
                    errAiyong = err;
                    detailInfoGetTop();
                },
            });
        }

        function detailInfoGetTop () {
            if (!mergeTid) {
                fullinfoGet({
                    tid: tid,
                    fields,
                    source,
                    callback: (trade) => {
                        resolveTrade(trade);
                        resolve(trade);
                        callback(trade);
                    },
                    errCallback: (err) => {
                        reject(err);
                        callback(err);
                    },
                });
            } else{ // 如果是合单 就难搞了
                if (!tid) {  // 如果没有传tid 就彻底凉凉了
                    reject(errAiyong);
                    errCallback(errAiyong);
                } else{ // 如果传了tid 还能抢救一下
                    let tids = tid.split(',');
                    return fullinfoGetBatch({
                        tids,
                        callback: (trades) => {
                            let trade = { mergeTid: mergeTid, trades };
                            resolveTrade(trade);
                            resolve(trade); // 拼一个合单糊弄一下
                            callback(trade);
                        },
                        errCallback: (err) => {
                            reject(err);
                            errCallback(err);
                        },
                    });
                }
            }
        }
    });
}
