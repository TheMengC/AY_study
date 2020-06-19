import { ENV, getUserInfo, isEmpty, moment, Object_values } from "tradePolyfills";
import { getFlatTrades } from "tradePublic/tradeDataCenter/index";
import { getTimeMax, sum } from "tradePublic/tradeDataCenter/common/utils";
import { getOrders, washTradesWithArray } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { soldGet } from "tradePublic/tradeDataCenter/api/soldGet";
import { fullinfoget_all_fields, soldget_all_type } from "tradePublic/tradeDataCenter/config";
import { SOLDGET_SOURCE } from "tradePublic/tradeDataCenter/consts";

export function resolveTrade(trade){
    initTrade(trade);
    if (trade.mergeTid){
        resolveMergeTrade(trade);
    }
    if (trade.num == undefined){
        trade.num =getOrders(trade).map(order=>order.num).reduce((a,b) => a+b,0); //单行求和大法
    }
    setRefundFlag(trade)
    if (ENV && ENV.platform == 'mapp'){
        getFlatTrades(trade).map(subTrade=>{
            washTradesWithArray(subTrade);
            splitSkuPropertys(subTrade);
        })

    }
    if (trade.checked == undefined) {
        trade.checked = false;
    }

    return trade;
}
export function splitSkuPropertys(trade){
    getOrders(trade).map(order=>{
        if (order.sku_properties_name){
            order.sku_properties_values = order.sku_properties_name.split(';').map(item=>item.split(':')[1]);
        }
    })
}

export const mergeTradeSameFields = [
    'buyer_nick',
    'seller_nick',
    'receiver_address',
    'receiver_city',
    'receiver_country',
    'receiver_district',
    'receiver_mobile',
    'receiver_name',
    'receiver_phone',
    'receiver_state',
    'receiver_town',
    'receiver_zip',
    'buyer_alipay_no'
    //'status',
];

export function resolveMergeTrade(mergeTrade){
    let orders = [];
    mergeTrade.trades.map(subTrade => Array.prototype.push.apply(orders, getOrders(subTrade)));
    if (ENV && ENV.platform == 'mapp') {
        mergeTrade.orders = orders;
    }else{
        mergeTrade.orders = {order: orders}
    }
    mergeTrade.tid = mergeTrade.trades.map(trade => trade.tid).join(',');
    let sameContent = {};
    mergeTrade.payment = 0;
    mergeTrade.post_fee = 0;
    mergeTrade.total_fee = 0;
    mergeTrade.trades.map(subTrade => {
        Object.keys(subTrade).map(key => {

            if (!sameContent[key]){
                sameContent[key] = {content: []};
            }
            sameContent[key].content.push(subTrade[key]);
        })
        !isEmpty(subTrade.payment) && (mergeTrade.payment += parseFloat(subTrade.payment));
        !isEmpty(subTrade.post_fee) && (mergeTrade.post_fee += parseFloat(subTrade.post_fee));
        !isEmpty(subTrade.total_fee) && (mergeTrade.total_fee += parseFloat(subTrade.total_fee));
        //subTrade.buyer_rate&&(mergeTrade.buyer_rate=true)
        //subTrade.seller_rate&&(mergeTrade.seller_rate=true)
        //subTrade.is_daixiao&&(mergeTrade.is_daixiao=true)
    });
    Object.keys(sameContent).map(key => {
        let set = new Set(sameContent[key].content.map(str => str.replace ? str.replace(/\s/g,'') : str));
        sameContent[key].set = set;
    });
    mergeTradeSameFields.map(key => {
        if (!sameContent[key]){
            sameContent[key] = {};
            //sameContent[key].isError = true;
            return;
        }
        mergeTrade[key] = sameContent[key].content[0];
        sameContent[key].isError = sameContent[key].set.size != 1;
    });
    ['payment','post_fee','total_fee','num'].map(key => {
        if (!sameContent[key]){
            return;
        }
        if (key === 'num') {
            mergeTrade[key] = sum(sameContent[key].content).toFixed(0);
        }else{
            mergeTrade[key] = sum(sameContent[key].content).toFixed(2);

        }
    })
    if (sameContent.yfx_fee){
        mergeTrade.has_yfx = true;
        mergeTrade.yfx_fee = sum(sameContent.yfx_fee.content).toFixed(2);
    }
    let wayBillMap = new Map();
    let printState = {
        courier: false,
        invoice: false,
        surface: false,
    }
    mergeTrade.has_buyer_message = false;
    mergeTrade.trades.map(subTrade => {
        printState.courier = printState.courier || subTrade.printState.courier;
        printState.invoice = printState.invoice || subTrade.printState.invoice;
        printState.surface = printState.surface || subTrade.printState.surface;
        mergeTrade.has_buyer_message |= subTrade.has_buyer_message;
        subTrade.wayBill.map(waybill => {
            wayBillMap.set(JSON.stringify(waybill),waybill);
        })
    })
    mergeTrade.wayBill = [...wayBillMap.values()];
    mergeTrade.printState = printState;

    ['created','pay_time','consign_time','modified','end_time','timeout_action_time',].map(key => {
        if (sameContent[key]){
            mergeTrade[key] = getTimeMax(sameContent[key].content);
        }
    })
    let errorFields = Object.keys(sameContent).filter(key => sameContent[key].isError);
    if (errorFields.length){
        console.error('合单列数据错误'+errorFields.join(','),errorFields.map(key => sameContent[key].content));
        return false;
    }
    return true;
}

