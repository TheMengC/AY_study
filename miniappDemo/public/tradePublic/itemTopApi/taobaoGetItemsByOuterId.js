import { NOOP, isEmpty } from "tradePolyfills";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse, integrationDate } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

let FIELDS = "total_results,nick,type,valid_thru,has_discount,has_invoice,has_warranty,modified,seller_cids,list_time,pic_url,sold_quantity,postage_id,outer_id,title,num,price,num_iid,delist_time,has_showcase,approve_status,total_results,cid,props,props_name";

/**
 * 通过商家编码(outer_id)获取宝贝信息
 * @param fields 宝贝信息中的属性
 * @param order_by 排序方式
 * @param seller_cids 筛选（属于哪个分类）
 * @param outer_id 商家编码
 * @param callback
 * @param errCallback
 */
export function taobaoGetItemsByOuterId({fields=FIELDS, order_by = undefined, seller_cids = undefined, outer_id, callback = NOOP, errCallback = handleError}) {
    qnRouter({
        api:'taobao.items.custom.get',
        params: {
            fields,
            order_by,
            seller_cids,
            outer_id
        },
        callback: result => {
            result = resolveTopResponse(result);
            result = integrationDate(result, 'item', true);
            let item;
            try {
                item = result.items.item;
            } catch (e) {
                item = undefined;
            }
            if (!isEmpty(order_by) && (order_by === "delist_time:desc" || order_by === "delist_time:asc" || order_by === "num:desc" || order_by === "num:asc" || order_by === 'sold_quantity:desc' || order_by === 'sold_quantity:asc')) {
                if (item) {
                    //开始排序
                    if (order_by === "delist_time:desc") {
                        item.sort(function(a,b){
                            let msA = a.delist_time ? getDelistTime(a) : 0;
                            let msB = b.delist_time ? getDelistTime(b) : 0;
                            return msB - msA;
                        });
                    }else if (order_by === "delist_time:asc") {
                        item.sort(function(a,b){
                            let msA = a.delist_time ? getDelistTime(a) : 0;
                            let msB = b.delist_time ? getDelistTime(b) : 0;
                            return msA - msB;
                        });
                    }else if (order_by === "num:desc") {
                        item.sort(sortBy('num', true))
                    }else if (order_by === "num:asc") {
                        item.sort(sortBy('num', false))
                    } else if (order_by === 'sold_quantity:desc') {
                        item.sort(sortBy('sold_quantity', true))
                    } else if (order_by === 'sold_quantity:asc') {
                        item.sort(sortBy('sold_quantity', false))
                    }
                }
            }
            if (!isEmpty(seller_cids)){//筛选分类
                if (item) {
                    for (let i = item.length - 1 ; i >= 0;i--) {
                        if (!isEmpty(item[i].seller_cids) && item[i].seller_cids) {
                            let piece = item[i].seller_cids.split(',');
                            let isExist = false;
                            for (let j in piece) {
                                if (!isEmpty(piece[j])) {
                                    if (seller_cids.includes(piece[j])) {
                                        isExist = true;
                                    }
                                }
                                if (j == piece.length - 1) {
                                    if (!isExist) {
                                        item.splice(i,1);
                                    }
                                }
                            }
                        }else{
                            item.splice(i,1);
                        }
                    }
                }
            }
            callback(item);
        },
        errCallback: errCallback,
    })
}

/**
 * 获取下架时间
 * @param item
 * @returns {number}
 */
function getDelistTime(item) {
    return new Date(item.delist_time.replace(/-/g,'/')).getTime()
}

/**
 * 排序的方法
 * @param key 排序属性值
 * @param isDesc 是否是降序
 * @param dataConvert
 * @returns {function(*, *): number}
 */
function sortBy (key, isDesc, dataConvert = (item) => item) {
    return function (a, b) {
        return (dataConvert(a[key]) - dataConvert(b[key])) * (isDesc ? -1 : 1)
    };
}
