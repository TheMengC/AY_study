import Taro from '@tarojs/taro';
import { deepCopyObj, getCurrentPageName, isEmpty, isIOS, isPC, NOOP } from "mapp_common/utils";

import { storage } from "mapp_common/utils/storage";
import { AD_STATE,
    MARKETING_STORAGE_KEY,
    MARKETING_TYPE,
    MODAL_VIP_LIST,
    NO_AD_PID } from "tradePublic/marketing/constants";
import moment from "mapp_common/utils/moment";
import { ENV } from "@/constants/env";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { feedbackShowed } from "mapp_common/marketing/feedback";
import { getAd } from "tradePublic/marketing";
import { marketConsole } from "mapp_common/marketing/utils";
import { getKeyName, getToday, judgeRenew } from "tradePublic/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { isAutoPay, isHuser } from "mapp_common/utils/userInfo";



/*
 * @Description 首次进入插件时，把localStorage中的广告信息同步到redux里
*/
export const marketingReduxInit = () => {
    const localInfo = marketing_getStorage();
    if (!isEmpty(localInfo)) {
        marketing_dispatch(localInfo);
    }
};

/*
 * @Description 生成符合redux的marketing结构的数据
*/
const createAdData = (pid, adInfo, state, type) => {
    const ad = {
        pid,
        lastCloseTime: state === false ? getToday() : undefined,
        page: getCurrentPageName(),
        state,
        adInfo,
        type,
    };
    return ad;
};

/*
 * @Description 更新redux中的广告信息
*/
export const marketing_dispatch = (data) => {
    marketConsole('log', '同步marketing的缓存到redux惹', data);
    Taro.getApp().store.dispatch({ type: "UPDATE_AD_INFO", data });
};

/*
 * @Description 获取redux中的所有广告信息
*/
export const marketing_getState = () => {
    return Taro.getApp().store.getState().marketingAdInfoReducer;
};

/*
 * @Description 取缓存中的广告数据
*/
const marketing_getStorage = () => {
    return storage.getItemSync(MARKETING_STORAGE_KEY);
};

/*
 * @Description 把广告数据丢到缓存里
*/
const marketing_setStorage = (data) => {
    const storageData = deepCopyObj(data);
    Object.keys(storageData).forEach(key => {
        storageData[key].adInfo = undefined;
        storageData[key].showPayResult = undefined;
    });
    storage.setItemSync(MARKETING_STORAGE_KEY, storageData);
};

/*
 * @Description 判断是否需要展示广告
*/
const judgeShow = (adInfo) => {
    if (isEmpty(adInfo)) {
        marketConsole('log', '≠≠≠这个广告啥信息都没有，赶紧获取他~≠≠≠');
        return true;
    }
    if(adInfo.type === MARKETING_TYPE.modalVip) {
        marketConsole('log', '≠≠≠功能点广告的每次都弹弹弹~~~≠≠≠');
        return true;
    }
    const { lastCloseTime, type } = adInfo;
    const today = getToday();
    let shouldShow = true;
    marketConsole('log', `≠≠≠这是个${type}广告≠≠≠`);
    if (lastCloseTime === today) {
        marketConsole('log', '≠≠≠今天已经弹过啦≠≠≠');
        shouldShow = false;
    }
    marketConsole('log', `≠≠≠对这个广告的分析结果是：${shouldShow ? '弹他！' : '放过孩子吧'}≠≠≠`);
    return shouldShow;
};

/*
 * @Description 用来控制要不要展现广告，调试用
*/
const shouldShowAd = true;

