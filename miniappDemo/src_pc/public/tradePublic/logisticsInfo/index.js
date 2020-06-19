import { moment, Object_values, sqlHelper } from "tradePolyfills/index";
import { qnRouter } from "tradePublic/qnRouter";
import { getFlatTrades } from "tradePublic/tradeDataCenter";
import { getOrders, resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { STATUS_IS_SENDED, statusMap } from "tradePublic/consts";
import { Logger } from "mapp_common/utils/logger";

const logistics_orders_detail_get_fields = 'tid,order_code,seller_nick,buyer_nick,delivery_start,delivery_end,out_sid,item_title,receiver_name,created,modified,status,type,freight_payer,seller_confirm,company_name,sub_tids,is_split';

/**
 * 获取物流信息和转运信息
 * 这个返回promise 结束以后trade会被加上一个logisticsInfo的字段
 * @param trade
 * @param callback
 * @param errCallback
 * @returns {Promise}
 */
export function getTradeLogisticsInfo (trade, refresh) {
    if (getOrders(trade).every(order => !STATUS_IS_SENDED[order.status])) {
        return Promise.resolve();
    }

    // getWebsql_data modieif
    return Promise.all(getFlatTrades(trade).map(async subTrade => {
        /**
         * 每个order都没有发货单号 所以是无需物流
         */
        if (getOrders(trade).every(order => !order.invoice_no)) {
            subTrade.logisticsInfo = [{
                company_name: '无需物流',
                out_sid: '',
                tid: subTrade.tid,
                trace_list: { transit_step_info: [] },
            }];
            return;
        }
        if (refresh) {
            Logger.log("物流信息强制刷新 - 调api");
            return getByApi(subTrade);
        }
        let res;
        if (sqlHelper.canUseSql() && LogisticsWebSql.enabled) {
            try {
                let dataSql = await LogisticsWebSql.getByTid(subTrade.tid);
                res = dataSql[0];
                Logger.log('datasql', res);
            } catch (e) {

            }
        }
        if (res) {
            /**
             * 虽然sql里面有 但是时间超过12小时了 不可信 重新调接口
             */
            if (moment().isAfter(moment.unix(res.created).add(12, 'hours'))) {
                Logger.log("taobaoLogisticsTraceSearch时间到了 用api", res);
                return getByApi(subTrade);
            } else {
                /**
                 * 终于可以使用sql里面的数据了
                 */
                Logger.log("taobaoLogisticsTraceSearch时间没有到 用缓存", res);
                subTrade.logisticsInfo = JSON.parse(res.storage);
                return;
            }
        }else{
            /**
             * 两小时内使用假数据迷惑敌人
             */
            if (moment(subTrade.consign_time).add(2, 'h').isAfter(moment())) {
                getFake(subTrade);
                return;
            }
            /**
             * sql里面没有只能调接口
             */
            Logger.log("taobaoLogisticsTraceSearch没有取到 用api", res);
            return getByApi(subTrade);
        }


    })).then(() => {
        Logger.log("taobaoLogisticsTraceSearch好啦");
        // 合单 把包裹信息去重拼起来
        if (trade.mergeTid) {
            let logisticsInfoIndexedByVoice = {};
            trade.trades.map(subTrade => {
                subTrade.logisticsInfo.map(logisticsItem => {
                    logisticsInfoIndexedByVoice[logisticsItem.invoice_no] = logisticsItem;
                });
            });
            trade.logisticsInfo = Object_values(logisticsInfoIndexedByVoice);
        }
    });

    /**
     * 从api获取
     * @returns {Promise<[]>}
     */
    function getByApi (subTrade) {
        return new Promise((resolve) => {
            const packageInfo = getPackageInfoByTrade(subTrade);
            subTrade.logisticsInfo = [];
            Promise.all(packageInfo.map(packageInfoItem => {
                return new Promise((resolve) => {
                    let query = {
                        tid: subTrade.tid,
                        seller_nick: subTrade.seller_nick,
                    };
                    if (packageInfoItem.is_split == 1) {
                        query.is_split = 1;
                        query.sub_tid = packageInfoItem.oid;
                    }
                    qnRouter({
                        api: 'taobao.logistics.trace.search',
                        params: query,
                        callback: (rsp) => {
                            rsp = resolveTopResponse(rsp);
                            rsp = { ...packageInfoItem, ...rsp };
                            if (Array.isArray(rsp.trace_list)) {
                                rsp.trace_list = { transit_step_info: rsp.trace_list };
                            }
                            rsp.trace_list.transit_step_info.reverse();
                            subTrade.logisticsInfo.push(rsp);
                            resolve();
                        },
                        errCallback: (error) => {
                            Logger.error(error);
                            resolve();
                        },
                    });
                });
            })).then(() => {
                if (subTrade.logisticsInfo.length > 0) {
                    LogisticsWebSql.insertByTrade(subTrade);
                }
                resolve();
            });
        });
    }
}

/**
 * 如果发货时间跟当前时间过于接近,则不获取物流信息,搞一个假的物流信息来迷惑敌人
 */
export function getFake (subTrade) {
    // 按运单号分组
    let logisticsInfo =   getPackageInfoByTrade(subTrade).map(packageInfoItem => {
        packageInfoItem.trace_list = {
            transit_step_info: [{
                action: "X_WAIT_ALLOCATION",
                status_desc: "您的订单待配货",
                status_time: packageInfoItem.consign_time,
            }],
        },
        packageInfoItem.tid = subTrade.tid;
        packageInfoItem.seller_nick = subTrade.seller_nick;
        return packageInfoItem;
    });
    subTrade.logisticsInfo = logisticsInfo;
    return logisticsInfo;
}

/**
 * 获取订单的物流信息（不掉接口）
 * @param trade
 */
export function getTradeLogisticsInfoWithoutRequest (trade) {
    if (trade.mergeTid) {
        trade.trades.map(subTrade => getFake(subTrade));
    }else{
        getFake(trade);
    }
}

/**
 * 根据订单的发货公司和运单号计算包裹信息
 * @param trade
 * @returns {{company_name: *, out_sid: *, oid}[]}
 */
export function getPackageInfoByTrade (trade) {

    let orders = getOrders(trade);
    orders = orders.filter(order => statusMap[order.status] !== 'ALL_CLOSED');
    if (orders.every(order => !STATUS_IS_SENDED[order.status])) {
        return [];
    }
    if (orders.every(order => !order.invoice_no)) {
        return [{
            company_name: '无需物流',
            out_sid: '',
            oid: orders.map(order => order.oid),
            consign_time: orders[0].consign_time,
        }];
    }
    let packageInfo = [];
    // 按运单号分组
    let ordersIndexByInvoiceNo = {};
    orders.map(order => {
        if (!order.invoice_no) {
            return;
        }
        if (!ordersIndexByInvoiceNo[order.invoice_no]) {
            ordersIndexByInvoiceNo[order.invoice_no] = [];
        }
        ordersIndexByInvoiceNo[order.invoice_no].push(order);
    });
    packageInfo = Object.keys(ordersIndexByInvoiceNo).map(invoice_no => {
        let orderGroup = ordersIndexByInvoiceNo[invoice_no];
        return {
            company_name: orderGroup[0].logistics_company,
            out_sid: orderGroup[0].invoice_no,
            oid: orderGroup.map(order => order.oid),
            consign_time: orderGroup[0].consign_time,
            is_split: +(orderGroup.length !== orders.length),
        };
    });
    return packageInfo;
}

export const LogisticsWebSql = {
    enabled: true,
    init:async function () {
        if (!sqlHelper.canUseSql()) {
            Logger.log('websql未实现');
            return Promise.resolve();
        }
        try {
            await sqlHelper.doSqlAsync({
                sql: `CREATE TABLE IF NOT EXISTS 'logistics_info' ('tid' varchar(32) NOT NULL,
                                                    'created' BIGINT NOT NULL,
                                                    'storage' text NOT NULL,
                                                    PRIMARY KEY ('tid'))`,
            });
            await this.clearTimeout();
        }catch (e) {
            Logger.error(e);
            this.enabled = false;
        }

    },
    getByTid: function (tid) {
        let sql = 'SELECT * from logistics_info where tid=?';
        return sqlHelper.doSqlAsync({
            sql,
            params: [tid],
        });
    },
    insertByTrade: function (trade) {
        if (!sqlHelper.canUseSql()) {
            Logger.log('websql未实现');
            return Promise.resolve();
        }
        let params = {
            tid: trade.tid,
            created: moment().unix(),
            storage: JSON.stringify(trade.logisticsInfo),
        };
        let sql = `REPLACE into logistics_info (${Object.keys(params).join(',')}) values(${Object.keys(params).map(() => '?').join(',')})`;
        return sqlHelper.doSqlAsync({
            sql,
            params: Object_values(params),
        });
    },
    clearAll: function () {
        return sqlHelper.doSqlAsync({ sql: 'DELETE FROM logistics_info' });
    },
    clearTimeout:function () {
        let time = moment().subtract(12, 'h').unix();
        Logger.log('clearTimeout', time);
        return sqlHelper.doSqlAsync({ sql:'DELETE FROM logistics_info where created<?', params:[time] });
    },
    count:function () {
        return sqlHelper.doSqlAsync({ sql: 'SELECT count(*) FROM logistics_info' });
    },
    getAll:function () {
        return sqlHelper.doSqlAsync({ sql: 'SELECT * FROM logistics_info' });
    },
};

/**
 * 物流信息是否可以修改
 * @param logisticsInfo
 * @returns {*}
 */
export function logisticsInfoCanChange (logisticsInfo) {
    return moment(logisticsInfo.consign_time).add('1', 'day').isAfter(moment());
}
