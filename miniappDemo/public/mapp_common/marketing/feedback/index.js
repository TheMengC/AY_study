// import {GetUserInfo} from "../User/GetUserInfo";
// import {DoBeanWithObj} from "../DoBeacon/DoBeacon";

import { isEmpty } from "mapp_common/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { api } from "mapp_common/utils/api";
import { ENV } from "@/constants/env";

const FEEDBACK_TYPE_SHOWED = 1;         // 展现type
const FEEDBACK_TYPE_CLICKED = 2;        // 点击type
const FEEDBACK_TYPE_CLOSED = 3;         // 关闭type

/*
 * @Description 反馈广告展现事件
*/
export const feedbackShowed = function ({ adData }) {
    if(isEmpty(adData)) {
        return;
    }
    const { open_id, creative_id:open_cid, pid } = adData;
    const { user_id:imei } = getUserInfo();
    feedback({ open_id, open_cid, imei, type: FEEDBACK_TYPE_SHOWED, pid });
};

/*
 * @Description 反馈广告关闭事件
*/
export const feedbackClosed = function ({ adData }) {
    if(isEmpty(adData)) {
        return;
    }
    const { open_id, creative_id:open_cid, pid } = adData;
    const { user_id:imei } = getUserInfo();
    feedback({ open_id, open_cid, imei, type: FEEDBACK_TYPE_CLOSED, pid });
};

/*
 * @Description 反馈广告点击事件
*/
export const feedbackClicked = function ({ adData, url }) {
    if(isEmpty(adData)) {
        return;
    }
    let pid = isEmpty(adData.modalVipPid) ? adData.pid : adData.modalVipPid;
    const { open_id, creative_id:open_cid } = adData;
    const { user_id:imei } = getUserInfo();
    feedback({ open_id, open_cid, imei, type: FEEDBACK_TYPE_CLICKED, pid, url });
};

/*
 * @Description 实际的广告反馈请求
*/
function feedback ({ open_id, open_cid, imei, type, pid, url = undefined }) {
    const args = {
        open_id,
        open_cid,
        type,
        imei,
        pid,
        source: ENV.adFeedbackSource,
    };

    if (!isEmpty(url)) {
        args.url =  encodeURIComponent(url);
    }

    api({
        apiName: 'aiyong.ad.showAd.feedback',
        args,
    });
}
