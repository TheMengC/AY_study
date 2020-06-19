import { api } from "mapp_common/utils/api";
import { NOOP } from "tradePublic/consts";

// 生效时间判断
export function  formatSeconds (theTime) {
    var second = parseInt(theTime / 1000);// 秒
    var minute = 0;// 分
    var hour = 0;// 小时
    var day = 0;// 天
    var obj = {};
    if(second > 60) {
        minute = parseInt(second / 60);
        second = parseInt(second % 60);
        if(minute > 60) {
            hour = parseInt(minute / 60);
            minute = parseInt(minute % 60);
        }
        if(hour > 24) {
            day = parseInt(hour / 24);
            hour = parseInt(hour % 24);
        }
    }
    obj = {
        day:day,
        hour:hour,
        minute:minute,
        second:second,
    };
    return obj;
}

export function getContactRecordApi (id, callback = NOOP, errCallback = NOOP) {
    api({
        method: '/rate/getContactRecord',
        args: { oid: id },
        callback: rsp => {
            callback(rsp);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

export function saveRemark (param, callback = NOOP, errCallback = NOOP) {
    api({
        method: '/rate/saveContactRecord',
        args: param,
        callback: (rsp) => {
            callback(rsp);
        },
        errCallback: (err) => {
            errCallback(err);
        },
    });
}



