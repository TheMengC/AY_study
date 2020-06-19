import Taro from "@tarojs/taro";
import { NOOP } from "mapp_common/utils";
import { itemCostPriceGet, itemCostPriceRemove,
    itemCostPriceSet,
    itemShortTitleGet,
    itemShortTitleSet, itemWeightGet, itemWeightRemove, itemWeightSet,
    NO_SKU_KEY } from "tradePublic/itemSettings";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { getDataDeferred } from "tradePublic/utils";

let app = Taro.getApp();

export function itemShortTitleMap_dispatch (itemShortTitleMap) {
    app.store.dispatch({ type: 'ITEM_SHORT_TITLE_MAP_CHANGE', itemShortTitleMap });
}

export const initItemShortTitleMap = getDataDeferred(itemShortTitleGet, res => {
    let itemShortTitleMap = {};
    res.filter(item =>
        item.num_iid != '${num_iid}' && item.num_iid != 'undefined' && item.uptitle)
        .map(item => itemShortTitleMap[item.num_iid] = item.uptitle);
    itemShortTitleMap_dispatch(itemShortTitleMap);
});

/**
 * 获取商品简称 Map num_iid => sortTitle
 */
export async function getItemShortTitleMap ({ refresh = false }) {
    await initItemShortTitleMap({ refresh });
    return app.store.getState().itemSettingsReducer.itemShortTitleMap;
}

/**
 * 设置商品简称
 * @param title
 * @param num_iid
 * @param shortTitle
 * @param callback
 * @param errCallback
 */
export function setItemShortTitle ({ title, num_iid, shortTitle, callback = NOOP, errCallback = handleError }) {
    itemShortTitleSet({
        title, num_iid, shortTitle,
        callback: res => {
            let { itemShortTitleMap } = app.store.getState().itemSettingsReducer;
            if (shortTitle) {
                itemShortTitleMap[num_iid] = shortTitle;
            }else{
                delete itemShortTitleMap[num_iid];
            }
            itemShortTitleMap_dispatch(itemShortTitleMap);
            callback(res);
        },
        errCallback,
    });
}

export function itemCostPriceMap_dispatch (itemCostPriceMap) {
    app.store.dispatch({ type: 'ITEM_COST_PRICE_MAP_CHANGE', itemCostPriceMap });
}

export const initItemCostPriceMap = getDataDeferred(itemCostPriceGet, res => {
    if (!res.rsp) {
        itemCostPriceMap_dispatch({});
    }
    let itemCostPriceMap = {};
    res.rsp && res.rsp.map(item => {
        if (item.price === '无属性|Y|') { // 这个是还没有设置成本价的商品
            return;
        }
        let skuToPriceMap = {};
        item.price.split('|X|').map(item => {
            let data = item.split('|Y|');
            skuToPriceMap[data[0]] = data[1];
        });
        itemCostPriceMap[item.num_iid] = skuToPriceMap;
    });
    itemCostPriceMap_dispatch(itemCostPriceMap);
});

/**
 * 获取商品成本价
 * @param refresh
 * @returns {Promise<void>}
 */
export async function getItemCostPriceMap ({ refresh = false } = {}) {
    await initItemCostPriceMap({ refresh });
    return app.store.getState().itemSettingsReducer.itemCostPriceMap;
}

/**
 * 设置商品成本价
 * @param item
 * @param skuToPriceMap
 * @param callback
 * @param errCallback
 */
export function setItemCostPrice ({ item, skuToPriceMap, callback = NOOP, errCallback = handleError }) {
    let priceStr = '';
    if (!item.skus) {
        // 没有sku
        priceStr = `${NO_SKU_KEY}|Y|${skuToPriceMap[NO_SKU_KEY]}`;
    }else{
        let priceArr = [];
        Object.keys(skuToPriceMap)
            .filter(key => skuToPriceMap[key])
            .map(key => priceArr.push(`${key}|Y|${skuToPriceMap[key]}`));
        priceStr = priceArr.join('|X|');
    }
    itemCostPriceSet({
        properties:item.pic_path,
        num_iid:item.num_iid,
        price:priceStr,
        title:item.title,
        callback:res => {
            itemCostPriceMap_dispatch({ ...app.store.getState().itemSettingsReducer.itemCostPriceMap, [item.num_iid]:skuToPriceMap });
            callback(res);
        },
        errCallback,
    });
}

/**
 * 批量删除商品成本价
 * @param num_iids
 * @param callback
 * @param errCallback
 */
export function batchRemoveItemCostPrice ({ num_iids = [], callback = NOOP, errCallback = handleError }) {
    itemCostPriceRemove({
        num_iids,
        callback:(res) => {
            let itemCostPriceMap = { ...app.store.getState().itemSettingsReducer.itemCostPriceMap };
            num_iids.map(value => delete itemCostPriceMap[value]);
            itemCostPriceMap_dispatch(itemCostPriceMap);
            callback(res);
        },
        errCallback,
    });
}

