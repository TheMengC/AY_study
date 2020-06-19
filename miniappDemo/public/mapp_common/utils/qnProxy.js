import { getDeferred, NOOP } from "mapp_common/utils/index";
import { getSettings } from "mapp_common/utils/settings";

import Taro  from '@tarojs/taro';

let proxyDeferred;

/**
 * 获取代理打开的promise
 * @returns {*}
 */
export function getProxyDeferred () {

    if (!proxyDeferred) {
        proxyClientInit();
    }
    return proxyDeferred;
}

/**
 * node 项目位置 https://github.com/moonkop/QNProxy
 * 这个是将千牛外的 请求 转发到千牛内 在千牛内打开该页面 并在浏览器打开该页面 浏览器将把所有QN.top.invoke全部发送到node中 node将把请求发送到千牛的页面中 千牛页面进行处理后将数据发回node node再发回浏览器
 */
let wsClient;
const requestPool = [];
const QNproxy = {};
let requestId = 0;

['top', 'application', 'plugin', 'wangwang'].map(item => {
    QNproxy[item] = (params, callback, errCallback) => {
        let request = {
            requestId,
            params,
            type: item,
            category: "TOP",
        };
        requestPool[requestId] = {
            request,
            callback,
            errCallback,
        };
        requestId++;
        proxySend(request);
    };
});

/**
 * top请求走QNProxy的方法
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
export function invokeTopProxy ({ api, params, callback, errCallback }) {
    QNproxy.top({
        cmd: api,
        param: params,
    }, callback, errCallback);
}

/**
 * api请求走代理
 * @param params
 * @param callback
 * @param errCallback
 */
export function invokeApiProxy ({ params, url, callback, errCallback }) {
    let request = {
        requestId,
        params,
        url,
        category: "HTTP",
    };
    requestPool[requestId] = {
        request,
        callback,
        errCallback,
    };
    requestId++;
    proxySend(request);
}

/**
 * websocket发送的方法
 * @param msg
 */
export function proxySend (msg) {
    let cache = [];
    let msgStr = JSON.stringify(msg, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            let index = cache.indexOf(value);
            if (index !== -1) {
                // Circular reference found, discard key
                return '[cycle]' + index;
            }
            // Store value in our collection
            cache.push(value);
            if (value instanceof Error) {
                let error = {};
                Object.getOwnPropertyNames(value).forEach(function (key) {
                    error[key] = value[key];
                });
                return error;
            }

        }
        return value;
    });
    console.debug('websocket proxy send', msg);
    if (process.env.TARO_ENV === 'h5') {
        wsClient.send(msgStr);
    } else {
        my.sendSocketMessage({ data: msgStr });
    }
}

/* eslint-disable */
/**
 * 初始化QNProxyClient 项目见 http://github.com/moonkop/QNProxy
 * @param callback
 */
export function proxyClientInit (callback = NOOP) {
    proxyDeferred = getDeferred();
    my.closeSocket()
    let url = `ws://${getSettings().proxy.host}:12355`;
    const onMessage = function (msg_event) {
        let data = JSON.parse(msg_event.data);
        let request = JSON.parse(data.request);
        if (data.type == 'SUCCESS') {
            if (!requestPool[request.requestId]) {
                return;
            }
            requestPool[request.requestId].callback(data.response);
            delete requestPool[request.requestId];
        } else if (data.type == 'ERROR') {
            if (!requestPool[request.requestId]) {
                return;
            }
            requestPool[request.requestId].errCallback(data.response);
            delete requestPool[request.requestId];
        }
    };

    if (process.env.TARO_ENV === 'h5') {
        wsClient = new WebSocket(url);
        wsClient.onerror = function (event) {
            console.log("QNProxy-Client连接失败", event);
            wsClient.close();
            callback();
        };

        wsClient.onopen = function (event) {
            callback();
            console.log("QNProxy-Client连接成功", event);
            wsClient.onmessage = onMessage;
            /* 监听Socket的关闭 */
            wsClient.onclose = function (close_event) {
                console.log('Client notified webSocket has closed', close_event);
            };
            proxyDeferred.resolve();
        };
    } else {
        my.connectSocket({
            url: url,
            success: () => {
                console.log('正在打开websocket', url);
            },
            fail: (err) => {
                console.log('my error', err);
            },
        });
        my.onSocketMessage(onMessage);

        const onOpen = (res) => {
            console.log('QNProxy-Client连接成功', url);
            if (proxyDeferred) {
                proxyDeferred.resolve();
            }
            Taro.showToast({ title: '代理服务器连接成功'})
            callback();
            my.offSocketOpen(onOpen);
            my.onSocketClose(onClose);

        };
        my.onSocketOpen(onOpen);

        const onError = (res) => {
            Taro.showToast({ title: '代理服务器连接失败'})
            console.log('WebSocket 连接打开失败，请检查！', res);
            my.offSocketError(onError);
        };
        my.onSocketError(onError);

        const onClose = (res) => {
            Taro.showToast({ title: '代理服务器连接已关闭'})
            console.log('连接已关闭！', res);
            proxyDeferred = null;
            my.offSocketMessage(onMessage);
            my.offSocketClose(onClose);
        };

    }
}

export const getApiProxyEnabled = () => {
    return getSettings().proxy.apiProxyMode == "on";
};

/**
 * TOP代理是否开启
 * @returns {boolean}
 */
export function getQNProxyEnabled () {
    const { qnProxyMode } = getSettings().proxy;
    if (qnProxyMode == "on") {
        return true;
    }
    return false;
}

/**
 * 日志是否开启
 * @returns {boolean}
 */
export function getRemoteLogEnabled () {
    const { logMode } = getSettings().proxy;
    if (logMode == 'on') {
        return true;
    }
    return false;
}
