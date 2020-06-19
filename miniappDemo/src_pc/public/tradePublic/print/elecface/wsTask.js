// import { showInstallCainiaoDialog } from "pcComponents/installCainiao/api";
// import { getDeferred, getUUID } from "mapp_common/utils";
// import { Logger } from "mapp_common/utils/TdcLogger";

import { Logger, getDeferred } from "tradePolyfills/index";
import { getUUID, showConfirmModalAsync } from "tradePublic/utils";
import { NOOP } from "tradePublic/consts";

let logLevel = 1;
// 菜鸟打印websocket 顺序任务队列
const webSocketMap = {
    "CN": {
        protocol: 'ws',
        webSocket: "webSocket",
        pool: "cainiaoWebSocketTaskPool",
        port: '13528',
        name: '菜鸟',
        deferred: null,
    },
    "PDD": {
        protocol: 'wss',
        webSocket: "webSocketPdd",
        pool: "pddWebSocketTaskPool",
        port: "18653",
        name: '拼多多',
        deferred: null,
    },
};
export const PRINT_PLATFORMS = {
    PDD: 'PDD',
    CN: "CN",
};
const global = {};
export const testTask = {
    "cmd": "print",
    "requestID": "print_preview_ef",
    "version": "1.0",
    "task": {
        "taskID": "8E1664C4__A1C48609",
        "preview": true,
        "previewType": "image",
        "printer": null,
        "notifyMode": "allInOne",
        "firstDocumentNumber": 1,
        "totalDocumentCount": 1,
        "documents": [
            {
                "documentID": "96F3086B",
                "contents": [
                    {
                        "encryptedData": "AES:rU904rj6UH2oqfSUb43+Z5CuoOkTVqESmlQ0tcJbrUAU/Tyci9E9dE6M43ziEjHJpqMCv4MiWNHxOp/KDX0OnCXsNsHNMGxek8ZztYZTuIg8e82v11KpVRFYaoV0v1AkC9N7qjc4lLqY2FO3P3UBoCoG4z4nfysIKvq9ZaT+Gdo9mVhafyDp7x4rWWPzvYeGPHvNr9dSqVURWGqFdL9QJAvTe6o3OJS6mNhTtz91AaA+KN1g7dl0ZgOkh+usxI3ahDQkS84mK68CvpkWA3BQphmRmXO0Yk9ln9RsoGTghZI5MVgAZTMallR6nSraLCNKAUKzKS+OG28iMq5+ysgps++U6kEf9oceMRbqpa7NCR+AbRhVaPSFuBPZeOuNukELMPwiE04whbpknPyHydsgPZRLI3mpGJex8OvsDIz9JfHmO8cZIGnFOARyFxjC63p0+YEFj9N+T53tXtYI0gqy6/vjy6rgiUpA9AbavpMD4BW5FxPTAKeXDDqxhKTbyDfW8YAGiB/qOHmGrOu4MwrLSDgX5l9Naj2jau1z4jPtlGYzp5w8ql72mJqZQx3skEzQXgXj2TRR6yoIKleZ+X4sAwM5yi/xFwmIG4S5gdGoS+nwshr45dfZGnQfQr0w0T6gLOieGzLTO2IdvYSJab9WTF9IVttpDaeGsDUTZYGCUoop3IMC6UghetyqVC+TJ4L8ci8PV+XVZU/e7hLiQ1mNv33yo5cfE+9rjIi7Puca0d+zZqZ3XWgU8lh+D1EAIBIkOZ3nzJtOwiClvHMYE0OuPi1iY1OIGS1ybkPSGM8LM/k+/XMOttzf0hhSSfPaPzVpiAkNnbbeeYyrCU9O5BRZK9AtQ0l7zJeD6MXzYXuPUFwboVMk5su1O50BBdYlH4sN6zOpMJOa+nZ4PTAMlXlYDGrPDXLH9a6bVfGukOvtDXAJgCH5xjDKF45h3eOPYcKy5meo6IX7GQ1lbhrNPeNJkGvg+dA205uTle3UiBnSj103XdAgm2+hcs7Wtd32OkVubjU4qZG6IJoPgqM0MutgyF+Qp/bUVhDNinZb3X3e5E6XPJVw3949EV70YUlBhPmxR9q7FTYbpnoiOP/6Z3YaNDCHHdgGEJpV9Vx2o1tHdSP50pQ8zA+iBcdua/KwF4i07PmaH9tDyscse1ihvzShCdvTrpV3AQfevbTkzYotGBVeCZPFQyvV54Gp2aHL8455WkuOK3StY7iLmtVatLSi4FsI9uNz434HRlRLJgShBqVaZxN53TWqfoqDrl07CvvpEftSiS9YC659qWTv19r9a6j3Rz9ZVcrqe0632ZKSrC+gUAOBSl1iuib80r+CIH/Iw9WslXdbY+QdiNUJcbndW1OaqJAuhpHr2WkzIjNHrII=",
                        "signature": "MD:48IykdHdQLdTdEiFYsN9KA==",
                        "templateURL": "http://cloudprint.cainiao.com/template/standard/309188",
                        "ver": "waybill_print_secret_version_1",
                    },
                ],
            },
        ],
    },
};