/**
 * 删除商品成本价
 * @param num_iid
 * @param callback
 * @param errCallback
 */
export function removeItemCostPrice ({ num_iid, callback = NOOP, errCallback = handleError }) {
    batchRemoveItemCostPrice({ num_iids:[num_iid], callback, errCallback });
}

/**
 * 生成列表的成本价
 * @param item
 * @returns {string|*}
 */
export function getItemCostPriceFormat (item) {
    let skuToPriceMap  = { ...app.store.getState().itemSettingsReducer.itemCostPriceMap[item.num_iid] };
    if (Object.keys(skuToPriceMap).length > 1) {
        // 存在sku
        delete skuToPriceMap[NO_SKU_KEY];// 去掉无属性的值
        let priceList = Object.values(skuToPriceMap);
        if (priceList.some(item => item !== priceList[0])) { // 判断数组中的值是否全部相等
            return `￥${Math.min(...priceList)}~￥${Math.max(...priceList)}`;
        }else {
            return `￥${priceList[0]}`;
        }
    }else{
        return `￥${skuToPriceMap[NO_SKU_KEY]}`;
    }
}

export function itemWeightMap_dispatch (itemWeightMap) {
    app.store.dispatch({ type: 'ITEM_WEIGHT_MAP_CHANGE', itemWeightMap });
}

export const initItemWeightMap = getDataDeferred(itemWeightGet, res => {
    if (!res.rsp) {
        itemWeightMap_dispatch({});
    }
    let itemWeightMap = {};
    res.rsp && res.rsp.map(item => {
        if (item.width === '无属性|Y|') { // 这个是还没有设置成本价的商品
            return;
        }
        let skuToWeightMap = {};
        item.width.split('|X|').map(item => {
            let data = item.split('|Y|');
            skuToWeightMap[data[0]] = data[1];
        });
        itemWeightMap[item.num_iid] = skuToWeightMap;
    });
    itemWeightMap_dispatch(itemWeightMap);
});

/**
 * 生成列表的商品重量
 * @param item
 * @returns {string}
 */
export function getItemWeightFormat (item) {
    let skuToWeightMap  = { ...app.store.getState().itemSettingsReducer.itemWeightMap[item.num_iid] };
    if (Object.keys(skuToWeightMap).length > 1) {
        // 存在sku
        delete skuToWeightMap[NO_SKU_KEY];// 去掉无属性的值
        let priceList = Object.values(skuToWeightMap);
        if (priceList.some(item => item !== priceList[0])) { // 判断数组中的值是否全部相等
            return `${Math.min(...priceList)}KG~${Math.max(...priceList)}KG`;
        }else {
            return `${priceList[0]}KG`;
        }
    }else{
        return `${skuToWeightMap[NO_SKU_KEY]}KG`;
    }
}

/**
 * 设置商品重量
 * @param item
 * @param skuToWeightMap
 * @param callback
 * @param errCallback
 */
export function setItemWeight ({ item, skuToWeightMap, callback = NOOP, errCallback = handleError }) {
    let weightStr = '';
    if (!item.skus) {
        // 没有sku
        weightStr = `${NO_SKU_KEY}|Y|${skuToWeightMap[NO_SKU_KEY]}`;
    }else{
        let priceArr = [];
        Object.keys(skuToWeightMap)
            .filter(key => skuToWeightMap[key])
            .map(key => priceArr.push(`${key}|Y|${skuToWeightMap[key]}`));
        weightStr = priceArr.join('|X|');
    }
    itemWeightSet({
        properties:item.pic_path,
        num_iid:item.num_iid,
        weight:weightStr,
        title:item.title,
        callback:res => {
            itemWeightMap_dispatch({ ...app.store.getState().itemSettingsReducer.itemWeightMap, [item.num_iid]:skuToWeightMap });
            callback(res);
        },
        errCallback,
    });
}

/**
 * 批量取消商品重量设置
 * @param num_iids
 * @param callback
 * @param errCallback
 */
export function batchRemoveItemWeight ({ num_iids = [], callback = NOOP, errCallback = handleError }) {
    itemWeightRemove({
        num_iids,
        callback:(res) => {
            let itemWeightMap = { ...app.store.getState().itemSettingsReducer.itemWeightMap };
            num_iids.map(value => delete itemWeightMap[value]);
            itemWeightMap_dispatch(itemWeightMap);
            callback(res);
        },
        errCallback,
    });
}

/**
 * 取消商品重量设置
 * @param num_iid
 * @param callback
 * @param errCallback
 */
export function removeItemWeight ({ num_iid, callback = NOOP, errCallback = handleError }) {
    batchRemoveItemWeight({ num_iids:[num_iid], callback, errCallback });
}
