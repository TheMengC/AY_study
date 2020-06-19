import { NOOP } from "tradePublic/consts";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";

/**
 * 获取单个商品详细信息
 * https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.1b14669afEtmka&source=search&docId=24625&docType=2
 * @param num_iid
 * @param fields
 * @param callback
 * @param errCallback
 */
export function itemSellerGet ({
    num_iid,
    fields = 'sku.sku_id,sku.properties_name,sku.properties,sku.quantity,sku.price,sku.outer_id,outer_id,property_alias,num_iid,title',
    callback = NOOP,
    errCallback = handleError,
}) {
    qnRouter({
        api: 'taobao.item.seller.get',
        params: {
            fields,
            num_iid,
        },
        callback:(res) => {
            if (resolveTopResponse(res).item) {
                callback(resolveTopResponse(res).item);
            }else{
                errCallback(res);
            }
        },
        errCallback:errCallback,
    });
};

