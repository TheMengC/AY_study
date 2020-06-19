import { NOOP, isEmpty } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { showErrorDialog } from "tradePublic/utils";

let defaultTaobaoPriceUpdateMethod = 'taobao.item.price.update'; //改价格
let defaultTmallPriceMethod = 'tmall.item.price.update';    //天猫改价格
let defaultTmallQuanMethod = 'taobao.skus.quantity.update'; //批量修改SKU库存的功能
let defaultUpdateQuantityMethod = 'taobao.item.quantity.update'; //改库存
let defaultTaobaoUpdateMethod = 'taobao.item.update';
let defaultTmallOuterIdUpdateMethod = 'tmall.item.outerid.update';
let defaultTmallSchemaMethod = 'tmall.item.schema.increment.update';
let defaultTaobaoUpadteSkuMethod = 'taobao.item.sku.price.update';
let defaultTmallUpadteSkuMethod = 'taobao.item.sku.price.update.tmall';
/**
 * 对商品更新操作类
 * 改价格和库存  UpdatePriceNum
 * 改商家编码    UpdateOuterid
 * 改宝贝属性    UpdateInputStr
 * 改运费模版    UpdatePostageId
 * 会员打折      UpdateHasDiscount
 * 修改保修      UpdateHasWarranty
 * 修改发表      UpdateHasInvoice
 * 改标题        UpdateTitle
 * 改详情        UpdateDesc
 * 改条形码      UpdateBarcode
 * 修改减库存方式 UpdateSubStock
 * 其他修改内容   UpdateItem
 * 修改sku的属性 updateSkuPriceNum
 */

/**
 * 修改sku的属性
 * @param num_iid
 * @param quantity
 * @param price
 * @param properties //Sku的数量串
 * @param callback
 * @param errCallback
 */
