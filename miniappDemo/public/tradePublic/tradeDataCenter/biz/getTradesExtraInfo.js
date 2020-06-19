import { getPrintWeightHistory } from "tradePublic/tradeDataCenter/api/getPrintWeightHistory";
import { getSettings, getWindow, isEmpty, Tools, Object_values, getUserInfo, Logger } from "tradePolyfills";
import { resolveMergeTrade, resolveTrade } from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { getFlatTrades } from "tradePublic/tradeDataCenter/index";
import { getOrders } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { fullinfoGetBatch } from "tradePublic/tradeDataCenter/api/fullinfoGet";
import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";
import { aiyongApiList } from "tradePublic/tradeDataCenter/consts";
import { NOOP } from "tradePublic/consts";

/**
 * 从soldget来的数据用fullinfo补全数据
 * @param trades
 * @param source
 * @returns {Promise<*[]>}
 */
export async function fillFullinfo (trades = [], source) {
    let needFullinfoTrades = trades.filter(trade => trade.loadingState.fullinfo == false);
    let fullinfoTradeGroup = {};
    needFullinfoTrades.map(trade => {
        if (!trade.tid) {
            return;
        }
        if (!fullinfoTradeGroup[trade.tid]) {
            fullinfoTradeGroup[trade.tid] = [];
        }
        fullinfoTradeGroup[trade.tid].push(trade);
    });
    let fullinfos = [];
    try {
        fullinfos = await fullinfoGetBatch({
            tids: Object.keys(fullinfoTradeGroup),
            source: source,
        });

    } catch (e) {

    }
    fullinfos.filter((item) => item && !!item.tid).map(trade => {
        fullinfoTradeGroup[trade.tid].map(currentTrade => {
            Object.assign(currentTrade, trade);
            resolveTrade(currentTrade);
            currentTrade.loadingState.fullinfo = true;
        });
        delete fullinfoTradeGroup[trade.tid];
    });
    Object_values(fullinfoTradeGroup).map(group => {
        group.map(trade => {
            trade.loadingState.fullinfoFailed = true;
        });

    });
    return trades;

}

/**
 * 获取订单更多信息 比如打印信息 订单检测信息 打印日志信息等
 * @param trades
 * @returns {Promise<unknown>}
 */
