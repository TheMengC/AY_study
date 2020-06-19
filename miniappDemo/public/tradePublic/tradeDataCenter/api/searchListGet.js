import { fullinfoget_all_fields, soldget_all_type } from "tradePublic/tradeDataCenter/config";
import { getUserInfo, isEmpty, moment, NOOP } from "tradePolyfills";
import { ADVANCEDSEARCH_SOURCE,
    aiyongApiList,
    FULLINFO_SOURCE,
    SEARCH_ERROR_TYPE,
    SOLDGET_SOURCE } from "tradePublic/tradeDataCenter/consts";
import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";
import { getRefundListTop } from "tradePublic/tradeDataCenter/api/refundListGet";
import { fullinfoGet } from "tradePublic/tradeDataCenter/api/fullinfoGet";

import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTrade,
    setRefundFlag,
    setTradeLoadingState,
    setTradesLoadingState } from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { soldGet } from "tradePublic/tradeDataCenter/api/soldGet";
import { getOrders } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

export function getTradeSearch (
    {
        fields = fullinfoget_all_fields,
        type = soldget_all_type,
        pageSize = 20,
        pageNo = 1,
        sortBy,
        source,
        fallback = true,
        callback = NOOP,
        errCallback = handleError,
        searchArgs,
        // ...rest
    }) {
    let args = { fields, type, pageSize, pageNo,sortBy, ...searchArgs };
    return new Promise((resolve, reject) => {
        if (getUserInfo().vipFlag != 0) {
            source = ADVANCEDSEARCH_SOURCE.aiyong;
        } else{
            source = ADVANCEDSEARCH_SOURCE.top;
        }
        if (source == ADVANCEDSEARCH_SOURCE.aiyong) {
            advancedSearchAiyong();
        } else if (source == SOLDGET_SOURCE.top) {
            advancedSearchTop();
        }

        function advancedSearchAiyong () {
            pgApi({
                api: aiyongApiList.advancedSearch,
                args,
                callback: (res) => {
                    let totalResults = res.body.tradeListResponse.total_results;
                    let has_next = res.body.tradeListResponse.has_next;
                    let trades = [];
                    if (!res.body.tradeListResponse.trades) {
                        _resolve(trades, totalResults, ADVANCEDSEARCH_SOURCE.aiyong, has_next);
                    } else{
                        trades = res.body.tradeListResponse.trades.trade;
                        trades.map(resolveTrade);
                        setTradesLoadingState(trades, {
                            fullinfo: true,
                            printBrief: true,
                        });
                        _resolve(trades, totalResults, ADVANCEDSEARCH_SOURCE.aiyong, has_next);
                    }
                },
                errCallback: (err) => {
                    if (err.sub_code == 20009) {
                        _reject({ type: SEARCH_ERROR_TYPE.dialogAlert, msg: err.message });
                        return;
                    }
                    if (err.code == 500) {
                        advancedSearchTop();
                    }
                },
            });
        }

        // 降级以及初级版走 sold.get 搜索
        // 可搜索字段：tid、buyer_nick
        function advancedSearchTop () {
            let argKeys = {
                tid: true,
                buyerNick: true,
                fields: true,
                pageNo: true,
                pageSize: true,
                sortBy: true,
                status: true,
                type: true,
                timeFilterBy: true,
            };
            let error = { type: SEARCH_ERROR_TYPE.searchAlert, msg: '高级搜索功能异常，请稍后重试，你可以通过订单号/昵称搜索。' };
            if (Object.keys(args).filter(key => !argKeys[key]).length > 0) {
                reject(error);
                errCallback(error);
                return;
            }
            if (!isEmpty(args.tid)) {
                // 如果是 tid 搜索 直接走fullinfo搜出后判断是不是该状态
                fullInfoTop();
            } else if (!isEmpty(args.buyerNick)) {
                // 按nick搜索 退款中走 refund.get 其他走sold.get
                if (args.status != 'TRADE_REFUND') {
                    soldGetTop();
                } else{
                    return  refundsTop();
                }
            } else{
                _reject(error);
            }
        }

        function fullInfoTop () {
            fullinfoGet({
                tid: args.tid,
                source:FULLINFO_SOURCE.top,
                callback: (rsp) => {
                    let trade;
                    setRefundFlag(rsp);
                    // 搜索状态退款中
                    if (args.status == 'TRADE_REFUND' && rsp.has_refunding) {
                        trade = rsp;
                    } else if (args.status == 'NEED_RATE') {
                        // 搜索状态待评价
                        if (getOrders(rsp).some((item) => !item.seller_rate && moment().diff(item.end_time, 'days') < 15)) {
                            trade = rsp;
                        }
                    } else{
                        //   if (statusNameMap[args.status].type == statusNameMap[rsp.status].type){
                        trade = rsp;
                        // }
                    }
                    if (!trade) {
                        _resolve([], 0, ADVANCEDSEARCH_SOURCE.fullinfo, false);
                        return;
                    }
                    resolveTrade(trade);
                    setTradeLoadingState(trade, { fullinfo: true });
                    _resolve([trade], 1, ADVANCEDSEARCH_SOURCE.fullinfo, false);
                },
                errCallback: (err) => {
                    _resolve([], 0, ADVANCEDSEARCH_SOURCE.fullinfo, false);
                },
            });
        }


        function soldGetTop () {
            let newQuery = {
                fields,
                type,
                pageSize,
                pageNo,
                buyer_nick: args.buyerNick,
            };
            if (args.status == 'NEED_RATE') {
                newQuery.status = 'TRADE_FINISHED';
                newQuery.rate_status = 'RATE_UNSELLER';
            } else{
                newQuery.status = args.status;
            }
            soldGet({
                source: SOLDGET_SOURCE.top,
                ...newQuery,
                callback: ({ trades, totalResults, has_next }) => {
                    if (args.status == 'NEED_RATE') {
                        trades = trades.filter((trade) => moment().diff(trade.end_time, 'days') < 15);
                    }
                    trades.map(resolveTrade);
                    setTradesLoadingState(trades, {});
                    _resolve(trades, totalResults, ADVANCEDSEARCH_SOURCE.top, has_next);
                }, errCallback: (err) => {
                    _reject(err);
                },
            });
        }

        function refundsTop () {
            return  getRefundListTop({ buyer_nick: args.buyerNick }).then(({ trades, totalResults, has_next }) => {
                _resolve(trades, totalResults, has_next, ADVANCEDSEARCH_SOURCE.top);
            });

        }

        function _resolve (trades, totalResults, source, has_next) {
            callback({ trades, totalResults, has_next, source });
            resolve({ trades, totalResults, has_next, source });
        }

        function _reject (error) {
            reject(error);
            errCallback(error);
        }
    });
}
