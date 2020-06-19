'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aiyongLogisticsCompaniesGetNew = exports.getLogisiticsCompanyCodeVersion = undefined;
exports.initLogisticsCompanyLocal = initLogisticsCompanyLocal;
exports.aiyongLogisticsCompaniesInit = aiyongLogisticsCompaniesInit;
exports.aiyongLogisticsCompaniesGet = aiyongLogisticsCompaniesGet;
exports.aiyongLogisticsCompaniesSortByPinyin = aiyongLogisticsCompaniesSortByPinyin;
exports.aiyongGetLogisticsCompanyByCode = aiyongGetLogisticsCompanyByCode;
exports.aiyongGetLogisticsCompanyByName = aiyongGetLogisticsCompanyByName;
exports.aiyongGetLogisticsCompanyByNameFuzzy = aiyongGetLogisticsCompanyByNameFuzzy;
exports.aiyongLogisticsCompanyNameIsEqual = aiyongLogisticsCompanyNameIsEqual;

var _index = require('../tradePolyfills/index.js');

var companies = [];
var getCompaniesDeferred = null;
var getCompaniesVersionDeferred = (0, _index.getDeferred)();
var hasGetNew = false;
var companyIndexes = {
  code: {},
  code_cainiao: {},
  code_pdd: {},
  name: {},
  name_cainiao: {},
  name_pdd: {}
};

var company = { // 给ide提示用。
  name: '',
  code: '',
  name_cainiao: '',
  code_cainiao: '',
  alias: '',
  pinyin: '',
  reg_mail_no: undefined
};
/**
 * 取物流公司表的版本号
 * 一般是取完版本号调aiyongLogisticsCompaniesGet 这个函数会根据版本号看是否需要更新这张表
 * @param callback
 */
function getLogisiticsCompanyCodeVersion() {
  var _callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

  (0, _index.api)({
    //	host: 'http://trade.zdh.aiyongbao.com',
    apiName: 'aiyong.tools.logisticscompanies.version.get',
    method: '/print/getLogisiticsCompanyCodeVersion',
    isloading: false,
    callback: function callback(rsp) {
      log('getLogisiticsCompanyCodeVersion', 1, rsp);
      getCompaniesVersionDeferred.resolve(rsp.version);
      _callback(rsp.version);
    },
    errCallback: function errCallback() {
      _callback(0);
    }
  });
}

/**
 * 获得当前缓存中的版本号
 * @returns {number|*}
 */
exports.getLogisiticsCompanyCodeVersion = getLogisiticsCompanyCodeVersion;
function getLogisticsLocalVersion() {
  var str = _index.storage.getItemSync('logistics_company_aiyong');
  if ((0, _index.isEmpty)(str)) {
    return 0;
  }
  var store = {};
  try {
    store = JSON.parse(str);
  } catch (e) {
    return 0;
  }
  if (store.version === undefined) {
    return 0;
  }
  return store.version;
}

/**
 * 从缓存初始化
 * @param callback
 */
function initLogisticsCompanyLocal() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _index.NOOP;

  var str = _index.storage.getItemSync('logistics_company_aiyong');
  if ((0, _index.isEmpty)(str)) {
    aiyongLogisticsCompaniesGetNew({ callback: callback });
    return [];
  }
  var store = {};
  try {
    store = JSON.parse(str);
  } catch (e) {
    aiyongLogisticsCompaniesGetNew({ callback: callback });
    return [];
  }
  companies = store.data;
  if (store.update) {
    if ((0, _index.moment)().diff(store.update, 'days') > 7) {
      aiyongLogisticsCompaniesGetNew({});
    }
  }
  aiyongLogisticsCompanyCreateIndexes();
  callback(companies);
  return companies;
}

/**
 * 初始化
 */
function aiyongLogisticsCompaniesInit() {
  initLogisticsCompanyLocal();
  setTimeout(function () {
    getLogisiticsCompanyCodeVersion(function (version) {
      if (getLogisticsLocalVersion() < version && !hasGetNew) {
        aiyongLogisticsCompaniesGetNew({});
      }
    });
  }, 1000);
}