/**
 *
 * @param taskQueue 任务队列
 * @param {*|function} finishCallback 任务队列同步执行完成回调
 * @return object taskControl
 */
export  function execPrintTaskQueue ({ taskQueue, finishCallback = () => {}, onCancel = NOOP, platform = 'CN' }) {
    /*
     * 这个东西的用处就是可以打印一个waybillarr数组（当然只有一个任务也是可以的），并监听其中出现的相应的事件。
     * 这个任务队列是顺序执行的，前面的打印任务有了结果，才会调用回调，需要在回调中手动调用ctl.nextTask()才进行下一个任务
     * 一个任务执行完了以后 也可以重复当前的任务（可以对这个任务进行一些修改，比如给一个新的id）使用ctl.repeatTask() （已经废弃了）
     * 需要手动调用nextTask()这样设计的原因是因为可能回调中需要保存单号之类的事情，是一个异步的操作，需要在这个异步事件过后再进行下一个任务。
     * 在最后一个任务完成了以后 调用nextTask()就会执行finishCallback
     * 这个任务队列也可以有多个实例，并发执行，原理在下面的TaskPool
     * */
    let { webSocket, pool } = webSocketMap[platform];
    // 给所有任务的requestid再加一段uuid 防止在任务池中出现冲突
    taskQueue.forEach((item) => {
        if (!item.request.task) {
            item.request.task = { taskID: '' };
        }
        item.request.task.taskID += '__' + getUUID(8, 16);
    });
    let poolInstance = getWebSocketPrintTaskPool(platform);
    let taskControl = {
        currentTaskIndex: -1,
        currentTask: null,
        taskArr: taskQueue,

        _pool: poolInstance,
        _log: poolInstance._log,

        nextTask: function () {
            this.currentTaskIndex++;
            this.currentTask = this.taskArr[this.currentTaskIndex];
            if (this.currentTask == undefined) {
                this.finish();
                return;
            }
            //	this._log('nextTask');
            this._checkCurrentTaskBeforeSend();
            let requestStr = JSON.stringify(this.currentTask.request);
            this._pool.add(this.currentTask, this);
            Logger.debug('websocket print send msg', requestStr);
            my.sendSocketMessage({
                data: requestStr, // 需要发送的内容
            });
        },
        stop: function () {
            this._pool.remove(this.currentTask);
        },
        finish: function () {
            this._log('finish');
            if (finishCallback) {
                finishCallback(this.taskArr[this.taskArr.length - 1].request);
            }
            this._pool.remove(this.currentTask);
        },
        _success: function (result) {
            this._log('success', result);
            this._pool.remove(this.currentTask);
            if (!this.currentTask.callback) {
                return;
            }
            this.currentTask.callback(result, this);
        },
        _error: function (result) {
            this._log('error', result);
            if (!this.currentTask.errCallback) {
                return;
            }
            this.currentTask.errCallback(result, this);
        },
        _checkCurrentTaskBeforeSend: function () {
            if (this.currentTask == undefined) {
                throw "this.currentTask == undefined";
            }
            if (this.currentTask.request == undefined) {
                throw "this.currentTask.request == undefined";
            }
        },
    };
    openSocketMapp(platform).then((res) => {
        if (res) {
            bindSocketMessage(global[pool].onmessage.bind(global[pool]));
            // global[webSocket].onmessage = global[pool].onmessage.bind(global[pool]);
            taskControl.nextTask();
        }else{
            onCancel();
        }

    })
    return taskControl;
}

