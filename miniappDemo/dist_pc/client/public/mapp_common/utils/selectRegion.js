"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logisticsAddressAreaDistrictGet = exports.logisticsAddressAreaCityGet = exports.logisticsAddressAreaProvinceGet = exports.logisticsAddressAreaDistrictsGet = exports.logisticsAddressAreaCitysGet = exports.logisticsAddressAreaProvincesGet = exports.logisticsAddressAreaInit = undefined;

/**
 * 初始化省市区 缓存7天
 * @returns {Promise<void>}
 */
var logisticsAddressAreaInit = exports.logisticsAddressAreaInit = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _cache.getCachedRequest)({
              key: 'aiyong.tools.area.get',
              timeout: '168h',
              requestFun: function requestFun(_ref2) {
                var callback = _ref2.callback;

                (0, _api.api)({
                  apiName: 'aiyong.tools.area.get',
                  method: '/iytrade/getArea',
                  callback: callback
                });
              }
            });

          case 2:
            logisticsAddressArea = _context.sent;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function logisticsAddressAreaInit() {
    return _ref.apply(this, arguments);
  };
}();

exports.showProvinceActionSheet = showProvinceActionSheet;
exports.showCityActionSheet = showCityActionSheet;
exports.showDistrictActionSheet = showDistrictActionSheet;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./index.js");

var _api = require("./api.js");

var _cache = require("../../tradePublic/utils/cache.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logisticsAddressArea = {};;
/**
 * 获取所有省份列表
 * @return {Object}
 */
var logisticsAddressAreaProvincesGet = exports.logisticsAddressAreaProvincesGet = function logisticsAddressAreaProvincesGet() {
  return logisticsAddressArea.province;
};
/**
 * 获取某省份城市列表
 * @param provinceAddcode 省份的addcode
 * @return {*}
 */
var logisticsAddressAreaCitysGet = exports.logisticsAddressAreaCitysGet = function logisticsAddressAreaCitysGet(provinceAddcode) {
  return logisticsAddressArea.citys[provinceAddcode];
};
/**
 * 获取某城市的县区列表
 * @param cityAddcode 城市的addcode
 * @return {*}
 */
var logisticsAddressAreaDistrictsGet = exports.logisticsAddressAreaDistrictsGet = function logisticsAddressAreaDistrictsGet(cityAddcode) {
  return logisticsAddressArea.districts[cityAddcode];
};
var provinceNameToItemMap = {};
var cityNameToItemMap = {};
var districtNameToItemMap = {};
/**
 * 获取某个省份的item
 * @param provinceName 省份的名字
 */
var logisticsAddressAreaProvinceGet = exports.logisticsAddressAreaProvinceGet = function logisticsAddressAreaProvinceGet(provinceName) {
  if ((0, _index3.isEmpty)(provinceNameToItemMap)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = logisticsAddressAreaProvincesGet()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        provinceNameToItemMap[item.address] = item;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return provinceNameToItemMap[provinceName];
};
/**
 * 获取某城市的item
 * @param provinceName 省份的名字
 * @param cityName 城市的名字
 */
var logisticsAddressAreaCityGet = exports.logisticsAddressAreaCityGet = function logisticsAddressAreaCityGet(provinceName, cityName) {
  var province = logisticsAddressAreaProvinceGet(provinceName);
  if ((0, _index3.isEmpty)(cityNameToItemMap[province.addcode])) {
    var map = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = logisticsAddressAreaCitysGet(province.addcode)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;

        map[item.address] = item;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
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
var logisticsAddressAreaDistrictGet = exports.logisticsAddressAreaDistrictGet = function logisticsAddressAreaDistrictGet(provinceName, cityName, districtName) {
  var city = logisticsAddressAreaCityGet(provinceName, cityName);
  if ((0, _index3.isEmpty)(districtNameToItemMap[city.addcode])) {
    districtNameToItemMap[city.addcode] = {};
    logisticsAddressAreaDistrictsGet(city.addcode).map(function (item) {
      return districtNameToItemMap[city.addcode][item.address] = item;
    });
  }
  return districtNameToItemMap[city.addcode][districtName];
};

/**
 * 展示选择省份的actionsheet
 */
function showProvinceActionSheet() {
  return new Promise(function (resolve, reject) {
    var provinceSelectValues = logisticsAddressAreaProvincesGet();
    _index2.default.showActionSheet({ itemList: provinceSelectValues.map(function (item) {
        return item.address;
      }) }).then(function (res) {
      resolve(provinceSelectValues[res.index]);
    });
  });
}

/**
 * 展示选择城市的actionsheet
 * @param provinceName 省份的名字
 */
function showCityActionSheet(provinceName) {
  return new Promise(function (resolve, reject) {
    var province = logisticsAddressAreaProvinceGet(provinceName);
    var citySelectValues = logisticsAddressAreaCitysGet(province.addcode);
    _index2.default.showActionSheet({ itemList: citySelectValues.map(function (item) {
        return item.address;
      }) }).then(function (res) {
      resolve(citySelectValues[res.index]);
    });
  });
}

/**
 * 展示选择区域的actionsheet
 * @param provinceName 省份的名字
 * @param cityName 城市的名字
 */
function showDistrictActionSheet(provinceName, cityName) {
  return new Promise(function (resolve, reject) {
    var city = logisticsAddressAreaCityGet(provinceName, cityName);
    var districtSelectValues = logisticsAddressAreaDistrictsGet(city.addcode);
    if ((0, _index3.isEmpty)(districtSelectValues)) {
      resolve({ address: '' });
      return;
    }
    _index2.default.showActionSheet({ itemList: districtSelectValues.map(function (item) {
        return item.address;
      }) }).then(function (res) {
      resolve(districtSelectValues[res.index]);
    });
  });
}