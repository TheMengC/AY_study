import { NOOP, isEmpty, showConfirmModal, consoleLogger, showActionSheet } from "tradePolyfills";
import { DETAIL_MEMBER_DISCOUNT, DETAIL_INVENTORY_COUNT, DETAIL_INVOICE, DETAIL_GUARANTEE, UPDATE_ITEM_MUST_PARAM } from './consts';
import {updateItem,updateOuterid,updateBarcode,updatePostageId} from 'tradePublic/itemTopApi/taobaoItemUpdate';
import {aiyongItemTmallItemSchemaUpdate} from './api';
import {DETAIL_LAYOUT_INIT_INFO} from 'tradePublic/itemDetail/consts';

/******************************************** 本api公用方法 ***********************/
/**
 * 计算字符串长度
 *
 * @param {*} str
 * @returns
 * @memberof ItemDetailBaseInfo
 */
export function checkLen(str){
    let len = 0;
    if(!isEmpty(str)){
        for(var i = 0;i < str.length;i++){
            if (str.charCodeAt(i) < 0x80) {
                len++;
            } else {
                len += 2;
            }
        }
    }
    return len;
}

/**
 * 检测字符串长度,给出substring合理的位置
 * @param  {[type]} str [description]
 * @return [type]       [description]
 */
export function checkTextLen(str){
    // 一个中文三个英文
    let len = 0;
    if(!isEmpty(str)){
        let zh_len = 0;
        let sum_len = 0;
        for(var i = 0;i < str.length;i++){
            if (str.charCodeAt(i) < 0x80) {
                len++;
                sum_len++;
            } else {
                if (zh_len == 1) {
                    len++;
                    zh_len = 0;
                }
                sum_len = sum_len + 2;
                zh_len++;
            }
            if (sum_len > 30) {
                return len;
            }
        }
    }
    return len;
}

/**
 * 消息提示框
 * @param {*} icon ['success',"loading", "none"]
 * @param {*} title
 */
export function toast(type,content){
    my.showToast({
        type,
        content,
    })
}

/**
 * 封装taro默认showModal
 * @export
 * @param {*} {title='温馨提示',content='',showCancel=true,cancelText='取消',cancelColor='#000000',confirmText='确定',confirmColor='#3CC51F',confirmFuc=NOOP（确认时调用的方法）cancelFuc=NOOP(取消、返回时调用的方法)}
 */
export function showModal({title='温馨提示',content='',showCancel=true,cancelText='取消',cancelColor='#000000',confirmText='确定',confirmColor='#3CC51F',confirmFuc=NOOP,cancelFuc=NOOP}){
    showConfirmModal({
        title,
        content,
        showCancel,
        cancelText,
        cancelColor,
        confirmText,
        confirmColor,
        onConfirm:confirmFuc,
        onCancel:cancelFuc,
    })
}

/**
 * 处理更新商品信息的业务逻辑
 * @param {*} {showToast（提示操作文案[默认 成功或失败]）,sellerType（店铺的类型）,query=（修改后的商品信息）,callback=（成功回调）,errCallback=（失败回调）}
 */
function updateItemInfo({showToast='',sellerType='',query={},callback=NOOP,errCallback=NOOP}){
    //淘宝店铺的处理
    if (sellerType == 'c' || sellerType == 'C') {
        updateItem({
            num_iid: query.num_iid,
            extraArgs:query,
            callback: (res) => {
                if(!isEmpty(res) && isEmpty(res.sub_msg)){
                    //成功提示
                    toast('success',`${showToast}成功！`);
                    callback && callback()
                }else{
                    //失败提示
                    showModal({
                        content: `${showToast}失败！`+JSON.stringify(res),
                        showCancel: false
                    })
                    errCallback && errCallback(res);
                }
            },
            errCallback: (error) => {
                //失败提示
                showModal({
                    content: `${showToast}失败！`+JSON.stringify(error),
                    showCancel: false
                })
                errCallback && errCallback(error);
            },
        });
    } else {
        //天猫店铺的处理
        aiyongItemTmallItemSchemaUpdate({
            args:query,
            callback:(res)=>{
                if(!isEmpty(res) && isEmpty(res.sub_msg)){
                    //成功提示
                    toast('success',`${showToast}成功！`);
                    callback && callback()
                }else{
                    //失败提示
                    showModal({
                        content: `${showToast}失败！`+JSON.stringify(res),
                        showCancel: false
                    })
                    errCallback && errCallback(res);
                }
            },
            errCallback:(error)=>{
                //失败提示
                showModal({
                    content: `${showToast}失败！`+JSON.stringify(error),
                    showCancel: false
                })
                errCallback && errCallback(error);
            }
        })
    }
}

