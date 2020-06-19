import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";
import { aiyongApiList } from "tradePublic/tradeDataCenter/consts";
import { NOOP } from "tradePublic/consts";

/**
 * 获取拉单状态与数量
 */
export function getOrderSyncProgress (callback = NOOP) {
    pgApi({
        api:aiyongApiList.saveOrderProcess,
        callback:(rsp) => {
            callback(rsp.body);
        },
    });
}