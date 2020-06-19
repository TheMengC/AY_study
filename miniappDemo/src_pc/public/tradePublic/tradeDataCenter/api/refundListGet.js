import { refund_simple_fields, soldget_all_type } from "tradePublic/tradeDataCenter/config";
import taobaoRefundsReceiveGet from "tradePublic/taobaoRefundsReceiveGet";
import taobaoRefundGet from "tradePublic/taobaoRefundGet";
import TDC from "tradePublic/tradeDataCenter/index";
import {fullinfoGetBatch} from "tradePublic/tradeDataCenter/api/fullinfoGet";
import {resolveTrade} from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { moment, NOOP } from "tradePolyfills/index";
import { getArrayByKey, getOrders, resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
export function getRefundList(
    {
        fields = refund_simple_fields,
        buyerNnick = '',
        type = soldget_all_type,
        useHasNext = true,
        pageSize = 40,
        pageNo = 1,
        source,
        fallback = true,
        callback = NOOP,
        errCallback = handleError,
        ...rest
    }
) {
    let query = {
        fields,
        buyer_nick:buyerNnick,
        type,
        page_no: pageNo,
        page_size: pageSize,
        use_has_next: useHasNext,
        ...rest,
    };
    let has_next=false;
    let totalResults = 0;

    return new Promise((resolve, reject) => {
        taobaoRefundsReceiveGet({
            query: query,
            callback: (rsp) => {
                rsp = resolveTopResponse(rsp);
                let refunds = getArrayByKey('refund', rsp);
                if (refunds) {
                    has_next = rsp.has_next;
                }
                totalResults = rsp.total_results;
                resolve({refunds:refunds});
            },
            errCallback: (error) => {
                reject(error);
                errCallback(error);
            },
        });

    }).then(({refunds}) => {
        let refundsGroupByTid = {};
        refunds.map(refund => {
            if (!refundsGroupByTid[refund.tid]){
                refundsGroupByTid[refund.tid] = [];
            }
            refundsGroupByTid[refund.tid].push(refund);
        })
        return new Promise((resolve,reject) => {
            fullinfoGetBatch({
                tids: Object.keys(refundsGroupByTid),
                callback: (rsp) => {
                    let list = [];
                    let trades = rsp.filter(Boolean);
                    trades.map(trade => {
                        refundsGroupByTid[trade.tid].map(refund => {
                            let order = getOrders(trade).find(order => order.oid === refund.oid);
                            let newTrade = JSON.parse(JSON.stringify(trade));
                            newTrade.orders.order = [order];
                            newTrade.refund = refund;
                            resolveTrade(newTrade);
                            list.push(newTrade);
                        })
                    });
                    resolve({totalResults: totalResults,trades: list, has_next});
                    callback({totalResults: totalResults,trades: list, has_next});
                }
            })
        });

    });
}


/**
 * 这个退款中是有够复杂的 先是用refund.receive.get取所有的退款中订单 这个返回的单位是order
 * 用这个接口返回的refund_id放到refund.get查退款详情 里面有退款过期时间
 *  然后把上面这些order里面的tid去重然后查fullinfo
 * @returns {Promise<{refunds: *} | never>}
 */
export function getRefundListTop({...args}){
    let query = {...args};
    query.page_no = 1;
    query.page_size = 40;
    query.use_has_next = true;
    query.end_modified = moment().format('YYYY-MM-DD HH:mm:ss');
    query.start_modified = moment().subtract(45,'days').format('YYYY-MM-DD')+' 00:00:00';
    query.type = soldget_all_type;
    let has_next=false;
    return new Promise((resolve,reject) => {
        let allRefunds = [];
        let refundGet = () => {
            taobaoRefundsReceiveGet({
                query: query,
                callback: (rsp) => {
                    rsp = resolveTopResponse(rsp);
                    let refunds = getArrayByKey('refund', rsp);
                    if (refunds){
                        has_next = rsp.has_next;
                        refunds = refunds.filter(trade => trade.status != 'SUCCESS' && trade.status != 'CLOSED');
                        Array.prototype.push.apply(allRefunds,refunds);
                    }
                    if (rsp.has_next){
                        query.page_no++;
                        refundGet();
                    } else{
                        resolve({refunds: allRefunds});
                    }
                },
                errCallback: (error) => {
                    if (error.msg == 'App Call Limited'){
                        setTimeout(refundGet,1000);
                        return;
                    }
                    reject();
                }
            })
        }
        refundGet();

    }).then(({refunds}) => {
        return new Promise((resolve,reject) => {
            let refundGetPromiseArr = refunds.map(refund => {
                return new Promise((resolveRefundGet,reject1) => {
                    taobaoRefundGet({
                        query: {
                            refund_id: refund.refund_id,
                        },
                        callback: (res) => {
                            resolveRefundGet(resolveTopResponse(res).refund);
                        }
                    })
                })
            })
            Promise.all(refundGetPromiseArr).then((refundGets) => {
                let refundsGroupByTid = {}; //分组 请求fullinfo
                let refundsIndexedByOid = {};
                refundGets.map(refund => {
                    if (refundsGroupByTid[refund.tid]){
                        refundsGroupByTid[refund.tid] = [];
                    }
                    refundsGroupByTid[refund.tid] = refund;
                    refundsIndexedByOid[refund.oid] = refund;
                })
                return fullinfoGetBatch({
                    tids: Object.keys(refundsGroupByTid),
                    callback: (rsp) => {
                        let trades = rsp.filter(Boolean);
                        trades.map(trade => {
                            getOrders(trade).map(order => {
                                if (refundsIndexedByOid[order.oid]){
                                    order.refund = refundsIndexedByOid[order.oid];
                                }
                            })
                            resolveTrade(trade);
                            Object.assign(trade,{
                                loadingState: {
                                    fullinfo: true,
                                    printBrief: false,
                                    printWayBill: false,
                                    refundMessage: false,
                                }
                            })
                        })
                        resolve({totalResults: trades.length,trades: trades,has_next});
                    }
                })
            })
        })
    })
}