/**
 * 校验提交的参数中是否包含了不可缺少的参数
 * @param {*} {allParams(提交的参数),mustParams(必须存在的参数),from(来源 便于输出日志)}
 * @returns
 */
function checkMustHasParam({allParams,mustParams,from}){
    let hasMustParam = true;
    for (const mustParam of mustParams) {
        if(isEmpty(allParams[mustParam])){
            consoleLogger.error(`${from} 参数 numIid sellerTyp,都不可为空`,allParams);
            //失败提示
            showModal({
                content: `更新宝贝属性失败！${from} 参数 ${mustParam}不可为空！`,
                showCancel: false
            })
            hasMustParam = false;
            break;
        }
    }
    return hasMustParam;
}
/******************************************** 基本信息 ***********************/
/**
 * 根据dataSource来初始化,Layout数据
 * @export
 * @param {*} dataSource
 * @returns
 */
export function initBaseInfoLayoutData(dataSource){
    let layoutInfoJson = {};
    layoutInfoJson['outerId'] = Object.assign({},DETAIL_LAYOUT_INIT_INFO,{label:'商品编码',value:dataSource.outer_id,placeholder:'最多只能输入64个字符哦！',txtMaxLength:64,toastContent:'商品编码修改'});
    layoutInfoJson['barcode'] = Object.assign({},DETAIL_LAYOUT_INIT_INFO,{label:'条形码',value:dataSource.barcode,placeholder:'只能输入字母和数字，最多只能输入20个字符哦！',txtMaxLength:20,toastContent:'条形码修改'});
    layoutInfoJson['templateName'] = Object.assign({},DETAIL_LAYOUT_INIT_INFO,{label:'运费模版',value:dataSource.postage_id,toastContent:'运费模版修改',selectArr:[],selectItem:{},});
    layoutInfoJson['timerUp'] = Object.assign({},DETAIL_LAYOUT_INIT_INFO,{label:'上架时间',value:0,toastContent:'定时上架修改',selectArr:[{label:'保持为仓库中',value:0},{label:'设置时间为',value:1}],selectItem:{label:'保持为仓库中',value:0},});
    return layoutInfoJson;
}

/**
 * 处理基本信息需要展现的数据
 * @export
 * @param {*} dataSource 商品信息
 * @param {*} catsList 店铺全部的宝贝分类
 * @param {*} deliveryTemplate 运费模版
 * @returns
 */