/**
 * 对刚进来的订单数据做一些初始化 将waybill等东西放进去 避免之后提前取的时候undefined问题
 */
export function initTrade(trade){
    getFlatTrades(trade).map(trade => {
        if (!trade.wayBill) {
            trade.wayBill = [];
        }
        if (!trade.printState) {
            trade.printState = {};
        }
    })

}

export function setRefundFlag (trade) {
    getFlatTrades(trade).map(subTrade => {
        let orders = getOrders(subTrade);
        orders.map(order => {
            if (order.refund) {
                order.refund_id = order.refund.refund_id;
                order.refund_status = order.refund.status;
            }
            if (order.refund_id && order.refund_status && order.refund_status != "CLOSED" && order.refund_status != "SUCCESS") {
                order.is_refunding = true;
            } else {
                order.is_refunding = false;
            }
        });
        subTrade.has_refunding = getOrders(subTrade).some(order => order.is_refunding);
    });
    if (trade.mergeTid) {
        trade.has_refunding = trade.trades.some(subTrade => subTrade.has_refunding);
    }
}

export function setTradesLoadingState(trades,loadingState){
    trades.map(trade => {
        setTradeLoadingState(trade,loadingState);
    });
}

let defaultLoadingState = {
    fullinfo: false,
    printBrief: false,
    printWayBill: false,
    refundMessage: false,
    logistics: false,
}

export function setTradeLoadingState(trade,loadingState){
    loadingState = Object.assign({},defaultLoadingState,loadingState);
    Object.assign(trade,{
        loadingState
    })
    return trade;
}

/**
 * 合并两个订单，返回一个新创建的对象 如果要修改dataSource 请把这个对象重新用Index设回去 如 dataSource[index]=updateTrade(new,old) 然后更新dataSource
 * 这个函数主要是可以接受一个不完整的newTrade并和之前的oldTrade进行拼接 将对应的字段更新掉
 * 这个方法不支持合单
 * @param oldTrade
 * @param newTrade
 * @param mutable 是否改变原有对象 默认不改变并返回生成的新对象
 * @returns {*}
 */
export function updateTrade(oldTrade,newTrade,mutable=false){
    let {orders,wayBill,printState,trades,...rest} = newTrade;
    let trade = {};
    if (!mutable){
        trade = Object.assign({},oldTrade,rest);
    } else{
        trade = Object.assign(oldTrade,rest);
    }
    orders = getOrders(newTrade);
    if (orders){
        let oldOrders = getOrders(trade);
        if (oldOrders){
            let oldOrderIndexedByOid = {};
            let resultOrders=[];
            oldOrders.map(oldOrder => {
                oldOrderIndexedByOid[oldOrder.oid]=oldOrder
            });
            orders.map(newOrder=>{
                let oldOrder = oldOrderIndexedByOid[newOrder.oid];
                delete oldOrderIndexedByOid[newOrder.oid];
                if (oldOrder){
                    resultOrders.push(Object.assign({},oldOrder,newOrder));
                }else{
                    resultOrders.push(newOrder);
                }
            })
            Array.prototype.push.apply(resultOrders,Object_values(oldOrderIndexedByOid));
            if (ENV && ENV.platform == 'mapp') {
                trade.orders = resultOrders;
            }else{
                trade.orders.order = resultOrders;
            }
        }else{
            if (ENV && ENV.platform == 'mapp'){
                trade.orders=orders

            }else{
                trade.orders={
                    order:orders
                }
            }
        }
    }
    if (wayBill){
        trade.wayBill = updateWayBills(oldTrade.wayBill,wayBill);
    }
    if (printState){
        trade.printState.courier = trade.printState.courier || printState.courier;
        trade.printState.invoice = trade.printState.invoice || printState.invoice;
        trade.printState.surface = trade.printState.surface || printState.surface;
        trade.printState.invoicesPart = trade.printState.invoicesPart || printState.invoicesPart;
    }
    return trade;
}

