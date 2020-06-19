import { qnRouter } from "tradePublic/qnRouter";
import { NOOP } from "tradePublic/consts";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

/**
 * 更新交易的销售sku sku_id和sku_props 两个需要传一个
 * https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.14db669a5UxDBS&source=search&docId=240&docType=2
 * @param tid
 * @param oid
 * @param sku_id
 * @param sku_props
 * @param callback
 * @param errCallback
 */
export function orderskuUpdate ({
    tid, oid, sku_id, sku_props,
    callback = NOOP,
    errCallback = handleError,
}) {
    let params = { tid, oid };
    if (sku_id) {
        params.sku_id = sku_id;
    }else{
        params.sku_props = sku_props;
    }
    qnRouter({
        api: 'taobao.trade.ordersku.update',
        params,
        callback: (rsp) => {
            if (resolveTopResponse(rsp).order.modified){
                callback(rsp);
            }else{
                errCallback(rsp);
            }
        },
        errCallback: errCallback,
    });
};
