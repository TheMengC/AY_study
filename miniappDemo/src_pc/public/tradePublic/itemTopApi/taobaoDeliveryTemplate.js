import { NOOP,isEmpty } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse, integrationDate } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
let taobaoDeliveryTemplatesGet = 'taobao.delivery.templates.get';
let FIELDS = 'template_id,template_name,supports,assumer,valuation,query_express,query_ems,query_cod,query_post,address';
let taobaoSingleDeliveryTemplatesGet = 'taobao.delivery.template.get';
/**
 * 获取运费模版
 * https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.7d7e669aRtqf0m&source=search&docId=65&docType=2
 * @param callback
 * @param errCallback
 */
export function taobaoDeliveryTemplateGet ({fields = FIELDS, callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: taobaoDeliveryTemplatesGet,
        params: {
            fields
        },
        callback: res => {
            callback(deliveryTemplateCommon(resolveTopResponse(res)));
        },
        errCallback: errCallback,
    });
}

function deliveryTemplateCommon(res){
    if(!isEmpty(res.delivery_templates) && isEmpty(res.delivery_templates.delivery_template)){
        let newDeliveryTemplate = integrationDate(res,'delivery_template',false);
        res.delivery_templates = newDeliveryTemplate.delivery_templates;
    }
    return res;
}

/**
 * 获取单个模版信息的接口
 *
 * @export
 * @param {*} {template_ids = 0,fields = FIELDS, callback = NOOP, errCallback = handleError }
 */
export function taobaoSingleDeliveryTemplateGet ({template_ids = 0,fields = FIELDS, callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: taobaoSingleDeliveryTemplatesGet,
        params: {
            fields,
            template_ids,
        },
        callback: res => {
            callback(deliveryTemplateCommon(resolveTopResponse(res)));
        },
        errCallback: errCallback,
    });
}