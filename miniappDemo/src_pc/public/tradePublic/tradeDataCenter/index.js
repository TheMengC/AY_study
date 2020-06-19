import { isEmpty } from "tradePolyfills/index";

export function getFlatTrades (trades) {
    if (!trades) {
        return [];
    }
    !Array.isArray(trades) && (trades = [trades]);
    trades = trades.filter(Boolean);
    let flatTrades = [];
    trades.map(trade => {
        if (trade.mergeTid) {
            Array.prototype.push.apply(flatTrades, trade.trades);
        } else{
            flatTrades.push(trade);
        }
    });
    return flatTrades;
}

/**
 * 获取订单的payFee
 * @param order
 * @return {string}
 */
export function getOrderPayFee (order) {
    return (Number(order.price) + Number(order.adjust_fee) - Number(order.discount_fee)).toFixed(2);
}

/**
 * 获取订单的商家编码
 * @param order
 * @return {string|*}
 */
export function getOrderOuterId (order) {
    if (!isEmpty(order.outer_sku_id)) {
        return order.outer_sku_id;
    }else if (!isEmpty(order.outer_iid)) {
        return order.outer_iid;
    }
    return '';
}