export function initBaseInfoShowData(dataSource, catsList, deliveryTemplate){
    let showData = {}
    let itemStatus;
    if (dataSource.approve_status == 'onsale' || dataSource.orderStatus == '出售中') {
        itemStatus = '出售中';
    } else {
        itemStatus = '仓库中';
    }
    let outer_id = '暂未设置商家编码';
    if (!isEmpty(dataSource.outer_id)) {
        outer_id = dataSource.outer_id;
        if (outer_id.length > 16) {
            outer_id = outer_id.substring(0, 16);
            outer_id = `${outer_id}……`;
        } else {
            outer_id = outer_id;
        }
    }
    let attriBute = '';
    if(!isEmpty(dataSource.props_name)){
        let propsName = dataSource.props_name.split(';');
        for(let i=0;i<propsName.length;i++){
            if(attriBute.indexOf(propsName[i].split(':')[3])==-1){
                attriBute = attriBute+propsName[i].split(':')[3]+'/';
            }
        }
        attriBute = attriBute.substr(0, attriBute.length - 1);
        if(attriBute == ''||attriBute=='undefined'){
            attriBute = '该类目下宝贝无属性';
        }
        if(checkLen(attriBute)>22){
            attriBute = attriBute.substring(0,checkTextLen(attriBute));
            attriBute = attriBute+'……';
        }
    }
    let sellerShopCat ='';
    if (isEmpty(catsList.code) && catsList.seller_cats){
        const sellerCat = catsList.seller_cats.seller_cat;
        let getsellerCids = '';
        if (isEmpty(dataSource.seller_cids)) {
            getsellerCids = '未分类';
            sellerShopCat = '未分类';
        } else {
            const arr = dataSource.seller_cids.split(',');
            getsellerCids = '';
            for (let i = 0; i < arr.length; i += 1) {
                if (arr[i]) {
                    getsellerCids = `${getsellerCids},${arr[i]}`;
                }
            }
        }
        for (let i = 0; i < sellerCat.length; i += 1) {
            // 判断该宝贝有没有类目
            if (getsellerCids.indexOf(sellerCat[i].cid) > -1) {
                sellerShopCat = `${sellerShopCat}/${sellerCat[i].name}`;
            }
            if (sellerShopCat != '' && sellerShopCat.substr(0, 1) == '/') {
                sellerShopCat = sellerShopCat.substring(1, sellerShopCat.length);
            }
        }
        if(checkLen(sellerShopCat)>22){
            sellerShopCat = sellerShopCat.substring(0,checkTextLen(sellerShopCat));
            sellerShopCat = sellerShopCat+'……';
        }
    } else {
        sellerShopCat = '未分类';
    }
    let barcode = '暂未设置条形码';
    if (!isEmpty(dataSource.barcode)) {
        barcode = dataSource.barcode;
    }
    let memberDiscount = dataSource.has_discount?'参与会员打折':'不参与会员打折';
    let invoice = dataSource.has_invoice?'有':'无';
    let guarantee = dataSource.has_warranty?'有':'无';
    let showSpecifiedTime = dataSource.is_timing ? dataSource.list_time : '未设置上架时间';

    let inventoryCount;
    if (dataSource.sub_stock == 0) {
        inventoryCount = '默认';
    } else if (dataSource.sub_stock == 1) {
        inventoryCount = '拍下减库存';
    } else if (dataSource.sub_stock == 2) {
        inventoryCount = '付款减库存';
    }

    let isDistribution;
    if (dataSource.is_fenxiao == 0) {
        isDistribution = '非分销宝贝';
    } else if (dataSource.is_fenxiao == 1) {
        isDistribution = '代销';
    } else {
        isDistribution = '经销';
    }
    let templateName = '暂无运费模板';
    let seatOf = '暂无';
    if(isEmpty(deliveryTemplate.code) && !isEmpty(deliveryTemplate.delivery_templates)){
        let delivery_template = deliveryTemplate.delivery_templates.delivery_template[0];
        if(delivery_template.address.length>16){
            delivery_template.address = delivery_template.address.substring(0,16);
            delivery_template.address = delivery_template.address+'……';
        }
        templateName = delivery_template.name;
        seatOf = delivery_template.address;
    }
    //商品状态
    showData['itemStatus'] = itemStatus;
    //商品编码
    showData['outer_id'] = outer_id;
    //条形码
    showData['barcode'] = barcode;
    //宝贝属性
    showData['attriBute'] = attriBute;
    //店铺分类
    showData['sellerShopCat'] = sellerShopCat;
    //运费模版
    showData['templateName'] = templateName;
    //所在地
    showData['seatOf'] = seatOf;
    //会员打折
    showData['memberDiscount'] = memberDiscount;
    //库存计数
    showData['inventoryCount'] = inventoryCount;
    //发票
    showData['invoice'] = invoice;
    //保修
    showData['guarantee'] = guarantee;
    //是否分销
    showData['isDistribution'] = isDistribution;
    //定时上架时间
    showData['showSpecifiedTime'] = showSpecifiedTime;
    return showData;
}

/**
 * 改变会员打折选项
 *
 * @export
 * @param {*} {dataSource={}, numIid='' ,sellerType='',itemColor=''}
 * @returns
 */
export function changeMemberDiscount({dataSource={}, numIid='' ,sellerType='',itemColor=''}){
    return new Promise((resolve, reject)=>{
        if(!checkMustHasParam({
            allParams:arguments[0],
            mustParams:UPDATE_ITEM_MUST_PARAM,
            from:'changeMemberDiscount(改变会员打折选项)',
            })){
            reject('参数 numIid sellerTyp,都不可为空');
            return;
        }
        //弹出选项
        showActionSheet({
            itemList: DETAIL_MEMBER_DISCOUNT.item,
            itemColor:itemColor,
            success:(res)=>{
                let hasDiscount = false;
                if (res == DETAIL_MEMBER_DISCOUNT.item[0]) {
                    hasDiscount = true;
                }
                updateItemInfo({
                    showToast:DETAIL_MEMBER_DISCOUNT.toastContent,
                    sellerType:sellerType,
                    query:{
                        num_iid: numIid,
                        has_discount: hasDiscount,
                    },
                    callback:()=>{
                        if(isEmpty(dataSource)){
                            resolve();
                        }else{
                            dataSource.has_discount = hasDiscount;
                            resolve(dataSource);
                        }
                    }
                })
            }
        })
    })
}

