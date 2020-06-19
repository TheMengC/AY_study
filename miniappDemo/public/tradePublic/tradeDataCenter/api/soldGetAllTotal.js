import { pgApiHost } from "tradePublic/tradeDataCenter/consts";
import qnRouter from "tradePublic/qnRouter";
import { soldget_all_type } from "tradePublic/tradeDataCenter/config";
import { api, isEmpty, moment, NOOP } from "tradePolyfills";
import { TRADE_TABS } from "tradePublic/consts";
import { getTrades, resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

const allTradeStatus = Object.keys(TRADE_TABS).filter((tab) => tab != 'TRADE_REFUND' && tab != 'NEED_RATE');

const INTERFACE_PARAM_MAP = {
    THREE_MONTH: 'allNum',
    ALL_CLOSED: 'closeNum',
    TRADE_REFUND: 'refundNum',
    WAIT_BUYER_CONFIRM_GOODS: 'sendedNum',
    TRADE_FINISHED: 'successNum',
    NEED_RATE: 'waitEvaNum',
    WAIT_BUYER_PAY: 'waitPayNum',
    WAIT_SELLER_SEND_GOODS: 'waitSendNum',
};

/**
 * 从爱用后端接口获取订单数量
 * @param callback
 */
export function soldGetNumAiyong ({ callback = NOOP }) {
    api({
        apiName:'aiyong.trade.order.solds.total.get',
        host: pgApiHost,
        method: '/tradeList/soldGetAllTotal',
        mode: 'json',
        callback: (rsp) => {
            let tradeCounts = {};
            if (rsp.code > 200) {
                callback(tradeCounts);
                return;
            }
            Object.keys(TRADE_TABS).forEach((key) => {
                tradeCounts[key] = rsp.body[INTERFACE_PARAM_MAP[key]];
            });
            callback(tradeCounts);
        },
        errCallback: (err) => {
            console.error('errmsg', err);
            callback({});
        },
    });
}

/**
 * 从top接口获取订单数量
 * @param callback
 */
export function soldGetNumTop ({ callback = NOOP }) {

    const argsArr = allTradeStatus.map((status) => {
        switch(status) {
            case 'THREE_MONTH':
                return {
                    api: 'taobao.trades.sold.get',
                    params: {
                        fields: 'tid',
                        type: soldget_all_type,
                    },
                    status: status,
                };
            default:
                return {
                    api: 'taobao.trades.sold.get',
                    params: {
                        status: status,
                        fields: 'tid',
                        type: soldget_all_type,
                    },
                    status: status,
                };
        }
    });
    const promiseArr = argsArr.map((args) => {
        return new Promise((resolve) => {
            qnRouter({
                api: args.api,
                params: args.params,
                callback: (rsp) => {
                    const respons = resolveTopResponse(rsp);
                    let totalResults = respons.total_results;
                    resolve({ [args.status]: totalResults });
                },
                errCallback: (err) => {
                    console.error('errmsg', err);
                    resolve({ [args.status]: 0 });
                },
            });
        });
    });
    Promise.all(promiseArr).then((result) => {
        callback(Object.assign({}, ...result));
    });
}

/**
 * 获取待评价订单数量，这里避免调用量过多问题，只取200单查出待评价订单
 * @param callback
 */
export function getNeedRateAllNum ({ callback = NOOP }) {
    const pageSize = 40;
    let pageNoList = [];
    let trades = [];

    const getNeedNumByPage = (page) => {
        return new Promise(resolve => {
            qnRouter({
                api: 'taobao.trades.sold.get',
                params: {
                    rate_status: "RATE_UNSELLER",
                    status: "TRADE_FINISHED",
                    fields: 'tid, end_time',
                    type: soldget_all_type,
                    pageNo: page,
                    pageSize: pageSize,
                },
                callback: (rsp) => {
                    const respons = resolveTopResponse(rsp);
                    if (respons.trades) {
                        trades = [...trades, ...getTrades(respons)];
                    }
                },
                errCallback: (err) => {
                    console.error('errmsg', err);
                },
            });
        });
    };

    // 先获取总数判断调接口次数
    new Promise(resolve => {
        qnRouter({
            api: 'taobao.trades.sold.get',
            params: {
                rate_status: 'RATE_UNSELLER',
                status: 'TRADE_FINISHED',
                fields: 'tid, end_time',
                type: soldget_all_type,
                pageNo: 1,
                pageSize: pageSize,
            },
            callback: (rsp) => {
                const respons = resolveTopResponse(rsp);
                let totalResults = respons.total_results;
                // 只有一页待评价订单
                if (totalResults > pageSize) {
                    const length = totalResults > 200 ? Math.ceil(200 / pageSize) : Math.ceil(totalResults / pageSize);
                    pageNoList = new Array(length).fill('');
                } else if (respons.trades) {
                    trades = getTrades(respons);
                }
                resolve();
            },
            errCallback: (err) => {
                console.error('errmsg', err);
            },
        });
    }).then(() => {
        const resolveTrades = (trades) => {
            trades = trades.filter((trade) => moment().diff(trade.end_time, 'days') < 15);
            let totalResults = trades.length;
            callback(totalResults);
        };

        if (!isEmpty(trades)) {
            resolveTrades(trades);
            return;
        }

        pageNoList = pageNoList.map((item, page) => {
            return getNeedNumByPage(page);
        });
        Promise.all(() => {
            resolveTrades(trades);
        });
    });
}

/**
 * 获取退款中状态数量，以oder为数量
 * @param callback
 */
export function getRefundsAllNum ({ callback = NOOP }) {
    const argsArr = [
        {},
        { status: 'CLOSED' },
        { status: 'SUCCESS' },
    ];
    const promiseArr = argsArr.map((args) => {
        return new Promise((resolve) => {
            qnRouter({
                api: 'taobao.refunds.receive.get',
                params: {
                    fields: 'refund_id,status,tid',
                    start_modified: moment().subtract(90, 'd').format('YYYY-MM-DD 00:00:00'),
                    end_modified: moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
                    pageNo: 1,
                    pageSize: 1,
                    ...args,
                },
                callback: (rsp) => {
                    const respons = resolveTopResponse(rsp);
                    let totalResults = respons.total_results;
                    resolve(totalResults);
                },
                errCallback: (err) => {
                    resolve(0);
                    console.error('errmsg', err);
                },
            });
        });
    });
    Promise.all(promiseArr).then((result) => {
        let num = result[0] - result[1] - result[2];
        num = num < 0 ? 0 : num;
        callback(num);
    });
}
