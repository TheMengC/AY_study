"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSettingsEntrySafe = exports.getSettingsAsync = undefined;
exports.getSettings = getSettings;
exports.settingManagerInit = settingManagerInit;

var _index = require("./index.js");

var _storage = require("./storage.js");

var _trademapp = require("../defaultSettings/trademapp.js");

var _itemmapp = require("../defaultSettings/itemmapp.js");

var _env = require("../../../constants/env.js");

var planetDefaultSettingMap = {
  trademapp: _trademapp.defaultSettings_trademapp,
  itemmapp: _itemmapp.defaultSettings_itemmapp
};
var defaultSettings = planetDefaultSettingMap[_env.ENV.planet];
var Settings = void 0;

/**
 * 获取缓存
 * @returns {*}
 */
function getSettings() {
  if (!Settings) {
    console.warn("设置未初始化完成,将返回默认设置");
    return defaultSettings;
  }
  return Settings;
};
var settingsInitDeferred = (0, _index.getDeferred)();
/**
 * 在设置可能没有初始化好时调用
 */
var getSettingsAsync = exports.getSettingsAsync = function getSettingsAsync() {
  return settingsInitDeferred;
};
var getSettingsEntrySafe = exports.getSettingsEntrySafe = function getSettingsEntrySafe(key) {
  var path = key.split('.');
  var ret = getSettings();
  path.map(function (key) {
    ret = ret[key];
  });
  return ret;
};

/**
 * 初始化设置
 * @returns {Object|string|{_value: {}}|undefined|{}|any}
 */
