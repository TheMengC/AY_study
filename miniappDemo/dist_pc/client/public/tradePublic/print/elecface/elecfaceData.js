"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveDefaultSendAddress = exports.wayBillTypeMap = exports.initElecfaceTemplateInfo = exports.initElecfaceTemplateInfoDeferred = undefined;

/**
 * 获取所有的
 * @returns {Promise<void>}
 */
var initElecfaceTemplateInfo = exports.initElecfaceTemplateInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return new Promise(_taobaoLogisticsCompaniesGet.aiyongLogisticsCompaniesGet);

          case 3:
            _index.Logger.warn('initElecfaceTemplateInfo1');
            _context.next = 6;
            return (0, _cache.getCachedRequest)({
              key: 'elecfaceTemplateInfo',
              timeout: '12h',
              requestFun: function requestFun(_ref2) {
                var _callback = _ref2.callback;

                (0, _qnRouter2.default)({
                  api: "cainiao.cloudprint.stdtemplates.get",
                  params: {},
                  callback: function callback(e) {
                    _callback(setElecFaceTemplateInfo(e));
                  }
                });
              }
            });

          case 6:
            elecfaceTemplateInfo = _context.sent;

            _index.Logger.warn('initElecfaceTemplateInfo2');

            _context.next = 10;
            return (0, _cache.getCachedRequest)({
              key: 'elecfaceShareAddresses',
              timeout: '12h',
              requestFun: function requestFun(_ref3) {
                var callback = _ref3.callback;

                initElecFaceAddress().then(callback);
              }
            });

          case 10:
            elecfaceShareAddresses = _context.sent;

            _index.Logger.warn('initElecfaceTemplateInfo3');

            _context.next = 14;
            return (0, _cache.getCachedRequest)({
              key: 'elecfaceUserStdTemplates',
              timeout: '12h',
              requestFun: function requestFun(_ref4) {
                var callback = _ref4.callback;

                var a = (0, _cainiaoCloudprintMystdtemplatesGet.cainiaoCloudprintMystdtemplatesGet)();
                a.then(callback);
              }
            });

          case 14:
            elecfaceUserStdTemplates = _context.sent;

            _index.Logger.warn('initElecfaceTemplateInfo4');

            Object.keys(elecfaceUserStdTemplates).map(function (cp_code) {
              var company = elecfaceTemplateInfo[cp_code];
              var userTemplatesCurrentCompany = elecfaceUserStdTemplates[cp_code];
              if (!company) {
                return;
              }
              company.templates.map(function (item) {
                var currentUserStdTemplateForCompany = userTemplatesCurrentCompany[item.standard_template_id];
                if (!currentUserStdTemplateForCompany) {
                  return;
                }
                item.user_templates = currentUserStdTemplateForCompany.user_templates;
              });
            });
            _index.Logger.warn('initElecfaceTemplateInfo5');

            initElecfaceTemplateInfoDeferred.resolve({
              elecfaceShareAddresses: elecfaceShareAddresses,
              elecfaceTemplateInfo: elecfaceTemplateInfo,
              elecfaceUserStdTemplates: elecfaceUserStdTemplates
            });
            _index.Logger.log('initElecfaceTemplateInfo', {
              elecfaceShareAddresses: elecfaceShareAddresses,
              elecfaceTemplateInfo: elecfaceTemplateInfo,
              elecfaceUserStdTemplates: elecfaceUserStdTemplates
            });
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](0);

            _index.Logger.error('initElecfaceTemplateInfo error ', _context.t0);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 22]]);
  }));

  return function initElecfaceTemplateInfo() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * 初始化电子面单地址信息 因为有共享面单 所以要把所有共享的面单全部取到 并按快递公司分组并标记默认
 * @param callback
 */