/**
 * 改变库存计数选项
 *
 * @export
 * @param {*} {dataSource={}, numIid='',sellerType='',itemColor=''}
 * @returns
 */
export function changeInventoryCount({dataSource={}, numIid='',sellerType='',itemColor=''}){
    return new Promise((resolve, reject)=>{
        if(!checkMustHasParam({
            allParams:arguments[0],
            mustParams:UPDATE_ITEM_MUST_PARAM,
            from:'changeInventoryCount(改变库存计数)',
            })){
            reject('参数 numIid sellerTyp,都不可为空');
            return;
        }
        showActionSheet({
            itemList: DETAIL_INVENTORY_COUNT.item,
            itemColor:itemColor,
            success:(res)=>{
                let subStock = 2;
                if (res == DETAIL_INVENTORY_COUNT.item[0]) {
                    subStock = 1;
                }
                updateItemInfo({
                    showToast:DETAIL_INVENTORY_COUNT.toastContent,
                    sellerType:sellerType,
                    query:{
                        num_iid: numIid,
                        sub_stock: subStock,
                    },
                    callback:()=>{
                        if(isEmpty(dataSource)){
                            resolve();
                        }else{
                            dataSource.sub_stock = subStock;
                            resolve(dataSource);
                        }
                    }
                })
            }
        })
    })
}

/**
 * 改变发票选项
 * @export
 * @param {*} {dataSource={}, numIid='',sellerType='',itemColor=''}
 * @returns
 */
export function changeInvoice({dataSource={}, numIid='',sellerType='',itemColor=''}){
    return new Promise((resolve, reject)=>{
        if(!checkMustHasParam({
            allParams:arguments[0],
            mustParams:UPDATE_ITEM_MUST_PARAM,
            from:'changeInvoice(改变发票)',
            })){
            reject('参数 numIid sellerTyp,都不可为空');
            return;
        }
        showActionSheet({
            itemList: DETAIL_INVOICE.item,
            itemColor:itemColor,
            success:(res)=>{
                let invoice = false;
                if (res == DETAIL_INVOICE.item[0]) {
                    invoice = true;
                }
                updateItemInfo({
                    showToast:DETAIL_INVOICE.toastContent,
                    sellerType:sellerType,
                    query:{
                        num_iid: numIid,
                        has_invoice: invoice,
                    },
                    callback:()=>{
                        if(isEmpty(dataSource)){
                            resolve();
                        }else{
                            dataSource.has_invoice = invoice;
                            resolve(dataSource);
                        }
                    }
                })
            }
        })
    })
}

/**
 * 改变保修选项
 * @export
 * @param {*} {dataSource={}, numIid='',sellerType='',itemColor=''}
 * @returns
 */
export function changeGuarantee({dataSource={}, numIid='',sellerType='',itemColor=''}){
    return new Promise((resolve, reject)=>{
        if(!checkMustHasParam({
            allParams:arguments[0],
            mustParams:UPDATE_ITEM_MUST_PARAM,
            from:'changeGuarantee(改变保修)',
            })){
            reject('参数 numIid sellerTyp,都不可为空');
            return;
        }

        showActionSheet({
            itemList: DETAIL_GUARANTEE.item,
            itemColor:itemColor,
            success:(res)=>{
                let guarantee = false;
                if (res == DETAIL_GUARANTEE.item[0]) {
                    guarantee = true;
                }
                updateItemInfo({
                    showToast:DETAIL_GUARANTEE.toastContent,
                    sellerType:sellerType,
                    query:{
                        num_iid: numIid,
                        has_warranty: guarantee,
                    },
                    callback:()=>{
                        if(isEmpty(dataSource)){
                            resolve();
                        }else{
                            dataSource.has_warranty = guarantee;
                            resolve(dataSource);
                        }
                    }
                })
            }
        })
    })
}

/**
 * 验证商家编码的值是否符合规定
 * @export
 * @param {*} value
 * @returns true通过 false不通过
 */
