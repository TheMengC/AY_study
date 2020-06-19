import { api, ENV, getCurrentPageName, getUserInfo, getSystemInfo, isEmpty, moment,getDeferred,showConfirmModal,NOOP } from "tradePolyfills";
import { RENEW_RULES } from "tradePublic/marketing/constants";

/*
 * @Description 把对象转成url参数`
*/
export function buildParams (params) {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

/**
 * 计算与当前时间的差值
 * @param time
 */
export const timeDiffFromNow = (time) => {
    let timeDiff = new Date(time.replace(/-/g, '/')).getTime() - new Date().getTime(); // 得到距离高级版到期的毫秒数
    timeDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
    return Math.abs(timeDiff);
};

export const getToday = () => {
    return moment().format('YYYY-MM-DD');
};

/**
 * 判断是否是iPhone全面屏：iPhoneX或大于10
 */
export const isIPhoneFullScreen = () => {
    let {platform,model,screenHeight} = getSystemInfo();
    //判断屏幕高度是因为 iphone8 在 model中是10
    if(platform == "iOS" && screenHeight>800){
        let iphonemModelArr = model.replace('iPhone','').trim().split(',');
        if(iphonemModelArr.includes('X') || Number(iphonemModelArr[0])>10){
            return true;
        }
    }
}

/*
 * @Description 获取广告在redux中的key名
*/
export const getKeyName = (pid) => {
    return `${getCurrentPageName()}_${pid}`;
};

/*
 * @Description 判断用户处于什么续费周期
*/
export const judgeRenew = (type, time = undefined) => {
    let judgeTime = isEmpty(time) ? getUserInfo().vipRemain : time;
    return judgeTime >= RENEW_RULES[ENV.app][type][0] && judgeTime <= RENEW_RULES[ENV.app][type][1];
};

/**
 * 手机校验方法
 * @Description 判断用户处于什么续费周期
 * 台湾 ：台湾手机10位数，皆以09起头，如0932XXXXXX，0920XXXXXX。
 * 香港 ：香港手机号是 6 或 9 开头的 8 位数字。
 * 澳门 ：6 开头的 8 位数字。
 * 大陆 ：只要是11位的数字，以1开头的，我们都认为是国内合法的手机号码
 */
export const phoneTest = (phone, province) => {
    let d = /^1\d{10}$/;   // 1开头11为数字
    if(province == '台湾' || province == '海外' || province == '澳门特别行政区' || province == '香港特别行政区') {
        d = /^[0-9]*$/;
    }
    if(d.test(phone)) {
        return true;
    }else {
        return false;
    }
};


/**
 * 修改价格和库存时验证输入的值是否合法
 * @return {boolean} 返回false表示合法 返回true表示不合法
 */
export const  verifyInput = (inputPrice, inputQuantity)=> {
    const testInt = /^(0|[1-9][0-9]*)$/;
    if (!testInt.test(inputQuantity)) {
        return true;
    }
    const testFlo = /^(\-|\+)?\d+(\.\d+)?$/;
    const testNum = /^([1-9][0-9]*)$/;
    if ((!(testFlo.test(inputPrice) || testNum.test(inputPrice))) || Number(inputPrice) <= 0) {
        return true;
    }
    return false;
}
/**
 * api方法的promise包装 可以被await
 * @param host
 * @param apiName
 * @param method
 * @param args
 * @param rest
 * @returns {Promise<unknown>}
 */
export function apiAsync ({
    host = ENV.hosts.default,
    apiName,
    method,
    args = {},
    ...rest
}) {
    return new Promise((resolve, reject) => {
        let isSuccess = false;
        api({
            host,
            method,
            apiName,
            args,
            ...rest,
            callback: res => {
                isSuccess = true;
                resolve(res);
            },
            errCallback: res => {
                if (!isSuccess) {
                    reject(res);
                }
            },
        });
    });
}

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
/**
 * 生成uuid
 * @param len 位数
 * @param radix 随机数进制
 * @returns {string}
 */
export function getUUID (len = 8, radix = 16) {
    let uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 * 获取一个防抖函数
 * @param func
 * @param duration
 * @returns {Function}
 */
export function getDebounce (func, duration) {
    let timer;
    return function (args) {
        if (timer != null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func(args);
        }, duration ? duration : 800);
    };
}

/**
 * 异步获取数据 且只获取一次 返回一个promise
 * @param func
 * @param callback
 * @param errCallback
 * @returns {function({params?: *}=): Promise<any>}
 */
export function getDataDeferred (func, callback = NOOP, errCallback = NOOP) {
    let deferred;
    return function ({ refresh = false, params = {} } = {}) {
        if (!deferred || refresh) {
            deferred = getDeferred();
            func({
                params: params,
                callback: (res) => {
                    callback(res);
                    deferred.resolve(res);
                },
                errCallback: (err) => {
                    errCallback(err);
                    deferred = null;
                },
            });
        }
        return deferred;
    };
}
export function showErrorDialog (title = '出错了', content, detail) {
    showConfirmModal({
        title: title,
        content: content + (detail ? JSON.stringify(detail) : ''),
        showCancel: false,
    });
}
export function showConfirmModalAsync (args) {
    return new Promise(resolve => {
        showConfirmModal({
            ...args,
            onCancel:resolve.bind(null, false),
            onConfirm:resolve.bind(null, true),
        });
    });

}

/**
 * 绑定错误对话框
 * @param brief
 * @param detail
 * @returns {{new(...args: any[]): unknown} | ((...args: any[]) => unknown) | OmitThisParameter<showErrorDialog> | showErrorDialog | any | {new(...args: *[]): unknown} | ((...args: *[]) => unknown)}
 */
export function bindErrorDialog (brief, detail) {
    return showErrorDialog.bind(null, '出错了', brief, detail);
}
