import { aiyongGetLogisticsCompanyByCode } from "tradePublic/taobaoLogisticsCompaniesGet";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";

/** 
 * 处理电子面单数据为特定JSON格式
 * @param type 默认返回所有，type=self,返回自己的电子面单
 * @param datas 传入的电子面单的原始数据
 *  */
export function dealEWayBills(datas=[], type='all') {
    let elecfaceAddressesIndexedByCpCode = {};
    datas.map(item => {
        let waybillInfo = item.address.waybill_apply_subscription_cols && item.address.waybill_apply_subscription_cols.waybill_apply_subscription_info;
        if (!waybillInfo) {
            return;
        }
        let shareName = item.shareName;
        if(type == 'self') {
            waybillInfo = waybillInfo.filter(element => shareName == getUserInfo().userNick);
        }

        waybillInfo.map(waybillItem => {
            if (!elecfaceAddressesIndexedByCpCode[waybillItem.cp_code]) {
                elecfaceAddressesIndexedByCpCode[waybillItem.cp_code] = {
                    cp_name: (aiyongGetLogisticsCompanyByCode(waybillItem.cp_code) || {}).name_cainiao,
                    cp_code: waybillItem.cp_code,
                    cp_type: waybillItem.cp_type,
                    address_arr: [],
                };
            }

            let wbaArr = waybillItem.branch_account_cols.waybill_branch_account;
            for (let m in wbaArr) {
                let addressDtoArr = wbaArr[m].shipp_address_cols.address_dto;
                for (let n in addressDtoArr) {
                    let itemObj = {};
                    itemObj.addressStr = ['province', 'city', 'district', 'detail'].map(key => addressDtoArr[n][key]).join(' ');
                    itemObj.address = addressDtoArr[n];
                    itemObj.sharename = shareName;
                    itemObj.quantity = wbaArr[m].quantity;
                    itemObj.services = wbaArr[m].service_info_cols && wbaArr[m].service_info_cols.service_info_dto || [];
                    elecfaceAddressesIndexedByCpCode[waybillItem.cp_code].address_arr.push(itemObj);
                }
            }

        });
    });

    return elecfaceAddressesIndexedByCpCode;
}