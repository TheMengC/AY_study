import { NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

let defaultDelistingMethod = 'taobao.item.update.delisting';
let defaultListingMethod = 'taobao.item.update.listing';
let defaultDeleteMethod = 'taobao.item.delete';

 /**
 * 操作宝贝上下架删除
 * @param fields
 * @param page_no 
 * @param num_iid 
 * @param num
 * @param status  delisting（下架）/listing（上架）仓库中/delete（删除）
 * @param callback
 * @param errCallback
 */
export function taobaoItemOper ({ num_iid, status, num = undefined, callback = NOOP, errCallback = handleError }) {
    let method = defaultDelistingMethod;
    let query = {};
    query.num_iid = num_iid;
    switch(status){
        case 'delisting':
            method = defaultDelistingMethod;
        break;
		case 'listing':
            method = defaultListingMethod;
            query.num = num;
		break;
		case 'delete':
            method = defaultDeleteMethod;
		break;
	}
    
    qnRouter({
        api: method,
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}