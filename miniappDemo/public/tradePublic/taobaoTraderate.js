import qnRouter from "tradePublic/qnRouter";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { getSettings } from "mapp_common/utils/settings";
import { Logger } from "tradePolyfills/index";

/**
 * 新增单个评价
 * @param query
 * @param callback
 * @param errCallback
 */
export function taobaoTraderateAdd ({ tid, oid, result, content, role = 'seller', anony = false, callback, errCallback = handleError }) {
    if (getSettings().editApiTest == 1) {
        Logger.log({ tid, oid, result, content, role, anony  });
        setTimeout(() => {
            callback();
        }, 200);
        return;
    }
    qnRouter({
        api:'taobao.traderate.add',
        params:{ tid, oid, result, content, role, anony },
        callback:(res) => {
            if (resolveTopResponse(res).trade_rate.created) {
                callback(res);
            }
        },
        errCallback:errCallback,
    });
}

/**
 * 针对父子订单新增批量评价
 * @param tid
 * @param result
 * @param content
 * @param role
 * @param anony
 * @param callback
 * @param errCallback
 */
export function taobaoTraderateListAdd ({ tid, result, content, role = 'seller', anony = false, callback, errCallback = handleError }) {
    if (getSettings().editApiTest == 1) {
        Logger.log({ tid, result, content, role, anony  });
        setTimeout(() => {
            callback();
        }, 200);
        return;
    }
    qnRouter({
        api:'taobao.traderate.list.add',
        params:{ tid,  result, content, role, anony },
        callback:(res) => {
            if (resolveTopResponse(res).trade_rate.created) {
                callback(res);
            }
        },
        errCallback:errCallback,
    });
}