/**
 *  菜鸟打印 任务池
 * @param platform
 * @returns {global}
 */
export function getWebSocketPrintTaskPool (platform) {
    /*
     * 这个东西就是防止window.websocket.onmessage事件被不同的函数修改以至于前面的函数事情还没有执行完，后面的函数就把这个事件覆盖了。
     * 这样可以同时进行多个任务，并用requestID进行区分，并执行对应的回调。
     * 这样就需要requestID绝对唯一，所以在上面任务队列部分将requestID进行了随机化
     * */
    let { pool, name } = webSocketMap[platform];

    if (!global[pool]) {
        global[pool] = {
            // 这个池子是用来存储顺序任务的 任务success以后就应该被移除并放入下一个任务
            pool: {},
            // 这个池子用来储存慢速回调 例如notifyPrintResult的 这样保证所有的打印任务都能收到自己的notifyPrintResult事件
            asyncPool: {},
            notifyPrintResultPrintedPool: {},
            add: function (task, ctl) {
                if (!task || !task.request) {
                    return;
                }
                this.pool[task.request.task.taskID] = {
                    task,
                    ctl,
                };
                if (task.additionalEvents) {
                    this.asyncPool[task.request.task.taskID] = {
                        request: task.request,
                        additionalEvents: task.additionalEvents,
                    };
                }
                if (task.notifyPrintResultPrinted) {
                    this.notifyPrintResultPrintedPool[task.request.task.taskID] = {
                        task: task,
                        notifyPrintResultPrinted: task.notifyPrintResultPrinted,
                    };
                }
            },
            remove: function (task) {
                if (!task || !task.request || !task.request.task.taskID) {
                    return;
                }
                delete this.pool[task.request.task.taskID];
            },
            _log: function (...str) {
                let level = 1;
                if (level <= logLevel) {
                    Logger.log.apply(null, [`%cWebSocket ${platform} TaskControl:`, "color: white;background-color:black", ...str, this.currentTask]);
                }
            },
            onmessage: function (event) {
                let result = JSON.parse(event.data);
                let currentTask = this.pool[result.taskID];
                let asyncTask = this.asyncPool[result.taskID];
                let notifyPrintResultPrintedTask = this.notifyPrintResultPrintedPool[result.taskID];

                if (currentTask) {
                    if (result.cmd == currentTask.task.request.cmd) {
                        if (result.status == "success") {
                            currentTask.ctl._success(result);
                        } else {
                            currentTask.ctl._error(result);
                        }
                    }
                }
                if (asyncTask) {
                    // 到这里说明就可能有异步事件产生了 比如notifyPrintResut
                    this._log("additional events:", result);
                    let listener = asyncTask.additionalEvents[result.cmd];
                    if (!listener) {
                        return;
                    }
                    let destroy = () => {
                        delete asyncTask.additionalEvents[result.cmd];
                        if (Object.keys(asyncTask.additionalEvents).length == 0) {
                            delete this.asyncPool[result.taskID];
                        }
                    };
                    listener(result, asyncTask.request, destroy);
                }

                if (notifyPrintResultPrintedTask) {
                    this._log("notifyPrintResultPrintedTask:", result);
                    let destroy = () => {
                        delete this.notifyPrintResultPrintedPool[result.taskID];
                    };
                    if (result.cmd == 'notifyPrintResult' && result.taskStatus == 'printed') {
                        notifyPrintResultPrintedTask.notifyPrintResultPrinted(result, notifyPrintResultPrintedTask.task, destroy);
                    }
                }
            },
        };
    }
    ;
    //	global.webSocket.onmessage = global.cainiaoWebSocketTaskPool.onmessage.bind(global.cainiaoWebSocketTaskPool);
    return global[pool];

}

