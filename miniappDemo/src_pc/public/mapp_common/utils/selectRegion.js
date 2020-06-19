import Taro from '@tarojs/taro';
import { isEmpty } from "mapp_common/utils/index";
import { api } from "mapp_common/utils/api";
import { getCachedRequest } from "tradePublic/utils/cache";

let logisticsAddressArea = {};

/**
 * 初始化省市区 缓存7天
 * @returns {Promise<void>}
 */
export async  function logisticsAddressAreaInit()  {
    logisticsAddressArea = await getCachedRequest({
        key: 'aiyong.tools.area.get',
        timeout: '168h',
        requestFun: ({ callback }) => {
            api({
                apiName: 'aiyong.tools.area.get',
                method: '/iytrade/getArea',
                callback,
            });
        },
    });
};
/**
 * 获取所有省份列表
 * @return {Object}
 */
export const logisticsAddressAreaProvincesGet = () => {
    return logisticsAddressArea.province;
};
/**
 * 获取某省份城市列表
 * @param provinceAddcode 省份的addcode
 * @return {*}
 */
export const logisticsAddressAreaCitysGet = (provinceAddcode) => {
    return logisticsAddressArea.citys[provinceAddcode];
};
/**
 * 获取某城市的县区列表
 * @param cityAddcode 城市的addcode
 * @return {*}
 */
export const logisticsAddressAreaDistrictsGet = (cityAddcode) => {
    return logisticsAddressArea.districts[cityAddcode];
};
let provinceNameToItemMap = {};
let cityNameToItemMap = {};
let districtNameToItemMap = {};
/**
 * 获取某个省份的item
 * @param provinceName 省份的名字
 */
export const logisticsAddressAreaProvinceGet = (provinceName) => {
    if (isEmpty(provinceNameToItemMap)) {
        for (let item of logisticsAddressAreaProvincesGet()) {
            provinceNameToItemMap[item.address] = item;
        }
    }
    return provinceNameToItemMap[provinceName];
};
/**
 * 获取某城市的item
 * @param provinceName 省份的名字
 * @param cityName 城市的名字
 */
export const logisticsAddressAreaCityGet = (provinceName, cityName) => {
    let province = logisticsAddressAreaProvinceGet(provinceName);
    if (isEmpty(cityNameToItemMap[province.addcode])) {
        let map = {};
        for (let item of logisticsAddressAreaCitysGet(province.addcode)) {
            map[item.address] = item;
        }
        cityNameToItemMap[province.addcode] = map;
    }
    return cityNameToItemMap[province.addcode][cityName];
};

/**
 * 获取某县级市的item
 * @param provinceName
 * @param cityName
 * @param districtName
 * @returns {*}
 */
export const logisticsAddressAreaDistrictGet = (provinceName, cityName, districtName) => {
    let city = logisticsAddressAreaCityGet(provinceName, cityName);
    if (isEmpty(districtNameToItemMap[city.addcode])) {
        districtNameToItemMap[city.addcode] = {};
        logisticsAddressAreaDistrictsGet(city.addcode).map(item => districtNameToItemMap[city.addcode][item.address] = item);
    }
    return districtNameToItemMap[city.addcode][districtName];
};

/**
 * 展示选择省份的actionsheet
 */
export function showProvinceActionSheet () {
    return new Promise((resolve, reject) => {
        let provinceSelectValues = logisticsAddressAreaProvincesGet();
        Taro.showActionSheet({ itemList: provinceSelectValues.map(item => item.address) }).then(res => {
            resolve(provinceSelectValues[res.index]);
        });
    });
}

/**
 * 展示选择城市的actionsheet
 * @param provinceName 省份的名字
 */
export function showCityActionSheet (provinceName) {
    return new Promise((resolve, reject) => {
        let province = logisticsAddressAreaProvinceGet(provinceName);
        let citySelectValues = logisticsAddressAreaCitysGet(province.addcode);
        Taro.showActionSheet({ itemList: citySelectValues.map(item => item.address) }).then(res => {
            resolve(citySelectValues[res.index]);
        });
    });
}

/**
 * 展示选择区域的actionsheet
 * @param provinceName 省份的名字
 * @param cityName 城市的名字
 */
export function showDistrictActionSheet (provinceName, cityName) {
    return new Promise((resolve, reject) => {
        let city = logisticsAddressAreaCityGet(provinceName, cityName);
        let districtSelectValues = logisticsAddressAreaDistrictsGet(city.addcode);
        if (isEmpty(districtSelectValues)) {
            resolve({ address:'' });
            return;
        }
        Taro.showActionSheet({ itemList: districtSelectValues.map(item => item.address) }).then(res => {
            resolve(districtSelectValues[res.index]);
        });
    });
}
