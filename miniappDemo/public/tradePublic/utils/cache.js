import { Logger, storage, moment } from "tradePolyfills/index";

/**
 * 安全获取一个缓存并解析为string 在不存在或解析不了的时候返回空
 * @param key
 * @param _default
 * @returns {{}|any}
 */
export function getLocalStorageAndParse (key, _default = null) {
    let str = storage.getItemSync(key);
    if (!str) {
        return _default;
    }
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (e) {
        Logger.log(e);
        return _default;
    }
}

/**
 * 带过期时间的保存缓存
 * @param key
 * @param data
 * @param timeout
 * @returns {{data: *, timeout}}
 */
export function saveCacheWithTimeout (key, data, timeout = '12h') {
    let timeout_num = timeout.match(/\d+/)[0];
    let timeout_unit = timeout.match(/[a-zA-Z]+/)[0];
    let cache = {
        data,
        timeout: moment().add(timeout_num, timeout_unit).format('YYYY-MM-DD HH:mm:ss'),
    };
    Logger.debug('保存缓存', { key, data, timeout });
    storage.setItem(key, JSON.stringify(cache));
    return cache;
};

/**
 * 带过期时间的取缓存 如果缓存没有或者过期返回null 过期时间为缓存自带的过期时间 不需要传入
 * @param key
 * @param timeout
 */
export function getCacheWithTimeout (key) {
    let cache = getLocalStorageAndParse(key);
    if (cache && moment(cache.timeout).isAfter(moment())) {
        Logger.debug('从缓存取到了' + key, cache);
        return cache.data;
    }
    return null;
}
/**
 *
 * @param query
 * @param key
 * @param requestFun
 * @param timeout
 * @returns {Promise<unknown>}
 */
export function getCachedRequest ({ query, key, requestFun, timeout = '12h', forceUpdate = false }) {
    return new Promise((resolve, reject) => {
        if (!forceUpdate) {
            let cache = getCacheWithTimeout(key);
            if (cache !== null) {
                resolve(cache);
                return;
            }
        }
        requestFun({
            query: query,
            callback: (data) => {
                let  cache = saveCacheWithTimeout(key, data, timeout);
                Logger.debug('没有从缓存取到' + key, cache);
                resolve(data);
            },
            errCallback: reject,
        });
    });
}
