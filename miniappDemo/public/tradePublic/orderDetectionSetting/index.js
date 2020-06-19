import { api, isEmpty, NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { getDataDeferred, getDebounce } from "tradePublic/utils";

export const orderDetectionSettingStatusGet = ({ callback = NOOP, errCallback = handleError }) => {
    api({
        apiName:'aiyong.user.settings.orderdetect.set',
        method: '/set/updateDetectSet',
        args: { type: 'get' },
        callback: (res) => {
            if (res.code === 200) {
                callback(res.result);
            } else {
                errCallback('code != 200');
            }
        },
        errCallback: (msg) => {
            errCallback(msg);
        },
    });
};

export const orderDetectionSettingStatusSet = ({ data, callback = NOOP, errCallback = handleError }) => {
    api({
        apiName:'aiyong.user.settings.orderdetect.set',
        method: '/set/updateDetectSet',
        args: {
            type: 'save',
            json: data,
        },
        callback: (res) => {
            if (res.code === 200) {
                callback(res.result);
            } else {
                errCallback('code != 200');
            }
        },
        errCallback: (msg) => {
            errCallback(msg);
        },
    });
};

export const setDetectionSetting = getDebounce(orderDetectionSettingStatusSet, 800);


let addressWarningSwitchStatus = false;
let addressWarningContent = '';

/**
 *
 * @param callback
 * @param errCallback
 */
function addressWarningInoGet ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.specialaddress.get',
        method: '/iytrade2/getuserglsz',
        callback,
        errCallback,
    });
}

export const initAddressWarningInfo = getDataDeferred(addressWarningInoGet, res => {
    if (res.tsdz) {
        let data = res.tsdz.split(';');
        addressWarningSwitchStatus = data[0] === 'on';
        addressWarningContent = data[1];
    }
});

/**
 * 获取地址预警的开关状态
 * @param refresh
 * @returns {Promise<boolean>}
 */
export async function getAddressWarningSwitchStatus (refresh = false) {
    await initAddressWarningInfo({ refresh });
    return addressWarningSwitchStatus;
}

/**
 * 获取地址预警的内容
 * @param refresh
 * @returns {Promise<string>}
 */
export async function getAddressWarningContent (refresh = false) {
    await initAddressWarningInfo({ refresh });
    return addressWarningContent;
}

/**
 * 获取地址预警的开关和内容
 * @param refresh
 * @returns {Promise<string>}
 */
export function getAddressWarningSet () {
    return {
        addressWarningSwitchStatus,
        addressWarningContent,
    };
}

/**
 * 保存地址预警信息
 * @param switchStatus
 * @param content
 * @param callback
 * @param errCallback
 */
function addressWarningInfoSet ({ switchStatus, content, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.user.settings.addresswarning.save',
        method: '/iytrade2/saveglsz',
        args:{ tsdz:`${switchStatus ? 'on' : 'off'};${content}` },
        callback,
        errCallback,
    });
}

/**
 * 修改地址预警开关
 * @param switchStatus
 * @param callback
 * @param errCallback
 */
export function modifyAddressWarningSwitchStatus ({ switchStatus, callback = NOOP, errCallback = handleError }) {
    addressWarningInfoSet({
        switchStatus,
        content:addressWarningContent,
        callback: (res) => {
            addressWarningSwitchStatus = switchStatus;
            callback(res);
        },
        errCallback,
    });
}

/**
 * 修改地址预警内容
 * @param content
 * @param callback
 * @param errCallback
 */
export function modifyAddressWarningContent ({ content, callback = NOOP, errCallback = handleError }) {
    content = content.split('，');
    content = content.join(',');
    addressWarningInfoSet({
        switchStatus:addressWarningSwitchStatus,
        content,
        callback: (res) => {
            addressWarningContent = content;
            callback(res);
        },
        errCallback,
    });
}

/**
 * 传入地址获取风险地址
 * @param address
 * @returns {{addrObj: object}}
 * addrObj:是一个对象，key为地址，value是否为风险地址
 */
export function getWarnAddress (address) {
    let warnAddress = {};

    const addressWarning = getAddressWarningSet();
    if (!addressWarning.addressWarningSwitchStatus) {
        return warnAddress;
    }

    // 将风险地址切割成数组，在地址中寻找关键词的下标
    const warnContArr = addressWarning.addressWarningContent.split(',');
    let splitIndex = [];
    warnContArr.forEach((cont) => {
        const index = address.indexOf(cont);
        if (index > -1) {
            splitIndex = [...splitIndex, index, index + cont.length];
        }
    });

    // 地址中没有关键词
    if (isEmpty(splitIndex)) {
        return warnAddress;
    }

    // 地址中含有关键词
    splitIndex = [0, ...splitIndex];
    splitIndex.forEach((item, index) => {
        const nextItem = splitIndex[index + 1] ? splitIndex[index + 1] : -1;
        const addrChip = address.slice(item, nextItem);
        warnAddress[addrChip] = warnContArr.indexOf(addrChip) > -1 ;
    });
    return warnAddress;
}
