import Taro from '@tarojs/taro';
import { REFUND_CHANGE } from './config';
import { soldGet } from "tradePublic/tradeDataCenter/api/soldGet";
import { fullinfoget_all_fields } from "tradePublic/tradeDataCenter/config";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import taobaoRefundGet from "tradePublic/taobaoRefundGet";

let app = Taro.getApp();
/**
 *
 * @param json
 */
export const dispatch = (json) => {
    app.store.dispatch(json);
};
/**
 *
 * @returns {any|*|Promise<NavigationPreloadState>}
 */
export const getState = () => {
    return app.store.getState();
};

export const changeTab = (tabkey, pageNo, pageSize, searchVal) => {
    dispatch({
        type: REFUND_CHANGE,
        data:{
            activeTabKey: tabkey,
            pageNo:pageNo,
            pageSize: pageSize,
            list:[],
            isLoading:true,
        },
    });
    soldGet({
        fields:fullinfoget_all_fields,
        status:tabkey,
        pageNo:pageNo,
        pageSize:pageSize,
        buyerNnick:searchVal,
        useHasNext:false,
        callback:(rsp) => {
            let list = rsp.trades;
            dispatch({
                type: REFUND_CHANGE,
                data:{
                    activeTabKey: tabkey,
                    list:[...list],
                    tradeCounts: rsp.totalResults,
                },
            });
            Promise.all(
                list.filter(trade => ['WAIT_BUYER_PAY', 'WAIT_SELLER_SEND_GOODS'].includes(trade.refund.status))
                    .map(trade => {
                        return new Promise((resolve,reject) => {
                            taobaoRefundGet({
                                query: {
                                    refund_id: trade.refund.refund_id,
                                },
                                callback: (res) => {
                                    res = resolveTopResponse(res);
                                    trade.refund = res.refund;
                                    resolve();
                                },
                                errCallback: (err) => {
                                    resolve();
                                }
                            })
                        })
                    })
            ).then(() => {
                dispatch({
                    type: REFUND_CHANGE,
                    data:{
                        activeTabKey: tabkey,
                        list:[...list],
                        tradeCounts: rsp.totalResults,
                        isLoading:false,
                    },
                });
            });
        }
    });
}