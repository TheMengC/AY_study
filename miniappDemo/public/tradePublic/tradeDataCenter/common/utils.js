import { isEmpty } from "tradePolyfills/index";
import { statusMap } from "tradePublic/consts";
import { getStatusLabel } from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { moment } from "tradePolyfills";
import { INDEX_TRADE_TABS } from "@/constants/consts";

export const sum = (arr) => {
    let _sum = 0;
    arr.map(item => {
        let num = parseFloat(item);
        if (isFinite(num)) {
            _sum += num;
        }
    });
    return _sum;
};
export const getTimeMax = (times) => {
    let maxtime = times[0];
    return maxtime;
    times.map(time => {
        let a = moment(time);
        let b = moment(maxtime);
        if (a.isAfter(b)) {
            maxtime = time;
        };
    });
    return maxtime;
};

// 计算两个时间差 返回天/时/分/秒
export const getDiffFormatTime = (firstTime, lastTime) => {
    firstTime = isEmpty(firstTime) ? moment() : moment(firstTime);
    lastTime = isEmpty(lastTime) ? moment() : moment(lastTime);
    const diff = lastTime.diff(firstTime) / 1000;
    const diffDay = Math.floor(diff / 3600 / 24);
    const diffHour = Math.floor((diff - diffDay * 3600 * 24) / 3600);
    const diffMinute = Math.floor((diff - diffDay * 3600 * 24 - diffHour * 3600) / 60);
    const diffSecond = Math.floor(diff - diffDay * 3600 * 24 - diffHour * 3600 - diffMinute * 60);
    return {
        diffDay,
        diffHour,
        diffMinute,
        diffSecond,
    };
};

// 这里获得的状态是订单的主状态，和tab的状态名一致
export const getStatusByTab = (trade) => {
    if (!trade) {
        return "";
    }
    const { status } = trade;
    if (trade.status == 'TRADE_CLOSED' || trade.status == "TRADE_CLOSED_BY_TAOBAO") {
        return 'ALL_CLOSED';
    }
    let tradeTabStatus = !isEmpty(statusMap[status]) ? statusMap[status] : 'WAIT_SELLER_SEND_GOODS';
    if (status === 'TRADE_FINISHED') {
        let diff = moment(moment()).diff(trade.end_time, 'days');
        if (diff < 15 && !trade.seller_rate) {
            tradeTabStatus = 'NEED_RATE';
        }
    }
    if (trade.has_refunding || trade.is_refunding) {
        tradeTabStatus = 'TRADE_REFUND';
    }

    return tradeTabStatus;
};

/**
 * 获取order的label状态
 * @param order
 * @param trade
 */
export function getOrderLabel ({ order, trade, currentTab = '' }) {
    let orderStatus = getStatusLabel({
        trade:order,
        type: 'order',
        currentTab,
    });
    if (trade) {
        let tradeStatus = getStatusLabel({
            trade:trade,
            type:'trade',
            currentTab,
        });
        if (orderStatus.status != tradeStatus.status) {


        };
    }
    INDEX_TRADE_TABS[orderStatus]



}

/**
 * 获取trade的label状态
 */
// export function getTradeStatusLabel (trade, tabStaus) {
//
// }


