import Taro from "@tarojs/taro";

/**
 * 显示菊花
 *     (这个函数其实是pc遗留下来的弊病 不应该用type来区分是show 还是hide
 * @param type
 * @param title
 */
export const loading = (type, title = '加载中...') => {
    if (type == 'show') {
        showLoading(title);
    }
    if (type == 'hide') {
        hideLoading();
    }
};

export function showLoading (title = '加载中...') {
    Taro.showLoading({ title: title });
}
export function hideLoading () {
    Taro.hideLoading();
}