export function updateSkuPriceNum ({ type = 'C', num_iid, quantity, price, properties, item_price = undefined, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpadteSkuMethod;
    let query = {};
    query.num_iid = num_iid;
    query.quantity = quantity;
    query.price = price;
    query.properties = properties;
    if(item_price && !isEmpty(item_price)){
        query.item_price = item_price;
    }
    //淘宝
    if(type == 'C'){
        method = defaultTaobaoUpadteSkuMethod;
    }else{
        method = defaultTmallUpadteSkuMethod;
    }
    qnRouter({
        api: method,
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 同时改价格和库存
 * @param num_iid
 * @param num
 * @param price
 * @param sku_properties //Sku的数量串
 * @param sku_quantities //Sku的数量串
 * @param sku_prices     //Sku的价格串
 * @param sku_outer_ids  //Sku的外部id串
 * @param callback
 * @param errCallback
 */
export function updatePriceNum ({ type = 'C', num_iid, num, price, sku_properties, sku_quantities, sku_prices, sku_outer_ids, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoPriceUpdateMethod;
    let query = {};
    //淘宝
    if(type == 'C'){
        method = defaultTaobaoPriceUpdateMethod;
        query.num = num;
        query.price = price;
        query.num_iid = num_iid;
        if (sku_quantities || sku_prices) {
            query.sku_properties = sku_properties;
            query.sku_outer_ids = sku_outer_ids;
            if (sku_quantities) {
                query.sku_quantities = sku_quantities;
            }
            if (sku_prices) {
                query.sku_prices = sku_prices;
            }
        }
        qnRouter({
            api: method,
            params: query,
            callback: res => {
                callback(resolveTopResponse(res));
            },
            errCallback: errCallback,
        });
    }else{
        //天猫 先改价再改库存
        method = defaultTmallPriceMethod;
        query.item_id = num_iid;
        query.item_price = price;
        if (sku_prices) {
            query.sku_prices = JSON.stringify(sku_prices);
        }
        qnRouter({
            api: method,
            params: query,
            callback: res => {
                delete query.item_id;
                delete  query.item_price;
                if (sku_quantities) {
                    method = defaultTmallQuanMethod;
                    query.num_iid = num_iid;
                    query.skuid_quantities = sku_quantities;
                    query.type = '1';
                } else {
                    method = defaultUpdateQuantityMethod;
                    query.num_iid = num_iid;
                    query.quantity = num;
                }
                qnRouter({
                    api: method,
                    params: query,
                    callback: res => {
                        callback(resolveTopResponse(res));
                    },
                    errCallback: errCallback,
                });
            },
            errCallback: errCallback,
        });
    }
}

/**
 * 修改商家编码
 * @param num_iid
 * @param sku_outerids //Sku的编码
 * @param outer_id     //Sku的数量串
 * @param callback
 * @param errCallback
 */
export function updateOuterid ({ type = 'C', num_iid, outer_id, sku_outerids = undefined, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    let query = {};
    //淘宝
    if(type == 'C'){
        method = defaultTaobaoUpdateMethod;
        if (sku_outerids) {
            query.sku_outer_ids = sku_outerids;
        }
        query.num_iid = num_iid;
        query.outer_id = outer_id;
    }else{
        //天猫
        method = defaultTmallOuterIdUpdateMethod;
        query.item_id = num_iid;
        query.outer_id = outer_id;
        if (sku_outerids) {
            query.sku_outers = sku_outerids;
        }
    }
    qnRouter({
        api: method,
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改属性
 * @param num_iid
 * @param props         //商品属性列表
 * @param input_str     //用户自行输入的子属性名和属性值
 * @param input_pids    //用户自行输入的类目属性ID串
 * @param callback
 * @param errCallback
 */
export function updateInputStr ({ num_iid, props, input_str, input_pids,  callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    qnRouter({
        api: method,
        params: {
            num_iid,
            props,
            input_str,
            input_pids
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改运费模版
 * @param num_iid
 * @param postage_id     //运费模版
 * @param callback
 * @param errCallback
 */
export function updatePostageId ({ seller_type = 'C', num_iid, postage_id, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    if (isEmpty(postage_id)) {
        return;
    }
    if (seller_type == 'B' || seller_type == 'b') {
        showErrorDialog('温馨提示', '由于淘宝接口改造，暂时不支持天猫店铺修改运费，我们会尽快实现该功能~给您带来不便，敬请谅解~', '天猫店铺改运费模版失败');
        return;
    }
    qnRouter({
        api: method,
        params: {
            num_iid,
            postage_id
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改会员打折
 * @param num_iid
 * @param has_discount     //会员打折
 * @param callback
 * @param errCallback
 */
export function updateHasDiscount ({  num_iid, has_discount, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    qnRouter({
        api: method,
        params: {
            num_iid,
            has_discount
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改保修
 * @param num_iid
 * @param has_warranty     //修改保修
 * @param callback
 * @param errCallback
 */
export function updateHasWarranty ({  num_iid, has_warranty, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    qnRouter({
        api: method,
        params: {
            num_iid,
            has_warranty
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改发票
 * @param num_iid
 * @param has_invoice     //修改发票
 * @param callback
 * @param errCallback
 */
export function updateHasInvoice ({  num_iid, has_invoice, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    qnRouter({
        api: method,
        params: {
            num_iid,
            has_invoice
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改标题
 * @param num_iid
 * @param update_title     //修改标题
 * @param callback
 * @param errCallback
 */
export function updateTitle ({  seller_type = 'C', num_iid, update_title, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    let query = {};
    if (seller_type == 'C' || seller_type == 'c') {
        method = defaultTaobaoUpdateMethod;
        query.title = update_title;
        query.num_iid = num_iid;
    } else {
        query = defaultTmallSchemaMethod;
        let xml_data = `<?xml version="1.0" encoding="utf-8"?><itemRule><field id="title" name="商品标题" type="input"><value>${update_title}</value></field><field id="update_fields" name="更新字段列表" type="multiCheck"><values><value>title</value></values></field></itemRule>`;
        query.xml_data = xml_data;
        query.item_id = num_iid;
    }

    qnRouter({
        api: method,
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改详情
 * @param num_iid
 * @param desc     //修改标题
 * @param callback
 * @param errCallback
 */
export function updateDesc ({  seller_type = 'C', num_iid, desc, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    let query = {};
    if (seller_type == 'C' || seller_type == 'c') {
        query.method = defaultTaobaoUpdateMethod;
        desc = desc.replace(/&amp;/, '&');
        desc = desc.replace(/&lt;/, '<');
        desc = desc.replace(/&gt;/, '>');
        query.desc = desc;
        query.num_iid = num_iid;
    } else {
        query = defaultTmallSchemaMethod;
        let xml_data = `<?xml version="1.0" encoding="utf-8"?><itemRule><field id="descForPC" name="宝贝电脑端描述" type="input"><value>${desc}</value></field><field id="update_fields" name="更新字段列表" type="multiCheck"><values><value>descForPC</value></values></field></itemRule>`;
        query.xml_data = xml_data;
        query.item_id = num_iid;
    }
    qnRouter({
        api: method,
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 修改条形码
 * @param num_iid
 * @param barcode     //修改条形码
 * @param callback
 * @param errCallback
 */
export function updateBarcode ({ num_iid, barcode, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    qnRouter({
        api: method,
        params: {
            num_iid,
            barcode
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 商品是否支持拍下减库存
 * @param num_iid
 * @param sub_stock     0(默认)不更改;1支持;2取消支持
 * @param callback
 * @param errCallback
 */
export function updateSubStock ({ num_iid, sub_stock, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    qnRouter({
        api: method,
        params: {
            num_iid,
            sub_stock
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}


/**
 * 修改宝贝数据
 * @param num_iid
 * @param extraArgs    支持修改的各类数据
 * @param callback
 * @param errCallback
 */
export function updateItem ({ num_iid, extraArgs = {}, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    qnRouter({
        api: method,
        params: {
            num_iid,
            ...extraArgs,
        },
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 删除主图视频
 * @param seller_type
 * @param num_iid
 * @param callback
 * @param errCallback
 */
export function deleteVideo ({ seller_type, num_iid, callback = NOOP, errCallback = handleError }) {
    let method = defaultTaobaoUpdateMethod;
    let query = {};
    if (seller_type == '') {
        seller_type = 'c';
    }
    if (seller_type == 'C' || seller_type == 'c') {
        query.num_iid = num_iid;
    	query.empty_fields = 'video_id';
    } else {
        showErrorDialog('温馨提示', '由于淘宝接口改造，暂时不支持天猫店铺修改运费，我们会尽快实现该功能~给您带来不便，敬请谅解~', '天猫店铺改运费模版失败');
        return;
    }
    qnRouter({
        api: method,
        params: query,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 更新主图视频数据
 * @param seller_type
 * @param num_iid
 * @param callback
 * @param errCallback
 */
export function updateVideo ({ seller_type, num_iid, video_id = undefined }) {
    return new Promise((resolve, reject)=>{
        let method = defaultTaobaoUpdateMethod;
        let query = {};
        if (seller_type == '') {
            seller_type = 'c';
        }
        if (seller_type == 'C' || seller_type == 'c') {
            query.num_iid = num_iid;
            if (video_id) {
                query.video_id = video_id;
            } else {
                query.empty_fields = 'video_id';
            }
        } else {
            showErrorDialog('温馨提示', '由于淘宝接口改造，暂时不支持天猫店铺修改运费，我们会尽快实现该功能~给您带来不便，敬请谅解~', '天猫店铺改运费模版失败');
            return;
        }
        qnRouter({
            api: method,
            params: query,
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
}