function aiyongLogisticsCompaniesGetNew(_ref) {
  var _ref$callback = _ref.callback,
      _callback2 = _ref$callback === undefined ? _index.NOOP : _ref$callback,
      _ref$errCallback = _ref.errCallback,
      _errCallback = _ref$errCallback === undefined ? _index.NOOP : _ref$errCallback;

  if (getCompaniesDeferred) {
    getCompaniesDeferred.then(_callback2);
    return;
  }
  getCompaniesDeferred = (0, _index.getDeferred)();
  hasGetNew = true;
  (0, _index.api)({
    mode: 'json',
    apiName: 'aiyong.tools.logisticscompanies.get',
    // host: 'http://trade.zdh.aiyongbao.com',
    method: '/iyprint2/GetLogisticsCompanies',
    callback: function callback(rsp) {
      log('%caiyongLogisticsCompaniesGet取最新', 1, rsp);
      var arr = [];
      for (var i = 0; i < rsp.length; i++) {
        var item = rsp[i];
        if (item.name == '圆通快递') {
          // 圆通快递有两个 跳过第一个
          continue;
        }
        if (item.alias) {
          item.alias = item.alias.split(',');
        } else {
          item.alias = [];
        }
        arr.push(item);
      }

      companies = arr;
      aiyongLogisticsCompanyCreateIndexes();
      _callback2(arr);
      getCompaniesVersionDeferred.then(function (currentVersion) {
        var store = {
          version: currentVersion,
          update: (0, _index.moment)().format('YYYY-MM-DD HH:mm:ss'),
          data: arr
        };
        _index.storage.setItem('logistics_company_aiyong', JSON.stringify(store));
        getCompaniesDeferred.resolve(arr);
        getCompaniesDeferred = null;
      });
    },
    errCallback: function errCallback(rsp) {
      _errCallback(rsp);
    }
  });
}exports.aiyongLogisticsCompaniesGetNew = aiyongLogisticsCompaniesGetNew;
;

/** 走淘宝取到的公司快递公司不全 用我们库里面的快递公司
 * 默认程序启动的时候会跑一遍上面的aiyongLogisticsCompaniesInit 所以缓存里应该是有数据的。
 * 如果缓存中没有 这个函数会取 并返回空数组，这边其实不关键 因为是空的概率很小 而且只要重新操作一遍就可以了，所以可以不做判空之类的操作。
 * @author moonkop
 * @param callback 这个函数在确定缓存中有的时候会被回调。 如果不放心是缓存中有 可以把代码写在这个回调里面，回调也返回快递公司列表
 * @param errCallback
 */
function aiyongLogisticsCompaniesGet() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
  var errCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  if (companies.length != 0) {
    callback(companies);
    return companies;
  } else {
    return initLogisticsCompanyLocal(callback);
  }
}

/**
 * 获取按照拼音排序的快递公司列表
 * @return {Promise<unknown>}
 */
function aiyongLogisticsCompaniesSortByPinyin() {
  return new Promise(function (resolve, reject) {
    aiyongLogisticsCompaniesGet(function (data) {
      data.sort(function (a, b) {
        return a.pinyin.localeCompare(b.pinyin);
      });
      resolve(data);
    });
  });
}

/**
 * 建立索引 加快查找速度。
 */
function aiyongLogisticsCompanyCreateIndexes() {
  companies.map(function (item) {
    item.code_pdd == null && (item.code_pdd = item.code);
    item.name_pdd == null && (item.name_pdd = item.name);
    item.code_cainiao == null && (item.code_cainiao = item.code);
    item.name_cainiao == null && (item.name_cainiao = item.name);
    companyIndexes.code[item.code] = item;
    companyIndexes.code_cainiao[item.code_cainiao] = item;
    companyIndexes.code_pdd[item.code_pdd] = item;
    companyIndexes.name[item.name] = item;
    companyIndexes.name_cainiao[item.name_cainiao] = item;
    companyIndexes.name_pdd[item.name_pdd] = item;
  });
}

