import { api, ENV, getDeferred, NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { taobaoItemsSellerListGet } from "tradePublic/taobaoItemsSellerListGet";
import taobaoSellercatsListGet from "tradePublic/taobaoSellercatsListGet";
import { taobaoItemsOnsaleGet } from "tradePublic/taobaoItemsOnsaleGet";
import { getArrayByKey, getItems, getSellerCats } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { getDataDeferred } from "tradePublic/utils";

export const titlesIndexedByIid = {};
let titlesDeferred;


/**
 * 获取商品简称的接口
 * @param callback
 * @param errCallback
 */
export function itemShortTitleGet ({ callback = NOOP, errCallback = handleError }) {
    api({
        host: ENV.hosts.trade,
        apiName: 'aiyong.item.shorttitle.get',
        method: '/iyprint2/getTitleNew',
        callback: res => {
            res.map(item => {
                titlesIndexedByIid[item.num_iid] = item.uptitle;
            });
            callback(res.filter(item => item.num_iid != '${num_iid}' && item.num_iid != 'undefined' && item.uptitle));
        },
        errCallback: () => {
            errCallback();
        },
    });
}


/**
 * 获取商品简称返回promise且只获取一次
 * @returns {Promise<unknown>}
 */
export function itemShortTitleGetDeferred () {
    if (!titlesDeferred) {
        titlesDeferred = getDeferred();
        itemShortTitleGet({
            callback: () => {
                titlesDeferred.resolve(titlesIndexedByIid);
            },
            errCallback:() => {
                titlesDeferred = null;
            },
        });
    }
    return titlesDeferred;
}

/**
 * 设置商品简称
 * @param title
 * @param num_iid
 * @param uptitle
 * @param callback
 * @param errCallback
 */
export function itemShortTitleSet ({ title, num_iid, shortTitle, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.shorttitle.save',
        host:ENV.hosts.trade,
        method:'/print/setItemTitle',
        args:{ title, num_iid, uptitle:shortTitle },
        callback,
        errCallback,
    });
}

/**
 * 批量获取商品信息
 * @param num_iids
 * @param fields
 * @param callback
 * @param errCallback
 */
export function getItemsByNumIids ({ num_iids = [], fields = 'num_iid,title,nick,pic_url,price,outer_id,sku.properties_name,sku.outer_id,sku.price', callback = NOOP, errCallback = handleError }) {
    taobaoItemsSellerListGet({
        num_iids:num_iids.join(','),
        fields,
        callback: res => callback(getItems(res)),
        errCallback,
    });
}

/**
 * 获取在售的商品
 * @param pageNo
 * @param pageSize
 * @param queryArgs
 * @param callback
 * @param errCallback
 */
export function getItemsOnsale ({ pageNo, pageSize, queryArgs = {}, callback = NOOP, errCallback = handleError }) {
    taobaoItemsOnsaleGet({
        page_no:pageNo,
        page_size:pageSize,
        extraArgs:queryArgs,
        callback:res => callback({
            items:res.total_results ? getItems(res) : [],
            totalResults:res.total_results,
        }),
        errCallback,
    });
}

let sellerCatsList = [];

const initSellerCatsList = getDataDeferred(taobaoSellercatsListGet, res => {
    sellerCatsList = (res.seller_cats ? getSellerCats(res) : []);
});

/**
 * 获取商品类目
 * @param refresh
 * @returns {Promise<[]>}
 */
export async function getSellerCatsList ({ refresh = false } = {}) {
    await initSellerCatsList({ refresh });
    return sellerCatsList;
}

export const UNCLASSIFIED_CID = '-1';

/**
 * 获取商品分类的 cid  如果存在二级分类 就把二级分类的cid拼起来
 * @param sellerCatItem
 * @returns {number | string}
 */
export function getSellerCids (sellerCatItem) {
    let sellerCids = sellerCatItem.cid;
    if (!sellerCatItem.parent_cid) {
        // 可能存在二级分类
        let childrenCats = sellerCatsList.filter(item => item.parent_cid === sellerCatItem.cid);
        if (childrenCats.length) {
            sellerCids = childrenCats.map(item => item.cid).join(',');
        }
    }
    return sellerCids;
}

