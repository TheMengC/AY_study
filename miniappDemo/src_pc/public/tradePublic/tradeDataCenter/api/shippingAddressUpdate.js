import { getFlatTrades } from "tradePublic/tradeDataCenter";
import { qnRouter } from "tradePublic/qnRouter";
import { pgApiHost } from "tradePublic/tradeDataCenter/consts";
import { api, getUserInfo} from "tradePolyfills/index";
import { NOOP } from "tradePublic/consts";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 修改地址
 * @param trade
 * @param address
 * @param callback
 * @param errCallback
 * @returns {void}
 */
export function shippingAddressUpdate ({ trade, address, callback = NOOP, errCallback = NOOP }) {
    let successSubTrades = [];
    let errorSubTrades = [];
    let query = {};
    Object.keys(address).map(key => {
        if (key != 'receiver_address') {
            query[key] = address[key].replace(/\s/g, '');
        }else{
            query[key] = address[key];
        }
    });
    Promise.all(getFlatTrades(trade).map(subTrade => {
        return new Promise(resolve => {
            qnRouter({
                api: 'taobao.trade.shippingaddress.update',
                params: {
                    tid: subTrade.tid,
                    ...query,
                },
                callback: () => {
                    successSubTrades.push(subTrade);
                    resolve();
                },
                errCallback: (error) => {
                    errorSubTrades.push({
                        trade: subTrade,
                        msg: error,
                    });
                    resolve();
                },
            });
        });
    })).then(() => {

        if (successSubTrades.length == 0) {
            showErrorDialog('温馨提示', '修改地址失败！' + errorSubTrades.map(item => item.msg.sub_msg).join(','), errorSubTrades.map(item => item.msg));
            errCallback(query);
            return;
        }
        if (errorSubTrades.length != 0) {
            showErrorDialog('温馨提示', '修改地址部分失败！' + errorSubTrades.map(item => item.msg.sub_msg).join(','), errorSubTrades.map(item => item.msg));
        }
        if (getUserInfo().vipFlag == 0) {
            callback(query);
            return;
        }
        if (trade.mergeTid) {
            query.mergeTid = trade.mergeTid;
        }
        api({
            apiName:'aiyong.trade.order.address.update',
            host: pgApiHost,
            method: '/order/updateAddressLevelUp',
            loading: false,
            mode: 'json',
            args: {
                ...query,
                tids: successSubTrades.map(trade => trade.tid),
            },
            callback: (res) => {
                if (res.body && res.body.mergeTradeChange) {
                    query.mergeTradeChange = true;
                }
                callback(query);
            },
            errCallback: () => {
                errCallback(query);
            },
        });
    });
}
