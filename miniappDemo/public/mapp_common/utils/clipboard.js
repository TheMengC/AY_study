import Taro from "@tarojs/taro";
import { Logger } from "mapp_common/utils/logger";
import { NOOP } from "mapp_common/utils/index";

/**
 * 复制文字并弹出复制成功的提示
 * @param content
 * @param toastText
 */
export const copyText = ({  text, msg = '复制成功', duration = 1000 }) => {
    if (!my.qn) {
        Logger.log('复制的内容是\n', text);
    }
    Taro.setClipboardData({
        data: text,
        success (res) {
            Taro.showToast({
                title: msg,
                duration: duration,
            });
        },
        fail () {
            Taro.showToast({
                title: '复制失败，请重试',
                duration: duration || 500,
            });
        },
    });
};

/**
 * 获取剪切板数据
 * @param callback
 * @returns {Promise<unknown>}
 */
export function getClipboardData (callback = NOOP) {
    return new Promise(resolve => {
        Taro.getClipboardData({
            success:  ({ data }) => {
                Logger.log('getClipboardData', data);
                resolve(data);
                callback(data);
            },
        });
    });
};

/**
 * 清空剪切板
 */
export function clearClipboard () {
    Taro.setClipboardData({ data: '' });
}