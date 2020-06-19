import qnRouter from "tradePublic/qnRouter";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { isEmpty, NOOP } from "tradePolyfills/index";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

/**
 * 修改物流公司和运单号
 * https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.6378669axZkm0q&source=search&docId=21492&docType=2
 * @param tid
 * @param sub_tid
 * @param is_split
 * @param company_code
 * @param companyName
 * @param feature
 * @param callback
 * @param errCallback
 */
export function taobaoLogisticsConsignResend ({ tid, sub_tid = [], is_split = false, company_code, companyName ,out_sid, feature = '', callback = NOOP, errCallback = handleError }) {
    let params = { tid, is_split : is_split ? 1 : 0, company_code,companyName, out_sid, feature };
    if (!isEmpty(sub_tid)) {
        params.sub_tid = sub_tid;
    }
    qnRouter({
        api:'taobao.logistics.consign.resend',
        params,
        callback:(res) => {
            if (resolveTopResponse(res).shipping.is_success) {
                callback(res);
            }else{
                errCallback(res);
            }
        },
        errCallback:errCallback,
    });
}
