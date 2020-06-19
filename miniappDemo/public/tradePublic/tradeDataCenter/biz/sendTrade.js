import {
    aiyongGetLogisticsCompanyByCode,
    aiyongGetLogisticsCompanyByName
} from "tradePublic/taobaoLogisticsCompaniesGet";
import { TdcLogger } from "tradePublic/tradeDataCenter/common/tdcLogger";
import taobaoWlbOrderJzConsign from "tradePublic/taobaoWlbOrderJzConsign";
import taobaoLogisticsSend from "tradePublic/taobaoLogisticsSend";
import { api, getSettings, Logger, Tools } from "tradePolyfills";
import { pgApiHost } from "tradePublic/tradeDataCenter/consts";
import { getOrders } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { showErrorDialog } from "tradePublic/utils";


/**
 * 将一个订单发货 可以是一个合单
 * @param trade        要发货的订单 必传 可以是一个合单
 * @param manual_split 是否手动拆单发货 比如单笔发货的部分发货 如果传了 在将检查每个order的is_checked字段 如果是true 则发货
 *                     可以不传 如果不传 则不检查order的is_checked字段 即全部发货
 *                     就算不传 如果有子订单存在不是代发货状态的 最后调接口的时候也会有is_split传到淘宝
 * @param sendType     发货方式 可以是offline online dummy 必传
 * @param company_code 发货快递公司号 如果sendType 为online 或者offline 必传
 * @param company_name 发货快递公司名 可以不传
 * @param voice        发货快递单号 如果sendType 为online 或者offline 必传
 * @returns {Promise<any>}
 */
