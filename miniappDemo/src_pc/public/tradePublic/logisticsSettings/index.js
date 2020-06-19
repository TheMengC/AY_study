import { NOOP } from "tradePublic/consts";
import {
    taobaoLogisticsAddressAdd,
    taobaoLogisticsAddressModify,
    taobaoLogisticsAddressRemove,
    taobaoLogisticsAddressSearch
} from "tradePublic/taobaoLogisticsAddress";
import { api, getDeferred, isEmpty } from "tradePolyfills/index";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { getDataDeferred } from "tradePublic/utils";

export const logisticsAddressGet = ({ query = false, callback = NOOP, errorCallback = handleError }) => {
    taobaoLogisticsAddressSearch(
        {
            query,
            callback: (res) => {
                let addressResult = resolveTopResponse(res).addresses;
                if (addressResult.address_result) {
                    addressResult = addressResult.address_result;
                }
                callback(addressResult);
            },
            errCallback: errorCallback,
        });
};
export const REQUIRED_FIELDS = {
    contact_name:'姓名',
    province:'所在省',
    city:'所在市',
    addr:'详细街道地址',
    mobile_phone:'手机号码',
};

export const SEND_ADDRESS_DEFAULT_KEY = 'get_def';
export const CANCEL_ADDRESS_DEFAULT_KEY = 'cancel_def';

export const logisticsAddressAdd = (
    {
        address,
        callback = NOOP,
        errorCallback = handleError,
    }) => {
    taobaoLogisticsAddressAdd({
        query: address,
        callback: res => {
            if (resolveTopResponse(res).address_result.modify_date) {
                callback();
            } else{
                errorCallback(res);
            }
        },
        errCallback: errorCallback,
    });
};

export const logisticsAddressRemove = (
    {
        contact_id,
        callback = NOOP,
        errorCallback = handleError,
    }) => {
    taobaoLogisticsAddressRemove({
        query: { contact_id },
        callback: res => {
            if (resolveTopResponse(res).address_result.modify_date) {
                callback();
            }else{
                errorCallback(res);
            }
        },
        errCallback:errorCallback,
    });
};

export const logisticsAddressModify = (
    {
        contact_id,
        address,
        callback = NOOP,
        errorCallback = handleError,
    }) => {
    taobaoLogisticsAddressModify({
        query: { ...address, contact_id },
        callback: res => {
            if (resolveTopResponse(res).address_result.modify_date) {
                callback();
            }else{
                errorCallback(res);
            }
        },
        errCallback:errorCallback,
    });
};

const commonlyLogisticsGet = ({ callback = NOOP }) => {
    api({
        apiName:'aiyong.user.settings.sendcompanies.get',
        method: '/iytrade/getSend',
        callback: data => {
            callback(resolveCompaniesGroup(data));
        },
    });
};

let companiesGroup = {};
/**
 * 解析CompaniesGroup
 * @param rsp 由接口返回的内容
 * @return  companiesGroup 一个对象 有key 为online，offline的两个数组 数组由company组成 company格式为 code,id,name
 */
export function resolveCompaniesGroup (rsp) {
    console.log('rsp to resolveCompaniesGroup', rsp);
    rsp.forEach((item) => {
        let idArr = item.lwid || '';
        let nameArr = item.name || '';
        let codeArr = item.code || '';
        idArr = idArr.split(/,|，/).map((item) => {
            return item;
        });
        nameArr = nameArr.split(/,|，/);
        codeArr = codeArr.split(/,|，/);
        let companies = [];
        idArr.forEach((item, index) => {
            if (idArr[index] && codeArr[index] && nameArr[index]) {
                companies.push({
                    code: codeArr[index],
                    id: idArr[index],
                    name: nameArr[index],
                });
            }
        });
        if(item) {
            companiesGroup[item.mode] = companies;
        }
    });
    if (!companiesGroup.online) {
        companiesGroup.online = [];
    }
    if (!companiesGroup.offline) {
        companiesGroup.offline = [];
    }
    return companiesGroup;
}


export const commonlyLogisticsSet = ({ mode, data, callback = NOOP }) => {
    let checkbox = '';
    data.map(item => checkbox += `${item.id},${item.code},${item.name};`);
    api({
        apiName:'aiyong.user.settings.sendcompanies.save',
        method: '/iytrade2/saveSend',
        args: {
            mode,
            checkbox,
        },
        callback: data => {
            callback(resolveCompaniesGroup([data]));
        },
    });
};

export const OFFLINE_KEY = 'offline';
export const ONLINE_KEY = 'online';

let commonlyLogistics = {};
const initCommonlyLogistics = getDataDeferred(commonlyLogisticsGet, data => {
    if(isEmpty(data)) {
        data = {
            [OFFLINE_KEY]:[],
            [ONLINE_KEY]:[],
        };
    }
    commonlyLogistics = data;
});

/**
 * 获取常用物流
 * @returns {Promise<void>}
 */
export async function getCommonlyLogistics ({ refresh = false } = {}) {
    await initCommonlyLogistics({ refresh });
    return commonlyLogistics;
}

/**
 * 修改常用物流
 * @param mode offline/online
 * @param newCommonlyLogistics
 */
export function modifyCommonlyLogistics (mode, newCommonlyLogistics) {
    commonlyLogistics[mode] = newCommonlyLogistics;
}

// 默认常用物流 四通一达
export const DEFAULT_COMMONLY_LOGISTICS = ['申通快递', '圆通速递', "中通快递", '百世快递', '韵达快递'];

export const USER_PRINT_ADDRESS_ELEC = 'elec';
export const USER_PRINT_ADDRESS_CUSTOM = 'custom';

/**
 * 自定义打印电子面单时使用电子面单取号时的发货地址
 * @param value 是否开启 true/false
 * @param callback
 * @param errCallback
 */
export function userPrintElecAddressSet ({ value, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.trade.order.print.elecface.useelecfaceaddress.set',
        method:'/print/setUserPrintElecAddress',
        args:{ value },
        callback:callback,
        errCallback: errCallback,
    });
}

/**
 * 获取打印设置
 * @param value {'black'|'white'}
 * @param callback
 * @param errCallback
 */
export function printSettingGet ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.trade.order.print.settings.get',
        method:'/iyprint2/getprintset',
        callback:callback,
        errCallback: errCallback,
    });
}

/**
 * 智能识别地址
 * @param addressString
 * @return Promise
 */
export function addressFastFill (addressString) {
    let deferred = getDeferred();

    addressString = addressString.replace(/，/g, ',');
    addressString = addressString.trim();

    api({
        apiName:'aiyong.tools.addressstring.split',
        method: '/print/splitAddressString',
        args: { address: addressString },
        callback: (res) => {
            deferred.resolve(res);
        },
        errCallback: handleError,
    });
    return deferred;
}