export function getTradesExtraInfo (trades) {
    trades = trades.filter(Boolean);
    return new Promise((resolve, reject) => {
        let num_dict = {};
        let buyer_nick_dict = {};// 买家旺旺名数组，用来查询
        let tradesIndexedByTid = {};
        let flatTrades = getFlatTrades(trades);
        flatTrades.map(trade => {
            tradesIndexedByTid[trade.tid] = trade;
            getOrders(trade).map(order => {
                if (!num_dict[order.num_iid]) {
                    num_dict[order.num_iid] = [];
                }
                num_dict[order.num_iid].push(order);
            });
            buyer_nick_dict[trade.buyer_nick] = trade.buyer_nick;
            trade.printState = {
                courier: false,
                invoice: false,
                surface: false,
            };
            if (!trade.wayBill) {
                trade.wayBill = [];
            }
        });
        let tids = Object.keys(tradesIndexedByTid);
        getPrintWeightHistory({
            query: {
                num_iid: Object.keys(num_dict),          // 返回num_iid的重量和成本价
                tid: tids,                   // 返回已打待打数据
                wayTid: tids,                    // 数组  返回物流公司运单号
                msg_tid: tids,                    // 数组   返回已关闭订单的关闭原因
                redis_tid: tids,                    // 数组   返回该订单发送过短信的类型
                aiyongSend: tids,                    // 数组   返回爱用已发货的记录
                buyer_nick_arr: Object.keys(buyer_nick_dict),         // 数组 当前展示订单的买家昵称
                wwcf_tid: tids,                     // 订单是否催付
            },
            callback: async (rsp) => {
                if (!rsp.print) {
                    rsp.print = {
                        courier: [],
                        invoice: [],
                        surface: [],
                    };
                }
                ['courier', 'invoice', 'surface'].map(key => {
                    rsp.print[key].map(tid => {
                        if (tradesIndexedByTid[tid]) {
                            tradesIndexedByTid[tid].printState[key] = true;
                        }
                    });
                });


                if (!isEmpty(rsp.wayBill)) {
                    Object.keys(rsp.wayBill).map(tid => {
                        if (tradesIndexedByTid[tid]) {
                            tradesIndexedByTid[tid].wayBill = rsp.wayBill[tid];
                        }
                    });
                }
                if (!isEmpty(rsp.wwcf)) {
                    Object.keys(rsp.wwcf).map(tid => {
                        tradesIndexedByTid[tid].has_wwcf = true;
                    }
                    );
                }

                if (!isEmpty(rsp.cost)) {// 接口数据容错
                    ['price', 'width'].map(key => {
                        Object.keys(rsp.cost).map(num_iid => {
                            let orders = num_dict[num_iid];
                            let costPrice = rsp.cost[num_iid][key].split('|X|');
                            orders.map(order => {
                                costPrice.map(cost => {
                                    if (isEmpty(cost)) {return;}
                                    let [name, value] = cost.split('|Y|');
                                    let orderSkuName = order.sku_properties_name;
                                    if (name.includes(orderSkuName)
                                        || !isEmpty(orderSkuName) && orderSkuName.includes(name)
                                        || isEmpty(orderSkuName) && name == '无属性') {
                                        switch (key) {
                                            case 'price':
                                                order.cost_price = Number(value);
                                                break;
                                            case 'width':
                                                order.weight = Number(value);
                                                break;
                                        }
                                    }
                                });
                            });
                        });
                    });
                }
                // 拆单打印 发货单子订单记录
                flatTrades.map(trade => {
                    trade.printState.invoicesPart = rsp.print.invoicesPart[trade.tid] || [];
                    trade.isPrintPart = false;
                    const tid = trade.tid;
                    ['courier', 'invoice', 'surface'].map(key => {
                        if (!isEmpty(rsp.print[key + 'sPart'][tid])) {
                            if (!trade.printState[key]) {
                                const hasNoPrintOrder = getOrders(trade).map(order => order.oid).some(oid => rsp.print[key + 'sPart'][tid].indexOf(oid) == -1);
                                trade.printState[key] = hasNoPrintOrder ? 'part' : true;
                            }
                            trade.isPrintPart = true;
                        }
                    });
                    if ((trade.wayBill && trade.wayBill.length > 0 && isEmpty(trade.wayBill[0].oids)) || (trade.status != 'WAIT_SELLER_SEND_GOODS' && trade.status != 'SELLER_CONSIGNED_PART')) {
                        trade.isPrintPart = false;
                    }
                });
                trades.map(trade => {
                    let totalWeight = 0;
                    let totalCostPrice = 0;
                    // 用来标识是否设置过成本价或重量
                    let hasWeight = false;
                    let hasCostPrice = false;
                    getOrders(trade).map(order => {
                        if (!isEmpty(order.weight)) {
                            totalWeight += Number(order.weight) * order.num;
                            hasWeight = true;
                        }
                        if (!isEmpty(order.cost_price)) {
                            totalCostPrice += Number(order.cost_price) * order.num;
                            hasCostPrice = true;
                        }
                    });
                    trade.cost_price = hasCostPrice ? totalCostPrice : "";
                    trade.weight = hasWeight ? totalWeight : "";
                });
                trades.filter(trade => trade.mergeTid).map(resolveMergeTrade);  // 处理合单的waybill和打印记录
                detectTradeResult(trades, rsp.detectTradeSet.result, rsp.rateBadToMe, rsp.buyerRateArr);
                trades.map(trade => {
                    if (!trade.loadingState) {
                        trade.loadingState = {};
                    }
                    trade.loadingState.printBrief = true;
                    trade.loadingState.printWayBill = true;
                });

                await getAySellerMemo(trades);
                await getCustomMergeTradesStatus(trades);
                resolve(trades);
            },
            errCallback: (msg) => {
                Logger.error('getPrintWeightHistory 接口调用失败', msg);
                return resolve(trades);
            },
        });
    });
}


