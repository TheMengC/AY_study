/*
 * @Description 运营相关的一些工具方法
 */
import Taro from '@tarojs/taro';

import { getCurrentPageName, isEmpty, navigateTo } from "../../utils";
import { feedbackClicked } from "mapp_common/marketing/feedback";
import { contactCustomerService } from "mapp_common/utils/openChat";
import { isIOS, isPC, NOOP } from "mapp_common/utils";
import { AD_STATE, AD_TYPE, MARKETING_TYPE, switchPid } from "tradePublic/marketing/constants";
import { marketing_getState, togglePayResult, triggerAdInfoByPid } from "mapp_common/marketing/action";
import { goToOpenPlugin } from 'mapp_common/utils/goToOpenPlugin.js';
import { goToQAP } from 'mapp_common/utils/goToQAP.js';
import { marketConsole } from "mapp_common/marketing/utils/index";
import { getKeyName, getToday } from "tradePublic/utils";
import { ENV } from "@/constants/env";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { beacons } from "mapp_common/utils/beacon";
import { showLoading } from "mapp_common/utils/loading";
import { api } from "mapp_common/utils/api";
import { Logger } from "mapp_common/utils/logger";

export function convertShortLink (url) {
    return new Promise(res => {
        api({
            apiName: 'aiyong.tools.shortlink.convert',
            args:{ url },
            callback:res,
            errCallback:() => res(),
        });
    });
}

/**
 * 跳转付费
 * @param url
 * @returns {Promise<void>}
 */
export async function goLink  (url)  {
    let contactContent = `我想订购${ENV.appName}高级版功能 ，链接：${url}`;
    if (isIOS()) {
        Logger.log('ios不能跳转，只能联系客服了');

        contactCustomerService(contactContent);
        return;
    }

    if (url.length < 50) {
        url = await convertShortLink(url);
    }

    if (url && url.indexOf("fuwu.taobao.com") > 0) {

        try {
            my.qn.navigateToWebPage({ url });
        }catch (e) {
            Logger.error('安卓 但是跳转出错了，只能联系客服了',e);
            contactCustomerService(contactContent);
        }
    } else {
        Logger.error('安卓 但是取到的链接不对 不能跳转，只能联系客服了');
        contactCustomerService(contactContent);
    }
    // }
    // my.navigateToMiniProgram({
    //     appId: '3000000002140711',
    //     path:'/pages/service-detail/service-detail?serviceCode=FW_GOODS-1827490&tracelog=plugin',
    //     success: (res) => {
    //         marketConsole('log', JSON.stringify(res));
    //     },
    //     fail: (res) => {
    //         marketConsole('log', JSON.stringify(res));
    //     },
    // });

};

/*
 * @Description 跳转功能
*/
export const goFunc = (url) => {
    if(!isEmpty(url)){
        //跳转到qap或mini
        let qapOrMini = 'mini';
        if(url.includes('qap:///')){
            qapOrMini = 'qap';
        }
        //跳转到交易或商品
        let tradeOrItem = 'item';
        if(url.includes(',trade')){
            tradeOrItem = 'trade';
        }
        //跳转到qap
        if(qapOrMini == 'qap'){
            //正则目标 'qap:///BadInterceptNegativePage.js,trade'
            let reg = /.*(?!qap:)(?=.js)/;
            let qapPage = url.match(reg)[0].split('///')[1];
            //跳转交易qap没有实现
            if(tradeOrItem == 'trade'){
                const title = `假装跳转这个页面了~~ ${url}`;
                Taro.showToast({ title });
            }else{
                //跳转商品qap
                goToQAP({page:qapPage,pageName:'我咋知道这个页面名字是啥'});
            }
        }else{
            //默认跳转到商品小程序
            let appkey = '21085832';
            if(tradeOrItem == 'trade'){
                //跳转到交易小程序
                appkey = '21085840';
            }
            //拆分目标例子 'pages/badWordDetection/badWordIndex/index,item'
            let directPage = url.split(',')[0];
            goToOpenPlugin({
                appkey,
                directPage:{'url':directPage}
            });
        }
    }
};

/*
 * @Description 跳转页面
*/
export const goPage = (url) => {
    const title = `假装跳转这个页面了~~ ${url}`;
   // Taro.showToast({ title });
};

