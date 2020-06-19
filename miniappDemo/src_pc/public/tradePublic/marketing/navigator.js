/*
 * @Description 根据广告的不同type做不同预处理
 */
import {
    checkNewUser,
    getCurrentPageName,
    getEntry,
    getLastCloseTime,
    getSystemInfo,
    getUserInfo,
    isEmpty,
    isIOS
} from "tradePolyfills";
import { AD_STATE, CONST_PIDS, MARKETING_TYPE, nameToFlag, NO_AD_PID } from "tradePublic/marketing/constants";
import { ENV } from "@/constants/env";
import { getKeyName, getToday, judgeRenew } from "tradePublic/utils";

const app = ENV.app;
let platform = getSystemInfo().platform;

/*
 * @Description 获取真实的modaladpid
 */
export const getModalPid = (from) => {
    if(from !== getEntry()) {
        // 证明不是入口广告，不弹
        return undefined;
    }
    const vipFlag = getUserInfo().vipFlag;
    const createDate = getUserInfo().createDate;
    const today = getToday();
    // 获取运营广告的pid
    const marketingPid = CONST_PIDS[app][platform]['marketing'][from];
    // 获取运营广告上次展示时间
    const marketingLastTime = getLastCloseTime(marketingPid);
    // 获取强提示的pid
    const highPid = CONST_PIDS[app][platform][vipFlag > 0 ? 'high' : 'high_free'][from];
    // 获取强提示上次展示时间
    const highLastTime = getLastCloseTime(highPid);
    let pid;
    // 通常情况下的广告是不需要要在逻辑里判断要不要展示的，但是由于强提示和运营广告有递进关系，所以需要在这里判断一下
    if (judgeRenew('high') && highLastTime !== today && highPid !== NO_AD_PID) {
        // 获取指定平台、插件下的强提示pid
        pid = highPid;
    } else if (marketingLastTime !== today && marketingPid !== NO_AD_PID) {
        pid = marketingPid;
    }
    // 临时增加纯新用户的弹窗 android & ios
    console.log(checkNewUser(createDate) + 'checkNewUser(createDate)');
    if(checkNewUser(createDate) == 1) {
        pid = isIOS() ? 3645 : 3625;
        return pid;
    }
    return pid;
};

/*
 * @Description 获取真实的中提示pid
 */
export const getMidModalPid = (from) => {
    if(from !== getEntry()) {
        // 证明不是入口广告，不弹
        return undefined;
    }
    let pid;
    if (judgeRenew('middle')) {
        const vipFlag = getUserInfo().vipFlag;
        pid = CONST_PIDS[app][platform][vipFlag > 0 ? 'middle' : 'middle_free'][from];
    }
    return pid;
};

/*
 * @Description 获取真实的角标中提示pid
 */
export const getMidCouponPid = (from) => {
    let pid;
    const vipFlag = getUserInfo().vipFlag;
    if (judgeRenew('middle') && vipFlag === nameToFlag.COMMON_VIP) {
        pid = CONST_PIDS[app][platform]['coupon'][from];
    }
    return pid;
};

/*
 * @Description 判断要不要渲染公告
 */
export const shouldRenderNotice = () => {
    const { notice, renewMessage } = getUserInfo();
    if(!isEmpty(notice) || (!isEmpty(renewMessage) && renewMessage.low)) {
        return MARKETING_TYPE.notice;
    }
};

/*
 * @Description 获取真实的banner的pid
 */
export const getBannerPid = (from) => {
    let pid;
    pid = CONST_PIDS[app][platform]['banner'][from];
    const createDate = getUserInfo().createDate;
    if(checkNewUser(createDate)) {
        pid = CONST_PIDS[app][platform]['banner_newuser'][from];
    }
    return pid;
};

/*
 * @Description 获取中提示卡片pid
 */
export const getMidCardPid = () => {
    let pid;
    const vipFlag = getUserInfo().vipFlag;
    if (judgeRenew('middle') && vipFlag === nameToFlag.COMMON_VIP) {
        pid = CONST_PIDS[app][platform]['middle_card'];
    }
    return pid;
};

/*
 * @Description 判断事后续费的逻辑
 */
export const shouldAfterAction = (props) => {
    const { afterActionInfo } = props;
    if (!isEmpty(afterActionInfo)) {
        let pid = afterActionInfo[getCurrentPageName()];
        const { [getKeyName(pid)]: ad } = props;
        if (!isEmpty(ad) && ad.state !== AD_STATE.NOT_SHOW) {
            return pid;
        }
    }
    return null;
};

/*
 * @Description 触发展现事后续费弹窗
 */
export const triggerShowAfterAction = (props, state) => {
    const { afterActionInfo } = props;
    if(!isEmpty(afterActionInfo)) {
        const pid = afterActionInfo[getCurrentPageName()];
        if(!isEmpty(pid)) {
            const keyName = getKeyName(pid);
            const { [keyName]:ad } = props;
            const { showAD, currentPid } = state;
            if(!isEmpty(ad) && !isEmpty(ad.adInfo) && ad.state !== AD_STATE.NOT_SHOW && !showAD && currentPid !== pid) {
                return {
                    pid,
                    state:ad.state ? ad.state : AD_STATE.AFTER_ACTION_MODAL,
                };
            }
        }
    }
    return null;
};
