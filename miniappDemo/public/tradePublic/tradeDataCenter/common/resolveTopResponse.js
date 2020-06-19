import { Logger } from "tradePolyfills/index";
import { isObject } from "mapp_common/utils";

export function resolveTopResponse (response) {

    if (response.request_id) {
        return response;
    }
    let key = Object.keys(response).find(item => /_response$/.test(item));
    if (key) {
        return response[key];
    }
    return {};
}

/**
 * 同上面方法相同意思 🙄
 * @param result
 * @returns {{}|*}
 */
export function resolveTopResult (result) {
    let key = Object.keys(result).find(item => /_result$/.test(item));
    if (key) {
        return result[key];
    } else {
        return result;
    }
}

/**
 * 我干死阿里这帮狗日的
 * pc的top请求的所有数组都会被包一层对象 如 trade.orders.order
 * 但是从小程序走的top请求就不是 直接是 trade.orders
 * 我他妈的居然还要兼容这种狗币东西 真他妈的醉了
 *
 */
export function getArrayByKey (key, obj) {
    const keyS = key + 's';

    if (!obj || !key) {
        return [];
    }
    if (!obj[keyS]) {
        return [];
    }

    if (Array.isArray(obj[keyS])) {
        return obj[keyS];
    } else if (Array.isArray(obj[keyS][key])) {
        return obj[keyS][key];
    }
}

export const getTrades = getArrayByKey.bind(null, 'trade');
export const getOrders = getArrayByKey.bind(null, 'order');
export const getItems = getArrayByKey.bind(null, 'item');
export const getSellerCats = getArrayByKey.bind(null, 'seller_cat');

/**
 * 清洗一个trade 把里面的orders.order换成orders
 * @param trade
 * @returns {*}
 */
export function washTradesWithArray (trade) {
    trade.orders = getOrders(trade);
}

/**
 * 上面那个函数的更加暴力的版本
 * 我们认为阿里的傻逼数组封装里面这个对象一定只有一个key 所以只要把这个key对应的array拿出来就行了 并不需要知道这个key的名字是什么
 * @param obj
 * @returns {*[]|*}
 */
export function getArrayInWrapper (obj) {
    if (Array.isArray(obj)) {
        return obj;
    }
    if (isObject(obj)) {
        if (Object.keys(obj).length != 1) {
            Logger.error('getArrayByGress长度!=1', obj);
            return [];
        }
        let key = Object.keys(obj)[0];
        return obj[key];
    }
    return [];

}

/**
 * 将小程序的接口返回数据转化与原来数据一致
 * res 接口返回数据 resolveTopResponse 这个方法处理过的
 * type 增加的缺少对象
 * isTotal 是否有总数处理
 */
export function integrationDate(res, type, isTotal){
    let types = type + 's';
    let rsp = {
      [types]: {}
    }
    if(res[types] && !res[types][type]){
      rsp[types][type] = res[types];
      if(isTotal){
        rsp.total_results = res.total_results;
      }
    }else{
      rsp = res;
    }
    return rsp;
}