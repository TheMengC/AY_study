import { NOOP } from "mapp_common/utils/index";
import { Logger } from "mapp_common/utils/logger";
import { isEmpty } from "./index";

/**
 * 执行sql
 * @param sql
 * @param params
 * @param callback
 * @param errCallback
 */
export function doSql (
    {
        sql,
        params = [],
        callback = NOOP,
        errCallback = (e) => console.error(e),
    }) {
    Logger.debug('dosql-start', sql, params);
    try {
        let env = canUseSql();
        if (!env) {
            errCallback('websql没有实现');
            return;
        }
        if (env == 'h5') {
            window.db.transaction(function (context) {
                context.executeSql(
                    sql,
                    params,
                    callback,
                    errCallback);
            });
            return;
        }
        if (env == 'qn') {
            Logger.log('dosql-execSql');
            my.qn.database({
                method: "execSql",
                sql:[sql, params],
                success: (res) => {
                    Logger.debug('dosql-success', res);
                    // drop table 时 res没有数据
                    if(isEmpty(res)){
                        callback(res);
                    }else if (Boolean(res.success) == true) {
                        let data = "";
                        try {
                            data = JSON.parse(res.data);
                        } catch (error) {
                            //这里报错。一般都是 {success: "true", data: ""} 这种情况下，转化data造成的，这种情况不处理,剩下的情况进入失败回调
                        }
                        callback(data);
                    } else {
                        errCallback(res);
                    }
                },
                fail: (res) => {
                    Logger.warn('dosql-fail', res);
                    errCallback(res);
                },
            });
        }

    } catch (e) {
        errCallback(e);
    }
}

/**
 * promise方式调用sql (上面函数的promise包装)
 * @param sql
 * @param params
 * @returns {Promise<unknown>}
 */
export function doSqlAsync ({
    sql,
    params = [],
}) {
    return new Promise((resolve, reject) => {
        doSql({
            sql,
            params,
            callback:resolve,
            errCallback:reject,
        });
    });
}
/**
 * 判断websql是否可用
 * @returns {}
 */
export function canUseSql () {
    if (window && window.db && window.db.transaction) {
        return 'h5';
    }
    if (my && my.qn && my.qn.database) {
        return 'qn';
    }
    return false;
}

const sqlHelper = {
    canUseSql,
    doSql,
    doSqlAsync,
};
export default sqlHelper;
