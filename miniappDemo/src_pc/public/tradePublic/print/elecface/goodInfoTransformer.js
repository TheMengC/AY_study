import { isEmpty } from "tradePolyfills/index";



/*
 快递单对应数据
 {
 'bproperty'  : '商品属性（数量）',
 'CODINGnum'  : '商家编码（数量）',
 'bbabynum'   : '宝贝名称（数量）',
 'bpropertys' : '宝贝名称/销售属性/数量',
 'bsxnums'    : '商家编码/销售属性/数量',
 'babyall'    : '宝贝名称/商家编码/销售属性/数量'
 }
 电子面单对应数据
 {
 'babyAssemble1' : '商家编码+数量',
 'babyAssemble2' : '销售属性+数量',
 'babyAssemble3' : '宝贝标题+数量',
 'babyAssemble4' : '商家编码+销售属性+数量',
 'babyAssemble5' : '宝贝标题+销售属性+数量',
 'babyAssemble6' : '宝贝标题+商家编码+销售属性+数量',
 'babyAssemble7' : '宝贝标题+商家编码+数量'
 }
 */
const logisticsOldGoodInfo = ['babyall', 'bsxnums', 'bpropertys', 'bbabynum', 'bproperty', 'CODINGnum', 'CODING', 'btitle'];
const electricOldGoodInfo  = ['babyAssemble7', 'babyAssemble6', 'babyAssemble5', 'babyAssemble4', 'babyAssemble3', 'babyAssemble2', 'babyAssemble1', 'newBabyCount', 'bproperty', 'CODING', 'babyinfo'];
/**
 * 物流单新老数据兼容转换方法
 * @Author ZW
 * @date   2017-10-17T16:33:54+0800
 * @param  {Array}                 mMould          当前数据 也可以传对象
 * @param  {string}                 mType           当前类型 快递单(logistics)or电子面单(electric)
 * @param  { bool }                 needGoodInfo    新增需求，是否需要返回goodinfo具体包含什么，
 * @return {stirng}                                 如果needGoodInfo为false 返回 转换后的数据 或者对象（按照传入算）
 *                                                  为true则返回三个数组，一个是content包含项目，一个是goodInfo包含项目，一个是自定义区域内容
 */