/**
 * 下面这俩是匹配快递公司的函数 调用了上面获取快递公司的函数，使用之前需要判断是否有快递公司的缓存（大概率是有的 直接用就是了），没有的话会直接获取，但返回undefined，下次调用就有了。
 * 匹配的时候同时匹配了淘宝的和菜鸟的名称和code 只要有一个符合就返回
 * 所以 只要上面调用过 aiyongLogisticsCompaniesGet一次后确定缓存中有物流公司则 aiyongLogisticsCompaniesGet会直接返回物流公司
 * 所以这个函数在确定缓存中有的时候才可以以同步的形式调用 异步形式调用已废弃（其实缓存没有也无所谓啦 确实会有错乱发生，但是只要调用过一次就有缓存了嘛（逃
 * 其实如果不确定是缓存中是否有快递公司，或者发货那边需要特别的不能出错 那就把相应的逻辑写在aiyongLogisticsCompaniesGet的回调里面 就能保证有缓存了。
 * @author moonkop
 * @param code 同时匹配了淘宝的和菜鸟的名称和code 只要有一个符合就返回 里面有name 有code 有name_cainiao和code_cainiao和name_pdd和code_pdd 要什么自己取
 * @return  返回一个company 但是如果缓存没有 会返回undefined
 *
 *   我相信 现在不会有人自己匹配快递公司了！
 */
function aiyongGetLogisticsCompanyByCode(code, from) {
  if ((0, _index.isEmpty)(code)) {
    return;
  }
  var companies = aiyongLogisticsCompaniesGet();
  function searchByIndex() {
    var company = companyIndexes.code[code];
    if (company) {
      return company;
    }
    company = companyIndexes.code_cainiao[code];
    if (company) {
      return company;
    }
    if (from == 'pdd') {
      company = companyIndexes.code_pdd[code];
      if (company) {
        return company;
      }
    }
  }
  if (companies) {
    var _company = searchByIndex();
    log('aiyongGetLogisticsCompanyByCode', 1, _company);
    return _company;
  }
}

/**
 * 用快递公司名称搜索快递公司
 * @param name 快递公司名称
 * @param from undefined | pdd
 * @return {*|void}
 */
function aiyongGetLogisticsCompanyByName(name, from) {
  if ((0, _index.isEmpty)(name)) {
    return;
  }
  var companies = aiyongLogisticsCompaniesGet();
  function searchByIndex() {
    var company = companyIndexes.name[name];
    if (company) {
      return company;
    }
    company = companyIndexes.name_cainiao[name];
    if (company) {
      return company;
    }
  }

  function searchByAlias() {
    log('aiyongGetLogisticsCompanyByName-searchByAlias', 2, company);
    for (var i = 0; i < companies.length; i++) {
      var currentCompany = companies[i];
      if (!(0, _index.isEmpty)(currentCompany.alias) && currentCompany.alias.indexOf(name) != -1) {
        return currentCompany;
      }
    }
  }
  function searchFromPDD() {
    var company = companyIndexes.name[name];
    if (company) {
      return company;
    }
  }

  if (companies) {
    var _company2 = void 0;
    if (from == 'pdd') {
      _company2 = searchFromPDD();
      return _company2;
    }
    _company2 = searchByIndex();
    if (!_company2) {
      // 用别名匹配
      _company2 = searchByAlias();
    }
    // 安能这个妖孽
    if (!_company2 && name.indexOf('安能') != -1) {
      name = '安能快运';
      _company2 = searchByIndex();
    }

    // 搞一个模糊匹配的策略
    // 比如百世快运标准模板 要能匹配到百世快运
    if (!_company2) {
      log('aiyongGetLogisticsCompanyByName-doFuzzy', 2, _company2);
      // 1.互相indexOf匹配一下
      for (var i = 0; i < companies.length; i++) {
        var currentCompany = companies[i];
        if (!(0, _index.isEmpty)(currentCompany.name) && name.indexOf(currentCompany.name) != -1 || !(0, _index.isEmpty)(currentCompany.name_cainiao) && name.indexOf(currentCompany.name_cainiao) != -1) {
          _company2 = currentCompany;
          break;
        }
      }
    }
    log('aiyongGetLogisticsCompanyByName', 1, _company2);
    return _company2;
  }
}

/**
 * 模糊搜索 这个模糊搜索可能会返回多个快递公司也可能会返回一个快递公司 这个模糊搜索的返回值比较复杂,可能有几个快递公司,在
 * @param name
 * @param fuzzyLevel
 * @returns {{firstMatch: undefined, matches: Array}}
 */