export function getWebSocketConnection (platform, onClose = () => {}) {
    /* 如果是https的话，端口是13529 */
    /* global.webSocket = new WebSocket('wss://localhost:13529'); */
    /* 打开Socket */
    let { webSocket, port, pool, name } = webSocketMap[platform];
    return new Promise((resolve, reject) => {
        if (global[webSocket] && global[webSocket].readyState == WebSocket.OPEN) {
            resolve();
            return;
        }
        loading('show', `正在连接${name}组件`);
        global[webSocket] = new WebSocket(`wss://localhost:${port}`);
        global[webSocket].onerror = function (event) {
            Logger.log(`没有安装${name}组件或组件没有打开`, event);
            loading('hide');
            reject({
                code: 500,
                msg: 'WEBSOCKET_ERROR',
            });
        };
        global[webSocket].onopen = function (event) {
            Logger.log(`${name}组件连接成功！`);
            loading('hide');
            setTimeout(resolve, 100);
        };
        global[webSocket].onclose = function (event) {
            Logger.log('Client notified webSocket has closed', event);
            onClose();
            global[webSocket] = null;
        };
    });
}

let currentSocketMessageCallback;

function bindSocketMessage (callback) {
    my.offSocketMessage(currentSocketMessageCallback);
    my.onSocketMessage(callback);
}


export async function openSocketMapp (platform,callback) {
    let socketConfig = webSocketMap[platform];
    /**
     * 千牛不吃wss协议?
     * @type {string}
     */
    let url = `${socketConfig.protocol}://localhost:${socketConfig.port}`;

    if (socketConfig.deferred) {
        let res = await socketConfig.deferred;
        return res;
    }

    socketConfig.deferred = getDeferred();

    while (1) {
        if (await new Promise(resolve => {
            my.connectSocket({
                url: url,
                success: () => {
                    Logger.log('print websocket connecting', socketConfig);
                },
                fail: (err) => {
                    Logger.log('print websocket connecting error', err);
                    my.offSocketOpen(onOpen);
                    my.offSocketError(onError);
                    resolve(false);
                },
            });

            const onOpen = (res) => {
                Logger.log('websocket print connected', socketConfig);
                my.offSocketOpen(onOpen);
                const onClose = (res) => {
                    Logger.log('websocket print closed！', res);
                    socketConfig.deferred = null;
                    my.offSocketMessage(currentSocketMessageCallback);
                    my.offSocketClose(onClose);
                };
                my.onSocketClose(onClose);
                resolve(true);
            };
            my.onSocketOpen(onOpen);
            const onError = (res) => {
                Logger.log('websocket print connect error', res);
                resolve(false);
                my.offSocketError(onError);
            };
            my.onSocketError(onError);
        })) {
            socketConfig.deferred.resolve(true);
            return true;
        };
        if (!await showConfirmModalAsync({
            confirmText:'重试',
            cancelText:'取消',
            content:'未安装菜鸟组件或菜鸟组件未打开，请打开后再试',
            title: '温馨提示',
        })
        ) {
            socketConfig.deferred.resolve(false);
            socketConfig.deferred = null;
            return false;
        }
    }

}
