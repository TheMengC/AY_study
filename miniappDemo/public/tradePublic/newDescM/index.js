import { api, showErrorDialog, NOOP } from 'tradePolyfills';
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { taobaoPictureUserInfoGet } from "tradePublic/itemTopApi/taobaoPicture";
import { taobaoItemListGet } from "tradePublic/itemTopApi/taobaoItemListGet";
import { taobaoItemsSellerListGet } from "tradePublic/itemTopApi/taobaoItemsSellerListGet";
/**
 * 获取上次任务状态
 */
export function getLastTask({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName: "aiyong.item.mdetail.last.task.get",
        args: {},
        callback: res => {
            if (res == 'misstop' || res == undefined) {//未授权
                callback(res);
            } else if (res.length != 0) {
                callback(res[res.length - 1]);
            }
        },
        errCallback: errCallback,
    })
}

export function getLastTaskNew() {
    return new Promise((resolve, reject)=>{
        api({
            apiName: "aiyong.item.mdetail.last.task.get",
            args: {},
            callback: res => {
                if (res == 'misstop' || res == undefined) {//未授权
                   return;
                } else if (res.length != 0) {
                    resolve(res[res.length - 1]);
                }
            },
            errCallback: (e)=>{
                console.log(e)
            }
        })
    });
}

/**
 * 获取当前任务状态
 * @param query id
 */
export function getNewTask({ id, callback = NOOP }) {
    api({
        apiName: "aiyong.item.mdetail.task.get",
        args: { id },
        callback: res => {
            if (res == 'misstop') {
                callback(res);
            } else if (res.length != 0) {
                callback(res[0]);
            } else {
                callback(null);
            }
        }
    })
}
/**
 * 删除任务
 * @param query id
 */
export function deleteTask({ id, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.mdetail.task.del',
        args: { id },
        callback: res => {
            if (res == 'misstop') {
                // 授权失效的用户
                return;
            }
            callback(res);
        }
    })
}
/**
 * 全部生成 /newmitem/genDescNow
 * @param 
 */
export function addAllTask({ sid, nick, sellerType, checked, spaceInfo, force, itemRange, callback = NOOP, errCallback = handleError }) {
    api({
        apiName: 'aiyong.item.mdetail.task.addall',
        args: {
            sid, nick, sellerType, checked, spaceInfo, force, itemRange,
        },
        option: {
            method: 'POST',
            dataType: 'json',
        },
        callback: res => {
            // 未授权 数量太多 图片空间不足 没有可操作的宝贝 不算成功生成手机详情  
            if (res.misstop) {
                // 授权失效的用户
                showErrorDialog('温馨提示', '【手机详情】为后台功能，请先使用主账号进入爱用商品对该功能授权！', '全店生成失败');
            } 
            if (res.noBaby) {
                //没有可操作的宝贝
                showErrorDialog('温馨提示', '此次手机详情任务没有可操作宝贝，请重新操作', '全店生成失败');
            } 
            if (res.moreBaby) {
                //大于1000个宝贝，不支持一键生成
                showErrorDialog('温馨提示', '一键生成全店手机详情功能暂不支持1000个以上宝贝，请您尝试单个/批量生成手机详情或者咨询客服。', '全店生成失败');
            } 
            callback(res);
        },
        errCallback,
    })
}
/**
 * 终止任务
 * @param  id
 */
export function stopTask({ id, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.mdetail.task.stop',
        args: { id },
        callback: res => {
            if (res == 'misstop') {
                // 授权失效的用户
                showErrorDialog('温馨提示', '【手机详情】为后台功能，请先使用主账号进入爱用商品对该功能授权！', '操作失败');
                return;
            }
            callback(res);
        },
    })
}
/**
 * 重新执行
 * @param id
 */
export function resetTask({ id, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.mdetail.task.reset',
        args: { id },
        callback: res => {
            if (res == 'misstop') {
                // 授权失效的用户
                showErrorDialog('温馨提示', '【手机详情】为后台功能，请先使用主账号进入爱用商品对该功能授权！', '操作失败');
                return;
            }
            callback(res);
        },
    })
}
/**
 * 批量生成手机详情 NewMobileList
 * @param nick  /newmitem/getallBaby
 * @param q
 * @param order_by
 * @param status
 * @param checked
 * @param sid
 * @param sellerType
 * @param ruledBaby
 * @param excludeIid
 */
export function getAllBaby({ nick, q, order_by, status, checked, sid, sellerType, ruledBaby, excludeIid, callback = NOOP }) {
    api({
        apiName: 'aiyong.item.mdetail.goods.get',
        args: { nick, q, order_by, status, checked, sid, sellerType, ruledBaby, excludeIid },
        callback: res => {
            if (!res.misstop && !res.moreBaby) {
                callback(res.result);
            } else {
                callback(res);
            }
        }
    })
}
/**
 * 查询任务状态 NewMobileList
 * /newmitem/queryTask
 */
