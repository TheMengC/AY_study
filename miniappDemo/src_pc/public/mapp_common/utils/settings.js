import { getDeferred, getType, isObject, TYPES } from "./index";
import { storage } from "./storage";
import { defaultSettings_trademapp } from "mapp_common/defaultSettings/trademapp";
import { defaultSettings_itemmapp } from "mapp_common/defaultSettings/itemmapp";
import { ENV } from "@/constants/env";

let planetDefaultSettingMap = {
    trademapp:defaultSettings_trademapp,
    itemmapp:defaultSettings_itemmapp,
};
const defaultSettings =  planetDefaultSettingMap[ENV.planet] ;
let Settings;

/**
 * 获取缓存
 * @returns {*}
 */
export function getSettings () {
    if (!Settings) {
        console.warn("设置未初始化完成,将返回默认设置");
        return defaultSettings;
    }
    return Settings;
};
const settingsInitDeferred = getDeferred();
/**
 * 在设置可能没有初始化好时调用
 */
export const getSettingsAsync = () => {
    return settingsInitDeferred;
};
export const getSettingsEntrySafe = (key) => {
    let path = key.split('.');
    let ret = getSettings();
    path.map(key => {
        ret = ret[key];
    });
    return ret;
};

/**
 * 初始化设置
 * @returns {Object|string|{_value: {}}|undefined|{}|any}
 */
