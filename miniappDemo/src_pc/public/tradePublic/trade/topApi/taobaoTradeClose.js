import { qnRouter } from "tradePublic/qnRouter";
import { Logger, getSettings} from "tradePolyfills/index";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 评价
 * @param query
 * @param callback
 * @param errCallback
 */
export function taobaoTradeClose ({ query, callback, errCallback = undefined }) {
    if (getSettings().editApiTest == 1) {
        Logger.log(query);
        setTimeout(() => {
            callback();
        }, 200);
        return;
    }
    if (getSettings().editApiErrorMock == 1) {
        query.tid = 'hahah';
    }
    qnRouter({
        api : 'taobao.trade.close',
        params : {
            tid:query.tid,
            mainTid: query.mainTid,
            close_reason:query.close_reason,
        },
        callback:(rsp) => {
            callback(rsp);
        },
        errCallback:(error) => {
            if (errCallback) {
                errCallback(error);
            } else {
                showErrorDialog('温馨提示', '关闭订单失败，请稍候再试！', JSON.stringify(error));
            }
        },
    });
}
