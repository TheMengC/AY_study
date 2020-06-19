import Taro from '@tarojs/taro';
import {initDatabase} from 'tradePublic/titleOptimize/databaseCenter';
import { consoleLogger } from "tradePolyfills";

export const processInit = (type='normal') => {
    return new Promise((resolve, reject)=>{
        initDatabase({
            type:type,
            processCallback:(res)=>{
                consoleLogger.warn('processInit-processCallback',res);
                process_dispatch({
                    hideProcess: res.showResult,
                    number: res.number,
                    process1: res.process1,
                    process2: res.process2,
                    process3: res.process3,
                    process4: res.process4,
                    process5: res.process5,
                    process6: res.process6,
                })
            }
        }).then((res)=>{
            consoleLogger.warn('processInit-then',res);
            resolve(res);
        }).catch((e)=>{
            consoleLogger.error('processInit-catch',e);
            reject(e);
        })
    })
}

/*
 * @Description 获取redux中的所有广告信息
*/
export const process_getState = () => {
    return Taro.getApp().store.getState().titleOptimizeProcessViewReducer;
};

/*
 * @Description 更新redux中的广告信息
*/
export const process_dispatch = (data) => {
    consoleLogger.log('log~~~~', '开始改变标题优化组件的redux', data);
    Taro.getApp().store.dispatch({ type: "UPDATE_TITLE_OPTIMIZE_PROCESS_INFO", data });
};