export function sendTrade (
    {
        trade,
        manual_split,
        sendType = 'offline',
        company_code,
        company_name,
        voice = '',
        sender_id,
        cancel_id,
        ...rest
    }) {
    return new Promise((resolve) => {
        let successes = [];
        let errors = [];
        let isMerge = !!trade.mergeTid;
        if (!company_name && company_code) {
            let company = aiyongGetLogisticsCompanyByCode(company_code);
            if (!company) {
                showErrorDialog("出错了", "对应的company_code没有找到快递公司 请重新设置" + company_code);
                return;
            }
            Logger.log("发货时没有传快递公司名称 自动匹配为", company);
            company_name = company.name;
        }
        if (company_name && !company_code) {
            let company = aiyongGetLogisticsCompanyByName(company_name);
            if (!company) {
                showErrorDialog("出错了", "对应的company_name没有找到快递公司 请重新设置" + company_name);
                return;
            }
            Logger.log("发货时没有传快递公司编号 自动匹配为", company);
            company_code = company.code;
        }
        let param = {};
        if (sendType != 'dummy') {
            param.company_code = company_code;
            param.company_name = company_name;
            param.out_sid = voice.trim();
        }
        if (cancel_id) {
            param.cancel_id = cancel_id;
        }
        if (sender_id) {
            param.sender_id = sender_id;
        }
        Object.assign(param, rest);

        /**
         * 单笔发货
         * @param subTrade
         * @returns {Promise<unknown>}
         */
        function sendOrder (subTrade) {
            return new Promise((resolve) => {
                let args = { ...param };
                // 开始计算是否是拆单 两个标准一个是看选中长度和orders是否一个，一个是看商品状态是否不是待发货
                let is_split;
                let sub_tid;
                // 如果是手动拆单 需要检查里面的orders是否被is_checked标记
                if (manual_split) {
                    is_split = +getOrders(subTrade).some(order => !order.is_checked || order.status != 'WAIT_SELLER_SEND_GOODS');// 这个+号是把true/false转成1/0的
                    sub_tid = getOrders(subTrade).filter(order => order.is_checked && order.status == 'WAIT_SELLER_SEND_GOODS').map(order => order.oid);
                } else{
                    is_split = +getOrders(subTrade).some(order => order.status != 'WAIT_SELLER_SEND_GOODS');
                    sub_tid = getOrders(subTrade).filter(order => order.status == 'WAIT_SELLER_SEND_GOODS').map(order => order.oid);
                }
                if (sub_tid.length == 0) {
                    resolve();
                    return;
                }
                let isCod = subTrade.type == 'cod';
                args.tid = subTrade.tid;
                if (trade.isSplit) { // 【拆单发货】在trade里面会有一个isSplit标记 如果有这个标记 就一定是拆单的
                    is_split = 1;
                }
                if (is_split) {
                    args.is_split = is_split;
                    args.sub_tid = sub_tid.join(',');
                }
                TdcLogger.info('发货', args);
                if (trade.service_orders && trade.service_orders.service_order[0].tmser_spu_code) {
                    // 家装发货
                    if (is_split) {
                        param.lg_tp_dto = { 'code': company_code };
                    } else{
                        param.company_code = company_code;
                    }
                    param.jz_top_args = { 'mail_no': voice };// 运单号
                    taobaoWlbOrderJzConsign({
                        query: param,
                        callback: rsp => {
                            successes.push({ trade: subTrade, args });
                            resolve(rsp);
                        },
                        errCallback: msg => {
                            errors.push({ trade: subTrade, args, msg });
                            resolve(msg);
                        },
                    });
                } else{
                    taobaoLogisticsSend({
                        query: args,
                        isCod: isCod,
                        sendType: sendType,
                        isMerge: isMerge,
                        callback: rsp => {
                            successes.push({ trade: subTrade, args });
                            resolve(rsp);
                        },
                        errCallback: msg => {
                            errors.push({ trade: subTrade, args, msg });
                            resolve(msg);
                        },
                        type: 'signleSend',
                    });
                }
            });
        }

        if (!isMerge) {
            sendOrder(trade).then(() => {
                resolve({ successes, errors });
            });
        } else{
            let mainTrade = JSON.parse(JSON.stringify(trade));
            let orderIndexedByOid = {};
            mainTrade.trades.map(subTrade => {
                getOrders(subTrade).map(order => {
                    orderIndexedByOid[order.oid] = order;
                });
            });
            let subTradesNeedSend = mainTrade.trades;
            Tools.tradeBeacon({
                func: 'mergeTradeSend',
                d3: mainTrade.trades.length,
            });
            if (manual_split) { // 如果是手动拆单发货 则要检查里面的order是否都是空 如果都是空 主订单不需要被发货
                subTradesNeedSend = mainTrade.trades.filter(subTrade => getOrders(subTrade).some(order => order.is_checked));
            }
            Promise.all(subTradesNeedSend.map(sendOrder))
                .then(() => {
                    return new Promise((resolve) => {
                        if (successes.length != 0) {
                            let arg_trades = [];
                            successes.map(success => {
                                let item = {
                                    tid: success.args.tid,
                                    is_split: +!!success.args.is_split,
                                };
                                if (success.args.is_split) {
                                    item.oid = success.args.sub_tid.split(',');
                                }
                                arg_trades.push(item);
                            });
                            let { company_name, out_sid } = param;
                            let host = pgApiHost;
                            getSettings().pgSendErrorMock === 1 && (host += 1);
                            let args = {
                                merge_tid: mainTrade.mergeTid,
                                trades: arg_trades,
                                send_type: sendType,
                                company_name,
                                out_sid,
                                subTids: mainTrade.trades.map(trade => trade.tid),
                            };
                            TdcLogger.info('发货双存', args);
                            api({
                                apiName:'aiyong.trade.order.send.merge.save',
                                host: host,
                                method: '/order/sendGoodsLevelUp',
                                mode: 'json',
                                args,
                                callback: (code) => {
                                    if (code > 200) {
                                        showErrorDialog('温馨提示', '合单发货处理异常，请检查。', code);
                                    }
                                    resolve();
                                },
                                errCallback: (msgs) => {
                                    showErrorDialog('温馨提示', '合单发货处理异常，请检查。' + msgs, '网络异常');
                                    resolve();

                                },
                            });

                        } else{
                            return Promise.resolve();
                        }
                    });
                }
                ).then(() => {
                    resolve({ successes, errors });
                });
        }
    }
    );
}
