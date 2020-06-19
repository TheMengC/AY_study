import { api, NOOP, isNotVip } from "tradePolyfills/index";
import Taro from "@tarojs/taro";

//aiyong.item.autoadjust.logs.detail.get
/**
 * 检测出售中宝贝的上下架时间
 * @param onSaleBabyData 出售中的宝贝信息
 * @param callback
 * @param finishCallback
 */
export const listTimeDetection = ({onSaleBabyData=[], callback = NOOP, finishCallback = NOOP}) => {
    const h = 0; // 高峰期宝贝个数
    const l = 0; // 低谷期宝贝个数
    const m = 0; // 平常期宝贝个数
    if (isNotVip()) {
        testListTimeSingle(0, h, l, m, onSaleBabyData, 'off', callback, finishCallback);
    } else {
        api({
            apiName: 'aiyong.item.autoadjust.logs.detail.get',
            callback: data => {
                if (typeof (data) === 'object') {
                    testListTimeSingle(0, h, l, m, onSaleBabyData, data.adjust, callback, finishCallback);
                } else if (data.indexOf('misstop') != -1) {
                    Taro.showModal({
                        title: '温馨提示',
                        content: '您的登陆已经失效，为了店铺安全，请关闭商品管理再打开重试',
                        confirmText: '我知道了',
                        showCancel:false,
                    });
                    return false;
                }
            }
        })
    }
};

/**
 *  单个检测宝贝上下架时间
 * @param i index
 * @param h 高峰期个数
 * @param l 低谷期个数
 * @param m 平常期个数
 * @param babyData 宝贝信息数组
 * @param adjust 接口返回的数据
 * @param callback
 * @param finishCallback
 */
const testListTimeSingle = (i, h, l, m, babyData, adjust, callback, finishCallback) => {
    //const self = this;
    if (babyData[i].list_time) {
        const timeLevel = ConversionTime(babyData[i].list_time);
        if (timeLevel == '高峰期') {
            h++;
        } else if (timeLevel == '平常期') {
            m++;
        } else {
            l++;
        }
    }
    if (i % 10 == 1) {
        callback({index: i, result: [h, m, l]});
    }
    if (i == babyData.length - 1) { // 检测完毕
        if (adjust == 'on') { // 开启了自动上下架就直接给 0, 0,0
            finishCallback({result: [0, 0, 0], adjust})
        } else {
            finishCallback({result: [h, m, l], adjust})
        }
    } else {
        setTimeout(() => {
            i++;
            testListTimeSingle(i, h, l, m, babyData, adjust, callback, finishCallback);
        }, 50);
    }
};

/**
 * 返回宝贝上下架种类
 * @param rtime
 * @returns {string}
 * @constructor
 */
const ConversionTime = (rtime) => {
    const temptime = new Date(Date.parse(rtime.replace(/-/g, '/')));
    const times = ['l', 'l', 'l', 'l', 'l', '', '', '', '', 'h', 'h', '', '', '', '', 'h', 'h', '', '', '', 'h', 'h', '', ''];
    const temp = times[temptime.getHours()];
    if (temp == 'l') {
        return '低谷期';
    } if (temp == 'h') {
        return '高峰期';
    }
    return '平常期';
};
