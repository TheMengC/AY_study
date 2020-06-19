/**
 * @description 电子发票信息表
 * @author hcy
 * @Data 2019-04-11
 */
import { getUserInfo, moment, api, isEmpty } from "tradePolyfills/index";
import { NOOP } from "tradePublic/consts";
import { getFlatTrades } from "tradePublic/tradeDataCenter";
import { doSql } from "mapp_common/utils/sqlHelper";
import { Logger } from "mapp_common/utils/logger";


export const EinvoiceWebSql = {
    selectAllForText: () => {
        try {
            doSql({
                sql: `SELECT * FROM einvoice_new`,
                callback: (res) => {
                    Logger.log("%c websql全部内容 ", "color:white;background:red", res);
                },
            });
        } catch(e) {
            Logger.error('EinvoiceWebSql createWebsql catch error', e);
        }
    },
    // 创建电子发票信息表
    init: function () {
        if (getUserInfo() && getUserInfo().type == 'C') {
            return;
        }
        try {
            doSql({
                sql: `CREATE TABLE IF NOT EXISTS einvoice_new (
						tid text NOT NULL,
						invoice_type text NOT NULL,
						invoice_name text NOT NULL,
						invoice_kind text NOT NULL,
						modified datetime NOT NULL,
						payer_register_no text NOT NULL,
						PRIMARY KEY (tid)
					)`,
                callback: (res) => {
                    EinvoiceWebSql.deleteOnTime();
                },
                errCallback: (rsp) => {
                    Logger.error('创建发票信息表失败了', rsp);
                },
            });

        } catch(e) {
            Logger.error('EinvoiceWebSql createWebsql catch error', e);
        }
    },
    // 删除上一个电子发票信息表
    deleteLastTable: function () {
        try {
            window.db.transaction((context) => {
                context.executeSql(
                    `DROP TABLE einvoice`,
                    [],
                    (ctx, rsp) => {
                    },
                    (ctx, error) => {
                    }
                );
            });
        } catch(e) {
            Logger.error('EinvoiceWebSql deleteLastTable catch error', e);
        }
    },
    // 发票信息表定期清理
    deleteOnTime: function () {
        try {
            new Promise((resolve) => {
                // 筛选出过期订单（插入时间在当前时间的15天前）
                const delTime =  moment().subtract(15, 'd').format('YYYY-MM-DD');

                doSql({
                    sql: `SELECT tid FROM einvoice_new WHERE modified < (?)`,
                    params: [delTime],
                    callback: (res) => {
                        resolve(res);
                    },
                    errCallback: (rsp) => {
                        Logger.error('创建发票信息表失败了', rsp);
                    },
                });
            }).then((delTid) => {
                if (delTid.length == 0) {
                    return;
                }
                // 删除过期订单
                let selSql = `DELETE FROM einvoice_new WHERE tid IN (`;
                delTid.forEach((item, index) => {
                    if (index == delTid.length - 1) {
                        selSql += `${item})`;
                    } else {
                        selSql += `${item},`;
                    }
                });

                doSql({
                    sql: selSql,
                    callback: (res) => {
                    },
                    errCallback: (rsp) => {
                        Logger.error('删除过期订单失败了', rsp);
                    },
                });
            });
        } catch(e) {
            Logger.error('EinvoiceWebSql deleteOnTime catch error', e);
        }
    },
    // 调用接口批量获取电子发票信息
    batchEinvoice: function ({ tid, callback }) {
        api({
            method: '/router/einvoice',
            apiName: 'aiyong.trade.order.einvoce.batchget',
            mode: 'json',
            args: {
                method: 'alibaba.einvoice.apply.get',
                'value[platform_tid]': tid,
            },
            callback: (rsp) => {
                let einvoiceData = [];
                let eTid = [];	// 用来存储有发票信息的tid数组
                if (!rsp.length) {
                    callback([]);
                    return;
                }
                rsp.forEach((item) => {
                    if (!isEmpty(item.alibaba_einvoice_apply_get_response)) {
                        let apply = {};
                        apply.tid = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].platform_tid;
                        apply.invoice_type = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].invoice_type;
                        apply.invoice_name = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].payer_name;
                        apply.invoice_kind = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].invoice_kind;
                        apply.payer_register_no = item.alibaba_einvoice_apply_get_response.apply_list.apply[0].payer_register_no;
                        einvoiceData.push(apply);
                        eTid.push(apply.tid);
                    }
                    // 测试数据
                    let apply = {};
                    apply.tid = tid[0];
                    apply.invoice_type = 111;
                    apply.invoice_name = 222;
                    apply.invoice_kind = 333;
                    apply.payer_register_no = 444;
                    einvoiceData.push(apply);
                    eTid.push(apply.tid);
                });
                let noEtid = tid.filter((item) => {
                    return eTid.indexOf(item) == -1;
                });
                noEtid.forEach((item) => {
                    let apply = {};
                    apply.tid = item;
                    apply.invoice_type = '';
                    apply.invoice_name = '';
                    apply.invoice_kind = '';
                    apply.payer_register_no = '';
                    einvoiceData.push(apply);
                });
                einvoiceData.forEach((item) => {
                    EinvoiceWebSql.insertData({ data: item });
                });
                callback(einvoiceData);
            },
            errCallback: (error) => {
                Logger.error('einvoice 接口调用失败', error);
            },
        });
    },
    // 根据 tid 插入电子发票信息
    insertData: function ({ data, callback = NOOP, errCallback = NOOP }) {
        let modified = moment().format('YYYY-MM-DD');
        try {

            doSql({
                sql: `INSERT INTO einvoice_new (tid,invoice_type,invoice_name,invoice_kind,modified,payer_register_no) VALUES (?,?,?,?,?,?)`,
                params: [
                    data.tid,
                    data.invoice_type,
                    data.invoice_name,
                    data.invoice_kind,
                    modified,
                    data.payer_register_no,
                ],
                callback: (res) => {
                    Logger.log("%c 发票信息表 插入成功 ", "color:white;background:red", res);
                },
                errCallback: (rsp) => {
                    Logger.error('发票信息表 插入失败', rsp);
                },
            });

        } catch (e) {
            Logger.error('EinvoiceWebSql insertData catch error', e);
        }
    },
    // 根据 tid 查出电子发票信息
    // tid[Array]
    selectData: function ({ tid, callback = () => {}, errCallback = () => {} }) {
        if (tid.length == 0) {
            callback();
            return;
        }
        let selSql = `SELECT tid,invoice_type,invoice_name,invoice_kind,payer_register_no FROM einvoice_new WHERE tid IN (`;
        tid.forEach((item, index) => {
            if (index == tid.length - 1) {
                selSql += `${item})`;
            } else {
                selSql += `${item},`;
            }
        });
        try {
            doSql({
                sql: selSql,
                callback: (res) => {
                    Logger.log("%c 发票信息表 查询成功 ", "color:white;background:red", res);
                    callback(res);
                },
                errCallback: (rsp) => {
                    Logger.log('发票信息表 查询失败', rsp);
                    errCallback();
                },
            });
        } catch (e) {
            Logger.error('EinvoiceWebSql selectData catch error', e);
            errCallback();
        }
    },

};