export function detectTradeResult (trades, detectTradeSet, rateBadToMe, buyerRateList) {
    for (let trade of trades) {
        let detectResultIsSafe = {// 检测的结果是否合格 true(安全) false(警告)
            buyerToMeBad: true,
            dangerTrade: true,
            addrKeyWord: true,
            moreBad: true,
            negativeProfit: true,
        };
        let keyAddr = [];// 地址中的全部敏感字
        let warnTextArr = [];// 显示的提示文字
        if (!Tools.isEmpty(detectTradeSet)) {
            getWindow().detectTradeSet = detectTradeSet;
            if (detectTradeSet.buyerToMeBad) {
                if (!Tools.isEmpty(rateBadToMe)) {// 判断是否对我进行中差评
                    if (rateBadToMe.includes(trade.buyer_nick)) {
                        detectResultIsSafe.buyerToMeBad = false;
                        warnTextArr.push('当前买家给过您中差评');
                    }
                }
            }
            if (detectTradeSet.dangerTrade) {
                // trade.pbly = 1;
                if (trade.pbly && trade.pbly == 1 || (trade.trade_attr || {}).pbly == true) {// 判断风险订单
                    detectResultIsSafe.dangerTrade = false;
                    warnTextArr.push('留言中包含有害信息，可能为风险订单');
                }
            }

            if (detectTradeSet.addrKeyWord) {
                let addr = [
                    'receiver_address',
                    'receiver_city',
                    'receiver_country',
                    'receiver_district',
                    'receiver_mobile',
                    'receiver_name',
                    'receiver_phone',
                    'receiver_state',
                    'receiver_town',
                    'receiver_zip'].map(key => trade[key]).join(',');

                let dangeraddr = '教程|微淘关注|动态平分|企业QQ|u站喜欢|开团提醒|天猫关注|宝贝收藏|刷粉刷店铺|联系QQ|活刷|皇冠|不降权|不扣分|不封店|爆款|刷钻|真实单号|真是运单号|老板您好|掌柜您好|加QQ聊|先做后款|确保安全|刷信誉|刷销量';
                dangeraddr = dangeraddr.split('|').map(item => {

                    if (addr.indexOf(item) != -1) {
                        keyAddr.push(item);
                    }
                });
                if (keyAddr.length > 0) {
                    detectResultIsSafe.addrKeyWord = false;
                    warnTextArr.push(`收货地址中含关键字[ ${keyAddr.join('、')} ]，可能为刷信誉订单`);
                }
            }

            // buyerRateList['tb35114315'] = {neutral_num:5,bad_num:5};
            if (detectTradeSet.moreBad) {
                if (!Tools.isEmpty(buyerRateList)) {// 5+次差评
                    if (!isEmpty(buyerRateList[trade.buyer_nick]) && buyerRateList[trade.buyer_nick] == false) {
                        let buyerRateInfo = buyerRateList[trade.buyer_nick];
                        if (parseInt(buyerRateInfo.neutral_num) + parseInt(buyerRateInfo.bad_num) > 5) {
                            detectResultIsSafe.moreBad = false;
                            warnTextArr.push('该买家曾发出的中差评数高于5个');
                            break;
                        }
                    }
                }
            }

            // 判断利润负
            // if(Number(cost_price)<0 || cost_price!='-'){
            //     detectResultIsSafe['negativeProfit'] = false;
            // }

            let allSafe = !Object.keys(detectTradeSet).some(key => detectTradeSet[key] && detectResultIsSafe[key] == false); // 打开了设置并且检测结果为不安全 则整个订单不安全
            // trade.keyWord = keyWord;
            trade.warnText = warnTextArr;
            trade.allSafe = allSafe;
            trade.detectResult = detectResultIsSafe;
        } else {
            trade.allSafe = true;
        }
    }
    // trades.map(trade=>{
    //     trade.allSafe=false;
    //     trade.warnText = ['当前买家给过您中差评'];
    // })
    return trades;
}