export function updateWayBills(oldWaybills,newWaybills){
    if (!oldWaybills){
        oldWaybills = [];
    }
    let wayBillMap = new Map();

    newWaybills.map(item => {
        wayBillMap.set(JSON.stringify(item),item);
    })
    oldWaybills.map(item => {
        wayBillMap.set(JSON.stringify(item),item);
    })
    let waybillAfterMerge = [...wayBillMap.values()];
    /**
     * isNative这个是标记着是打印后直接修改数据进行绑定的 不是从接口取的
     * 如果这些直接绑定的在newWaybills里面不存在 是要手动给他添加上去的 因为getPrintWeightHistory可能有一定的延迟 先以这个为准
     */
    waybillAfterMerge = waybillAfterMerge.filter(item => {
        if (item.isNative){
            if (waybillAfterMerge.find(item2 => item2.voice == item.voice && !item2.isNative)){
                return false;
            }
            ;
        }
        return true;
    });
    return waybillAfterMerge;
}

export const getStatusLabel = ({trade, currentTab, type='trade'}) => {
    const { status } = trade;
    let cell = {};
    let statusLabelMap = {
        'WAIT_BUYER_PAY': {label:'待付款',value:'label-wait',type:'dfk',status:'WAIT_BUYER_PAY'},
        'TRADE_NO_CREATE_PAY': {label:'待付款',value:'label-wait',type:'dfk',status:'WAIT_BUYER_PAY'},
        'PAY_PENDING': {label:'外卡支付',value: 'label-nomore',type:'dfk',status:'WAIT_BUYER_PAY'},
        'WAIT_SELLER_SEND_GOODS': {label:'待发货',value:'label-info',type:'dfh',status:'WAIT_SELLER_SEND_GOODS'},
        'SELLER_CONSIGNED_PART': {label:'部分发货',value:'label-info',type:'dfh',status:'WAIT_SELLER_SEND_GOODS'},
        'PAID_FORBID_CONSIGN': {label:'已冻结',value:'label-info',type:'dfh',status:'PAID_FORBID_CONSIGN'},
        'WAIT_BUYER_CONFIRM_GOODS': {label:'已发货',value:'label-primary',type:'yfh',status:'WAIT_BUYER_CONFIRM_GOODS'},
        'TRADE_ BUYER_SIGNED': {label:'已签收',value:'label-primary',type:'yfh',status:'WAIT_BUYER_CONFIRM_GOODS'},
        'TRADE_FINISHED': {label:'已成功',value:'label-success',type:'ycg',status:'TRADE_FINISHED'},
        'TRADE_CLOSED': {label:'已关闭',value:'label-nomore',type:'ygb',status:'ALL_CLOSED'},
        'TRADE_CLOSED_BY_TAOBAO': {label:'已关闭',value:'label-nomore',type:'ygb',status:'ALL_CLOSED'},
    };
    cell = { ...statusLabelMap[status] };
    switch (status) {
    case 'WAIT_BUYER_PAY':
    case 'TRADE_NO_CREATE_PAY': //没有创建外部交易（支付宝交易）
        if(!isEmpty(trade.step_trade_status)){
            if(trade.step_trade_status == 'FRONT_NOPAID_FINAL_NOPAID'){
                cell.label = '定金未付';
                cell.status='FRONT_NOPAID_FINAL_NOPAID'
            }else if(trade.step_trade_status == 'FRONT_PAID_FINAL_NOPAID'){
                cell.label = '定金已付';
                cell.status = 'FRONT_PAID_FINAL_NOPAID';
            }
        }
        break;
    case 'TRADE_FINISHED'://交易成功
        let diff = moment(moment()).diff(trade.end_time, 'days');
        if(diff < 15 && !trade.seller_rate){
            cell.label = trade.buyer_rate ? '买家已评' : '双方未评';
            cell.value = 'label-rate';
            cell.type = 'dpj';
            cell.status = 'NEED_RATE';
        }
        break;
    }
    if (type == 'trade') {
        // 在退款中type下退款订单的主状态显示退款中
        if (currentTab == 'TRADE_REFUND') {
            if (trade.has_refunding == true){
                cell.label = '退款中';
                cell.value = 'label-refund';
                cell.type = 'tkz';
                cell.status='TRADE_REFUND'
                cell.mainType = statusLabelMap[status].type;
            }
        }
    } else if (type == 'order') {
        // 普通退款
        if (trade.is_refunding) {
            cell.label = '退款中';
            cell.value = 'label-refund';
            cell.type = 'tkz';
            cell.status='TRADE_REFUND'
        } else if(trade.refund_status == 'SUCCESS'){
            cell.label = '已关闭';
            cell.value = 'label-nomore';
            cell.type = 'ygb';
            cell.status='ALL_CLOSED'
        }
        // 售后退款
        if(trade.refund_status == 'NO_REFUND' && !isEmpty(trade.refund_id)){
            cell.label = '售后退款';
            cell.value = 'label-refund';
            cell.type = 'tkz';
            cell.status='TRADE_REFUND'
        }
    }
    return cell;
}