export function settingManagerInit () {
    const  SettingManager = {
        defaultProps: {
            prefix: 'Settings_',
            suffix: ``,
        },
        getFullKey (key) {
            return this.defaultProps.prefix + key + this.defaultProps.suffix;
        },
        /**
         *
         * 判断改动是否合法
         * 将传入的默认值和改动的类型进行比较 若不同 则不合法（对数字与字符串有特殊的照顾）
         * 若传入的默认值不存在 如传入的改动是在新的字段上的改动 默认值没有这个字段 则改动合法
         * @param {object} defaultVal
         * @param {object} newVal
         * @return {undefined|string} 返回undefined说明合法 返回字符串说明不合法 字符串是不合法的原因
         */
        changeIsValid (defaultVal, newVal) {
            if (defaultVal == undefined) {
                return ;
            }

            let isValid = function (correct, test) {
                let correctType = getType(correct);
                let testType = getType(test);
                if (correctType === testType) {

                    if (correctType === TYPES.Object) {
                        let resArr = Object.keys(correct).map(key => {
                            let nextCorrect = correct[key];
                            let nextTest = test[key];
                            let valid = isValid(nextCorrect, nextTest);
                            if (valid != undefined) {
                                return '.' + key + "字段" + valid;
                            }else{
                                return;
                            }
                        });
                        resArr = resArr.filter(item => item != undefined);
                        if (resArr.length == 0) {
                            return;
                        }else{
                            return resArr.join(";");
                        }
                    }
                    return;
                } else {
                    if (correctType == TYPES.String && testType == TYPES.Number)
                    {
                        return;
                    }else if(correctType == TYPES.Number && testType == TYPES.String)
                    {
                        if(Number.isNaN(test * 1)) {
                            return "字符串无法转换为数字";
                        }else{
                            return;
                        }
                    }else{
                        if (testType == TYPES.Undefined) {
                            return '不能为undefined';
                        }
                        return testType + "无法转换为" + correctType;
                    }
                }
            };
            return isValid(defaultVal, newVal);
        },
        /**
         * 将缓存中的对象与默认对象进行【深度】递归合并
         * ```
         * obj1={a:{b:'1'},d:10}
         * obj2={a:{c:2},e:20}
         * obj3=merge(obj1,obj2)
         * obj3=={
         *   a:{
         *      b:'1',
         *      c:2
         *   }
         *   d:10,
         *   e:20
         * }
         * ```
         * @param {object} obj  缓存中的对象
         * @param {object} defaultObj  默认的对象
         */
        merge (obj, defaultObj) {
            if (obj === undefined || obj === null || obj === '') { // todo 判空
                if (isObject(defaultObj)) {
                    return JSON.parse(JSON.stringify(defaultObj));
                } else {
                    return defaultObj;
                }
            }
            if (isObject(defaultObj)) {
                Object.keys(defaultObj).map(key => {
                    if (obj[key] == undefined) {
                        obj[key] = defaultObj[key];
                    }
                    else {
                        obj[key] = this.merge(obj[key], defaultObj[key]);
                    }
                });
            }
            return obj;
        },
        /**
         * 将受监听的对象转换为不受监听的值对象
         * @param {object} watchedObj 受监听的对象
         */
        convertWatchToValue (watchedObj) {
            if (!isObject(watchedObj)) {
                return watchedObj;
            }
            if (watchedObj._value == undefined) { // 如果传进来的是一个普通对象 直接返回
                return watchedObj;
            }
            let valueObj = {};
            Object.keys(watchedObj).map(key => {
                if (key.startsWith('_')) {
                    return;
                }
                if (isObject(watchedObj[key])) {
                    valueObj[key] = this.convertWatchToValue(watchedObj[key]);
                } else {
                    valueObj[key] = watchedObj[key];
                }
            });
            Object.keys(watchedObj._value).map(key => {
                if (isObject(watchedObj._value[key])) {
                    valueObj[key] = this.convertWatchToValue(watchedObj._value[key]);
                } else {
                    valueObj[key] = watchedObj._value[key];
                }
            });
            return valueObj;
        },
        /**
         * 收到改动后 更新缓存中对应的项
         * @param {object} watchObj 受监听的对象
         * @param {string} storageKey 字段名
         */
        saveChangedValue (watchObj, storageKey) {
            try{
                storage.setItem(this.getFullKey(storageKey), JSON.stringify(this.convertWatchToValue(watchObj)));
            }catch (e) {
                console.error(e);
            }
        },
        /**
         * 把一个值对象变成一个受监视的对象
         * @param {object} valueObj 值对象
         * @param {object} defaultObj 与上面这个值对象对应的默认对象
         * @param {string} storageKey 字段名
         */
        convertValueToWatch (valueObj, defaultObj, storageKey) {
            let that = this;
            let watchObj = that._convertValueToWatchRecursively(valueObj, defaultObj, () => {that.saveChangedValue(watchObj, storageKey);});
            return watchObj;
        },

        _convertValueToWatchRecursively (valueObj, defaultObj, changedCallback = () => {}) {
            let that = this;

            if (!defaultObj) { // 给下面容错
                defaultObj = {};
            }
            let watchedObj = { _value: {} };
            Object.keys(valueObj).map(key => {
                if (isObject(valueObj[key])) {
                    watchedObj._value[key] = that._convertValueToWatchRecursively(valueObj[key], defaultObj[key], changedCallback); // 递归转换为受监视的对象
                } else {
                    watchedObj._value[key] = valueObj[key];
                }
                Object.defineProperty(watchedObj, key, {
                    get: function () {
                        return this._value[key];
                    },
                    set: function (value) {
                        let valid = that.changeIsValid(defaultObj[key], value);

                        if (valid == undefined) {
                            if(isObject(value)) {
                                this._value[key] = that._convertValueToWatchRecursively(value, defaultObj[key], changedCallback);
                            }else{
                                this._value[key] = value;
                            }
                            changedCallback();
                        } else {
                            throw Error("类型不合法1" + key + valid);
                        }
                    },
                });
            });
            return watchedObj;
        },
        /**
         * 初始化 默认使用这个文件隔壁的文件作为defaultSettings 也可以改位置 传入别的defaultSettings
         * 这个defaultSettings会作为改变数据时类型的标准。
         */
        init (defaultSettings) {
            let that = this;
            this._values = {};
            Settings = {};
            Object.keys(defaultSettings).map(key => {
                let defaultSettingItem = defaultSettings[key];
                let setting = storage.getItemSync(this.getFullKey(key));
                if (setting != '' && setting != undefined) {
                    try {
                        setting = JSON.parse(setting);
                    } catch (e) {
                        setting = {};
                    }
                }
                let newSetting = this.merge(setting, defaultSettingItem);
                if (JSON.stringify(newSetting) != JSON.stringify(setting)) {
                    that.saveChangedValue(newSetting, key);
                }
                setting = newSetting;
                if (isObject(setting)) {
                    setting = this.convertValueToWatch(setting, defaultSettingItem, key);
                    setting._getValue = this.convertWatchToValue.bind(this, setting);
                    setting._save = this.saveChangedValue.bind(this, setting, key);
                }

                Object.defineProperty(Settings, key, {
                    get: function () {
                        return that._values[key];
                    },
                    set:function (value) {
                        let valid = that.changeIsValid(defaultSettingItem, value);
                        if (valid == undefined) {
                            if(isObject(value)) {
                                that._values[key] = that._convertValueToWatchRecursively(value, defaultSettingItem);
                                //	debugger;
                            }else{
                                that._values[key] = value;
                            }
                            that.saveChangedValue(that._values[key], key);
                        } else {
                            throw Error("类型不合法" + key + valid);
                        }

                        that._values[key] = value;
                    },

                });
                that._values[key] = setting;
            });
            return Settings;
        },
    };
    Settings = defaultSettings;
    try {
        Settings = SettingManager.init(defaultSettings);
    }catch (e) {

    }
    settingsInitDeferred.resolve(Settings);
    return Settings;
}

