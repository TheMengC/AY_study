import { NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse, integrationDate } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
let taobaoItemSellerGet = 'taobao.sellercats.list.get';

/**
 * 获取前台展示的店铺内卖家自定义商品类目
 * https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.7d7e669aRtqf0m&source=search&docId=65&docType=2
 * @param callback
 * @param errCallback
 */
export function taobaoSellercatsGet ({callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: taobaoItemSellerGet,
        callback: res => {
            res = resolveTopResponse(res)
            res = integrationDate(res, 'seller_cat', false);
            callback(res);
        },
        errCallback: errCallback,
    });
}