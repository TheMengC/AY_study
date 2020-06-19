import {soldget_all_fields,soldget_all_type} from "tradePublic/tradeDataCenter/config";
import {SOLDGET_SOURCE} from "tradePublic/tradeDataCenter/consts";
import {getWindow,NOOP} from "tradePolyfills";
import {handleError} from "tradePublic/tradeDataCenter/common/handleError";
import {getTrades,resolveTopResponse} from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import qnRouter from "tradePublic/qnRouter";
import {resolveTrade} from 'tradePublic/tradeDataCenter/biz/resolveTrade'

export function soldGet(
    {
        fields = soldget_all_fields,
        type = soldget_all_type,
        pageSize = 20,
        pageNo = 1,
        status,
        source = SOLDGET_SOURCE.aiyong,
        callback = NOOP,
        errCallback = handleError,
        ...rest
    }){
    return new Promise((resolve,reject) => {
        let params = {
            fields,
            page_no: pageNo,
            page_size: pageSize,
            type,
            ...rest
        };
        if (status){
            params.status = status;
        }
        if (getWindow().downGrade&&getWindow().downGrade.top_sold_get_use_has_next){
            params.use_has_next = true;
        }
        qnRouter({
            api: 'taobao.trades.sold.get',
            tag: 'TDC-soldGet',
            source: source,
            params,
            callback: (rsp) => {
                let trades = [];
                rsp=resolveTopResponse(rsp);
                if (rsp){
                    trades = getTrades(rsp);
                }
                let totalResults = rsp.total_results;
                let has_next = rsp.has_next;
                if (has_next == undefined) {
                    has_next = trades.length == pageSize;
                }
                trades = trades.map((trade)=>{return resolveTrade(trade)});
                callback({trades,totalResults,has_next});
                resolve({trades,totalResults,has_next});
            },
            errCallback: (error) => {
                errCallback(error);
                reject(error);
            }
        });
    })
}