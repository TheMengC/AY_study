/**
 * @Description: 时效相对到达时间
 * @Author: LC
 * @Date: 2020-04-07 10:43:52
 * @param {object}        trade [description] 订单信息
 * @param {Number}        es_time [description] 相对到达时间： 0当日达，1次日达，2三日达，3四日达，4五日达
 * @return: {string}     [description] 返回结果 几日达
 */
export function timingPromiseEsTime (trade) {
    let es_time = trade.es_time ? trade.es_time : '';
    const esArr = ['当日达', '次日达', '三日达', '四日达', '五日达'];
    return esArr[es_time];
}