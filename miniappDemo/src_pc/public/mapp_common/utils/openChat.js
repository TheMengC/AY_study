import { api } from "./api";
import { ENV } from "@/constants/env";
import { Logger } from "mapp_common/utils/logger";
import { NOOP } from "mapp_common/utils/index";

/**
 * 打开旺旺聊天
 * @param nick 聊天的对象的nick
 * @param text 携带的文本
 */
export const openChat = ({ nick, text, success = NOOP, fail = NOOP }) => {
    Logger.log('打开旺旺', {
        nick,
        text,
    });
    try {
        my.qn.openChat({
            nick: nick,
            text: text,
            success: success,
            fail: fail,
        });
    } catch (e) {
        Logger.error('openChat', e);
    }

};


/**
 * 联系爱用客服
 * @param text 发送的话术
 */
export const contactCustomerService = (text,nick) => {
    if (nick) {
        openChat({ nick, text });
        return;
    }
    api({
        apiName:'aiyong.tools.staffnick.get',
        host:ENV.hosts.trade,
        method: '/iytrade2/getchatnick',
        callback: (res) => {
            let nick = res ? res.result ? res.result : res : 'cntaobao爱用科技';
            openChat({ nick, text });
        },
        errCallback:() => {
            openChat({ nick: 'cntaobao爱用科技', text });
        },
    });
};
