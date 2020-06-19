import { NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse, getArrayByKey, integrationDate } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

let FIELDS = "total_results,nick,type,valid_thru,has_discount,has_invoice,has_warranty,modified,seller_cids,list_time,pic_url,sold_quantity,postage_id,outer_id,title,num,price,num_iid,delist_time,has_showcase,approve_status,total_results,cid,props,props_name";
let defaultOnsaleMethod = "taobao.items.onsale.get";
let defaultInventoryMethod = "taobao.items.inventory.get";
 /**
 * 获取出售中/仓库中宝贝列表 https://open.taobao.com/api.htm?docId=162&docType=2&source=search/ https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.1a79669aVXbydp&source=search&docId=18&docType=2
 * @param fields
 * @param page_no
 * @param page_size
 * @param status  出售中/仓库中/已售完
 * @param callback
 * @param errCallback
 */
export function taobaoItemListGet ({ fields = FIELDS, page_no = 1, page_size = 20, status, extraArgs = {}, callback = NOOP, errCallback = handleError }) {
    let method = defaultOnsaleMethod;
    let banner = '';
    switch(status){
        case '出售中':
            method = defaultOnsaleMethod;
        break;
		case '仓库中':
            method = defaultInventoryMethod;
		break;
		case '已售完':
            method = defaultInventoryMethod;
			banner = "sold_out";
		break;
	}

    qnRouter({
        api: method,
        params: {
            fields,
            page_no,
            page_size,
            banner,
            ...extraArgs,
        },
        callback: res => {
            res = resolveTopResponse(res)
            res = integrationDate(res, 'item', true);
            callback(res);
        },
        errCallback: errCallback,
    });
}
