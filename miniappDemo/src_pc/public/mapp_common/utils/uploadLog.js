import { api } from "mapp_common/utils/api";
import { getCurrentVersionNum } from "mapp_common/utils/version";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { ENV } from "@/constants/env";
import { getLogRecord } from "mapp_common/utils/logger";

/**
 * 上传日志
 * @param type
 * @param callback
 */
export function uploadRecordLog ({ type, callback = () => {}, errCallback = () => {} }) {
    let { log, actionQueueUploadedLength } = getLogRecord();
    let data = log.slice(actionQueueUploadedLength).map(item => {
        let obj = { ...item };
        delete obj.target;
        return obj;
    });
    let length = log.length;

    api({
        apiName: "aiyong.tools.log.save",
        host:'//crm.aiyongbao.com',
        method:'/log/save',
        args:{
            content: JSON.stringify(data),
            version:getCurrentVersionNum(),
            nick: getUserInfo().userNick,
            type: type,
            project: ENV.planet,
        },
        callback:(res) => {
            if (res.code == 200) {
                actionQueueUploadedLength = length;
            }
            callback(res);
        },
        errCallback,
    });


}