var initElecFaceAddress = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var allShareNickRes, addressArr, result, i, elecfaceAddressesIndexedByCpCode, defaultArr;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _utils.apiAsync)({
              apiName: 'aiyong.trade.order.print.elecface.sharenicks.get',
              method: '/print/getAllShareNick'
            });

          case 2:
            allShareNickRes = _context2.sent;

            if (!allShareNickRes.code) {
              _context2.next = 6;
              break;
            }

            (0, _utils.showErrorDialog)('温馨提示', '获取共享面单出错！' + allShareNickRes.msg);
            return _context2.abrupt("return");

          case 6:
            addressArr = [];

            // 使用取出的所有的nick搞事情

            _context2.next = 9;
            return Promise.all(allShareNickRes.result.map(function (item) {
              return new Promise(function (resolve) {
                // 根据nick拿到相应的地址信息
                (0, _index.api)({
                  apiName: 'aiyong.trade.order.print.elecface.address.get',
                  method: '/print/getElecAddressByShareNick',
                  args: { shareNick: item },
                  callback: function callback(resp) {
                    _index.Logger.log('获取电子面单信息', resp);
                    // 合并到一起去
                    addressArr.push(resp);
                    resolve(resp);
                  },
                  errCallback: function errCallback(err) {
                    resolve(err);
                  }
                });
              });
            }));

          case 9:
            result = addressArr;

            for (i in result) {
              if (result[i].code) {
                (0, _utils.showErrorDialog)('温馨提示', "获取共享面单出错！" + result[i].msg, result[i]);
              }
            }
            result = result.filter(function (item) {
              return !item.code;
            });
            elecfaceAddressesIndexedByCpCode = {};

            result.map(function (item) {
              var waybillInfo = item.address.waybill_apply_subscription_cols && item.address.waybill_apply_subscription_cols.waybill_apply_subscription_info;
              if (!waybillInfo) {
                return;
              }
              var shareName = item.shareName;
              waybillInfo.map(function (waybillItem) {
                if (!elecfaceAddressesIndexedByCpCode[waybillItem.cp_code]) {
                  elecfaceAddressesIndexedByCpCode[waybillItem.cp_code] = {
                    cp_name: ((0, _taobaoLogisticsCompaniesGet.aiyongGetLogisticsCompanyByCode)(waybillItem.cp_code) || {}).name_cainiao,
                    cp_code: waybillItem.cp_code,
                    cp_type: waybillItem.cp_type,
                    address_arr: []
                  };
                }

                var wbaArr = waybillItem.branch_account_cols.waybill_branch_account;
                for (var m in wbaArr) {
                  var addressDtoArr = wbaArr[m].shipp_address_cols.address_dto;
                  for (var n in addressDtoArr) {
                    var itemObj = {};
                    itemObj.address = addressDtoArr[n];
                    // itemObj.address = getAddressStr(addressDtoArr[n]);
                    itemObj.sharename = shareName;
                    itemObj.quantity = wbaArr[m].quantity;
                    itemObj.services = wbaArr[m].service_info_cols && wbaArr[m].service_info_cols.service_info_dto || [];
                    elecfaceAddressesIndexedByCpCode[waybillItem.cp_code].address_arr.push(itemObj);
                  }
                }
              });
            });

            _context2.next = 16;
            return (0, _utils.apiAsync)({
              apiName: 'aiyong.trade.order.print.elecface.defaultaddress.get',
              method: '/print/getDefaultSendAds'
            });

          case 16:
            defaultArr = _context2.sent;

            defaultArr = defaultArr.rsp;
            defaultArr.map(function (defaultItem) {
              var company = elecfaceAddressesIndexedByCpCode[defaultItem.cp_code];
              if (company) {
                setDefaultElecfaceAddress(company.cp_code, company.address_arr, defaultItem);
              }
            });

            Object.values(elecfaceAddressesIndexedByCpCode).map(function (company) {
              if (company.address_arr.every(function (item) {
                return item.default == 0;
              })) {
                company.address_arr[0].default = 1;
              }
            });
            return _context2.abrupt("return", elecfaceAddressesIndexedByCpCode);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function initElecFaceAddress() {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * 更换默认地址
 * @param selectSendAddress
 * @param callback
 * @returns {Promise<void>}
 */
var saveDefaultSendAddress = exports.saveDefaultSendAddress = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(selectSendAddress, callback) {
    var ssaArr, cp_code, sharename, addressObj, addressStr, rsp, addresses;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ssaArr = selectSendAddress;
            cp_code = ssaArr.cp_code;
            sharename = ssaArr.sharename;
            addressObj = ssaArr.address;
            addressStr = ['province', 'city', 'district', 'detail'].map(function (key) {
              return addressObj[key];
            }).join(' ');
            _context3.next = 7;
            return (0, _utils.apiAsync)({
              apiName: 'aiyong.trade.order.print.elecface.defaultaddress.set',
              method: '/print/setDefaultSendAds',
              args: {
                cp_code: cp_code,
                face_name: sharename,
                address_dto: addressStr
              }
            });

          case 7:
            rsp = _context3.sent;

            if (!(rsp.result != "success")) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return");

          case 10:
            addresses = (elecfaceShareAddresses[cp_code] || {}).address_arr;

            setDefaultElecfaceAddress(cp_code, addresses, {
              address_dto: addressStr,
              face_name: sharename
            });
            (0, _cache.saveCacheWithTimeout)('elecfaceShareAddresses', elecfaceShareAddresses, '12h');
            callback(elecfaceShareAddresses);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function saveDefaultSendAddress(_x, _x2) {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * 找到
 * @param cp_code
 * @param allAddress
 * @param defaultAddress
 */


exports.getElecfaceData = getElecfaceData;
exports.setElecFaceTemplateInfo = setElecFaceTemplateInfo;
exports.getElecfaceAddressAndTemplate = getElecfaceAddressAndTemplate;
exports.getTemplateDataByCpCodeAndTemplateId = getTemplateDataByCpCodeAndTemplateId;
exports.getCustomAreaByUserStdTemplateId = getCustomAreaByUserStdTemplateId;
exports.setDefaultElecfaceAddress = setDefaultElecfaceAddress;
exports.getAddressStr = getAddressStr;
exports.transformElecfaceServices = transformElecfaceServices;

var _taobaoLogisticsCompaniesGet = require("../../taobaoLogisticsCompaniesGet.js");

var _index = require("../../../tradePolyfills/index.js");

var _cache = require("../../utils/cache.js");

var _qnRouter = require("../../qnRouter.js");

var _qnRouter2 = _interopRequireDefault(_qnRouter);

var _resolveTopResponse = require("../../tradeDataCenter/common/resolveTopResponse.js");

var _cainiaoCloudprintMystdtemplatesGet = require("../../cainiaoCloudprintMystdtemplatesGet.js");

var _index2 = require("../../tradeDataCenter/index.js");

var _utils = require("../../utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var initElecfaceTemplateInfoDeferred = exports.initElecfaceTemplateInfoDeferred = (0, _index.getDeferred)();

var elecfaceTemplateInfo = void 0; // 标准模板信息
var elecfaceShareAddresses = void 0; // 各个快递公司的可选共享面单和地址
var elecfaceUserStdTemplates = void 0; // 初始化自定义标准模板(内含自定义区域)

/**
 * 获取面单打印需要的一大堆信息
 * @returns {Promise<{elecfaceShareAddresses: *, elecfaceUserStdTemplates: *, elecfaceTemplateInfo: *}>}
 */
function getElecfaceData() {
  return initElecfaceTemplateInfoDeferred.then(function () {
    return {
      elecfaceTemplateInfo: elecfaceTemplateInfo,
      elecfaceShareAddresses: elecfaceShareAddresses,
      elecfaceUserStdTemplates: elecfaceUserStdTemplates
    };
  });
}var wayBillTypeMap = exports.wayBillTypeMap = {
  1: '二联', // standard  标准(二联
  2: '三联', // three 三联
  4: '快运', // freight 快运
  6: '一联' //  single 一联
};

/**
 * 处理公共模板信息 这个信息是从菜鸟来的 内容是目前支持所有快递公司的所有种面单类型
 * @param e
 * @returns {{elecfaceCompanies: [], elecfaceModalsGroupByType: {standard: {}, single: {}, three: {}, kuaidata: {}}}}
 */
function setElecFaceTemplateInfo(e) {
  var companies = (0, _resolveTopResponse.getArrayInWrapper)((0, _resolveTopResponse.resolveTopResponse)(e).result.datas);
  var elefaceCompanies = {};

  companies.map(function (company) {
    var cp_code = company.cp_code;
    var stName = ((0, _taobaoLogisticsCompaniesGet.aiyongGetLogisticsCompanyByCode)(cp_code) || {}).name_cainiao;
    var companyModified = {
      cp_code: cp_code,
      cp_name: stName,
      templates: []
    };
    (0, _resolveTopResponse.getArrayInWrapper)(company.standard_templates).forEach(function (item) {
      var typeName = wayBillTypeMap[item.standard_waybill_type];
      if (typeName) {
        companyModified.templates.push(item);
      }
    });
    elefaceCompanies[cp_code] = companyModified;
  });

  return elefaceCompanies;
}

/**
 * 获取面单地址信息和模板信息
 * @returns {{elecfaceShareAddresses: *, elecfaceTemplateInfo: *}}
 */
function getElecfaceAddressAndTemplate() {
  return {
    elecfaceShareAddresses: elecfaceShareAddresses,
    elecfaceTemplateInfo: elecfaceTemplateInfo
  };
}

/**
 * 通过快递公司编号和模板编号找到对应的模板数据
 * @param cp_code
 * @param templateId
 * @returns {}
 */
function getTemplateDataByCpCodeAndTemplateId(cp_code, templateId) {
  return elecfaceTemplateInfo[cp_code].templates.find(function (item) {
    return item.standard_template_id == templateId;
  });
}

var userStdTemplatesDic = {};
/**
 * 用user_standard_template_id换自定义区域的url
 * @returns {Promise<unknown>}
 */
function getCustomAreaByUserStdTemplateId(user_std_template_id) {
  if (userStdTemplatesDic[user_std_template_id]) {
    _index.Logger.log('从内存取到了自定义模板信息');
    return Promise.resolve(userStdTemplatesDic[user_std_template_id]);
  }
  return new Promise(function (resolve) {
    (0, _qnRouter2.default)({
      api: 'cainiao.cloudprint.customares.get',
      params: { template_id: user_std_template_id },
      callback: function callback(res) {
        res = (0, _resolveTopResponse.resolveTopResponse)(res);
        res = res.result;
        if (!res.success) {
          resolve();
          return;
        }
        var datas = (0, _resolveTopResponse.getArrayInWrapper)(res.datas);
        if (Array.isArray(datas) && datas.length != 0) {
          var area = datas[0];
          var reg = /[^.]+$/;
          var fields = (0, _resolveTopResponse.getArrayInWrapper)(area.keys).map(function (item) {
            item = item.key_name;
            var match = item.match(reg);
            return match && match[0];
          }).filter(Boolean);
          var url = area.custom_area_url;
          userStdTemplatesDic[user_std_template_id] = {
            fields: fields,
            url: url
          };
          resolve(userStdTemplatesDic[user_std_template_id]);
        } else {
          resolve();
        }
      },
      errCallback: resolve.bind(null)
    });
  });
}function setDefaultElecfaceAddress(cp_code, allAddress, defaultAddress) {
  allAddress.map(function (addressItem) {
    var addressStr = getAddressStr(addressItem.address);
    if (addressStr == defaultAddress.address_dto && addressItem.sharename == defaultAddress.face_name) {
      addressItem.default = 1;
    } else {
      addressItem.default = 0;
    }
  });
}

/**
 * 把地址搞成字符串形式
 * @param addressObj
 */
function getAddressStr(addressObj) {
  return ['province', 'city', 'district', 'detail'].map(function (key) {
    return addressObj[key];
  }).join(' ');
}

/**
 * 添加物流服务
 * @Author ZW
 * @date   2018-03-09T15:20:26+0800
 * @param  {Object}                 request      原始request数据
 * @param  {string}                 cpCode    物流公司
 * @param  {Object}                 customSrv 自定义服务信息
 * @param  {Object}                 trade 当前订单信息
 * @return {Object}                 增加了服务信息的request数据
 */
function transformElecfaceServices(cpCode, customSrv, trade) {
  var services = {};
  // 是否是货到付款订单 合单格式是cod,cod,cod
  var isCOD = trade.type == 'cod';
  if ((0, _index2.getFlatTrades)(trade).some(function (subTrade) {
    return subTrade.type.indexOf('cod') > 0;
  })) {
    isCOD = 1;
  }
  // 实付款，用作保价和货到付款订单
  var payment = 0.00;
  if (trade.tid && trade.payment) {
    payment = (0, _index2.getFlatTrades)(trade).reduce(function (a, b) {
      return a + (b.payment || 0);
    }, 0);
  }

  // 判断货到付款订单标记
  if (!isCOD && Object.keys(customSrv).length == 0) {
    // 不是货到付款订单并且额外服务不存在
    return services;
  } else {
    services = Object.assign({}, customSrv);
    if (isCOD && payment * 1 != 0) {
      // 加上货到付款的东西
      services['SVC-COD'] = { value: payment };
    }
    if (Object.keys(customSrv).length > 0) {
      // 加上额外服务
      // 判断传入服务中的保价服务是不是自己定义的 -1代表使用订单实付款
      if (customSrv['SVC-INSURE'] && customSrv['SVC-INSURE'].value == "PAYMENT") {
        services['SVC-INSURE'] = { value: payment };
      }
    }
  }

  _index.Logger.log('transformElecfaceServices', services);
  return services;
}