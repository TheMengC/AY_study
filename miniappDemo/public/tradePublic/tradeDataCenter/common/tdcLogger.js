import {NOOP} from "tradePolyfills";
import {Logger} from "tradePolyfills/index";

export const logLevel = 4;
export const TdcLogger = {error: NOOP,warning: NOOP,info: NOOP,debug: NOOP};
const logMap = {
    0: {method: 'error',style: 'color:white;background-color:red'},
    1: {method: 'warning',style: 'color:white;background-color:orange'},
    2: {method: 'info',style: 'color:white;background-color:green'},
    3: {method: 'debug',style: 'color:white;background-color:#87939a'},
}
Object.keys(logMap).map(item => {
    TdcLogger[logMap[item].method] = log.bind(null,item);
})
export function log(level,name,...str){
    if (level <= logLevel){
        Logger.log.apply(null,[`%c[${logMap[level].method}]%c${name}:`,logMap[level].style,"color: white;background-color:blue",...str]);
    }
}
