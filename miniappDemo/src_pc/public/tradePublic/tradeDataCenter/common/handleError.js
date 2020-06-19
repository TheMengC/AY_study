import {TdcLogger} from "tradePublic/tradeDataCenter/common/tdcLogger";

export function handleError(error,name){
    TdcLogger.error(name || '未知错误', error);
}
