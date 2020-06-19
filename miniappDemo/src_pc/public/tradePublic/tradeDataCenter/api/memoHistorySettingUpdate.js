import {  NOOP } from "tradePolyfills";
import { aiyongApiList} from "tradePublic/tradeDataCenter/consts";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";

export function memoHistorySettingUpdate (
    {
        isOpen,
        callback = NOOP,
        errCallback = handleError,
    }
) {
    return new Promise((resolve, reject) => {
        pgApi({
            api:aiyongApiList.memoSetUpdate,
            args:{ isopen: isOpen },
            callback: (res) => {
                callback(res);
                resolve(res);
            },
            errCallback: (err) => {
                reject(err);
                errCallback(err);
            },
        });

    });
}
