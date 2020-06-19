import { aiyongGetLogisticsCompanyByCode, aiyongLogisticsCompaniesGet } from "tradePublic/taobaoLogisticsCompaniesGet";
import { api, Logger, getDeferred} from "tradePolyfills/index";
import { getCachedRequest, saveCacheWithTimeout } from "tradePublic/utils/cache";
import qnRouter from "tradePublic/qnRouter";
import { getArrayInWrapper, resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { cainiaoCloudprintMystdtemplatesGet } from "tradePublic/cainiaoCloudprintMystdtemplatesGet";
import { getFlatTrades } from "tradePublic/tradeDataCenter";
import { apiAsync, showErrorDialog } from "tradePublic/utils";

export const initElecfaceTemplateInfoDeferred = getDeferred();

let elecfaceTemplateInfo; // 标准模板信息
let elecfaceShareAddresses; // 各个快递公司的可选共享面单和地址
let elecfaceUserStdTemplates;// 初始化自定义标准模板(内含自定义区域)

/**
 * 获取面单打印需要的一大堆信息
 * @returns {Promise<{elecfaceShareAddresses: *, elecfaceUserStdTemplates: *, elecfaceTemplateInfo: *}>}
 */
export function getElecfaceData () {
    return initElecfaceTemplateInfoDeferred.then(() => ({
        elecfaceTemplateInfo,
        elecfaceShareAddresses,
        elecfaceUserStdTemplates,
    }));
}
/**
 * 获取所有的
 * @returns {Promise<void>}
 */
export async function initElecfaceTemplateInfo () {
    try {
        await new Promise(aiyongLogisticsCompaniesGet);
        Logger.warn('initElecfaceTemplateInfo1');
        elecfaceTemplateInfo = await getCachedRequest({
            key: 'elecfaceTemplateInfo',
            timeout: '12h',
            requestFun: ({ callback }) => {
                qnRouter({
                    api: "cainiao.cloudprint.stdtemplates.get",
                    params: {},
                    callback: (e) => {
                        callback(setElecFaceTemplateInfo(e));
                    },
                });
            },
        });
        Logger.warn('initElecfaceTemplateInfo2');

        elecfaceShareAddresses = await getCachedRequest({
            key: 'elecfaceShareAddresses',
            timeout: '12h',
            requestFun: ({ callback }) => {
                initElecFaceAddress().then(callback);
            },
        });
        Logger.warn('initElecfaceTemplateInfo3');

        elecfaceUserStdTemplates = await getCachedRequest({
            key: 'elecfaceUserStdTemplates',
            timeout: '12h',
            requestFun: ({ callback }) => {
                let a = cainiaoCloudprintMystdtemplatesGet();
                a.then(callback);

            },
        });
        Logger.warn('initElecfaceTemplateInfo4');

        Object.keys(elecfaceUserStdTemplates).map(cp_code => {
            let company = elecfaceTemplateInfo[cp_code];
            let userTemplatesCurrentCompany = elecfaceUserStdTemplates[cp_code];
            if (!company) {
                return;
            }
            company.templates.map(item => {
                let currentUserStdTemplateForCompany = userTemplatesCurrentCompany[item.standard_template_id];
                if (!currentUserStdTemplateForCompany) {
                    return;
                }
                item.user_templates = currentUserStdTemplateForCompany.user_templates;
            });
        });
        Logger.warn('initElecfaceTemplateInfo5');


        initElecfaceTemplateInfoDeferred.resolve({
            elecfaceShareAddresses,
            elecfaceTemplateInfo,
            elecfaceUserStdTemplates,
        });
        Logger.log('initElecfaceTemplateInfo', {
            elecfaceShareAddresses,
            elecfaceTemplateInfo,
            elecfaceUserStdTemplates,
        });
    }catch (e) {
        Logger.error('initElecfaceTemplateInfo error ', e);

    }

}


/**
 * 初始化电子面单地址信息 因为有共享面单 所以要把所有共享的面单全部取到 并按快递公司分组并标记默认
 * @param callback
 */
async function initElecFaceAddress () {
    // 优化获取所有共享信息速度，跃迁启动
    // 先取出所有的nick

    let allShareNickRes = await apiAsync({
        apiName: 'aiyong.trade.order.print.elecface.sharenicks.get',
        method: '/print/getAllShareNick',
    });
    // 容错
    if (allShareNickRes.code) {
        showErrorDialog('温馨提示', '获取共享面单出错！' + allShareNickRes.msg);
        return;
    }
    let addressArr = [];

    // 使用取出的所有的nick搞事情
    await Promise.all(allShareNickRes.result.map(item => {
        return new Promise((resolve) => {
            // 根据nick拿到相应的地址信息
            api({
                apiName: 'aiyong.trade.order.print.elecface.address.get',
                method: '/print/getElecAddressByShareNick',
                args: { shareNick: item },
                callback: (resp) => {
                    Logger.log('获取电子面单信息', resp);
                    // 合并到一起去
                    addressArr.push(resp);
                    resolve(resp);
                },
                errCallback: (err) => {
                    resolve(err);
                },
            });
        });
    }));
    let result = addressArr;
    for (let i in result) {
        if (result[i].code) {
            showErrorDialog('温馨提示', "获取共享面单出错！" + result[i].msg, result[i]);
        }
    }
    result = result.filter(item => !item.code);
    let elecfaceAddressesIndexedByCpCode = {};
    result.map(item => {
        let waybillInfo = item.address.waybill_apply_subscription_cols && item.address.waybill_apply_subscription_cols.waybill_apply_subscription_info;
        if (!waybillInfo) {
            return;
        }
        let shareName = item.shareName;
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
                    itemObj.address = addressDtoArr[n];
                    // itemObj.address = getAddressStr(addressDtoArr[n]);
                    itemObj.sharename = shareName;
                    itemObj.quantity = wbaArr[m].quantity;
                    itemObj.services = wbaArr[m].service_info_cols && wbaArr[m].service_info_cols.service_info_dto || [];
                    elecfaceAddressesIndexedByCpCode[waybillItem.cp_code].address_arr.push(itemObj);
                }
            }

        });
    });

    let defaultArr = await apiAsync({
        apiName: 'aiyong.trade.order.print.elecface.defaultaddress.get',
        method: '/print/getDefaultSendAds',
    });
    defaultArr = defaultArr.rsp;
    defaultArr.map(defaultItem => {
        let company = elecfaceAddressesIndexedByCpCode[defaultItem.cp_code];
        if (company) {
            setDefaultElecfaceAddress(company.cp_code, company.address_arr, defaultItem);
        }
    });

    Object.values(elecfaceAddressesIndexedByCpCode).map(company => {
        if (company.address_arr.every(item => item.default == 0)) {
            company.address_arr[0].default = 1;
        }
    });
    return elecfaceAddressesIndexedByCpCode;
}



