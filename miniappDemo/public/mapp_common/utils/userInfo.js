import { api, entry, initphpSessionIdDeferred } from "./api";
import { ENV } from "@/constants/env";
import { formatError, getDeferred, isEmpty, isIDE, showConfirmModal } from "./index";
import { events } from "mapp_common/utils/eventManager";
import moment from "mapp_common/utils/moment";
import { storage } from "mapp_common/utils/storage";
import { Logger } from "mapp_common/utils/logger";
import { judgeRenew } from "tradePublic/utils";
import { getUserInfo, setUserInfo } from "mapp_common/utils/userInfoChanger";
import { nameToFlag } from "tradePublic/marketing/constants";
import { checkIn_dispatch, newUserTasks_dispatch } from "mapp_common/newUserVillage/action";
import { tradeBeacon } from "mapp_common/utils/beacon";
import Taro from "@tarojs/taro";
import { openChat } from "mapp_common/utils/openChat";
import { NOOP } from "mapp_common/utils/index";

const { app } = ENV;
export const userInfoDeferred = getDeferred();
export const authDeferred = getDeferred();
export const testUser = {
    // nickName: '子小一十八',
    // access_token: '80008901239nOZZ0nyiqvaetdbBax3PuyeKkOjvhtyCCYnpugNQ12fee8d2VRQMROONUpfU5'
    nickName:'赵东昊的测试店铺',
    // nickName:'sinpo0',
    // access_token:'80008201047oUmyiZ6nyfidDRqkWFiqgPSzDkDKn4jUXjCW9uwgupXvdECv108e4a1dCn2gzj',

};

export const initUserInfoFromCache = () => {
    let cache = storage.getItemSync('userInfo');
    Logger.warn("initUserInfoFromCache", cache);
    setUserInfo(cache);
};

/*
 * @Description 接入tc/user，获取用户信息
*/
export const userInfoInit = (callback = NOOP) => {
    initphpSessionIdDeferred();
    authorize().then(res => {
        const nick = !isEmpty(res) ? res.nickName : testUser.nickName;
        entry({
            callback:(userInfoEntry) => {
                Logger.warn("userInfoEntry", userInfoEntry);
                setUserInfo(userInfoEntry);
            },
        });
        fetchUserInfoFromTcUser({
            nick,
            callback:(newUserInfo) => {

                // 添加一些便于使用的userInfo相关内容
                // 该展示的账号版本
                newUserInfo.showVipState = newUserInfo.vipFlag > 0 ? '高级版' : '初级版';
                // 用户版本剩余天数
                newUserInfo.vipRemain = getVipRemain(newUserInfo.vipTime);
                // 展示用的到期时间
                let showVipTime = '';
                if(newUserInfo.vipRemain === 1) {
                    showVipTime = '今天到期';
                } else if (judgeRenew('high', newUserInfo.vipRemain)) {
                    showVipTime = `剩余${newUserInfo.vipRemain}天`;
                } else {
                    showVipTime = `到期时间：${newUserInfo.vipTime}`;
                }
                newUserInfo.showVipTime = showVipTime;
                // 展示用的升级/续费按钮
                newUserInfo.showPayBtn = newUserInfo.vipFlag ? '续费' : '升级';
                // 判断是否是子账号
                if (!isEmpty(newUserInfo.sub_nick)) {
                    newUserInfo.subUserNick = newUserInfo.sub_nick;
                }
                Logger.warn("fetchUserInfoFromTcUser", newUserInfo);
                setUserInfo(newUserInfo);
                userInfoDeferred.resolve();
                events.userInfoCallback.emit(newUserInfo);
                callback(newUserInfo);
                getCheckinData(nick).then(res => {
                    checkIn_dispatch(res);
                });
                setTimeout(() => {
                    getNewUserTasksData(nick).then(res => {
                        newUserTasks_dispatch(res);
                    });
                }, 5000);

            },
        });
    });
};

/**
 * 授权失败 并弹出对话框 可以选择退出或者重新授权 重新授权会清除授权
 * @param location
 * @param err
 */
