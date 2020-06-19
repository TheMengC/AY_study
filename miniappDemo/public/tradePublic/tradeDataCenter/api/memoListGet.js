import {  NOOP } from "tradePolyfills";
import { aiyongApiList} from "tradePublic/tradeDataCenter/consts";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";

export function memoListGet (
    {
        tid,
        createTime,
        callback = NOOP,
        errCallback = handleError,
    }
) {
    return new Promise((resolve,reject) => {
        pgApi({
            api:aiyongApiList.memoListGet,
            args:{ tid: tid, orderCreate: createTime },
            callback: ({ body }) => {
                callback(body.record);
                resolve(body.record);
            },
            errCallback: (err) => {
                reject(err);
                errCallback(err);
            },
        });
    });
}