/**
 * 获取爱用备注历史
 * @Author ZW
 * @date   2019-12-02T11:51:10+0800
 * @param  {}                 trades
 * @param  {}               callback
 */
export function getAySellerMemo (trades, callback = NOOP) {
    return new Promise((resolve) => {
        const _callback = (res) => {
            callback(res);
            resolve(res);
        };

        // 是否需要获取
        if (getUserInfo().newMemoSet == '1') {
            let query = getFlatTrades(trades).map(subTrade => ({
                tid: subTrade.tid,
                orderCreate: subTrade.created,
            }));
            if (query.length == 0) {
                callback();
                return;
            }
            // 批量获取备注历史最新记录
            pgApi({
                api: aiyongApiList.memoHistoryGet,
                args: { queryCountList: query },
                callback: ({ body }) => {
                    // 转换格式
                    let memoMap = {};
                    body.forEach(item => {
                        if (item.tid) {
                            memoMap[item.tid] = item;
                        }
                    });
                    getFlatTrades(trades).forEach(item => {
                        if (memoMap[item.tid] && memoMap[item.tid].memoCount) {
                            item.memoHistory = memoMap[item.tid];
                        }
                    });
                    _callback(trades);
                },
                errCallback: () => {
                    _callback(trades);
                },
            });
        } else {
            _callback(trades);
        }
    });

}

/**
 * 获取订单的可合单信息
 * @Author ZW
 * @date   2019-12-30T10:50:55+0800
 * @param  {[type]}                 trades
 * @param  {Function}               callback
 */
export function getCustomMergeTradesStatus (trades, callback = NOOP) {
    return new Promise((resolve) => {
        const _callback = (res) => {
            callback(res);
            resolve(res);
        };

        if (getUserInfo().vipFlag != 0 && getUserInfo().vipFlag != 4) {
        // 如果不是待发货，不进行请求
            if (trades && trades[0] && trades[0].status != 'SELLER_CONSIGNED_PART' && trades[0].status != 'WAIT_SELLER_SEND_GOODS') {
                _callback(trades);
                return;
            }
            // 高级版用户才需要获取信息
            let tidWithBuyerNick = trades.map((item) => {
                return {
                    tid: isEmpty(item.mergeTid) ? item.tid : 'TDM' + item.trades[0].tid,
                    buyerNick: item.buyer_nick,
                };
            });

            pgApi({
                api: aiyongApiList.customMergeCountGet,
                args: { mergeTidsRequests: tidWithBuyerNick },
                mode: 'json',
                callback: (res) =>  {
                    if (res && res.body) {
                    // 转换格式
                        let mergeMap = {};

                        res.body.forEach(item => {
                            if (item.tid) {
                                mergeMap[item.tid + ''] = item.mergeNumber;
                            }
                            if (item.mergeTid) {
                                mergeMap[item.mergeTid + ''] = item.mergeNumber;
                            }
                        });
                        trades.forEach(item => {
                            let m = mergeMap[item.tid + ''] || mergeMap[item.mergeTid + ''];
                            if (m >= 2) {
                                item['mergeNumber'] = m;
                                // 合单
                                if (!isEmpty(item.mergeTid) && item.trades && item.trades.length == m) {
                                    delete (item.mergeNumber);
                                }
                            }
                        });

                        _callback(trades);
                    } else {
                        console.error('getCustomMergeTradesStatus callback error', res);
                        _callback(trades);
                    }

                },
                errCallback: (err) => {
                    console.error('getCustomMergeTradesStatus error', err);
                    _callback(trades);
                },
            });
        } else {
        // 初级版直接跳过
            _callback(trades);
        }
    });
}
