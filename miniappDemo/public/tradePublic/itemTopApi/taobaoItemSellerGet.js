import { NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse, integrationDate } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

const FIELDS = 'num_iid,title,nick,price,cid,pic_url,list_time,is_timing,delist_time,has_showcase,approve_status,num,title,outer_id,price,post_fee,express_fee,ems_fee,skus,sku,skus.sku_id,property_alias,props,props_name,sub_stock,has_discount,has_invoice,has_warranty,freight_payer,postage_id,is_fenxiao,barcode,wireless_desc,desc,sell_point,seller_cids,item_img,global_stock_country,global_stock_type,global_stock_delivery_place';

/**
 * 获取单个商品的全部信息
 * https://open.taobao.com/api.htm?docId=24625&docType=2
 * @param fields
 * @param num_iid 
 * @param callback
 * @param errCallback
 */
export function taobaoItemSellerGet ({ fields = FIELDS, num_iid, callback = NOOP , errCallback = handleError }) {
    qnRouter({
        api: 'taobao.item.seller.get',
        params: {
            fields,
            num_iid
        },
        callback: res => {
            res = resolveTopResponse(res);
            if(res.item && res.item.skus && !res.item.skus.sku){
                let newsku = integrationDate(res.item,'sku',false);
                let newpropsImg = integrationDate(res.item,'prop_img',false);
                res.item.skus =  newsku.skus;
                res.item.prop_imgs =  newpropsImg.prop_imgs;
            }
            let newitemImg = integrationDate(res.item,'item_img',false);
            res.item.item_imgs =  newitemImg.item_imgs;
            callback(res);
        },
        errCallback: errCallback,
    });
}