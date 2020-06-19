import Taro from "@tarojs/taro";
import { buildArgs, formatError, getDeferred, isIDE, NOOP, showConfirmModal } from "./index";
import { ENV } from "@/constants/env";
import { Logger } from "mapp_common/utils/logger";
import { getCloud } from "mapp_common/utils/cloud";
import { testUser } from "mapp_common/utils/userInfo";
import moment from "mapp_common/utils/moment";
import { getApiProxyEnabled, getProxyDeferred, invokeApiProxy } from "mapp_common/utils/qnProxy";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { sleep } from "mapp_common/utils/index";

/**
 * 对象转换为www-x-form-encoded
 * @param element
 * @param key
 * @param list
 * @returns {string}
 */
function JSON_to_URLEncoded (element, key, list) {
    var list = list || [];
    if (typeof (element) === 'object') {
        for (let idx in element) {
            JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
        }
    } else {
        list.push(`${key}=${element}`);
    }


    return list.join('&');
}

let phpSessionId = '';

const hostApiNameMap = {
    'trade.aiyongbao.com': 'tradepc',
    'mtrade.aiyongbao.com': 'mtrade',
    'item.aiyongbao.com': 'itempc',
    'mitem.aiyongbao.com': 'mitem',
};
const style = {
    red: 'background-color:#FF5555;color:#FFFFFF',
    green: 'background-color:#5555FF;color:#FFFFFF',
};

/**
 * api方法 根据不同的环境会用不同的方法获取数据
 *  在目前调试时使用cookie写死的方法
 * @param host
 * @param method
 * @param args
 * @param callback
 * @param errCallback
 */
export function api (
    {
        host = ENV.hosts.default,
        apiName,
        method,
        args = {},
        callback = NOOP,
        errCallback = NOOP,
        ...rest
    }) {
    if (Object.keys(args)) {
        args = {
            ...args,
            trade_source: 'TAO',
        };
    }
    if (process.env.TARO_ENV === 'h5') {
        let isSuccess = false;
        fetch(host + method, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: buildArgs(args),
            headers: {},
        })
            .then(res => res.json())
            .then((res) => {
                isSuccess = true;
                callback(res);
            })
            .catch((err) => {
                if (isSuccess) {
                    return;
                }
                errCallback(err);
            });

    } else {
        if (apiName) {
            applicationApi({
                args: args,
                apiName: apiName,
                path: method,
                ...rest,
                callback: (res) => {
                    if (checkLogin(res)) {
                        success(res, apiName, 'application', args);
                    } else {
                        error(res, apiName, 'application', args);
                    }
                },
                errCallback: (res) => {
                    if (checkLogin(res)) {
                        error(res, apiName, 'application', args);
                    }
                },
            });
        } else {
            if (getApiProxyEnabled()) {
                getProxyDeferred().then(() => {
                    invokeApiProxy({
                        url: host + method,
                        params: args,
                        callback: (res) => {
                            success(res, host + method, 'proxy', args);
                        },
                        errCallback: (err) => {
                            error(err, host + method, 'proxy', args);
                        },
                    });
                });
                return;
            }
            phpSessionIdDeferred.then(() => {
                Taro.request({
                    url: host + method,
                    data: JSON_to_URLEncoded(args),
                    mode: 'cors',
                    method: "POST",
                    credentials: 'include',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        cookie: 'PHPSESSID=' + phpSessionId,
                    },
                    success (res) {
                        res = res.data;
                        if (checkLogin(res)) {
                            success(res, host + method, 'request', args);
                        } else {
                            error(res, host + method, 'request', args);
                        }
                    },
                    fail (err) {
                        if (checkLogin(err)) {
                            error(err, host + method, 'request', args);
                        }
                    },
                });

            });
        }
    }

    /**
     * 检查是否是登录失效
     * @param resp
     * @returns {boolean}
     */
    function checkLogin (resp) {
        if (resp == 'fail' || resp && resp.code == 500 && resp.sub_code == 20003) {
            // 遇见错误时弹框提示   by Mothpro
            // session获取失败登录失效
            showConfirmModal({
                title: '温馨提示',
                content: '登录失效，请重新打开插件！' + JSON.stringify(resp),
                onConfirm: () => {
                    my.qn.returnData();
                },
                onCancel: () => {
                    errCallback(resp);
                },
            });
            return false;
        }
        return true;
    }

    /**
     * 成功
     * @param res
     */
    function success (res, api, from, req) {
        Logger.debug(`%capi-${from}-success`, style.green, api, req, res);
        try {
            callback(res);

        }catch (e) {
            debugger;
            Logger.error('api-callback-error', formatError(e));
        }
    }

    /**
     * 失败
     * @param error
     */
    function error (error, api, from, req) {
        Logger.error(`%capi-${from}-error`, style.red, api, req, error);

        errCallback(error);
    }
};

