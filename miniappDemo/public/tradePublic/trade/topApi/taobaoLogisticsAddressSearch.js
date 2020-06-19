import qnRouter from "tradePublic/qnRouter";


import { Logger, moment, storage } from "tradePolyfills/index";
import { getLocalStorageAndParse } from "tradePublic/utils/cache";
import { resolveTopResponse, resolveTopResult } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 获得发货地址
 * @param query
 * @param callback
 * @param errCallback
 */
function taobaoLogisticsAddressSearch ({ query, callback, errCallback = undefined }) {
    qnRouter({
        api:'taobao.logistics.address.search',
        params:query,
        callback:(rsp) => {
            callback(rsp);
        },
        errCallback:(error) => {
            if (errCallback) {
                errCallback(error);
            } else {
                showErrorDialog('温馨提示', '查询物流公司信息失败，请稍候再试！', JSON.stringify(error));
            }
        },
    });
}

let address = {
    "addr": "新二路55",
    "area_id": 530428,
    "cancel_def": true,
    "city": "玉溪市",
    "contact_id": 1693768003,
    "contact_name": "孙平",
    "country": "元江哈尼族彝族傣族自治县",
    "get_def": true,
    "memo": "",
    "mobile_phone": "13817598390",
    "province": "云南省",
    "seller_company": "",
    "send_def": false,
    "zip_code": "223300"
};
/**
 * 从缓存取发货地址 避免过多请求 默认2小时更新一次
 * @param query
 * @param callback
 * @param errCallback
 */
export function taobaoLogisticsAddressSearchCache ({ query, callback, errCallback }) {
    let cache = getLocalStorageAndParse('taobao.logistics.address.search',{});
    let queryStr = JSON.stringify(query);
    let res = cache[queryStr];
    if (res && moment(res.timeout).isAfter(moment())) {
        Logger.log('从缓存取到了发货地址', res);
        callback(res.data);

        return;
    }

    taobaoLogisticsAddressSearch({
        query:query,
        callback:(res) => {
            const response = resolveTopResponse(res);
            const addresses = resolveTopResult(response.addresses);

            cache[queryStr] = { data:addresses, timeout: moment().add(2, 'h').format('YYYY-MM-DD HH:mm:ss') };
            storage.setItem('taobao.logistics.address.search', JSON.stringify(cache));
            Logger.log('没有从缓存取到收货地址', cache);
            callback(addresses);
        },
        errCallback: errCallback,
    });
}

export default taobaoLogisticsAddressSearch;