/**
 *
 * @param callback
 * @param errCallback
 */
export function itemCostPriceGet ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.priceweight.get',
        host:ENV.hosts.trade,
        method:'/print/getPriceWeight',
        args:{
            type:'price',
            page:1,
            page_size:1000, // 这里我需要获取商品对应成本价的索引表，所以一次性把所有的数据都拿出来
        },
        callback,
        errCallback,
    });
}

/**
 * 设置成本价
 * @param properties
 * @param num_iid
 * @param price
 * @param title
 * @param callback
 * @param errCallback
 */
export function itemCostPriceSet ({ properties, num_iid, price, title, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.costprice.set',
        host:ENV.hosts.trade,
        method:'/iyprint2/saveprice',
        args:{
            properties, // 我也搞不懂为啥要传一张主图上去
            num_iid,
            price,
            title,
        },
        callback,
        errCallback,
    });
}

/**
 * 批量删除商品成本价的接口
 * @param num_iids
 * @param callback
 * @param errCallback
 */
export function itemCostPriceRemove ({ num_iids = [], callback = NOOP, errCallback = handleError }) {
    api({
        host:ENV.hosts.trade,
        method:'/print/deleteTitleOrSet',
        args:{
            type:'price',
            num_iids,
        },
        callback,
        errCallback,
    });
}

/**
 * 商品重量获取API
 * @param callback
 * @param errCallback
 */
export function itemWeightGet ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.priceweight.get',
        host:ENV.hosts.trade,
        method:'/print/getPriceWeight',
        args:{
            type:'width', // weight ??  我也不知道这个鬼接口是谁写的
            page:1,
            page_size:1000, // 这里我需要获取商品对应重量的索引表，所以一次性把所有的数据都拿出来
        },
        callback,
        errCallback,
    });
}

/**
 * 商品重量设置API
 * @param properties
 * @param num_iid
 * @param weight
 * @param title
 * @param callback
 * @param errCallback
 */
export function itemWeightSet ({ properties, num_iid, weight, title, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.weight.save',
        host:ENV.hosts.trade,
        method:'/iyprint2/saveWidth',
        args:{
            properties,
            num_iid,
            width:weight, // weight 写成 width 我也是佛了
            title,
        },
        callback,
        errCallback,
    });
}

/**
 * 取消商品重量设置
 * @param num_iids
 * @param callback
 * @param errCallback
 */
export function itemWeightRemove ({ num_iids = [], callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.priceweight.delete',
        host:ENV.hosts.trade,
        method:'/print/deleteTitleOrSet',
        args:{
            type:'width',
            num_iids,
        },
        callback,
        errCallback,
    });
}

export const NO_SKU_KEY = '无属性';

/**
 * 获取商品sku的组合列表
 * @param item
 * @returns {[]}
 */
export function generateSkusList (item) {
    let skuPropertiesList = [];
    if (!item.skus) {
        skuPropertiesList.push({ name:NO_SKU_KEY, outer_id: '', price:item.price });
    }else {
        getArrayByKey('sku', item).map(item => {
            let propertyNameArr = [];
            item.properties_name.split(';').map(item => {
                let skuPropertyItem = item.split(':');
                propertyNameArr.push(`${skuPropertyItem[2]}:${skuPropertyItem[3]}`);
            });
            skuPropertiesList.push({ name: propertyNameArr.join(';'), outer_id: item.outer_id, price: item.price });
        });
    }
    return skuPropertiesList;
}

/**
 * 获取商品价格区间
 * @param item
 * @returns {string}
 */
export function getItemPriceRangeFormat (item) {
    if (!item.skus) {
        // 没有sku
        return `￥${item.price}`;
    }else{
        let priceList = getArrayByKey('sku', item).map(item => item.price);
        if (priceList.some(item => item !== priceList[0])) {
            return `￥${Math.min(...priceList)}~￥${Math.max(...priceList)}`;
        }else{
            return `￥${priceList[0]}`;
        }
    }
}
