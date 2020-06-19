import { qnRouter } from "tradePublic/qnRouter";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 修改运费
 * @param query
 * @param callback
 * @param errCallback
 */
export function taobaoTradePostageUpdate ({ query, callback, errCallback = undefined }) {
    qnRouter({
        api : 'taobao.trade.postage.update',
        params : {
            tid  : query.tid,
            post_fee : query.post_fee,
        },
        callback:(rsp) => {
            callback(rsp);
        },
        errCallback:(error) => {
            if (errCallback) {
                errCallback(error);
            } else {
                showErrorDialog('温馨提示', '一键免邮失败，请稍候再试！', JSON.stringify(error));
            }
        },
    });
}