export function checkOuterIdValue(value){
    let len = checkLen(value);
    if (len > 64) {
        return false;
    }else{
        return true;
    }
}

/**
 * 修改商家编码的方法
 * @export
 * @param {*} {dataSource={}, numIid='',sellerType='',layoutInfo}
 * @returns
 */
export function changeOuterId({dataSource={}, numIid='',sellerType='',layoutInfo}){
    return new Promise((resolve, reject)=>{
        if(!checkMustHasParam({
            allParams:arguments[0],
            mustParams:UPDATE_ITEM_MUST_PARAM,
            from:'changeOuterId(修改商家编码)',
            })){
            reject('参数 numIid sellerTyp,都不可为空');
            return;
        }
        updateOuterid({
            type:sellerType,
            num_iid:numIid,
            outer_id:layoutInfo.value,
            callback:(res)=>{
                toast('success',`${layoutInfo.toastContent}成功！`);
                if(isEmpty(dataSource)){
                    resolve();
                }else{
                    dataSource.outer_id = layoutInfo.value;
                    resolve(dataSource);
                }
            },
            errCallback:(error)=>{
                //失败提示
                showModal({
                    content: `${layoutInfo.toastContent}失败！`+JSON.stringify(error),
                    showCancel: false
                })
            }
        })
    })

}

/**
 * 验证条形码的值是否符合规定
 * @export
 * @param {*} value
 * @returns true通过 false不通过
 */
export function checkBarcodeValue(value,type){
    let len = checkLen(value);
    let reg = /^[0-9a-zA-Z]+$/;
    if (len > 20) {
        return false;
    } if (!reg.test(value) && len != 0 && type == 'submit') {
        showModal({
            title:'温馨提示',
            content: '条形码，只能输入字母和数字哦！',
            showCancel:false,
        })
        return false;
    }else{
        return true;
    }
}

/**
 * 修改条形码
 * @export
 * @param {*} {dataSource={}, numIid='',sellerType='',layoutInfo}
 * @returns
 */
export function changeBarcode({dataSource={}, numIid='',sellerType='',layoutInfo}){
    return new Promise((resolve, reject)=>{
        if(!checkMustHasParam({
            allParams:arguments[0],
            mustParams:UPDATE_ITEM_MUST_PARAM,
            from:'changeBarcode(修改条形码)',
            })){
            reject('参数 numIid sellerTyp,都不可为空');
            return;
        }
        updateBarcode({
            num_iid:numIid,
            barcode:layoutInfo.value,
            callback:(res)=>{
                toast('success',`${layoutInfo.toastContent}成功！`);
                if(isEmpty(dataSource)){
                    resolve();
                }else{
                    dataSource.barcode = layoutInfo.value;
                    resolve(dataSource);
                }
            },
            errCallback:(error)=>{
                //失败提示
                showModal({
                    content: `${layoutInfo.toastContent}失败！`+JSON.stringify(error),
                    showCancel: false
                })
            }
        })
    })
}

/**
 * 修改运费模版
 * @export
 * @param {*} {dataSource={}, numIid='',sellerType='',layoutInfo}
 * @returns
 */
export function changeTemplateName({dataSource={}, numIid='',sellerType='',layoutInfo}){
    return new Promise((resolve, reject)=>{
        if(!checkMustHasParam({
            allParams:arguments[0],
            mustParams:UPDATE_ITEM_MUST_PARAM,
            from:'changeTemplateName(修改运费模版)',
            })){
            reject('参数 numIid sellerTyp,都不可为空');
            return;
        }
        let postageId = 0;
        if(!isEmpty(layoutInfo.selectItem.template_id) && layoutInfo.selectItem.template_id !=0){
            postageId = layoutInfo.selectItem.template_id;
        }
        updatePostageId({
            seller_type:sellerType,
            num_iid:numIid,
            postage_id:postageId,
            callback:(res)=>{
                toast('success',`${layoutInfo.toastContent}成功！`);
                if(isEmpty(dataSource)){
                    resolve();
                }else{
                    dataSource.postage_id = postageId;
                    resolve(dataSource);
                }
            },
            errCallback:(error)=>{
                //失败提示
                showModal({
                    content: `${layoutInfo.toastContent}失败！`+JSON.stringify(error),
                    showCancel: false
                })
            }
        })
    })
}

/******************************************** 基本信息 ***********************/
