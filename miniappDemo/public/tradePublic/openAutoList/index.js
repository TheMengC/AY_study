import { api, NOOP } from "mapp_common/utils/api";
import {handleError} from "tradePublic/tradeDataCenter/common/handleError";

// aiyong.item.user.settings.autoadjust.cale.update
// aiyong.item.user.settings.autoadjust.update
/**
 * 开启调整自动上下架
 * @param callBack
 * @param errCallBack
 */
export const openAutoList = ({callBack = NOOP, errCallBack = handleError}) =>  {
    api({
        apiName: 'aiyong.item.user.settings.autoadjust.cale.update',
        args: { status: 1 },
        callback: () => {
            api({
                apiName: 'aiyong.item.user.settings.autoadjust.update',
                args: { sel: 'on' },
                callback: res => {
                    callBack(res)
                },
                errCallback: errCallBack,
            })
        },
        errCallback: errCallBack,
    })
};
