import { NOOP } from "mapp_common/utils";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

/**
 * 批量获取商品信息
 * @param num_iids 商品数字id列表，多个num_iid用逗号隔开，一次不超过50个。
 * @param fields
 * @param callback
 * @param errCallback
 */
export function taobaoItemsSellerListGet ({ num_iids, fields = 'num_iid,title,nick,pic_url,price', callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: 'taobao.items.seller.list.get',
        params: {
            num_iids,
            fields,
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}