export function getTaskStatus({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName: 'aiyong.item.mdetail.task.status.get',
        args: {},
        callback: res => {
            if (res.misstop) {
                //授权失效的用户
                return false;
            }
            callback(res);
        },
        errCallback,
    })
}
/**
 * 获取任务进度 NewMobileList
 * @param id /newmitem/getUserTask
 */
export function getProcessTask({ ids, callback = NOOP, errCallback = handleError }) {
    api({
        apiName: 'aiyong.item.mdetail.task.process.get',
        args: { ids },
        callback: res => {
            callback(res);
        },
        errCallback,
    })
}
/**
* 获取图片空间信息，可用空间，用户空间
* @author miao
*/
export function getPictureInfo({ callback = NOOP, errCallback = handleError }) {
    taobaoPictureUserInfoGet({
        callback: res => {
            let availableSpace = res.user_info.available_space;
            let usedSpace = res.user_info.used_space;
            if (availableSpace.indexOf("K") != -1) {
                availableSpace =
                    parseFloat(
                        availableSpace.substring(
                            0,
                            availableSpace.length - 1
                        )
                    ) / 1024;
            } else if (availableSpace.indexOf("G") != -1) {
                availableSpace =
                    parseFloat(
                        availableSpace.substring(
                            0,
                            availableSpace.length - 1
                        )
                    ) * 1024;
            } else {
                availableSpace = parseFloat(
                    availableSpace.substring(0, availableSpace.length - 1)
                );
            }
            if (usedSpace.indexOf("K") != -1) {
                usedSpace =
                    parseFloat(
                        usedSpace.substring(0, usedSpace.length - 1)
                    ) / 1024;
            } else if (usedSpace.indexOf("G") != -1) {
                usedSpace =
                    parseFloat(
                        usedSpace.substring(0, usedSpace.length - 1)
                    ) * 1024;
            } else {
                usedSpace = parseFloat(
                    usedSpace.substring(0, usedSpace.length - 1)
                );
            }
            const resSpace = Math.floor(availableSpace - usedSpace) / 2.5;
            callback(resSpace);
        },
        errCallback,
    });
}

/**
 * 点击生成手机详情
 * @param {'numIid,sid,sellerType,nick} param0 
 */
export function deviceStatus({ numIid, sid, sellerType, nick, callback = NOOP, errCallback = handleError }) {
    api({
        apiName: 'aiyong.item.mdetail.task.add',
        args: { numIid, sid, sellerType, nick },
        callback:res=>{
            if (res.misstop) {
                showErrorDialog('温馨提示', '【手机详情】为后台功能，请先使用主账号进入爱用商品对该功能授权！', '任务提交失败');
                return;
            }
            callback(res);
        },
        errCallback: (error)=>{
            showErrorDialog('温馨提示', '【手机详情】为后台功能，请先使用主账号进入爱用商品对该功能授权！', '任务提交失败');
        }
    })
}
/**
 * 获取用户记录
 * @param {id,usernick,status,isurl} param0 
 */
export function getNewOneTouchLog({ id, nick, status, isUrl, callback = NOOP, errCallback }) {
    api({
        apiName: 'aiyong.item.mdetail.logs.get',
        args: { id, nick, status, isUrl },
        callback: res => {
            callback(res);
        },
        errCallback: errCallback
    })
}


/**
 * @Description 获取商品的回调
 */
export function getNewData({pageNo = 1, pageSize = 20, orderBy = 'num:desc', q = '', status = '出售中'}) {
    return new Promise((resolve, reject)=>{
        taobaoItemListGet({
            fields: 'num_iid',
            page_no: pageNo, //默认为pageNo ,可能会改成1 
            page_size: pageSize,
            status: status,
            extraArgs: { q, order_by: orderBy },
            callback: res => {
                let num = res.total_results;
                if(res.items && pageNo <= Math.ceil(num / 20)){
                    resolve({str: res.items.item.map(item => {return item.num_iid}).join(','), total: num});
                }else{
                    resolve({str: '', total: num});
                }        
            }
        })
    });
}

/**
 * 批量获取宝贝的详细数据
 * @param {*} param0 
 */
export function getItemWdesDetail({numiidstr, noDescArr, totalArr}){
    return new Promise((resolve, reject)=>{
        taobaoItemsSellerListGet({
            num_iids: numiidstr,
            callback: res => {
                const items = res.items? res.items.item:[];
                items.forEach(item => {
                    if (item.wireless_desc) {
                    } else {
                        noDescArr.push(item)
                    }
                    totalArr.push(item)
                });
                resolve({noDescArr, totalArr});
            },
            errCallback: err => {
                resolve({noDescArr:[], totalArr:[]});
            }
        });
    });
}