/*
 * @Description 根据pid获取redux中的广告信息
*/
export const triggerAdInfoByPid = ({ pid, state = AD_STATE.SHOULD_SHOW, type, callback = NOOP }) => {
    if (process.env.NODE_ENV === 'development')  {
        if(shouldShowAd === false && type !== MARKETING_TYPE.modalVip && type !== MARKETING_TYPE.afterAction) {
            return;
        }
    }
    marketConsole('log', `≠≠≠开始进入${pid}广告更新进程≠≠≠`);
    if (pid === NO_AD_PID) {
        marketConsole('log', `≠≠≠确认过眼神，是不需要弹广告的情况~peace out~≠≠≠`);
        return;
    }
    let tempKey = getKeyName(pid);
    if(type === MARKETING_TYPE.modalVip) {
        // 功能点广告的话，pid=modalvip
        tempKey = MARKETING_TYPE.modalVip;
    }
    let adInfo = marketing_getState()[tempKey];
    let shouldShow = judgeShow(adInfo);
    // 触发更新广告里的redux数据
    if (shouldShow) {
        if (isEmpty(adInfo) || isEmpty(adInfo.adInfo) || adInfo.type === MARKETING_TYPE.modalVip) {
            // 如果redux里压根没有这个pid的所有信息，或者有pid的信息，但是没有广告内容（从缓存中搬到redux的）
            // 这个时候直接获取新的广告信息就行
            marketConsole('log', `≠≠≠此时需要获取一下pid：${pid}的最新的广告信息~≠≠≠`);
            switch(type) {
                case MARKETING_TYPE.notice: {
                    // 获取公告and弱提示的内容
                    const { notice, renewDatas, renewMessage } = getUserInfo();
                    let renderContent = {};
                    if(!isEmpty(notice)) {
                        renderContent.notice = notice;
                    }
                    if(!isHuser() && !isAutoPay() && renewMessage && renewMessage.low && renewDatas && !isEmpty(renewDatas.lowData)) {
                        // 非H版、非自动续费用户才可以拥有弱提示
                        renderContent.lowData = renewDatas.lowData;
                    }
                    if(isEmpty(renderContent)) {
                        return null;
                    }
                    const data = createAdData(pid, renderContent, AD_STATE.SHOULD_SHOW, MARKETING_TYPE.notice);
                    feedbackShowed({ adData:data.adInfo });
                    updateReduxAdByPid({ pid, data });
                    callback(shouldShow);
                    break;
                }
                case MARKETING_TYPE.modalVip: {
                    let pidList = MODAL_VIP_LIST[ENV.app][getUserInfo().vipflag == 1 ? 'renew' : 'upgrade'][getSystemInfo().platform];
                    if(isIOS() || isPC()) {
                        pidList = [pid];
                    } else {
                        if(!pidList.includes(pid.toString())) {
                            pidList.push(pid);
                        }
                    }
                    const marketingPromiseList = pidList.map(item => {
                        return new Promise((resolve) => {
                            getAd({
                                pid:item,
                                callback: adData => {
                                    resolve({ pid:item, adData:adData.result });
                                },
                            });
                        });
                    });
                    Promise.all(marketingPromiseList).then((adData) => {
                        adData.map(item => {
                            if(item.pid == pid) {
                                feedbackShowed({ adData:item.adData });
                            }
                        });
                        let data = createAdData(type, adData, state, type);
                        data.currentPid = pid;
                        marketConsole('log', `≠≠≠${type}广告冲冲冲~≠≠≠`);
                        updateReduxAdByPid({ pid:type, data });
                        callback(shouldShow);
                    });
                    break;
                }
                case MARKETING_TYPE.afterAction: {
                    if(!judgeRenew('high') || isAutoPay()) {
                        // 只有强提示阶段的非自动续费用户需要显示事后续费
                        callback(false);
                        return;
                    }
                    // 先获得广告，然后把页面&pid放到redux里
                    getAd({
                        pid,
                        callback: adData => {
                            let data = createAdData(pid, adData.result, state, type);
                            marketConsole('log', `≠≠≠${pid}广告冲冲冲~≠≠≠`);
                            feedbackShowed({ adData:adData.result });
                            updateReduxAdByPid({ pid, data });
                            recordAfterActionAdInfo(pid);
                            callback(shouldShow);
                        },
                    });
                    break;
                }
                default: {
                    if(isHuser()) {
                        marketConsole('log', `≠≠≠这是个h版用户，溜了溜了≠≠≠`);
                        callback(false);
                        return;
                    }
                    getAd({
                        pid,
                        callback: adData => {
                            // 如果是重新获取的广告信息，那肯定是没有redux结构的，让我们来建造一下
                            let data = createAdData(pid, adData.result, state, type);
                            if(type !== MARKETING_TYPE.midModal) {
                                if(!isEmpty(adData.result)) {
                                    // 中提示弹窗的时间反馈应该是在点击广告之后，所以这里不触发feedback
                                    feedbackShowed({ adData:adData.result });
                                }
                            }
                            marketConsole('log', `≠≠≠${pid}广告冲冲冲~≠≠≠`);
                            updateReduxAdByPid({ pid, data });
                            callback(shouldShow);
                        },
                    });
                }
            }
        } else {
            // 如果redux里有广告信息，那就直接提交redux里的广告信息，不用重新获取了
            marketConsole('log', `≠≠≠redux里有${pid}广告内容，我只需要更新一下state就可以惹≠≠≠`);
            adInfo.state = state;
            if(state !== AD_STATE.NOT_SHOW && type === MARKETING_TYPE.modalVip) {
                // 如果是打开的modalvip，需要重新记录一下显示事件
                adInfo.adInfo.map(item => {
                    if(item.pid == pid) {
                        feedbackShowed({ adData:item.adData });
                    }
                });
            }
            updateReduxAdByPid({ pid, data: adInfo });
            callback(shouldShow);
        }
    } else {
        marketConsole('log', `≠≠≠不需要展示${pid}广告，告辞≠≠≠`);
    }
};

