import { qnRouter } from "tradePublic/qnRouter";
import { NOOP } from "tradePolyfills/index";
import { getArrayByKey, getOrders, resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";


export const taobaoTraderatesGet = ({ query, callback = NOOP, errCallback = NOOP }) => {
    qnRouter({
        api:'taobao.traderates.get',
        params: query,
        callback:(rsp) => {
            callback(rsp);
        },
        errCallback:(err) => {
            errCallback();
            console.error('errmsg', err);
        },
    });
};

export const getBuyerRateInfo = (trade) => {
    return new Promise((resolve) => {
        taobaoTraderatesGet({
            query:{
                fields:'nick,result,content,created,oid,tid',
                rate_type:'get',
                role:'buyer',
                tid: trade.tid,
            },
            callback:(buyer_rsp) => {
                buyer_rsp = resolveTopResponse(buyer_rsp);
                let trade_rates = getArrayByKey('trade_rate', buyer_rsp);
                if(buyer_rsp.total_results != 0) {
                    const buyerRateInfo = {};
                    trade_rates.forEach((rate) => {
                        buyerRateInfo[rate.oid] = rate;
                    });
                    getOrders(trade).map((order) => {
                        order.buyerRateInfo = buyerRateInfo[order.oid];
                        return order;
                    });
                    trade.buyerRateInfo = trade_rates;
                }
                resolve();
            },
            errCallback:(err) => {
                resolve();
                console.error('获取买家评价信息失败！', err);
            },
        });
    });
};

export const getSellerRateInfo = (trade) => {
    return new Promise((resolve) => {
        taobaoTraderatesGet({
            query:{
                fields:'nick,result,content,created,oid,tid',
                rate_type:'give',
                role:'seller',
                tid:trade.tid,
            },
            callback:(seller_rsp) => {
                seller_rsp = resolveTopResponse(seller_rsp);
                if(seller_rsp.total_results != 0) {
                    const sellerRateInfo = {};
                    let trade_rate = getArrayByKey('trade_rate',seller_rsp);
                    trade_rate.forEach((rate) => {
                        sellerRateInfo[rate.oid] = rate;
                    });
                    getOrders(trade).map((order) => {
                        order.sellerRateInfo = sellerRateInfo[order.oid];
                        return order;
                    });
                    trade.sellerRateInfo = trade_rate;
                }
                resolve();
            },
            errCallback:(err) => {
                resolve();
                console.error('获取卖家评价信息失败！', err);
            },
        });
    });
};
