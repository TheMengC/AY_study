import { NOOP, api} from "tradePolyfills";
import { qnRouter } from "tradePublic/qnRouter";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";

/**
 * 获取库存预警值
 * @param {*} num_iid
 */
export function getStockMaxWarn ({num_iid, callback = NOOP, errCallback = handleError}) {
    api({
        apiName:'aiyong.item.stock.maxwarn.get',
        args:{ num_iid },
        callback: callback,
        errCallback: errCallback,
    })
}

/**
 * 获取库存预警相关信息
 * @param {*} num_iid
 */
export function getStockInfo ({num_iid, callback = NOOP, errCallback = handleError}) {
    api({
        apiName:'aiyong.item.stock.info.get',
        args:{ num_iid },
        callback: callback,
        errCallback: errCallback,
    })
}

/**
 * 编辑库存预警
 */
export function updateStockStatus ({args, callback = NOOP, errCallback = handleError }) {
    api({
        apiName: 'aiyong.item.stock.warn.update',
        args,
        callback: callback,
        errCallback: errCallback,
    });
}

/**
 * 获取类目名称cid_name
 */
export function getCategoryName ({ cid, callback = NOOP, errCallback = handleError }) {
    api({
        apiName: 'aiyong.item.duplicateitems.category.get',
        args:{ cid },
        callback: callback,
        errCallback: errCallback,
    });
}

/**
 * 开通消息服务
 */
export function taobaoTmcUserPermit ({ topics = 'taobao_item_ItemStockChanged', callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: 'taobao.tmc.user.permit',
        params: { topics },
        callback: callback,
        errCallback: errCallback,
    });
}

/**
 * 关闭消息服务
 */
export function taobaoTmcUserCancel ({ nick, callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: 'taobao.tmc.user.cancel',
        params: { nick },
        callback: callback,
        errCallback: errCallback,
    });
}

/**
 * 查询手机详情任务状态
 */
export function getMdetailTaskStatus ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName: 'aiyong.item.mdetail.task.status.get',
        args:{},
        callback: callback,
        errCallback: errCallback,
    });
}
