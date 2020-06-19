import { fullinfoget_all_fields, soldget_all_type } from "tradePublic/tradeDataCenter/config";
import {  NOOP, isPaidVip } from "tradePolyfills";
import { aiyongApiList, SOLDGET_SOURCE } from "tradePublic/tradeDataCenter/consts";
import { TRADE_TABS } from "tradePublic/consts";
import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";
import { getRefundListTop } from "tradePublic/tradeDataCenter/api/refundListGet";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTrade, setTradesLoadingState } from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { soldGet } from "tradePublic/tradeDataCenter/api/soldGet";

export function getTradeList (
    {
        fields = fullinfoget_all_fields,
        type = soldget_all_type,
        pageSize = 20,
        pageNo = 1,
        status,
        source,
        fallback = true,
        callback = NOOP,
        errCallback = handleError,
        ...rest
    }
) {

    let args = { fields, type, pageSize, pageNo, status, ...rest };
    return new Promise((resolve, reject) => {
        if (!source) {
            if (aiyongApiList.soldGet.enabled) {
                source = SOLDGET_SOURCE.aiyong;
            } else{
                source = SOLDGET_SOURCE.top;
            }
        }
        if (!isPaidVip()) {
            source = SOLDGET_SOURCE.top;
        }
        if (source == SOLDGET_SOURCE.aiyong) {
            soldGetAiyong();
        } else if (source == SOLDGET_SOURCE.top) {
            soldGetTop();
        }

        function soldGetAiyong () {
            pgApi({
                api: aiyongApiList.soldGet,
                args,
                callback: (res) => {
                    let totalResults = res.body.tradeListResponse.total_results;
                    let has_next = res.body.tradeListResponse.has_next;
                    let trades = [];
                    if (!res.body.tradeListResponse.trades) {
                        _resolve(trades, totalResults, SOLDGET_SOURCE.aiyong, has_next);
                        return;
                    }
                    trades = res.body.tradeListResponse.trades.trade;
                    setTradesLoadingState(trades, {
                        fullinfo: true,
                        printBrief: true,
                    });
                    trades.map(resolveTrade);
                    _resolve(trades, totalResults, SOLDGET_SOURCE.aiyong, has_next);

                },
                errCallback: (err) => {
                    if (!fallback) {
                        _reject(err);
                        return;
                    } else{
                        soldGetTop();
                    }
                },
            });
        }

        function soldGetTop () {
            if (status == TRADE_TABS.TRADE_REFUND.query_status) {
                getRefundListTop({}).then(resolve);
            } else{
                soldGet({
                    source: SOLDGET_SOURCE.top,
                    fields, type, pageSize, pageNo, status, ...rest,
                    callback: ({ trades, totalResults, has_next }) => {
                        trades.map(resolveTrade);
                        setTradesLoadingState(trades, {});
                        _resolve(trades, totalResults, SOLDGET_SOURCE.top, has_next);
                    }, errCallback: (err) => {
                        _reject(err);
                    },
                });
            }
        }

        function _resolve (trades, totalResults, source, has_next) {
            callback({ trades, has_next, source, totalResults });
            resolve({ trades, has_next, source, totalResults });
        }
        function _reject (err) {
            reject(err);
            errCallback(err);
        }
    }
    );
}
