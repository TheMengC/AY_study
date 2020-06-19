/**
 * 根据淘宝taobao.item.seller.get 接口返回的skus转换为我们需要的格式
 * @param skus taobao.item.seller.get 接口返回的skus
 * @return Array [{title:{pid:11111,value:'尺码'},values:[{vid:12344,value:'XL'},{vid:55555,value:'XXL'}]}]
 */
import { Object_values } from "tradePolyfills/index";

export function generateSkuSelectList (skus) {
    let skuTitleToValues = {};
    skus.map(item => {
        item.properties_name.split(';').map(item => {
            let skuObj = skuPropertiesNameToObject(item);
            if (!skuTitleToValues[skuObj.title]) {
                skuTitleToValues[skuObj.title] = new Set();
            }
            skuTitleToValues[skuObj.title].add(skuObj.value);
        });
    });

    return Object.keys(skuTitleToValues).map(key => {
        return { title: key, values: Array.from(skuTitleToValues[key]) };
    });
}

/**
 * sku的properties_name 转换成object
 * @param skuPropertiesName
 * @return {{title: *, value: *}}
 */
function skuPropertiesNameToObject (skuPropertiesName) {
    let skuStr = skuPropertiesName.split(':');
    return {
        title: skuStr[2],
        value: skuStr[3],
    };
}

/**
 * 生成SkuNames
 * @param skuObj
 * @return {string[]}
 */
function generateSkuNames (skuObj) {
    return Object.keys(skuObj).map(item => `${item}:${skuObj[item]}`);
}

/**
 * 过滤Skus
 * @param selectedValues 选中的sku
 * @param skus
 * @return {Int32Array | Uint32Array | any[] | Int8Array | Float64Array | BigUint64Array | Uint8Array | Int16Array | BigInt64Array | Float32Array | Uint8ClampedArray | Uint16Array}
 */
function filterSkus (selectedValues, skus) {
    let selectedSkuNames = generateSkuNames(selectedValues);
    return skus.filter(item => selectedSkuNames.every(sku => item.properties_name.includes(sku)));
}

/**
 * 获取sku的库存
 * @param selectedValues 选中的sku值
 * @param skuNameToQuantity sku Name和库存的映射
 * @return {*}
 */
export function getSkuQuantity (selectedValues, skus) {
    return filterSkus(selectedValues, skus).map(sku => sku.quantity).reduce((a, b) => a + b, 0);
}

/**
 * 获取sku_id
 * @param selectedValues
 * @param skuNameToItemMap
 * @return {string}
 */
export function getSkuProps (selectedValues, skus) {
    return filterSkus(selectedValues, skus)[0].properties;
}

/**
 * 修改order的sku
 * @param order
 * @param selectedValues
 */
export function changeOrderSku (order, selectedValues) {
    order.sku_properties_name = generateSkuNames(selectedValues).join(';');
    order.sku_properties_values = Object_values(selectedValues);
    return order;
}

/**
 * 根据order 获取默认选中的值
 * @param order
 * @returns {{}}
 */
export function generateSkuSelectedValueMap (order) {
    let skuSelectedValueMap = {};
    order.sku_properties_name.split(';').map(item => {
        let skuStr = item.split(':');
        if (skuStr[0] && skuStr[1]) {
            skuSelectedValueMap[skuStr[0]] = skuStr[1];
        }
    });
    return skuSelectedValueMap;
}

/**
 * 在当前sku中 过滤不存在的sku 比如被删除的sku和被修改的sku
 * @param selectedValues
 * @param skuSelectValueList
 * @returns {*}
 */
export function filterExistSkuValue (selectedValues,skuSelectValueList) {
    let skuOptionsMap = skuSelectValueList.reduce((previousValue, currentValue) => ((previousValue[currentValue.title] = currentValue.values), previousValue), {});
    Object.keys(selectedValues).map(key => {
        if (!skuOptionsMap[key] || !skuOptionsMap[key].includes(selectedValues[key])) {
            delete selectedValues[key];
        }
    });
    return selectedValues;
}

export function generateSkuPropertiesName (selectedValueMap) {
    let skus = [];
    Object.keys(selectedValueMap).map(key => skus.push(`${key}:${selectedValueMap[key]}`));
    return skus.join(';');
}