export const wayBillTypeMap = {
    1: '二联', // standard  标准(二联
    2: '三联', // three 三联
    4: '快运', // freight 快运
    6: '一联', //  single 一联
};

/**
 * 处理公共模板信息 这个信息是从菜鸟来的 内容是目前支持所有快递公司的所有种面单类型
 * @param e
 * @returns {{elecfaceCompanies: [], elecfaceModalsGroupByType: {standard: {}, single: {}, three: {}, kuaidata: {}}}}
 */
export function setElecFaceTemplateInfo (e) {
    let companies = getArrayInWrapper(resolveTopResponse(e).result.datas);
    let elefaceCompanies = {};

    companies.map(company => {
        let cp_code = company.cp_code;
        let stName = (aiyongGetLogisticsCompanyByCode(cp_code) || {}).name_cainiao;
        let companyModified = {
            cp_code: cp_code,
            cp_name: stName,
            templates: [],
        };
        getArrayInWrapper(company.standard_templates).forEach((item) => {
            let typeName = wayBillTypeMap[item.standard_waybill_type];
            if (typeName) {
                companyModified.templates.push(item);
            }
        });
        elefaceCompanies[cp_code] = companyModified;
    });

    return elefaceCompanies;
}


/**
 * 获取面单地址信息和模板信息
 * @returns {{elecfaceShareAddresses: *, elecfaceTemplateInfo: *}}
 */
export function getElecfaceAddressAndTemplate () {
    return {
        elecfaceShareAddresses,
        elecfaceTemplateInfo,
    };
}

/**
 * 通过快递公司编号和模板编号找到对应的模板数据
 * @param cp_code
 * @param templateId
 * @returns {}
 */
export function getTemplateDataByCpCodeAndTemplateId (cp_code, templateId) {
    return elecfaceTemplateInfo[cp_code].templates.find(item => item.standard_template_id == templateId);
}

const userStdTemplatesDic = {};
/**
 * 用user_standard_template_id换自定义区域的url
 * @returns {Promise<unknown>}
 */
