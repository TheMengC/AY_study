import { api, ENV, isEmpty, moment, storage } from "tradePolyfills";
import { isIOS, NOOP } from "mapp_common/utils";
import { checkNewUser } from "mapp_common/utils/checkNewUser";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { contactCustomerService } from "mapp_common/utils/openChat";
import { goLink } from "mapp_common/marketing/utils/biz";

/**
 * 查看用户签到情况
 * @param checkInData 签到记录数组
 * @param callback
 * @param errorCallback
 * show 是否展示签到按钮 countdown 红包倒计时时间
 */
export function getCheckinStatus (checkInData, callback = NOOP, errorCallback = NOOP) {
    const userInfo = getUserInfo();
    let checkInRecords = checkInData.data.map((d) => { return d.checkintime; }).sort((a, b) => a > b ? 1 : -1);
    // 每条签到记录内相对应的连续签到天数
    let seriesRecords = checkInData.data.map((d) => { return d.series; });
    let checkinDays = checkInRecords.length; // 签到记录天数
    let lastRecords = checkinDays >= 1 ? checkInRecords[checkinDays - 1] : ''; // 最后一条签到记录
    // 已经使用折扣券
    if (checkInData.useDiscount != 0) {
        // 退出 并设置缓存
        callback({ show: false });
        storage.setItem('checkInHadEnd', true);
    }else{
        // 新用户
        if (checkNewUser(userInfo.createDate)) {
            if (!isEmpty(checkInRecords)) {
                // 新人有签到记录
            } else {
                callback({ show: true });
                return ;
            }
        }else{
            // 非新用户
            if (!isEmpty(checkInRecords)) {
                // 非新人有签到记录
                if (lastRecords.substr(0, 10) == moment().add(-1, 'day').format('YYYY-MM-DD')) {
                    // 最后一次签到记录为昨天 今日为续签
                } else if(lastRecords.substr(0, 10) == moment().format('YYYY-MM-DD')) {
                    // 最后一次的签到记录为今天 已签到
                    callback({ show: false }); // 不显示悬浮签到按钮
                    return ;
                }else{
                    // 非新用户断签
                    callback({ show: false, notNewUser: true });
                    return ;
                }
            } else {
                // 非新人无签到记录
                callback({ show: false, notNewUser: true });
                return ;
            }
        }
        // 连续签到天数数组不为空 且最后一条签到记录的连续天数大于7天
        if (!isEmpty(seriesRecords) && seriesRecords[0] >= 7) {
            // 签满7天 最后一条签到记录的时间 + 24h 就是活动彻底结束的时间
            // IOS下new Date()短横线分隔符的时间日期不生效
            let lastRecordTime = isIOS() ? lastRecords.replace(/-/g, "/") : lastRecords;
            let activeEndTime = new Date(lastRecordTime).getTime() + (1000 * 3600 * 24);
            if (activeEndTime > new Date().getTime()) {
                callback({ countdown: activeEndTime });
            } else {
                callback({ show: false });
            }
        } else {
            // 未签满七天
            storage.getItem('checkInToday').then((res) => {
                // 有今日已签到的缓存
                if (!isEmpty(res) && !isEmpty(res.data) && res.data == moment().format('YYYY-MM-DD')) {
                    callback({ show: false });
                } else if (lastRecords.substr(0, 10) == moment().format('YYYY-MM-DD')) {
                    // 最后一天的签到记录为今天
                    callback({ show: false });
                    storage.setItem('checkInToday', moment().format('YYYY-MM-DD'));
                } else {
                    callback({ show: true });
                }
            });
        }
    }
}

/**
 * 调用接口获取签到记录数据
 * @param userNick
 * @returns {Promise<unknown>}
 */
export async function getCheckinData (userNick) {
    return new Promise((resolve, reject) => {
        api({
            apiName:'aiyong.marketing.newuser.checkininfo.get',
            host: ENV.hosts.trade,
            method: '/activity/getUserCheckInInfo',
            isloading: false,
            // dataType:'json',
            args:{
                userNick: userNick,
                app: ENV.app,
            },
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
}
/**
 * 领取奖励（第七天）
 * @param  {String}  iOS/android
 * @return {}
 */
export const  getFinalAward = () => {
    if(isIOS()) {
        // 跳转客服
        let msg = '';
        if(ENV.app === 'trade') {
            msg = '你好，我已完成爱用交易7天签到，如何优惠解锁插件所有功能呀？';
        } else if(ENV.app === 'item') {
            msg = '你好，我已完成7天签到，如何优惠解锁插件所有功能呀？';
        }
        contactCustomerService(msg);
    } else {
        // 跳转服务市场
        if(ENV.app === 'trade') {
            goLink('https://fuwu.m.taobao.com/ser/confirmOrder1.htm?commonParams=activityCode%3AACT_877021141_190704115539%3BagentId%3Afuwu.taobao.com%7Cmarketing-Order-0%3BmarketKey%3AFWSPP_MARKETING_URL%3BpromIds%3A%5B1004347460%5D&subParams=cycleNum%3A3%2CcycleUnit%3A2%2CitemCode%3AFW_GOODS-1827490-v2&sign=ED975899A3C4AA7E3265EEF2187170A8');
        }
    }
};
