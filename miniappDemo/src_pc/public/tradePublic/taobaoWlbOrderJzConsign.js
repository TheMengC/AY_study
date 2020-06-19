import qnRouter from "tradePublic/qnRouter";
import { api} from "tradePolyfills";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 家装发货
 * @param  {[type]} options.query       [description]
 * @param  {[type]} options.callback    [description]
 * @param  {[type]} options.errCallback [description]
 * @return {[type]}                     [description]
 */
function taobaoWlbOrderJzConsign  ({query,callback,errCallback=undefined}){
	qnRouter({
        api:'taobao.wlb.order.jz.consign',
        params:query,
        callback:(rsp)=>{
            //存入数据库中便于搜索运单号 by yxm
            api({
                apiName:'aiyong.trade.order.send.log.save',
                method:'/iytrade2/saveSendInfo',
                mode:'jsonp',
                args:{
                    tid:query.tid,//订单号
                    courier_number:query.out_sid,//运单号
                    is_split:query.is_split,//是否拆单
                    company_code:query.company_code,//物流公司code
                    sendcmd:'taobao.wlb.order.jz.consign',//调用的接口的字符串(无需发货/自己联系/在线下单/家装发货) 例如：taobao.logistics.online.send
                    feature:query.feature?query.feature:''//手机类目号（针对电子产品）
                },
                callback:(rsp)=>{
                },
                errCallback:(error)=>{
                    console.error('家装发货失败',error);
                }
            })
            callback(rsp);
        },
        errCallback:(error)=>{
            if (errCallback) {
                errCallback(error);
            } else {
                showErrorDialog('温馨提示','发货失败，请稍候再试！',JSON.stringify(error));
            }
        }
    })
}

export default taobaoWlbOrderJzConsign;