export function getCustomAreaByUserStdTemplateId (user_std_template_id) {
    if (userStdTemplatesDic[user_std_template_id]) {
        Logger.log('从内存取到了自定义模板信息');
        return Promise.resolve(userStdTemplatesDic[user_std_template_id]);
    }
    return new Promise((resolve) => {
        qnRouter({
            api: 'cainiao.cloudprint.customares.get',
            params: { template_id: user_std_template_id },
            callback: (res) => {
                res = resolveTopResponse(res);
                res = res.result;
                if (!res.success) {
                    resolve();
                    return;
                }
                let datas = getArrayInWrapper(res.datas);
                if (Array.isArray(datas) && datas.length != 0) {
                    let area = datas[0];
                    let reg = /[^.]+$/;
                    let fields = getArrayInWrapper(area.keys).map(item => {
                        item = item.key_name;
                        let match = item.match(reg);
                        return match && match[0];
                    }).filter(Boolean);
                    let url = area.custom_area_url;
                    userStdTemplatesDic[user_std_template_id] = {
                        fields,
                        url,
                    };
                    resolve(userStdTemplatesDic[user_std_template_id]);
                }else{
                    resolve();
                }
            },
            errCallback: resolve.bind(null),
        });

    });
}

/**
 * 更换默认地址
 * @param selectSendAddress
 * @param callback
 * @returns {Promise<void>}
 */
export async function saveDefaultSendAddress (selectSendAddress, callback) {
    let ssaArr = selectSendAddress;

    let cp_code = ssaArr.cp_code;
    let sharename = ssaArr.sharename;
    let addressObj = ssaArr.address;
    let addressStr = ['province', 'city', 'district', 'detail'].map(key => addressObj[key]).join(' ');

    let rsp = await apiAsync({
        apiName: 'aiyong.trade.order.print.elecface.defaultaddress.set',
        method: '/print/setDefaultSendAds',
        args: {
            cp_code: cp_code,
            face_name: sharename,
            address_dto: addressStr,
        },
    });

    if (rsp.result != "success") {
        return;
    }

    let addresses = (elecfaceShareAddresses[cp_code] || {}).address_arr;
    setDefaultElecfaceAddress(cp_code, addresses, {
        address_dto: addressStr,
        face_name: sharename,
    });
    saveCacheWithTimeout('elecfaceShareAddresses', elecfaceShareAddresses, '12h');
    callback(elecfaceShareAddresses);
}

/**
 * 找到
 * @param cp_code
 * @param allAddress
 * @param defaultAddress
 */
export function setDefaultElecfaceAddress (cp_code, allAddress, defaultAddress) {
    allAddress.map(addressItem => {
        let addressStr = getAddressStr(addressItem.address);
        if (addressStr == defaultAddress.address_dto && addressItem.sharename == defaultAddress.face_name) {
            addressItem.default = 1;
        } else {
            addressItem.default = 0;
        }
    });
}

/**
 * 把地址搞成字符串形式
 * @param addressObj
 */
export function getAddressStr (addressObj) {
    return ['province', 'city', 'district', 'detail'].map(key => addressObj[key]).join(' ');
}

/**
 * 添加物流服务
 * @Author ZW
 * @date   2018-03-09T15:20:26+0800
 * @param  {Object}                 request      原始request数据
 * @param  {string}                 cpCode    物流公司
 * @param  {Object}                 customSrv 自定义服务信息
 * @param  {Object}                 trade 当前订单信息
 * @return {Object}                 增加了服务信息的request数据
 */
export function transformElecfaceServices (cpCode, customSrv, trade) {
    let services = {};
    // 是否是货到付款订单 合单格式是cod,cod,cod
    let isCOD = trade.type == 'cod';
    if (getFlatTrades(trade).some(subTrade => subTrade.type.indexOf('cod') > 0)) {
        isCOD = 1;
    }
    // 实付款，用作保价和货到付款订单
    let payment = 0.00;
    if (trade.tid && trade.payment) {
        payment = getFlatTrades(trade).reduce((a, b) => a + (b.payment || 0), 0);
    }

    // 判断货到付款订单标记
    if (!isCOD && Object.keys(customSrv).length == 0) {
        // 不是货到付款订单并且额外服务不存在
        return services;
    } else {
        services = Object.assign({}, customSrv);
        if (isCOD && payment * 1 != 0) {
            // 加上货到付款的东西
            services['SVC-COD'] = { value: payment };
        }
        if (Object.keys(customSrv).length > 0) {
            // 加上额外服务
            // 判断传入服务中的保价服务是不是自己定义的 -1代表使用订单实付款
            if (customSrv['SVC-INSURE'] && customSrv['SVC-INSURE'].value == "PAYMENT") {
                services['SVC-INSURE'] = { value: payment };
            }
        }
    }

    Logger.log('transformElecfaceServices', services);
    return services;
}