let phpSessionIdDeferred = getDeferred();

export const initphpSessionIdDeferred = () => {
    phpSessionIdDeferred = getDeferred();
};

export const getphpSessionIdDeferred = () => {
    return phpSessionIdDeferred;
};

/**
 * 奇门接口
 * @param args
 * @param apiName
 * @param callback
 * @param errCallback
 */
export function applicationApi ({ args, apiName, path, method = 'POST', headers = {}, version = 1, callback, errCallback }) {
    phpSessionIdDeferred.then(() => {
        let _path = getUserInfo().userNick;
        !_path && (_path = path);
        !_path && (_path = '/');
        let isSuccess = false;
        if (args) {
            Object.keys(args).map(key => {
                if (args[key] === null || args[key] === undefined) {
                    delete args[key];
                }
            });
        }
        let data = {
            path: '#' + _path,
            method,
            headers,
            body: {
                api_name: apiName,
                phpSessionId: phpSessionId,
                version: version,
                ...args,

            },
        };
        getCloud().application.httpRequest(data).then(res => {
            isSuccess = true;
            let data = res;
            if (data.data) {
                data = data.data;
            }
            // 调整自动上下级接口返回的是 '1null' 字符串，单独做一个处理
            if (res === '1null') {
                data = JSON.stringify({ 'res': 1 });
            }
            try {
                data = JSON.parse(data);
            } catch (e) {
                errCallback(e);
                return;
            }
            callback(data);
        }).catch(error => {
            if (!isSuccess) {
                if (error instanceof Error) {
                    error = { message: error.message/* stack:error.stack */ };
                }
                errCallback(error);
            }
        });
    });
};

/**
 * 入口 取phpsessionid
 */
export async function entry ({ accessToken, callback = NOOP, errCallback = NOOP } = {}) {
    let args = {
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        slot: 'miniapp',
        from: 'qianniuIphone',
        api_name: ENV.entryApiName,
        version: 1,
        planet: ENV.planet,
        _access_token: accessToken,
    };
    if (isIDE()) {
        args.user_nick = testUser.nickName;
        args._access_token = testUser.access_token;
    }
    let res;
    let tryTime = 0;
    while (tryTime++ < 2) {
        res = await new Promise(resolve => {
            getCloud().application.httpRequest({
                path: 'shenmejibadongxi',
                method: 'POST',
                body: { ...args },
            }).then(res => {
                resolve(res);
            }).catch(error => {
                Taro.showToast({ title: '登录失败 重试中..' + tryTime });
                Logger.error('entry-error', {
                    args,
                    error,
                });
                resolve(false);
            });
        });
        if (res) {
            break;
        }
        await sleep(500);
    }
    if (!res) {
        showConfirmModal({ content: '登录失败 请稍后再试..', showCancel:false });
        errCallback();
        return;
    }

    // Taro.showToast({ title: '登录成功' });
    let data = res;
    if (data.data) {
        data = data.data;
    }
    try {
        data = JSON.parse(data);
    } catch (e) {
        Logger.error('entry-parse-error', e);
    }
    Logger.warn('ertry-success', args, data);
    phpSessionId = data.phpSessionId;
    phpSessionIdDeferred.resolve(phpSessionId);
    let userInfo = {
        userId: data.user_id,
        userNick: data.nick,
    };
    callback(userInfo);
}
