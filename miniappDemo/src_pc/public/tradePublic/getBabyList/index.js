import {taobaoItemListGet} from "tradePublic/itemTopApi/taobaoItemListGet"
/**
 * 
 * @param {status} 出售中还是仓库中
 * @param  {callback} 成功回调
 */
export  function getBabyList({status,callback,extraArgs,page_no = 1, page_size = 20}){
    taobaoItemListGet({
        page_no,
        page_size ,
        status,
        fields:"total_results,nick,type,valid_thru,has_discount,has_invoice,has_warranty,modified,seller_cids,list_time,pic_url,sold_quantity,postage_id,outer_id,title,num,price,num_iid,delist_time,has_showcase,approve_status,total_results,cid,props,props_name",
        extraArgs,
        callback:res => callback({
            arr:res.total_results ? res.items.item : [],
            total:res.total_results 
        }),
    })
} 