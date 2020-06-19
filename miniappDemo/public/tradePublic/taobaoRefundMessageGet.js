import qnRouter from "tradePublic/qnRouter";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 查询退款留言/凭证列表
 * @param query
 * @param callback
 * @param errCallback
 */
export default function taobaoRefundMessageGet ({ query, callback, errCallback = undefined }) {
    query.fields = 'total_results,refund_messages,id,owner_id,owner_nick,content,pic_urls,created,message_type,refund_phase,refund_id,owner_role,';
    qnRouter({
        api:'taobao.refund.messages.get',
        params:query,
        callback:(rsp) => {
            callback(rsp);
        },
        errCallback:(error) => {
            if (errCallback) {
                errCallback(error);
            } else {
                showErrorDialog('温馨提示', '获取单笔退款详情失败，请稍候再试！', JSON.stringify(error));
            }
        },
    });
}
