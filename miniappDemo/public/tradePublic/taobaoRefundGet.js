
import qnRouter from "tradePublic/qnRouter";
import { refundget_default_fields } from "tradePublic/tradeDataCenter/config";
import { showErrorDialog } from "tradePublic/utils";

let defaultFields = refundget_default_fields;

function taobaoRefundGet ({ query, callback, errCallback = undefined }) {
    query.fields = query.fields ? query.fields : defaultFields;
    qnRouter({
      	api:'taobao.refund.get',
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

export default taobaoRefundGet;