function settingManagerInit() {
  var SettingManager = {
    defaultProps: {
      prefix: 'Settings_',
      suffix: ""
    },
    getFullKey: function getFullKey(key) {
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
    changeIsValid: function changeIsValid(defaultVal, newVal) {
      if (defaultVal == undefined) {
        return;
      }

      var isValid = function isValid(correct, test) {
        var correctType = (0, _index.getType)(correct);
        var testType = (0, _index.getType)(test);
        if (correctType === testType) {

          if (correctType === _index.TYPES.Object) {
            var resArr = Object.keys(correct).map(function (key) {
              var nextCorrect = correct[key];
              var nextTest = test[key];
              var valid = isValid(nextCorrect, nextTest);
              if (valid != undefined) {
                return '.' + key + "字段" + valid;
              } else {
                return;
              }
            });
            resArr = resArr.filter(function (item) {
              return item != undefined;
            });
            if (resArr.length == 0) {
              return;
            } else {
              return resArr.join(";");
            }
          }
          return;
        } else {
          if (correctType == _index.TYPES.String && testType == _index.TYPES.Number) {
            return;
          } else if (correctType == _index.TYPES.Number && testType == _index.TYPES.String) {
            if (Number.isNaN(test * 1)) {
              return "字符串无法转换为数字";
            } else {
              return;
            }
          } else {
            if (testType == _index.TYPES.Undefined) {
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
    merge: function merge(obj, defaultObj) {
      var _this = this;

      if (obj === undefined || obj === null || obj === '') {
        // todo 判空
        if ((0, _index.isObject)(defaultObj)) {
          return JSON.parse(JSON.stringify(defaultObj));
        } else {
          return defaultObj;
        }
      }
      if ((0, _index.isObject)(defaultObj)) {
        Object.keys(defaultObj).map(function (key) {
          if (obj[key] == undefined) {
            obj[key] = defaultObj[key];
          } else {
            obj[key] = _this.merge(obj[key], defaultObj[key]);
          }
        });
      }
      return obj;
    },

    /**
     * 将受监听的对象转换为不受监听的值对象
     * @param {object} watchedObj 受监听的对象
     */
    convertWatchToValue: function convertWatchToValue(watchedObj) {
      var _this2 = this;

      if (!(0, _index.isObject)(watchedObj)) {
        return watchedObj;
      }
      if (watchedObj._value == undefined) {
        // 如果传进来的是一个普通对象 直接返回
        return watchedObj;
      }
      var valueObj = {};
      Object.keys(watchedObj).map(function (key) {
        if (key.startsWith('_')) {
          return;
        }
        if ((0, _index.isObject)(watchedObj[key])) {
          valueObj[key] = _this2.convertWatchToValue(watchedObj[key]);
        } else {
          valueObj[key] = watchedObj[key];
        }
      });
      Object.keys(watchedObj._value).map(function (key) {
        if ((0, _index.isObject)(watchedObj._value[key])) {
          valueObj[key] = _this2.convertWatchToValue(watchedObj._value[key]);
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
    saveChangedValue: function saveChangedValue(watchObj, storageKey) {
      try {
        _storage.storage.setItem(this.getFullKey(storageKey), JSON.stringify(this.convertWatchToValue(watchObj)));
      } catch (e) {
        console.error(e);
      }
    },

    /**
     * 把一个值对象变成一个受监视的对象
     * @param {object} valueObj 值对象
     * @param {object} defaultObj 与上面这个值对象对应的默认对象
     * @param {string} storageKey 字段名
     */
    convertValueToWatch: function convertValueToWatch(valueObj, defaultObj, storageKey) {
      var that = this;
      var watchObj = that._convertValueToWatchRecursively(valueObj, defaultObj, function () {
        that.saveChangedValue(watchObj, storageKey);
      });
      return watchObj;
    },
    _convertValueToWatchRecursively: function _convertValueToWatchRecursively(valueObj, defaultObj) {
      var changedCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      var that = this;

      if (!defaultObj) {
        // 给下面容错
        defaultObj = {};
      }
      var watchedObj = { _value: {} };
      Object.keys(valueObj).map(function (key) {
        if ((0, _index.isObject)(valueObj[key])) {
          watchedObj._value[key] = that._convertValueToWatchRecursively(valueObj[key], defaultObj[key], changedCallback); // 递归转换为受监视的对象
        } else {
          watchedObj._value[key] = valueObj[key];
        }
        Object.defineProperty(watchedObj, key, {
          get: function get() {
            return this._value[key];
          },
          set: function set(value) {
            var valid = that.changeIsValid(defaultObj[key], value);

            if (valid == undefined) {
              if ((0, _index.isObject)(value)) {
                this._value[key] = that._convertValueToWatchRecursively(value, defaultObj[key], changedCallback);
              } else {
                this._value[key] = value;
              }
              changedCallback();
            } else {
              throw Error("类型不合法1" + key + valid);
            }
          }
        });
      });
      return watchedObj;
    },

    /**
     * 初始化 默认使用这个文件隔壁的文件作为defaultSettings 也可以改位置 传入别的defaultSettings
     * 这个defaultSettings会作为改变数据时类型的标准。
     */
    init: function init(defaultSettings) {
      var _this3 = this;

      var that = this;
      this._values = {};
      Settings = {};
      Object.keys(defaultSettings).map(function (key) {
        var defaultSettingItem = defaultSettings[key];
        var setting = _storage.storage.getItemSync(_this3.getFullKey(key));
        if (setting != '' && setting != undefined) {
          try {
            setting = JSON.parse(setting);
          } catch (e) {
            setting = {};
          }
        }
        var newSetting = _this3.merge(setting, defaultSettingItem);
        if (JSON.stringify(newSetting) != JSON.stringify(setting)) {
          that.saveChangedValue(newSetting, key);
        }
        setting = newSetting;
        if ((0, _index.isObject)(setting)) {
          setting = _this3.convertValueToWatch(setting, defaultSettingItem, key);
          setting._getValue = _this3.convertWatchToValue.bind(_this3, setting);
          setting._save = _this3.saveChangedValue.bind(_this3, setting, key);
        }

        Object.defineProperty(Settings, key, {
          get: function get() {
            return that._values[key];
          },
          set: function set(value) {
            var valid = that.changeIsValid(defaultSettingItem, value);
            if (valid == undefined) {
              if ((0, _index.isObject)(value)) {
                that._values[key] = that._convertValueToWatchRecursively(value, defaultSettingItem);
                //	debugger;
              } else {
                that._values[key] = value;
              }
              that.saveChangedValue(that._values[key], key);
            } else {
              throw Error("类型不合法" + key + valid);
            }

            that._values[key] = value;
          }

        });
        that._values[key] = setting;
      });
      return Settings;
    }
  };
  Settings = defaultSettings;
  try {
    Settings = SettingManager.init(defaultSettings);
  } catch (e) {}
  settingsInitDeferred.resolve(Settings);
  return Settings;
}