export default EinvoiceWebSql;

// 获取电子发票 拆分tid
export const selectEinvoice = (tid = [], getByAfterEnd) => {
    return new Promise((resolve) => {
        if (getUserInfo() && getUserInfo().type == 'C') {
            resolve();
            return;
        }
        EinvoiceWebSql.selectData({
            tid: tid,
            callback: (selRsp) => {
                // 将没有的查到信息的 tid 取出
                let noTidArr = [];
                if (isEmpty(selRsp)) {
                    noTidArr = tid;
                } else {

                    let selTid = selRsp.map(item => item.tid);
                    noTidArr = tid.filter((item) => {
                        return selTid.indexOf(item) == -1;
                    });
                }

                // 获取一遍单号
                if (!isEmpty(noTidArr) && getByAfterEnd) {
                    // 拆分为20单一组
                    const sliceLength = Math.ceil(noTidArr.length / 20);
                    let sliceTidArr = [];
                    for (let i = 0; i < sliceLength; i++) {
                        sliceTidArr.push(noTidArr.slice(20 * i, 20 * (i + 1)));
                    }
                    const sliceBatchArr = sliceTidArr.map((item) => {
                        return new Promise((sliceBatchResolve) => {
                            EinvoiceWebSql.batchEinvoice({
                                tid: item,
                                callback: (einvoiceRsp) => {
                                    selRsp = [...selRsp, ...einvoiceRsp];
                                    sliceBatchResolve();
                                },
                                errCallback: () => {
                                    sliceBatchResolve();
                                },
                            });
                        });
                    });
                    Promise.all(sliceBatchArr).then(() => {
                        resolve(selRsp);
                    });
                } else {
                    resolve(selRsp);
                }
            },
            errCallback: () => {
                resolve();
            },
        });
    });
};

export const getEinvoiceByTrade = ({ trades, callback = NOOP, errCallback = NOOP, getByAfterEnd = false }) => {
    return new Promise((resolve) => {
        if (getUserInfo() && getUserInfo().type == 'C') {
            errCallback();
            return;
        }
        const einvoiceKeys = ['invoice_type', 'invoice_name', 'invoice_kind', 'payer_register_no'];

        if (!Array.isArray(trades)) {
            trades = [trades];
        }
        let flatTrades = getFlatTrades(trades);
        let tids = flatTrades.map(trade => trade.tid);
        let flatTradesIndexedByTid = {};
        flatTrades.map(trade => {
            flatTradesIndexedByTid[trade.tid] = trade;
        });
        selectEinvoice(tids, getByAfterEnd).then((rsp) => {
            if (!rsp) {
                errCallback();
                resolve(trades);
                return;
            }
            rsp.map(einvoiceItem => {
                let trade = flatTradesIndexedByTid[einvoiceItem.tid];
                if (trade) {
                    Object.assign(trade, einvoiceItem);
                }
            });
            trades.map(trade => {
                if (trade.mergeTid) {
                    einvoiceKeys.map(key => {
                        trade[key] = Array.from(new Set(trade.trades.map(subTrade => subTrade[key]).filter(Boolean))).join(',');
                    });
                }
            });
            callback(trades);
            resolve(trades);
        });
    });
};
