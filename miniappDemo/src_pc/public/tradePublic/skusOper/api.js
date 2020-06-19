import {isEmpty} from 'tradePolyfills';

let sku_ids = [];
let sku_num_arr = [];
let sku_prices_arr = [];

/**
 * 把宝贝sku等信息都整理出来 方便处理 里面有图片等
 * @param {*} skus 商品的sku的信息
 */
export function operSkus(item) {
    let datas={};
    if (item.skus && item.skus.sku.length != 0) {
        if (item.skus.sku) {
            datas.sku = new Array();
            let property = new Array();
            let property_color = new Array();
            if (item.property_alias) {
                // 自定义的颜色名称
                var properties = item.property_alias.split(';');
                for (var i in properties) {
                    let alias = properties[i].split(':');
                    property[i] = alias[0] + alias[1];
                    if (alias[3]) {
                        property_color[i] = alias[3];
                    } else {
                        property_color[i] = alias[2];
                    }
                }
            }
            if (item.skus.sku) {
                datas.has_sku = true;
                sku_ids = [];
                sku_num_arr = [];
                sku_prices_arr = [];
                let prop_img = [];
                if (item.prop_imgs) {
                    prop_img = [...item.prop_imgs.prop_img];
                    for (const x in prop_img) {
                        const p = prop_img[x].properties.split(':');
                        prop_img[x].prop = p;
                    }
                }
                for (var i in item.skus.sku) {
                    datas.sku[i] = {};
                    let sku = item.skus.sku[i];
                    let bbsize = '';
                    var properties = sku.properties_name.split(';');
                    const propertiesid = [];
                    const prop = item.skus.sku[i].properties.split(';').map((item) => item.split(':'));
                    if (prop_img) {
                        for (const x in prop) {
                            for (const y in prop_img) {
                                if (prop[x][0] === prop_img[y].prop[0] && prop[x][1] === prop_img[y].prop[1]) {
                                    datas.sku[i].img_url = prop_img[y].url;
                                }
                            }
                        }
                    }
                    let skuNames = [];
                    for (const j in properties) {
                        if (properties[j].indexOf('-') == 0) {
                            /* 自定义sku取第三个和第四个，且第三个前面加$*/
                            propertiesid.push(`$${properties[j].split(":")[2]}:${properties[j].split(":")[3]}`);
                        } else {
                            propertiesid.push(`${properties[j].split(":")[0]}:${properties[j].split(":")[1]}`);
                        }
                        skuNames.push(properties[j].split(':')[3]);
                    }
                    skuNames = skuNames.join('，');
                    datas.sku[i].propertiesid = propertiesid.join(';');
                    if (properties[1] != undefined) {
                        datas.sku[i].bbsize = properties[1].split(':')[3];
                        datas.sku[i].itemsize = properties[1].split(':')[2];
                    } else {
                        datas.sku[i].bbsize = '';
                        datas.sku[i].itemsize = '';
                    }
                    datas.sku[i].bbcolor = '';
                    for (let j = 0; j < properties.length; j++) {
                        let flag = false;
                        for (const n in property) {
                            if (property[n] == properties[j].split(':')[0] + properties[j].split(':')[1]) {
                                flag = property_color[n];
                                break;
                            } else {
                                flag = false;
                            }
                        }
                        if (flag) {
                            datas.sku[i].bbcolor = `${datas.sku[i].bbcolor + flag}，`;
                        } else {
                            datas.sku[i].bbcolor = `${datas.sku[i].bbcolor + properties[j].split(":")[3]}，`;
                        }
                    }
                    datas.sku[i].bbcolor = datas.sku[i].bbcolor.substr(0, datas.sku[i].bbcolor.length - 1);
                    datas.sku[i].index = i;
                    datas.sku[i].sku_outerid = sku.outer_id;
                    datas.sku[i].itemcolor = properties[0].split(':')[2];
                    datas.sku[i].skuid = sku.sku_id;
                    sku_ids[sku_ids.length] = sku.sku_id;
                    try {
                        datas.sku[i].bbcolor = decodeURIComponent(datas.sku[i].bbcolor);
                    } catch (e) {

                    }
                    datas.sku[i].bbprice = sku.price;
                    sku_prices_arr[sku_prices_arr.length] = sku.price;
                    sku_num_arr[sku_num_arr.length] = sku.quantity;
                    datas.sku[i].bbquantity = sku.quantity;
                    datas.sku[i].skuNames = skuNames;
                }
            }
            let newdatas = [];
            if (isEmpty(newdatas)) {
                for (let k = 0; k < datas.sku.length; k++) {
                newdatas.push(datas.sku[k]);
                }
            }
            return newdatas;
        }
    } else {
        return [];
        }
}



/**
 * 获取一口价并排序
 */
export function getYkjPrice(skus){
    let ykjArr = [];
    skus.sku.forEach(sku => {
        if(!ykjArr.includes(sku.price)){
            ykjArr.push(sku.price);
        }
    });
    ykjArr.sort(sortNumber);
    return ykjArr;
}
//排序升序
function sortNumber(a,b){
    return a - b
}

// 对对象数组根据对象进行排序
export function arraySort(array,field){
    array.sort(sortBy(field));
    return array;
}
    //排序升序
function  sortBy(field){
    return (x, y) => {
        return y[field] - x[field];
    }
}