export default function goodInfoTransformer (fields , mType ) {
    let mould    = '';
    let mouldIsOld  = false;             // 判断当前模板信息是否为旧数据（包含旧的商品信息）
    let oldItemsSet = new Set();         // 旧的商品信息集合
    // 旧的商品信息
    let oldGoodInfo = (mType == 'logistics' ? logisticsOldGoodInfo : electricOldGoodInfo);
    let newGoodInfo = {};
    let resultArr   = fields;
    let goodInfo    = '';
    let level       = -1;
    let allInfo     = logisticsOldGoodInfo.concat(electricOldGoodInfo);     // 用于比较优先级，确定goodInfo的位置信息
    let asGoodInfo  = 'goodInfo';
    if (isEmpty(fields)) {
        return fields;
    }
    if (mType == 'logistics') {
        // 物流单对应的子选项
        newGoodInfo = {
            'title' : 'btitle',
            'prop'  : 'newBabyProp',
            'code'  : 'CODING',
            'count' : 'newBabyCount'
        };
    } else {
        // 电子面单对应的子选项
        newGoodInfo = {
            'title' : 'babyinfo',
            'prop'  : 'bproperty',
            'code'  : 'CODING',
            'count' : 'newBabyCount'
        };
    }
    // 添加goodInfo字段
    goodInfo = 'goodInfo';
    // 判断是否是旧数据，更新set
    for (let item of oldGoodInfo) {
        if (mould.indexOf(item) > -1) {
            mouldIsOld = true;
            switch (item) {
                case 'btitle' :
                    oldItemsSet.add(newGoodInfo['title']);
                    break;
                case 'CODING' :
                    oldItemsSet.add(newGoodInfo['code']);
                    break;
                case 'babyinfo' :
                    oldItemsSet.add(newGoodInfo['title']);
                    break;
                case 'bproperty':
                    if (mType == 'logistics') {
                        oldItemsSet.add(newGoodInfo['prop']);
                        oldItemsSet.add(newGoodInfo['count']);
                    } else {
                        oldItemsSet.add(newGoodInfo['prop']);
                    }
                    break;
                case 'newBabyCount':
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'CODINGnum':
                    oldItemsSet.add(newGoodInfo['code']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'bbabynum':
                    oldItemsSet.add(newGoodInfo['title']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'bpropertys' :
                    oldItemsSet.add(newGoodInfo['title']);
                    oldItemsSet.add(newGoodInfo['prop']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'bsxnums' :
                    oldItemsSet.add(newGoodInfo['code']);
                    oldItemsSet.add(newGoodInfo['prop']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyall' :
                    oldItemsSet.add(newGoodInfo['title']);
                    oldItemsSet.add(newGoodInfo['code']);
                    oldItemsSet.add(newGoodInfo['prop']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyAssemble1' :
                    oldItemsSet.add(newGoodInfo['code']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyAssemble2' :
                    oldItemsSet.add(newGoodInfo['prop']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyAssemble3' :
                    oldItemsSet.add(newGoodInfo['title']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyAssemble4' :
                    oldItemsSet.add(newGoodInfo['code']);
                    oldItemsSet.add(newGoodInfo['prop']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyAssemble5' :
                    oldItemsSet.add(newGoodInfo['title']);
                    oldItemsSet.add(newGoodInfo['prop']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyAssemble6' :
                    oldItemsSet.add(newGoodInfo['title']);
                    oldItemsSet.add(newGoodInfo['code']);
                    oldItemsSet.add(newGoodInfo['prop']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                case 'babyAssemble7' :
                    oldItemsSet.add(newGoodInfo['title']);
                    oldItemsSet.add(newGoodInfo['code']);
                    oldItemsSet.add(newGoodInfo['count']);
                    break;
                default :
                    break;
            }
            // 判断选项优先级，赋值给goodInfo
            if (allInfo.indexOf(item) > level) {
                for (let o of resultArr) {
                    if (o.split(',')[0] == item) {
                        // 找到匹配项
                        let tmp    = o.split(',');
                        // 存储替换的东西
                        asGoodInfo = tmp[0];
                        tmp[0]     = 'goodInfo';
                        if (!isEmpty(tmp[9])) {
                            tmp[9] = '商品信息';
                        }
                        goodInfo = tmp.join(',');
                    } else {

                    }
                }
                level = allInfo.indexOf(item);
            }
            // 删除当前模板数据
            resultArr = delFromArr(resultArr, item);
        }
    }
    if (mouldIsOld) {
        if (mould.indexOf('goodInfo') < 0) {
            resultArr.push(goodInfo);
        }
        for (let newItem of oldItemsSet) {
            // 依次补充子选项信息
            if (mType == 'logistics') {
                resultArr.push(newItem + ',0,0,16,0,0,宋体,normal,false');
            } else {
                resultArr.push(newItem + ',0,0,9,0,0,宋体,normal,false,');
            }
        }

    }
    // 去除重复选项
    let noRepeatArr = [];
    for (let it of resultArr) {
        let tmp = it.split(',');
        let newResult = noRepeatArr.join(';');
        if (newResult.indexOf(tmp[0]) < 0) {
            noRepeatArr.push(it);
        }
    }

    // 返回三个东西
    let contentArr = [];                // 模板包含的项目
    let customArr  = [];                // 自定义区域内容

    // 组合需要的模板包含项 以及自定义区域项目
    for (let m of noRepeatArr) {
        let tmp = m.split(',');
        // goodInfo字段的
        if (tmp[0] == 'goodInfo') {
            if (mould.indexOf('goodInfo') > -1) {
                // 原本就有goodInfo
                contentArr.push('goodInfo');
            } else {
                contentArr.push(asGoodInfo);
            }
        } else {
            let newGoodItems = ['babyinfo', 'bproperty', 'CODING', 'newBabyCount'];
            // 如果是商品信息 就可以忽略了
            if (newGoodItems.indexOf(tmp[0]) < 0) {
                contentArr.push(tmp[0]);
            }
        }
        // 自定义区域
        if (tmp[0].indexOf('customfont') > -1 && tmp[10] != 'unchecked') {
            let newCustomObj = {};
            newCustomObj[tmp[0]] = tmp[9];
            customArr.push(newCustomObj);
        }

    }

    let newReturnObj = {
        contentArr  : contentArr,
        goodInfoArr : Array.from(oldItemsSet),
        customArr   : customArr
    };

    return newReturnObj;

}

/**
 * 删除数组某个元素
 * @Author ZW
 * @date   2017-10-17T17:30:34+0800
 * @param  {Array}                  arr  操作的数组
 * @param  {string}                 item 待删除项目
 * @return {Array}                       结果数组
 */
const delFromArr = (arr, item) => {
    let result   = [];
    let delIndex = -1;
    for (let i of arr) {
        if (i.indexOf(item) > -1) {
            delIndex = arr.indexOf(i);
            break;
        }
    }
    if (delIndex != -1) {
        result = arr.slice(0, delIndex).concat(arr.slice(delIndex + 1));
    } else {
        return arr;
    }
    return result;
}
