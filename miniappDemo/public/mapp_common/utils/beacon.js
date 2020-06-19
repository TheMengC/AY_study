import { getCurrentVersionNum } from "mapp_common/utils/version";
import { getCurrentPageName } from "mapp_common/utils/index";
import { Logger } from "mapp_common/utils/logger";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { ENV } from "@/constants/env";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { getCloud } from "mapp_common/utils/cloud";
import { getphpSessionIdDeferred } from "mapp_common/utils/api";
import { userInfoDeferred } from "mapp_common/utils/userInfo";

/**
 * 商品的封装过的埋点
 * flag为false 就是不区分初高级
 */
export const itemBeacon = ({
    page = getCurrentPageName(),
    func,
    flag = true,
    ...rest
}) => {
    newBeacon({
        page,
        func,
        flag,
        project: 'TD20200117150137',
        ...rest,
    });
};

/**
 * 交易的封装过的埋点
 */
export const tradeBeacon = ({
    page = getCurrentPageName(),
    func,
    flag = true,
    ...rest
}) => {
    newBeacon({
        page,
        func,
        flag,
        project: 'TD20191206151236',
        ...rest,
    });
};

/**
 * 埋点统一方法
 * @param page
 * @param func
 * @param project
 * @param rest
 */
export function newBeacon (
    {
        page = getCurrentPageName(),
        func,
        flag,
        project,
        ...rest
    }) {
    userInfoDeferred.then(() => {
        let vipFlag = +!!(getUserInfo().vipFlag);
        let vipFlagStr = vipFlag ? 'vip' : 'free';
        let e;
        if (flag) {
            e = [page, func, vipFlagStr].join('-');
        } else {
            e = [page, func].join('-');
        }
        beacons({
            n: getUserInfo().userNick,
            e: e,
            p: project,
            m1: page,
            m2: func,
            d1: getUserInfo().vipFlag,
            d2: getCurrentVersionNum(),
            ...rest,
        });
    });
}

/*
 * @Description 运营埋点
*/
export const marketingBeacon = (type, pid, level) => {
    const { app, marketingParent, platform: where } = ENV;
    const { platform } = getSystemInfo();
    let beaconObj = {
        n: getUserInfo().userNick,
        e: `${where}_${app}_${platform}_${level}_${type}`,
        p: marketingParent,
        m1: getCurrentPageName(),
        m2: pid,
        d1: getUserInfo().vipFlag,
        d2: getCurrentVersionNum(),
    };
    beacons(beaconObj);
};

/**
 * 埋点
 * @type {Object}
 */
export function beacons (args) {
    args.d6 = ENV.platform;
    args.t = new Date().getTime();
    getphpSessionIdDeferred().then(phpSessionId => {
        let data = {
            path : 'beacon',
            method: 'POST',
            body:{
                api_name:'aiyong.mcs.1.gif',
                version:'1',
                phpSessionId:phpSessionId,

                ...args,
            },
        };
        getCloud().application.httpRequest(data).then(res => {
            Logger.debug('beacons', args);
        }).catch(e => Logger.warn(e));
    });

};
export function beacon () {

}