async function authFailed (location, err) {

    Logger.error('auth failed', location, err);
    err = JSON.stringify(err);
    tradeBeacon({ func:'authorize_failed', m3:location, m4:err });
    let retry = await new Promise((resolve) => {
        showConfirmModal({
            content: '授权失败' + location + err,
            cancelText: '退出',
            confirmText: "重试",
            onCancel: () => {
                my.qn.returnData();
                resolve(false);
            },
            onConfirm: () => {
                my.qn.cleanToken({
                    success: (res) => {
                        Taro.showToast({ title: '清除授权成功' + JSON.stringify(res) });
                        resolve(true);
                    },
                    fail: (res) => {
                        Taro.showToast({ title: '清除授权失败' + JSON.stringify(res) });
                        resolve(true);
                    },
                });

            },
        });
    });
    if (retry) {
        return authorize();
    }else{
        return;
    }
}

/**
 * 授权 并拿到用户信息
 * @returns {Promise<{access_token: string, nickName: string}|{[p: string]: *}|{access_token: string, nickName: string}|*|undefined>}
 */
export async function authorize () {
    if (isIDE()) {
        Logger.error('auth dev mode',);
        tradeBeacon({
            func: 'auth_dev_mode',
            m3: !!my.qn,
            m4: !!(my.qn || {}).openPlugin,
        });
        authDeferred.resolve(testUser);
        return testUser;
    }
    try {
        let { authRes, authErr } = await new Promise((resolve) => {
            my.authorize({
                scopes: '*',
                success: (authRes) => {
                    Logger.warn('authorize', authRes);
                    setUserInfo({ accessToken: authRes.accessToken });
                    resolve({ authRes });
                },
                fail: (authErr) => {
                    resolve({  authErr });
                },
            });
        });
        if (authErr) {
            return   authFailed('authorize_fail', authErr);
        }
        authDeferred.resolve(authRes);

        let { userRes, userErr } = await new Promise((resolve) => {
            my.getAuthUserInfo({
                success: (userRes) => {
                    Logger.warn('getAuthUserInfo', userRes);
                    resolve({ userRes });
                },
                fail: (userErr) => {
                    resolve({ userErr });
                },
            });
        });

        /**
         * 这个地方可能是accessToken失效
         * 具体逻辑是这样的:
         *
         * 第一次进入小程序调用`my.authorize` 会得到一个accessToken 然后千牛会存在本地
         * 然后下次进来判断本地有没有 如果有 那就直接走success
         * 但是这个缓存里的accessToken是不一定有效的
         * 也就是虽然`my.authorize`走到了success 但是返回出来的accessToken在服务器看来是无效的
         * 然后这个`my.getAuthUserInfo`走到fail 大概率就是accessToken失效了 需要重新授权
         * 重新授权就是调用my.clearToken将本地的accessToken缓存清除 然后调my.authorize 重新授权
         */
        if (userErr) {
            return authFailed('getAuthUserInfo_fail', userErr);
        }
        return setUserInfo(userRes);
    }catch (e) {
        return authFailed('authorize throw', e);
    }
};
/**
 * 获取任务记录数据
 * @param userNick
 * @returns {Promise<unknown>}
 */
