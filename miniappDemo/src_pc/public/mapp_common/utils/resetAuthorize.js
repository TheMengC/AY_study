import { userInfoInit } from "mapp_common/utils/userInfo";
import { NOOP } from "tradePolyfills/index";
import Taro from "@tarojs/taro";

/**
 * 重新授权
 * @returns {*}
 */
export function resetAuthorize ({ callback = NOOP } = {}) {
    if (!my.qn || !my.qn.cleanToken) {
        Taro.showToast({ title: '无法重新授权' + !!my.qn + !!((my.qn||{}).cleanToken) });
        return;
    }
    my.qn.cleanToken({
        success: (res) => {
            Taro.showToast({ title: '清除授权成功' + JSON.stringify(res) });
            userInfoInit(callback);
        },
        fail: (res) => {
            Taro.showToast({ title: '清除授权失败' + JSON.stringify(res) });
        },
    });
};