/**
 * 获取完整的收货地址
 * @param trade
 * @param needContact {boolean} 是否需要联系方式
 * @param showZip {true|false|'auto'} 是否需要邮编
 * @returns {string}
 */
export function getTradeAddress (trade, { needContact = false, showZip = 'auto' } = {}) {
    // 拼接收货地址
    let contact = '';
    let addrWithoutContact = [
        trade.receiver_state,
        trade.receiver_city,
        trade.receiver_district,
        trade.receiver_country,
        trade.receiver_address,
    ].filter(Boolean).join('，');

    if (showZip !== false) { // 邮编
        if (trade.receiver_zip !== '000000' && showZip === 'auto' || showZip === true) {
            addrWithoutContact += '，' + trade.receiver_zip;
        }
    }

    if (needContact) {
        contact = [
            trade.receiver_name,
            trade.receiver_mobile,
            trade.receiver_phone,
        ].filter(Boolean).join('，');
        return contact + '，' + addrWithoutContact;

    } else {
        return addrWithoutContact;
    }


}

export const getMemoWithHistoryStr = (trade) => {
    let memo = trade.seller_memo;
    if (trade.memoHistory && trade.memoHistory.newest) {
        let newest = trade.memoHistory.newest;
        if (newest.memoContent === trade.seller_memo
            && newest.flag === trade.seller_flag
            && getUserInfo().newMemoSet == 1
        ) {
            let tag = getSubUserNick(newest.subNick);
            if (!tag) {
                tag = newest.sellerNick ? newest.sellerNick : '';
            }
            if (tag) {
                tag += ' ';
            }
            tag += newest.modify || "";
            // 带备注人和时间的备注
            memo = `${newest.memoContent} 【${tag}】`;
        }
    }

    return memo;
};

function getSubUserNick(nick){
    if (!nick) {
        return '';
    }
    let arr = nick.split(":");
    if (arr[1]) {
        return arr[1];
    }
    return arr[0];
}

/* 返回和当前订单信息一致的订单，即可合单的订单(max=40) */
export function getCanMergeTrade(trade) {
    return new Promise((resolve, reject) => {
        let { trades, totalResults } = soldGet({
            fields: fullinfoget_all_fields,
            source: SOLDGET_SOURCE.top,
            status: 'WAIT_SELLER_SEND_GOODS', // 等待卖家发货
            type: soldget_all_type,
            buyer_nick: trade.buyer_nick, // 买家nick
            pageSize: 40,
            pageNo: 1,
        });

        let mergeTrades = [];
        if (totalResults > 1) {
            // 将可合并的订单进行处理
            mergeTrades = trades.filter((item) => {
                return item.tid != trade.tid &&
                        item.receiver_name == trade.receiver_name &&
                        item.receiver_mobile == trade.receiver_mobile &&
                        item.receiver_city == trade.receiver_city &&
                        item.receiver_district == trade.receiver_district &&
                        item.receiver_town == trade.receiver_town &&
                        item.receiver_address == trade.receiver_address;
            });
        }

        resolve(mergeTrades);
    });
}