export const getNewUserTasksData = (userNick) => {
    return new Promise((resolve, reject) => {
        api({
            apiName:'aiyong.marketing.newuser.taskinfo.get',
            host: ENV.hosts.trade,
            method: '/activity/getNewUserTaskInfo',
            isloading: false,
            // dataType:'json',
            args:{
                userNick: userNick,
                app,
            },
            callback: res => {
                const { taskInfo, taskStatus } = res;
                // 小程序版不需要扫码发货以及设置默认插件的任务
                let userTasks = taskInfo && taskInfo.filter(item => {
                    return item.id != 13 && item.id != 16;
                });
                let statusArr = taskStatus && taskStatus.filter(item => {
                    return item.task_id != 13 && item.task_id != 16;
                });
                res = { "taskInfo": userTasks, "taskStatus": statusArr };
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
};
/**
 * 获取签到记录数据
 * @param userNick
 * @returns {Promise<unknown>}
 */
export const getCheckinData = (userNick) => {
    return new Promise((resolve, reject) => {
        api({
            apiName:'aiyong.marketing.newuser.checkininfo.get',
            host: ENV.hosts.trade,
            method: '/activity/getUserCheckInInfo',
            isloading: false,
            // dataType:'json',
            args:{
                userNick: userNick,
                app,
            },
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
};

const authNameMap = {
    'trade': "查看订单",
    'update': "修改订单",
    'refund': "处理退款",
    'logistics': "查看物流信息",
    'rate': "评价",
    'close': "关闭订单",
};
/**
 * 权限受到了限制 主要是因为tc/user返回的needauth为1 有可能是授权过期 或子账号的accessToken权限不足导致的
 * 要找主账号授权
 */
export function authLimited (authResult) {
    let unAuthorizedPermissionsStr = '';
    try{
        if (authResult && Object.keys(authResult)) {
            unAuthorizedPermissionsStr = Object.keys(authResult).map(key => {
                if (authResult[key] && authResult[key].code == 27 || authResult[key].code == 12) {
                    return authNameMap[key];
                }
            }).filter(Boolean).join('，');
            if (unAuthorizedPermissionsStr) {
                unAuthorizedPermissionsStr = `，当前缺失${unAuthorizedPermissionsStr}权限`;
            }
        }
    }catch (e) {
        Taro.showToast({ title: JSON.stringify(formatError(e)) });
    }

    showConfirmModal({
        title:'温馨提示',
        content: '爱用交易授权即将过期，自动评价、差评拦截、自动合单功能将无法正常使用，请立即联系主账号进行授权' + unAuthorizedPermissionsStr,
        showCancel: false,
        confirmText: '联系主账号授权',
        onConfirm:() => {
            openChat({
                nick: getUserInfo().userNick,
                text: '爱用交易授权即将过期，现在需要使用主账号的登录千牛，打开爱用交易授权，' +
                    '如不授权，所有账号将无法进入爱用交易，自动评价、差评拦截、自动合单功能无法正常使用，请立即授权爱用交易。',
            });
        },
    });
}
/*
 * @Description 从tcUser获取用户信息
*/
export const fetchUserInfoFromTcUser = ({ callback, nick  }) => {
    let args = { isqap: 1, slot: 'miniapp' };
    if (isIDE()) {
        args.nick = testUser.nickName;
        args.access_token = testUser.access_token;
    }
    api({
        apiName:ENV.userApiName,
        path:'/tc/user',
        args,
        callback:res => {

            const newUserInfo = {
                userNick: res.nick,
                vipFlag: res.vipflag,
                vipTime: res.order_cycle_end.split(' ')[0],
                isH: res.h,
                createDate: res.createdate,
                lastPaidTime: res.last_paid_time,
                tag: res.tag,
                renewMessage: res.vip_renew_message,
                notice: res.notice,
                renewDatas: res.renewDatas,
                sub_nick: res.sub_nick,
                user_id: res.user_id,
                newMemoSet: res.newMemoSet || 0,
                needauth: res.needauth,
                type: res.miniapp_shop_type,
            };
            callback(newUserInfo);
            if (res.needauth == '1') {
                authLimited(res.auth);
            }
        },
    });
};

/*
 * @Description 获取用户周期剩余时间
*/
const getVipRemain = (viptime) => {
    return moment(viptime).diff(moment(), 'day') + 1;
};

/**
 * 付了钱的用户 可以用存单高级搜索
 * @returns {boolean}
 */
export function isPaidVip () {
    return getUserInfo().vipFlag == 1 || getUserInfo().vipFlag == 3;
};

/**
 * 是否为初级版用户
 * @returns {boolean}
 */
export const isNotVip = () => {
    return getUserInfo().vipFlag == 0;
};

export const getMainUserName = () => {
    return getUserInfo().userNick.split(':')[0];
};

/*
 * @Description 判断是不是h版用户
*/
export const isHuser = () => {
    return getUserInfo().isH == 1;
};

/*
 * @Description 判断是否是自动续费用户
*/
export const isAutoPay = () => {
    return getUserInfo().vipFlag == nameToFlag.AUTO_PAY;
};
