import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

/**
* 封装修改标题、详情描述接口
* @author wzf
*/ 
const default_TaobaoUpdate_query = { method: 'taobao.item.update' };
const default_TmallSchema_query = { method: 'tmall.item.schema.increment.update' };

export  const UpdateText = function ({ update_text, type, seller_type = 'C', num_iid, callback, errCallback = undefined }) {
    let query = {};
    let method=""
    if (seller_type == '') {
        seller_type = 'c';
    }
    if (seller_type == 'C' || seller_type == 'c') {
        method = default_TaobaoUpdate_query.method;
        /* type:1为标题，3为详情描述 */
        if(type == 1){
            query.title = update_text;
            delete query.desc;
        }else{
            let desc = update_text.replace(/&amp;/, '&');
            desc = desc.replace(/&lt;/, '<');
            desc = desc.replace(/&gt;/, '>');
            query.desc = desc;
            delete query.title;
        }
        query.num_iid = num_iid;
    } else {
        method = default_TmallSchema_query.method;
        let xml_data = '';
        /* type:1为标题，3为详情描述 */
        if (type == 1) {
        	xml_data = `<?xml version="1.0" encoding="utf-8"?><itemRule><field id="title" name="商品标题" type="input"><value>${update_text}</value></field><field id="update_fields" name="更新字段列表" type="multiCheck"><values><value>title</value></values></field></itemRule>`;
        } else {
        	xml_data = `<?xml version="1.0" encoding="utf-8"?><itemRule><field id="descForPC" name="宝贝电脑端描述" type="input"><value>${update_text}</value></field><field id="update_fields" name="更新字段列表" type="multiCheck"><values><value>descForPC</value></values></field></itemRule>`;
        }
        query.xml_data = xml_data;
        query.item_id = num_iid;
    }
    qnRouter({
        api: method,
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback
    })
}    



/**
 * [function description]
 * 同时修改商品标题、详情描述
 * @param  {[type]}   desc          [1：标题；2：卖点；3：详情描述 4：上架时间]
 * @param  {[type]}   num_iid        [宝贝id]
 * @param  {[type]}   title          [宝贝标题、卖点、详情描述]
 * @param  {Function} callback       [description]
 * @param  {[type]}   err_callback}  [description]
 * @return {[type]}                  [description]
 */
export  const UpdateTitleNew = function ({ title,desc, num_iid, callback, errCallback=undefined }) {
    let query = {  };
    query.num_iid = num_iid;
    query.title=title;
    let newdesc = desc.replace(/&amp;/, '&');
    newdesc = newdesc.replace(/&lt;/, '<');
    newdesc = newdesc.replace(/&gt;/, '>');
    query.desc = newdesc;
    qnRouter({
        api: 'taobao.item.update',
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
};