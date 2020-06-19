import { getLocalStorageAndParse } from "tradePublic/utils/cache";
import { storage } from "mapp_common/utils/storage";
import qnRouter from "tradePublic/qnRouter";
import { getArrayInWrapper, resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

let mystdtemplatesGetPromise;


export function getTemplateIdByUrl (url) {
    return url.match(/[0-9]+/)[0];
}

/**
 * 获取用户所有快递的自定义区模板信息
 */
export function cainiaoCloudprintMystdtemplatesGet () {
    mystdtemplatesGetPromise = new Promise((resolve, reject) => {
        qnRouter({
            api: 'cainiao.cloudprint.mystdtemplates.get',
            callback: (rsp) => {
                rsp = resolveTopResponse(rsp);
                let userTemplatesIndexedByCpCode = {};
                if (rsp.result.success) {
                    // let mystdtemplates =
                    getArrayInWrapper(rsp.result.datas).map((cpValue) => {
                        let cp_templates = {};
                        getArrayInWrapper(cpValue.user_std_templates).forEach((templateValue) => {
                            let std_template_id = getTemplateIdByUrl(templateValue.user_std_template_url);
                            if (!cp_templates[std_template_id]) {
                                cp_templates[std_template_id] = {
                                    std_template_id: std_template_id,
                                    std_template_url: templateValue.user_std_template_url,
                                    user_templates: [],
                                };
                            }
                            delete templateValue.keys;
                            delete templateValue.user_std_template_url;
                            cp_templates[std_template_id].user_templates.push(templateValue);
                        });
                        userTemplatesIndexedByCpCode[cpValue.cp_code] = cp_templates;
                    });
                    console.log(userTemplatesIndexedByCpCode);

                    resolve(userTemplatesIndexedByCpCode);

                    // let mystdtemplates_promise_arr = [];
                    //
                    // mystdtemplates.forEach((cpValue) => {
                    //     cpValue.cp_templates.forEach((templateValue) => {
                    //         templateValue.template_content.forEach((contentValue) => {
                    //             mystdtemplates_promise_arr.push(new Promise((resolve, reject) => {
                    //                 qnRouter({
                    //                     api: 'cainiao.cloudprint.customares.get',
                    //                     params: { template_id:contentValue.user_std_template_id },
                    //                     callback: (rsp) => {
                    //                         resolveTopResponse(rsp);
                    //                         if(rsp.result.success) {
                    //                             contentValue.custom_area_result = rsp.result.datas.custom_area_result;
                    //                             resolve('ok');
                    //                         } else {
                    //                             reject('error');
                    //                         }
                    //                     },
                    //                     errCallback: () => {
                    //                         reject('error');
                    //                     },
                    //                 });
                    //             }));
                    //
                    //         });
                    //     });
                    // });
                    //
                    // Promise.all(mystdtemplates_promise_arr).then(() => {
                    //     storage.setItem('cainiaoCloudprintMystdtemplates', JSON.stringify(mystdtemplates));
                    //     resolve('ok');
                    // });
                }

            },
            errCallback: () => {
                reject('error');
            },
        });
    });
    return mystdtemplatesGetPromise;
}

/**
 * 确保用户所有快递的自定义区模板信息获取完成，缓存可用
 * @returns {Promise<void>}
 */
export async function checkMystdtemplatesOver () {
    await mystdtemplatesGetPromise;
}

/**
 * 根据物流公司编码和标准模板的url获取对应自定义区模板信息
 * @param cp_code
 * @param template_id
 * @returns {[*]|*[]|string|string}
 */
export function getMystdtemplateByUrl (cp_code, template_id) {
    let mystdtemplates = getLocalStorageAndParse('cainiaoCloudprintMystdtemplates', {});
    let mystdtemplates_cp_code = mystdtemplates.find(value => value.cp_code == cp_code);

    if (mystdtemplates_cp_code) {
        let mystdtemplates_template_url = mystdtemplates_cp_code.cp_templates.find(value => value.template_id == template_id);

        if (mystdtemplates_template_url) {
            return mystdtemplates_template_url.template_content;
        } else {
            return [];
        }
    } else {
        return [];
    }
}