export const goClick = ({ customType, customUrl, customContent, adData, callback = NOOP, needFeedback = true }) => {
    const adInfo = !isEmpty(adData.user_define) ? adData.user_define.body : {};
    let { type, service } = adInfo;  // type  1.功能跳转 2.订购插件 3.联系客服 4.千牛电台
    type = customType ? customType : type; // 如果没有从外部传type进来，那就是默认使用广告内的type
    type = type + '';
    let { url } = adInfo;
    url = customUrl ? customUrl : url;// 如果没有从外部传url进来，那就是默认使用广告内的url
    service = customContent ? customContent : service;// 如果没有从外部传话术进来，那就是默认使用广告内的话术
    // 记录一下这个广告被点击啦~
    if(needFeedback) {
        feedbackClicked({ adData, url });
    }
    if(isPC()) {
        // 如果是PC的点击，和手机不太一样嗷
        switch(type) {
            // 1：功能跳转类型
            case AD_TYPE.JUMP_FUNC:
                goFunc(url);
                break;
            // 4: 千牛电台类型
            case AD_TYPE.QIANNIU_RADIO: {
                goPage(url);
                break;
            }
            // 3： 联系客服类型
            case AD_TYPE.CONTACT_KEFU: {
                console.error('假装我和客服聊天惹：', service);
                contactCustomerService(service);
                break;
            }
            // 2: 订购插件类型
            case AD_TYPE.FUWU_ORDER:
            default: {
                // 显示付款后按钮
                let modalData = { pid:adData.pid, state:AD_STATE.SHOULD_SHOW, url };
                if(adData.user_define && adData.user_define.body && adData.user_define.body.freebutton) {
                    modalData.isRenew = true;
                }
                togglePayResult(modalData);
                beforePayBeacon(adData);
                goLink(url);
                break;
            }
        }
    } else {
        // 根据type走不同的跳转
        switch(type) {
            // 1：功能跳转类型
            case AD_TYPE.JUMP_FUNC:
                goFunc(url);
                break;
            // 4: 千牛电台类型
            case AD_TYPE.QIANNIU_RADIO: {
                goPage(url);
                break;
            }
            // 3： 联系客服类型
            case AD_TYPE.CONTACT_KEFU: {
                beforePayBeacon(adData);
                console.error('假装我和客服聊天惹：', service);
                contactCustomerService(service);
                break;
            }
            // 2: 订购插件类型
            case AD_TYPE.FUWU_ORDER:
            default: {
                beforePayBeacon(adData);
                const type = adData.type;
                if(type !== MARKETING_TYPE.notice) {
                    // 公告的跳转链接不用显示二次确认框
                    // 显示付款后按钮
                    let modalData = { pid:adData.pid, state:AD_STATE.SHOULD_SHOW, url };
                    if(adData.user_define && adData.user_define.body && adData.user_define.body.freebutton) {
                        modalData.isRenew = true;
                    }
                    togglePayResult(modalData);
                }
                // ios用户需要联系客服
                if (isIOS()) {
                    let text = adInfo.service;
                    // 如果没有话术但是有跳转链接，那就跳跳跳
                    if(type === MARKETING_TYPE.notice) {
                        // 如果是公告，直接跳转链接
                        goLink(url);
                    } else if (isEmpty(text) && !isEmpty(adInfo) && adInfo.url.indexOf('qap:///') > -1) {
                        goLink(url);
                    } else {
                        // 如果有话术，那就直接联系客服
                        text = text.replace('【URL】', adInfo['ios-url']);
                        contactCustomerService(text);
                    }
                } else {
                    // 非ios用户直接跳转服务市场
                    goLink(url);
                }
                break;
            }
        }
    }
    if (!isEmpty(callback)) {
        callback();
    }
};

const beforePayBeacon = (adData) => {
    console.error({ adData });
    const { payBeaconParent, payBeacon } = ENV;
    const { userNick, vipFlag } = getUserInfo();
    const m7 = vipFlag == 0 ? 'upgrade' : '';
    const { pid, cname, cid, payUrl } = adData;
    const beaconObj = {
        p: payBeaconParent,
        e: payBeacon,
        m1: pid,
        m2: cname,
        m3: cid,
        m4: getSystemInfo().platform,
        n: userNick,
        m7,
        m8: payUrl ? payUrl : '',
    };
    beacons(beaconObj);
};

/*
 * @Description 展现功能点广告
*/
export const showModalVIP = (pid) => {
    pid = getRealPid(pid);
    showLoading();
    triggerAdInfoByPid({
        pid,
        state: AD_STATE.SHOULD_SHOW,
        type: MARKETING_TYPE.modalVip,
        callback:() => {
            Taro.hideLoading();
            if(isIOS()) {
                // 如果是ios用户，那只要看到一个广告就行~
                navigateTo({
                    url: '/public/mapp_common/marketing/modalVIP/ModalVIPios',
                    params: { pid },
                });
            }
        },
    });
};

/*
 * @Description 展现事后续费广告
*/
export const showAfterAction = (pid, pageName = undefined) => {
    const realPid = getRealPid(pid);
    const marketState = marketing_getState();
    let shouldShow = true;
    if(!isEmpty(marketState.afterActionInfo)) {
        // 如果有事后续费的信息
        const pagePid = marketState.afterActionInfo[isEmpty(pageName) ? getCurrentPageName() : pageName];
        const keyName = isEmpty(pageName) ? getKeyName(pagePid) : `${pageName}_${realPid}`;
        if(!isEmpty(marketState[keyName])) {
            // 并且这个pid有广告信息
            const ad = marketState[keyName];
            if(getToday() === ad.lastCloseTime || ad.state !== AD_STATE.NOT_SHOW) {
                // 如果今天这个页面已经弹过了，或者还没有关，那就不弹啦，无事发生
                marketConsole('log', '今天这个页面已经弹过了，或者还没有关，那就不弹啦，无事发生');
                shouldShow = false;
            }
        }
    }
    if(shouldShow) {
        triggerAdInfoByPid({
            pid:realPid,
            state:AD_STATE.AFTER_ACTION_MODAL,
            type: MARKETING_TYPE.afterAction,
        });
    }
};


/*
 * @Description 把功能点广告的安卓pid转成iospid
*/
export const getRealPid = (pid) => {
    if(isIOS()) {
        return isEmpty(switchPid[pid]) ? pid : switchPid[pid];
    } else {
        return pid;
    }
};
