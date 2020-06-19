import Taro from "@tarojs/taro";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { ENV } from "@/constants/env";
import { Logger } from "mapp_common/utils/logger";

/**
 * 将Object 转换为QueryString 对象只能有一层.
 * @param params
 * @returns {string}
 */
export function buildParams (params) {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

let pageProps = {};

/**
 * 跳转到指定页面
 * @param url
 * @param params 参数 可以放一些复杂的东西 如对象/数组/回调 之后在page中用下面的getPageProps(this)  取出来
 * @returns {Promise<any>}
 */
export function navigateTo (
    {
        url,
        params = {},
        props = {},
        redirect = false,
    }) {
    Logger.log('navigateTo', {
        url,
        params,
        props,
        redirect,
    });
    try {
        let propsKey = url + "_" + (Math.random() * 10000000).toFixed(0);
        if (props) {
            props.dispose = () => {
                delete pageProps[propsKey];
            };
            pageProps[propsKey] = props;

            params.propsKey = propsKey;
        }
        if (params) {
            url += "?" + buildParams(params);
        }
        if (redirect) {
            return my.redirectTo({
                url: url,
                success: NOOP,
                fail: (res) => {
                    Logger.error("跳转失败", res);
                },
            });
        }
        return my.navigateTo({
            url: url,
            success: NOOP,
            fail: (res) => {
                Logger.error("跳转失败", res);
            },
        });
    }catch (e) {
        Logger.error("跳转失败 catch", e);

    }

}
/**
 * 用一个page对象(在page中也就是this)传进来,page对象的$router.params中有一个propsKey的键,这个键在上面的navigateTo中会被先注册.
 * 这样可以实现在页面中回调上一个页面的函数,并传复杂的对象进来.
 * 最好是在用完这个page之后调用这个pageProps.destroy,将外面的回调池清空,不然可能会越来越多.
 * 在willmount的时候
 * @param page
 * @returns {*}
 */
export function getPageProps (page) {
    return pageProps[page.$router.params.propsKey];
}




export function navigateBack (delta = 1) {
    Taro.navigateBack({ delta });
}

/**
 * 显示二次确认弹窗
 * @param onConfirm 点击确认的回调
 * @param onCancel 点击取消的回调
 */
export function showConfirmModal (
    {
        title = '温馨提示',
        content,
        confirmText = '确认',
        cancelText = '取消',
        onConfirm = NOOP,
        onCancel = NOOP,
        showCancel = true,
    }) {
    Taro.showModal({
        title,
        showCancel,
        content,
        confirmText,
        cancelText,
        success:(res) => {
            if (res.cancel || res.confirm == false) {
                onCancel();
            }else  {
                onConfirm();
            }
        },
    });
}


/**
 * 生成表单对象
 * @param args
 * @param keys
 * @returns {FormData}
 */
export function buildArgs (args, keys = []) {
    let formData = new FormData();
    for (let i in args) {
        if (typeof (args[i]) === 'object') {
            let newkeys = [...keys];
            if (newkeys.length > 0) {
                newkeys[0] = newkeys[0] + `[${i}]`;
            } else{
                newkeys.push(i);
            }
            buildArgs(formData, args[i], newkeys);
        } else{
            let key = '';
            keys.map(c => {
                isEmpty(key) ? key = c : key += `[${c}]`;
            });
            isEmpty(key) ? formData.append(i, args[i]) : formData.append(key + `[${i}]`, args[i]);
        }
    }
    return formData;
}

/**
 * 去掉前后 空格/空行/tab 的正则 预先定义 避免在函数中重复构造
 * @type {RegExp}
 */
let trimReg = /(^\s*)|(\s*$)/g;

/**
 * 判断一个东西是不是空 空格 空字符串 undefined 长度为0的数组及对象会被认为是空的
 * @param key
 * @returns {boolean}
 */
export function isEmpty (key) {
    if (key === undefined || key === '' || key === null) {
        return true;
    }
    if (typeof (key) === 'string') {
        key = key.replace(trimReg, '');
        if (key == '' || key == null || key == 'null' || key == undefined || key == 'undefined') {
            return true;
        } else{
            return false;
        }
    } else if (typeof (key) === 'undefined') {
        return true;
    } else if (typeof (key) === 'object') {
        for (let i in key) {
            return false;
        }
        return true;
    } else if (typeof (key) === 'boolean') {
        return false;
    }
}

/**
 * 构造一个deferred对象 相当于一个resolve reject 外置的promise 可以预先生成这个promise 然后等待这个promise被外部resolve
 * @returns {Promise<unknown>}
 */
export function getDeferred ()  {
    let resolve, reject;
    let promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};
/**
 * 空函数 避免重复构造空函数
 * @constructor
 */
export const NOOP = () => {};
export const TYPES = {
    Number: '[object Number]',
    String: '[object String]',
    Undefined: '[object Undefined]',
    Boolean: '[object Boolean]',
    Object: '[object Object]',
    Array: '[object Array]',
    Function: '[object Function]',
};

/**
 * 获取一个东西的type 请与上面的常量进行比较
 * @param obj
 * @returns {string}
 */
export function getType (obj) {
    return Object.prototype.toString.call(obj);
}

/**
 * 判断是否是对象
 * @param target
 * @returns {boolean}
 */
export function isObject (target) {
    return getType(target) === TYPES.Object;
}

/**
 * 判断参数是否是JSON字符串
 * */
export function isJSON (str) {
    try {
        let obj = JSON.parse(str);
        if(isObject(obj) && obj) {
            return true;
        }else{
            return false;
        }
    }catch(e) {
        return false;
    }
}

/**
 * 判断是否是array
 * @param target
 * @returns {boolean}
 */
export function isArray (target) {
    return getType(target) === TYPES.Array;
}

/**
 * 判断是否是函数
 * @param target
 * @returns {boolean}
 */
export function isFunction (target) {
    return getType(target) === TYPES.Function;
}

/*
 * @Description 从url中获取指定键值
 */
export const getQueryString = (url, name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substring(url.indexOf('?') + 1, url.length).match(reg);
    if (r != null)
    // return decodeURI(unescape(r[2]));
    {
        return decodeURIComponent(decodeURIComponent(r[2]));
    }
    return null;
};

/*
 * @Description 因为爱用全线 https，所以图片资源不可以有 http的，但是广告系统会有，所以需要处理一下~
 */
export function removeImgHttp  (oriUrl)  {
    return oriUrl.replace('http:', '');
};

/*
 * @Description 获取当前页面的page名
 */
export function getCurrentPageName  ()  {
    const page = getCurrentPages();
    if (isEmpty(page)) {
        return undefined;
    }
    return page[page.length - 1].route.match(/\/(\S*)\//)[1];
};

// 存在tabtar的页面
export const TAB_BAR_PAGES = ['tradeIndex', 'tradeList', 'my'];

/*
 * @Description 深拷贝对象
 */
export function deepCopyObj  (obj)  {
    if (typeof obj === 'object') {
        return JSON.parse(JSON.stringify(obj));
    } else{
        return obj;
    }
};

/*
 * @Description 判断是不是ios平台
*/
export function isIOS  ()  {
    return getSystemInfo().platform === 'iOS';
};

/*
 * @Description 判断是不是android平台
*/
export function isAndroid  ()  {
    return getSystemInfo().platform === 'Android';
};



/*
 * @Description 刷新插件功能
*/
export function refreshPlugin  ()  {
    Taro.reLaunch({ url: '/pages/tradeIndex/index' });
};


export function safeGet  (obj, path, defaultValue = '')  {
    path = path.split('.');
    let value = obj;
    if (!value) {
        return defaultValue;
    }

    for (let pathItem of path) {
        if (value[pathItem]) {
            value = value[pathItem];
        } else {
            return defaultValue;
        }
    }
    return value;

};



/**
 *
 * @param itemList
 * @param success
 * @param cancel
 */
export function showActionSheet ({ itemList, success, cancel = NOOP }) {
    if (itemList.length == 0) {
        return;
    }
    let textList = itemList;
    if (isObject(itemList[0])) {
        textList = itemList.map(item => item.name);
    }
    Taro.showActionSheet({
        itemList:textList, success:(res) => {
            if (!res || res.index == undefined) {
                return;
            }
            if (res.index == -1) {
                isFunction(cancel) && cancel(res);
                return;
            }
            success(itemList[res.index]);
        },
    });

}

/**
 * 联系淘宝客服（阿里万象）
 */
export function contactTaobaoCustomer () {
    my.qn.openPlugin({ appkey:'21661765' });
}
/*
 * @Description 判断是不是pc
*/
export const isPC = () => {
    return getSystemInfo().platform === 'pc';
};

/**
 * 显示tabBar
 * @param animation 是否需要动画效果
 * @param success
 * @param fail
 * @param complete
 */
export function showTabBar ({ animation = true, success = NOOP, fail = NOOP, complete = NOOP } = {}) {
    if (!TAB_BAR_PAGES.includes(getCurrentPageName())) {
        return;
    }
    Taro.showTabBar({
        animation,
        success,
        fail,
        complete,
    });
}

/**
 * 隐藏tabBar
 * @param animation 是否需要动画效果
 * @param success
 * @param fail
 * @param complete
 */
export function hideTabBar ({ animation = true, success = NOOP, fail = NOOP, complete = NOOP } = {}) {
    if (!TAB_BAR_PAGES.includes(getCurrentPageName())) {
        return;
    }
    Taro.hideTabBar({
        animation,
        success,
        fail,
        complete,
    });
}

// 动画延时
export function sleep (time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function classNames (...args) {
    let classes = [];

    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (!arg) continue;

        let argType = typeof arg;

        if (argType === 'string' || argType === 'number') {
            classes.push(this && this[arg] || arg);
        } else if (Array.isArray(arg)) {
            classes.push(classNames.apply(this, arg));
        } else if (argType === 'object') {
            for (let key in arg) {
                if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
                    classes.push(this && this[key] || key);
                }
            }
        }
    }

    return classes.join(' ');
}

/**
 * 是否是ide 最好把这个在上传的时候改成return false 鬼知道千牛的my.qn里有什么 不同人还不一样的
 * @returns {boolean}
 */
export function isIDE () {
    if (ENV.device === "pc") {
        return !my.qn.openPlugin;
    }
    if (ENV.device === "mobile") {
        return my.isIDE;
    }
}

/**
 * Object.values的替代品
 * 我真的佛了 ios的浏览器内核由系统决定 有很多新的feature都没有
 * @param object
 * @returns {[]}
 */
export function Object_values (object) {
    if (Object.values) {
        return Object.values(object);
    }
    return Object.keys(object).map(key => object[key]);
}

/**
 * 跳转到qap页面
 * 这个地方会通过qap首页中转一下
 * @param pageName
 */
export function navigateToQAP (pageName, redirect = true) {
    Logger.log("navigateToQAP", {
        pageName,
        redirect,
    });
    let query = {
        fromMapp: true,
        extraData: {
            event: 'gotoPage',
            status: pageName,
        },
    };
    if (redirect) {
        query.redirect = true;  // 这个flag会在qap被判断并在首页加载loading图
    }
    my.qn.navigateToQAP({
        animate: 1,
        animated: 1,
        request: 1,
        url: 'qap:///index',
        title: 'fdafaaf',
        query,
        success (res) {
            Logger.log('success', res);
        },
        fail (res) {
            Logger.log('err', res);
        },
    });
}


export function formatError (error) {
    return {
        message: error.message,
        stack: error.stack,
    };
}

/**
 * 比较两个版本 verA>verB 就是1 verA<verB就是-1 相等就是0
 * @param verA
 * @param verB
 * @returns {number}
 */
export function versionCompare  (verA,verB)  {
    let verAArr = verA.split('.');
    let verBArr = verB.split('.');
    let length = verAArr.length > verBArr.length ? verAArr.length : verBArr.length;
    for (let i = 0; i < length; i++) {
        let a = verAArr[i] || 0;
        let b = verBArr[i] || 0;
        if (+a > +b){
            return 1;
        }
        if (+a < +b){
            return -1;
        }
    }
    return 0;

};

