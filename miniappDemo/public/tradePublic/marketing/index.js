
import { isEmpty, getUserInfo, api } from "tradePolyfills";
import { timeDiffFromNow } from "tradePublic/utils";
import { isAutoPay } from "mapp_common/utils/userInfo";
import { marketConsole } from "mapp_common/marketing/utils";

const filterPids = [];

const DEFAULT_OPENAD_DATA = {
    n: 10,
    nf: 1,
    mo: 'android',
    rs: 0,
    did: 913181696,
    IMEI: 0,
    f: 'creative_name,creative_id,category,user_define,img_path,dest_url',
};
// 运营模块获取广告统一方法
export const getAd = ({ pid, callback, error_callback = undefined, data = {} }) => {
    if(filterPids.includes(`${pid}`)) {
        marketConsole('log', `这个广告是需要被过滤掉哒：${pid}`);
        return;
    }
    let args = {
        pid,
        ...DEFAULT_OPENAD_DATA,
        ...data,
    };
    api({
        apiName: 'aiyong.ad.showAd.get.creatives',
        args,
        callback: res => {
            if (res.status == '200') {
                // 先根据各种条件过滤一遍广告
                let adData = filterAd(res);
                // 然后随机指定一个广告
                if (isEmpty(adData.results)) {
                    // 如果过滤之后就没有广告了，那就直接返回吧，没必要随机啦
                    return callback(adData);
                }
                adData = randomAd(pid, adData);
                if (!isEmpty(adData.result)) {
                    adData.result.open_id = adData.open_id;
                    adData.result.pid = pid;
                }
                callback(adData);
            } else {
                callback(res);
            }
        },
        errCallback: err => {
            if (typeof error_callback === 'function') {
                error_callback(err);
            }
        },
    });
};

/*
 * @Description 过滤广告统一方法。
 * type：
 *  bannerAD、modal、notice
*/
export const filterAd = (adData) => {
    if (isEmpty(adData.results)) {
        return adData;
    }
    const userInfo = getUserInfo();
    let filteredAds = [];
    adData.results.forEach((res) => {
        // 2019-10-11 广告系统https SSL 失效，导致图片加载失败，将所有 https 换为 http
        if (res.img_path && res.img_path.includes('https:')) {
            res.img_path = res.img_path.replace('https://', 'http://');
        }
        let userDefine;
        if (typeof res.user_define === 'object') {
            userDefine = res.user_define;
        } else {
            userDefine = JSON.parse(res.user_define);
        }
        if (userDefine.body.vipflag == 0) {
            // 初级版广告
            if (userInfo.vipFlag != 0) {
                return;
            }
        } else if (parseInt(userDefine.body.vipflag) > 0) {
            // 高级版广告
            if (userInfo.vipFlag == 0) {
                return;
            }
        }
        if (isAutoPay() || (userInfo.lastPaidTime != null && timeDiffFromNow(userInfo.lastPaidTime) < 10)) {
            // 自动续费用户 || 10日内订购的用户 需要过滤掉售卖广告
            if (userDefine.body.type == 2) { // 1.功能跳转2.订购插件3.联系客服4.千牛电台
                return;
            }
        }
        filteredAds.push(res);
    });
    adData.results = filteredAds;
    adData.total_num = filteredAds.length;
    return adData;
};
/*
 * @Description 随机选择广告的cid
*/
const randomAd = (pid, adData) => {
    let rdomNum;
    const resultsLength = adData.results.length;
    if (isEmpty(rdomNum) && resultsLength > 0) {
        // 证明今天没有随机过嗷
        if (resultsLength == 1) {
            rdomNum = 0;
        } else {
            rdomNum = Math.ceil(Math.random() * resultsLength) - 1;
        }
    }
    adData.result = adData.results[rdomNum];
    adData.result.rdomNum = rdomNum;
    if (isEmpty(adData.result)) {
        // 如果到这里压根没有广告，那直接886
        return adData;
    }
    // 如果是有广告的，那统一把user_define给jsonParse一下~
    adData.result.user_define = JSON.parse(adData.result.user_define);
    return adData;
};
