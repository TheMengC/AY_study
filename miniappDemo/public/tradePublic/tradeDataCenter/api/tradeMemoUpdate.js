import {  NOOP } from "tradePolyfills";
import { aiyongApiList} from "tradePublic/tradeDataCenter/consts";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";
import qnRouter from "tradePublic/qnRouter";
import {  resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

export function tradeMemoUpdate (
    {
        tid,
        memo,
        flag,
        source,//来自于哪个平台 2表示手机端
        apiVersion,
        userNick,
        subUserNick,
        created,
        reset = false,

        callback = NOOP,
        errCallback = handleError,
    }
) {
    let query = {
        tid:tid,
        flag:flag,
        memo:memo,
        reset:reset,
    };
    return new Promise((resolve,reject) => {
        qnRouter({
            api:'taobao.trade.memo.update',
            params:query,
            callback:(rsp) => {
                rsp = resolveTopResponse(rsp);
                let trade = rsp.trade;
                resolve({ trade:trade });
            },
            errCallback:(error) => {
                reject(error);
                errCallback(error);
            },
        });
    }).then(({ trade }) => {
        let json = {};
        json.trade = trade;
        return new Promise((resolve,reject) => {
            pgApi({
                api:aiyongApiList.memoAdd,
                args:{
                    tid: tid,
                    sellerMemo: memo,
                    sellerFlag: flag,
                    apiVersion: apiVersion,
                    source: source,
                    sellerNick: userNick,
                    sellerSubNick: subUserNick,
                    orderCreate: created,
                    gmtModify: trade.modified,
                },
                callback: (body) => {
                    json.code = 200;
                    json.body = body;
                    callback(json);
                    resolve(json);
                },
                errCallback: (err) => {
                    json.code = 500;
                    json.body = err;
                    callback(json);
                    resolve(json);
                },
            });
        });
    });
}
