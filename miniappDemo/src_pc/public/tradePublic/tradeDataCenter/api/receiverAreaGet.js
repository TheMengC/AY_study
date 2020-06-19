import { pgApi } from "tradePublic/tradeDataCenter/common/pgApi";
import { aiyongApiList } from "tradePublic/tradeDataCenter/consts";
import { NOOP } from "tradePublic/consts";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";

export function receiverAreaGet ({
    status,
    callback = NOOP,
    errCallback = handleError,
}) {

    pgApi({
        api: aiyongApiList.receiverAreaGet,
        args    :{ status: status },
        callback: (rsp) => {
            let rspAreaList = rsp.body.receiverAreaListResponse.receiverAreaList;
            callback(rspAreaList);
        },
        errCallback: (err) => {
            errCallback(err);
        },
    }
    );
}

