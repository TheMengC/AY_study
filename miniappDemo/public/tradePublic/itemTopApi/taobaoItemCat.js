import { NOOP, api, isEmpty, consoleLogger } from "tradePolyfills/index";
import { qnRouter } from "tradePublic/qnRouter";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTopResponse, integrationDate } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

let errorNum = 0;
/**
 * 获取宝贝类目
 * @param cid 类目ID
 * @param callback
 * @param errCallback
 */
export function taobaoItemCatGet ({ cid, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.cats.get',
        args: {
            cid
        },
        callback: (res) => {
            let datas1 = {}, datas2 = {}, datas = {};
            datas1.item_cat = res;
            datas2.item_cats = datas1;
            datas.itemcats_get_response = datas2;
            callback(resolveTopResponse(datas));
        },
        errCallback: errCallback
    })
}


/**
 * 获取宝贝类目属性(从爱用接口)
 * @param cid 类目ID
 * @param parent_pid 父类目ID
 * @param vid
 * @param callback
 * @param errCallback
 */
export function taobaoItemCatPropsGet ({ cid, parent_pid, vid, callback = NOOP, errCallback = handleError }) {
    let query = {};
    query.cid = cid;
    if(!isEmpty(parent_pid)){
        query.parent_pid = parent_pid;
    }
    if(!isEmpty(vid)){
        query.vid = vid;
    }
    api({
        apiName:'aiyong.item.taobao.itemprops.get',
        args: query,
        callback: (res) => {
            res = resolveTopResponse(res);
            if(!isEmpty(res.sub_msg)){
                if(errorNum < 3){
                    errorNum++;
                    consoleLogger.error(`第${errorNum}次获取类目信息失败！`+JSON.stringify(res));
                    taobaoItemCatPropsGet({cid, parent_pid, vid, callback, errCallback});
                    return;
                }else{
                    errCallback(res);
                    return;
                }
            }
            errorNum = 0;
            callback(res);
        },
        errCallback: (error)=>{
            if(errorNum < 3){
                errorNum++;
                consoleLogger.error(`第${errorNum}次获取类目信息失败！`+JSON.stringify(res));
                taobaoItemCatPropsGet({cid, parent_pid, vid, callback, errCallback});
                return;
            }
            errorNum = 0;
            errCallback(error);
        }
    })
}

let taobaoItempropsGetField = 'pid,parent_pid,parent_vid,name,is_key_prop,is_sale_prop,is_color_prop,is_enum_prop,is_item_prop,must,multi,prop_values,status,sort_order,child_template,is_allow_alias,is_input_prop,features,taosir_do,is_material,material_do';

/**
 * 获取宝贝类目属性(从淘宝接口)
 * @export
 * @param {*} { cid, parent_pid, vid, fields=taobaoItempropsGetField, callback = NOOP, errCallback = handleError }
 */
export function taobaoItempropsGet({ cid, pid, parent_pid, vid, fields=taobaoItempropsGetField, callback = NOOP, errCallback = handleError }) {
    let params = {fields:fields,cid:cid};
    if(parent_pid){
        params.parent_pid = parent_pid;
    }
    if(pid){
        params.pid = pid;
    }
    if(vid){
        params.child_path = `${parent_pid}:${vid}`;
    }
    qnRouter({
        api: 'taobao.itemprops.get',
        params: params,
        callback: res => {
            res = resolveTopResponse(res);
            if(!isEmpty(res.item_props) && isEmpty(res.item_props.item_prop)){
                let newItemProp = integrationDate(res,'item_prop',false);
                res.item_props = newItemProp.item_props;
                for (const item of res.item_props.item_prop) {
                    let newPropValue = integrationDate(item,'prop_value',false);
                    item.prop_values = newPropValue.prop_values;
                }
            }
            if(!isEmpty(res.sub_msg)){
                if(errorNum < 3){
                    errorNum++;
                    consoleLogger.error(`第${errorNum}次获取类目信息失败！request:${JSON.stringify(arguments)},res:`+JSON.stringify(res));
                    taobaoItempropsGet({cid, pid, parent_pid, vid, fields, callback, errCallback});
                    return;
                }else{
                    errCallback(res);
                    return;
                }
            }
            errorNum = 0;
            callback(res);
        },
        errCallback: (error)=>{
            if(errorNum < 3){
                errorNum++;
                consoleLogger.error(`第${errorNum}次获取类目信息失败！request:${JSON.stringify(arguments)},res:`+JSON.stringify(error));
                taobaoItempropsGet({cid, pid, parent_pid, vid, fields, callback, errCallback});
                return;
            }
            errorNum = 0;
            errCallback(error);
        },
    });
}