function aiyongGetLogisticsCompanyByNameFuzzy(name, fuzzyLevel) {
  var result = {
    firstMatch: undefined,
    matches: []
  };
  if ((0, _index.isEmpty)(name)) {
    return result;
  }
  if (['快递', '速递', '包裹', '物流', '快运'].includes(name)) {
    return result;
  }
  var company = aiyongGetLogisticsCompanyByName(name);
  if (company) {
    result.matches.push({
      level: 0,
      company: company
    });
  }
  var companies = aiyongLogisticsCompaniesGet();
  if (fuzzyLevel >= 1) {
    // 这是第一次模糊搜索 这个模糊搜索会将德邦匹配为德邦快运或德邦快递 中通匹配为中通快运或中通快递 匹配结果不准确.
    companies.map(function (currentCompany) {
      if (!(0, _index.isEmpty)(currentCompany.name) && currentCompany.name.indexOf(name) != -1 || !(0, _index.isEmpty)(currentCompany.name_cainiao) && currentCompany.name_cainiao.indexOf(name) != -1) {
        result.matches.push({ level: 1, company: currentCompany });
      }
    });
  }
  if (fuzzyLevel >= 2) {
    // 第二级模糊搜索 这个模糊搜索会将输入的名字与快递公司的别名进行匹配,若别名中存在输入名则算匹配成功
    companies.map(function (currentCompany) {
      if (currentCompany.alias && currentCompany.alias.length > 0) {
        currentCompany.alias.map(function (alia) {
          if (!(0, _index.isEmpty)(alia) && alia.indexOf(name) != -1) {
            result.matches.push({ level: 2, company: currentCompany });
          }
        });
      }
    });
  }
  if (fuzzyLevel >= 3) {
    companies.map(function (currentCompany) {
      if (!(0, _index.isEmpty)(currentCompany.pinyin) && currentCompany.pinyin.indexOf(name) != -1) {
        result.matches.push({ level: 3, company: currentCompany });
      }
    });
  }

  if (result.matches.length > 0) {
    result.matches.sort(function (a, b) {
      return a < b;
    });
    result.firstMatch = result.matches[0];
  }
  return result;
}

/**
 * 这是匹配两个名称是否是一个快递公司的方法 比如安能快运在淘宝叫安能物流 如果用==的话匹配不到
 * @param name1
 * @param name2
 * @return {boolean}
 */
function aiyongLogisticsCompanyNameIsEqual(name1, name2) {
  if ((0, _index.isEmpty)(name1) || (0, _index.isEmpty)(name2)) {
    return false;
  }
  if (name1 == name2) {
    return true;
  }
  if ((0, _index.isEmpty)(companies)) {
    return false;
  }
  if (aiyongGetLogisticsCompanyByName(name1) == aiyongGetLogisticsCompanyByName(name2)) {
    return true;
  } else {
    return false;
  }
}

/**
 *
 * @param name 函数名或者方便辨识的东西
 * @param level  日志级别 日志级别越高 则表示该日志越详细。
 *                  比如一条日志级别是3 那在companyGetLogLevel为2的时候就不会显示这条日志
 * @param content  内容 可以是任何东西 会作为console.log后面的参数尾随
 */
function log(name, level) {
  if (level < (0, _index.getWindow)().companyGetLogLevel) {
    for (var _len = arguments.length, content = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      content[_key - 2] = arguments[_key];
    }

    console.log.apply(null, ['%c' + name, 'background-color:#FAA'].concat(content));
  }
}

/**
 * 日志级别，越高显示的越多，越详细
 * @type {number}
 */
(0, _index.getWindow)().companyGetLogLevel = 0;
(0, _index.getWindow)().companys = {
  companyIndexes: companyIndexes,
  companies: companies,
  getLogisiticsCompanyCodeVersion: getLogisiticsCompanyCodeVersion,
  aiyongGetLogisticsCompanyByCode: aiyongGetLogisticsCompanyByCode,
  aiyongLogisticsCompanyCreateIndexes: aiyongLogisticsCompanyCreateIndexes,
  aiyongGetLogisticsCompanyByName: aiyongGetLogisticsCompanyByName,
  aiyongLogisticsCompaniesGet: aiyongLogisticsCompaniesGet,
  aiyongLogisticsCompaniesGetNew: aiyongLogisticsCompaniesGetNew,
  aiyongLogisticsCompanyNameIsEqual: aiyongLogisticsCompanyNameIsEqual,
  aiyongLogisticsCompaniesInit: aiyongLogisticsCompaniesInit
};