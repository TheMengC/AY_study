import { api, Logger, isEmpty } from "tradePolyfills/index";


export default  function getWaybillQuantity (sharename, cp_code, addressObj, callback, origin = 'cainiao') {
    if (origin != 'cainiao') {
        // 其他平台暂时不处理
        callback(0);
    } else {
        api({
            apiName:'aiyong.trade.order.print.elecface.waybillquantity.get',
            method: '/print/getWaybillQuantity',  // 获取电子面单剩余数量
            mode:'json',
            args:{
                sharename:sharename,
                cp_code:cp_code,
            },
            callback:(rsp) => {
                if(!isEmpty(rsp.code)) {
                    callback({
                        code:rsp.code,
                        msg:rsp.sub_msg ? rsp.sub_msg : rsp.msg,
                    });
                }else {
                    // 取得时单个的物流公司 所以就一个取0就ok了
                    let accountArr = rsp.waybill_apply_subscription_cols.waybill_apply_subscription_info[0].branch_account_cols.waybill_branch_account;

                    let keys = ['city', 'detail', 'district', 'province'];
                    let item = accountArr.find(item => !!item.shipp_address_cols.address_dto.find(adItem => keys.every(key => addressObj[key] == adItem[key])));

                    if (item) {
                        if (cp_code == 'DBKD') {
                            // 德邦有问题，甩锅到这里
                            callback(0);
                        } else {
                            callback(item.quantity);
                        }
                        return;
                    }

                    Logger.log('意外处理--', sharename, cp_code, rsp);
                    // 意外
                    callback({
                        code: 404,
                        msg: '未查找到地址对应面单，请先设置默认地址。',
                    });
                }
            },
        });
    }

}
