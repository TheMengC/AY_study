import qnRouter from "tradePublic/qnRouter";
import { showErrorDialog } from "tradePublic/utils";
const defaultFields = 'total_results,has_next,refunds,refund_id,tid,oid,total_fee,buyer_nick,seller_nick,created,modified,order_status,status,good_status,has_good_return,refund_fee,payment,reason,desc,title,num,company_name,sid,refund_phase,refund_version,sku,attribute,outer_id,operation_contraint';
function taobaoRefundsReceiveGet({query,callback,errCallback=undefined}){
    query.fields = query.fields ? query.fields : defaultFields;
	qnRouter({
      	api:'taobao.refunds.receive.get',
      	params:query,
      	callback:(rsp)=>{
            callback(rsp);
        },
        errCallback:(error)=>{
            if (errCallback) {
            	errCallback(error);
            } else {
            	showErrorDialog('温馨提示','获取退款详情失败，请稍候再试！',JSON.stringify(error));
            }
        }
    })
}

export default taobaoRefundsReceiveGet;