/*
 * @Description 根据pid更新广告状态
*/
export const updateReduxAdByPid = ({ pid, data }) => {
    let key;
    if(pid === MARKETING_TYPE.modalVip) {
        key = pid;
    } else {
        key = getKeyName(pid);
    }
    saveNewToRedux({ key, data });
};

/*
 * @Description 记录当前页面的事后续费情况
*/
const recordAfterActionAdInfo = (pid) => {
    const data = { [getCurrentPageName()] : pid };
    saveNewToRedux({ key:'afterActionInfo', data });
};

const saveNewToRedux = ({ key, data }) => {
    const oldState = marketing_getState();
    let oldAdInfo = deepCopyObj(oldState[key]);
    let newAdInfo = Object.assign({}, oldAdInfo, data);
    const newState = Object.assign({}, oldState, { [key]:newAdInfo });
    marketing_setStorage(newState);
    Taro.getApp().store.dispatch({ type: "UPDATE_AD_INFO",  data: newState });
};

/*
 * @Description 关闭某个广告
*/
export const closeAdByPid = ({ pid, still = false }) => {
    const data = {
        state: false,
        lastCloseTime: still ? undefined : getToday(),
    };
    updateReduxAdByPid({ pid, data });
};

/*
 * @Description 获取指定广告的上次关闭时间
*/
export const getLastCloseTime = (pid) => {
    const keyName = getKeyName(pid);
    const adState = marketing_getState()[keyName];
    return adState ? adState['lastCloseTime'] : '';
};

/*
 * @Description 仅修改某个广告的最后关闭时间
*/
export const setLastCloseTime = (pid) => {
    updateReduxAdByPid({
        pid,
        data:{ lastCloseTime:getToday() },
    });
};

/*
 * @Description 中提示优惠券开始计时啦
*/
export const couponStartCount = (pid) => {
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const data = { startTime };
    updateReduxAdByPid({ pid, data });
    return startTime;
};

/*
 * @Description 更改付款后二次确认弹窗状态
*/
export const togglePayResult = ({ pid, state, url = undefined, isRenew = undefined }) => {
    if(isIOS()) {
        return;
    } else {
        const showPayResult = { state, url, isRenew };
        const data = { showPayResult };
        updateReduxAdByPid({ pid, data });
    }
};
