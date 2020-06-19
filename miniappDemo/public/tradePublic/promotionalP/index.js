import { api } from 'tradePolyfills';
import { NOOP } from "tradePolyfills";


/**
 * /ump/newGetOfficialActivityLists
 * @param {id} cid: res.guesscid
 */
export function newGetOfficialActivityLists({ query, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.ump.official.activy.list.get',
        args: query,
        callback: res => {
            callback(res);
        }
    })
}
/**
 * 获取所有活动数量
 * /ump/getActivityNumAll
 * activity_type: query.promotiontype === 'PromotionalPage' ? 'prom' : 'full', activity_time: 'true' 
 */
export function getActivityNumAll({ query, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.ump.activity.numall.get',
        args: query,
        callback: res => {
            callback(res)
        }
    })
}
/**
 * /ump/getActivityCount
 * activity_type: type
 */
export function getActivityCount({ query, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.ump.activity.count.get',
        args: query,
        callback: res => {
            callback(res);
        }
    })
}
/**
 * activity_type: 'all', // 活动类型 所有活动
 * page_no: pageNo, // 页数 默认1
 * page_size: 20, // 页码大小 默认10
 */
export function pcUmpGetActivityList({ query, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.ump.pc.activity.list.get',
        args: query,
        callback: res => {
            callback(res);
        }
    })
}
/**
 * /ump/getActivityList
 *  type, // 活动类型 prom：促销；full：满减
 *   status: 'UNFINSIH', // 活动状态--未开始,进行中
 *   page_no: pageNo, // 页数 默认1
 *   page_size: 20, // 页码大小 默认10
 */
export function getActivityList({ query, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.ump.activity.list.get',
        args: query,
        callback: res => {
            callback(res);
        }
    })
}
/**
 * 
 * @param { 'activity_id': itemData.activity_id} param0 
 */
export function getActivityItem({ query, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.ump.activity.item.get',
        args: query,
        callback: res => {
            callback(res);
        }
    })
}
// /**
//  * 
//  * @param {} param0 
//  */
// export function getActivityNumAll({ query, callback = NOOP }) {
//     api({
//         apiName: 'aiyong.item.ump.activity.numall.get',
//         args: query,
//         callback: res => {
//             callback(res);
//         }
//     })
// }
