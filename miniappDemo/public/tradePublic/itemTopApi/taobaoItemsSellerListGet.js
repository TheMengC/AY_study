import { NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse ,integrationDate} from "tradePublic/tradeDataCenter/common/resolveTopResponse";
const FIELDS = 'num_iid,title,nick,price,cid,pic_url,list_time,is_timing,delist_time,has_showcase,approve_status,num,title,outer_id,price,post_fee,express_fee,ems_fee,skus,sku,skus.sku_id,property_alias,props,props_name,sub_stock,has_discount,has_invoice,has_warranty,freight_payer,postage_id,is_fenxiao,barcode,wireless_desc,desc,sell_point,seller_cids,item_img,global_stock_country,global_stock_type,global_stock_delivery_place';
/**
 * 批量获取商品信息
 * @param num_iids 商品数字id列表，多个num_iid用逗号隔开，一次不超过50个。
 * @param fields
 * @param callback
 * @param errCallback
 */
export function taobaoItemsSellerListGet ({ num_iids, fields = FIELDS, callback = NOOP, errCallback = handleError }) {
    return new Promise((resolve, reject)=>{
        qnRouter({
            api: 'taobao.items.seller.list.get',
            params: {
                num_iids,
                fields,
            },
            callback: res => {
                resolve(integrationDate(resolveTopResponse(res),"item"));
                callback( integrationDate(resolveTopResponse(res),"item"));
            },
            errCallback: err => {
                reject(err);
                errCallback
            },
        });
    });
}
