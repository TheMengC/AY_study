import { Logger } from "mapp_common/utils/logger";
import { isPC } from "mapp_common/utils";
import Taro  from '@tarojs/taro';

const shouldMarketingLog = true;

/*
 * @Description marketing统一console
*/
export function marketConsole () {
    if(shouldMarketingLog && process.env.NODE_ENV === 'development') {
        const args2 = [...arguments];
        Logger[args2[0]](...args2);
    }
}

/*
 * @Description 运营统一收起tabbar功能，非pc可用
*/
export const marketingHideTabbar = () => {
    if(!isPC()) {
        Taro.hideTabBar({ animation: true });
    }
};

/*
 * @Description 运营统一展开tabbar功能，非pc可用
*/
export const marketingShowTabbar = () => {
    if(!isPC()) {
        Taro.showTabBar({ animation: true });
    }
};

