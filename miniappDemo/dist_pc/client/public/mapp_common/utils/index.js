"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPC = exports.showActionSheet = exports.TAB_BAR_PAGES = exports.getQueryString = exports.TYPES = exports.NOOP = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.buildParams = buildParams;
exports.navigateTo = navigateTo;
exports.getPageProps = getPageProps;
exports.navigateBack = navigateBack;
exports.showConfirmModal = showConfirmModal;
exports.buildArgs = buildArgs;
exports.isEmpty = isEmpty;
exports.getDeferred = getDeferred;
exports.getType = getType;
exports.isObject = isObject;
exports.isJSON = isJSON;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.removeImgHttp = removeImgHttp;
exports.getCurrentPageName = getCurrentPageName;
exports.deepCopyObj = deepCopyObj;
exports.isIOS = isIOS;
exports.isAndroid = isAndroid;
exports.refreshPlugin = refreshPlugin;
exports.safeGet = safeGet;
exports.contactTaobaoCustomer = contactTaobaoCustomer;
exports.showTabBar = showTabBar;
exports.hideTabBar = hideTabBar;
exports.sleep = sleep;
exports.classNames = classNames;
exports.isIDE = isIDE;
exports.Object_values = Object_values;
exports.navigateToQAP = navigateToQAP;
exports.formatError = formatError;
exports.versionCompare = versionCompare;

var _index = require("../../../npm/_tarojs/taro-alipay/index.js");

var _index2 = _interopRequireDefault(_index);

var _systemInfo = require("./systemInfo.js");

var _env = require("../../../constants/env.js");

var _logger = require("./logger.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 将Object 转换为QueryString 对象只能有一层.
 * @param params
 * @returns {string}
 */
function buildParams(params) {
  return Object.keys(params).map(function (key) {
    return key + '=' + params[key];
  }).join('&');
}

var pageProps = {};

/**
 * 跳转到指定页面
 * @param url
 * @param params 参数 可以放一些复杂的东西 如对象/数组/回调 之后在page中用下面的getPageProps(this)  取出来
 * @returns {Promise<any>}
 */
function navigateTo(_ref) {
  var url = _ref.url,
      _ref$params = _ref.params,
      params = _ref$params === undefined ? {} : _ref$params,
      _ref$props = _ref.props,
      props = _ref$props === undefined ? {} : _ref$props,
      _ref$redirect = _ref.redirect,
      redirect = _ref$redirect === undefined ? false : _ref$redirect;

  _logger.Logger.log('navigateTo', {
    url: url,
    params: params,
    props: props,
    redirect: redirect
  });
  try {
    var propsKey = url + "_" + (Math.random() * 10000000).toFixed(0);
    if (props) {
      props.dispose = function () {
        delete pageProps[propsKey];
      };
      pageProps[propsKey] = props;

      params.propsKey = propsKey;
    }
    if (params) {
      url += "?" + buildParams(params);
    }
    if (redirect) {
      return my.redirectTo({
        url: url,
        success: NOOP,
        fail: function fail(res) {
          _logger.Logger.error("跳转失败", res);
        }
      });
    }
    return my.navigateTo({
      url: url,
      success: NOOP,
      fail: function fail(res) {
        _logger.Logger.error("跳转失败", res);
      }
    });
  } catch (e) {
    _logger.Logger.error("跳转失败 catch", e);
  }
}
/**
 * 用一个page对象(在page中也就是this)传进来,page对象的$router.params中有一个propsKey的键,这个键在上面的navigateTo中会被先注册.
 * 这样可以实现在页面中回调上一个页面的函数,并传复杂的对象进来.
 * 最好是在用完这个page之后调用这个pageProps.destroy,将外面的回调池清空,不然可能会越来越多.
 * 在willmount的时候
 * @param page
 * @returns {*}
 */
function getPageProps(page) {
  return pageProps[page.$router.params.propsKey];
}

function navigateBack() {
  var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  _index2.default.navigateBack({ delta: delta });
}

/**
 * 显示二次确认弹窗
 * @param onConfirm 点击确认的回调
 * @param onCancel 点击取消的回调
 */
function showConfirmModal(_ref2) {
  var _ref2$title = _ref2.title,
      title = _ref2$title === undefined ? '温馨提示' : _ref2$title,
      content = _ref2.content,
      _ref2$confirmText = _ref2.confirmText,
      confirmText = _ref2$confirmText === undefined ? '确认' : _ref2$confirmText,
      _ref2$cancelText = _ref2.cancelText,
      cancelText = _ref2$cancelText === undefined ? '取消' : _ref2$cancelText,
      _ref2$onConfirm = _ref2.onConfirm,
      onConfirm = _ref2$onConfirm === undefined ? NOOP : _ref2$onConfirm,
      _ref2$onCancel = _ref2.onCancel,
      onCancel = _ref2$onCancel === undefined ? NOOP : _ref2$onCancel,
      _ref2$showCancel = _ref2.showCancel,
      showCancel = _ref2$showCancel === undefined ? true : _ref2$showCancel;

  _index2.default.showModal({
    title: title,
    showCancel: showCancel,
    content: content,
    confirmText: confirmText,
    cancelText: cancelText,
    success: function success(res) {
      if (res.cancel || res.confirm == false) {
        onCancel();
      } else {
        onConfirm();
      }
    }
  });
}

/**
 * 生成表单对象
 * @param args
 * @param keys
 * @returns {FormData}
 */
function buildArgs(args) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var formData = new FormData();
  for (var i in args) {
    if (_typeof(args[i]) === 'object') {
      var newkeys = [].concat(_toConsumableArray(keys));
      if (newkeys.length > 0) {
        newkeys[0] = newkeys[0] + ("[" + i + "]");
      } else {
        newkeys.push(i);
      }
      buildArgs(formData, args[i], newkeys);
    } else {
      (function () {
        var key = '';
        keys.map(function (c) {
          isEmpty(key) ? key = c : key += "[" + c + "]";
        });
        isEmpty(key) ? formData.append(i, args[i]) : formData.append(key + ("[" + i + "]"), args[i]);
      })();
    }
  }
  return formData;
}

/**
 * 去掉前后 空格/空行/tab 的正则 预先定义 避免在函数中重复构造
 * @type {RegExp}
 */
var trimReg = /(^\s*)|(\s*$)/g;

/**
 * 判断一个东西是不是空 空格 空字符串 undefined 长度为0的数组及对象会被认为是空的
 * @param key
 * @returns {boolean}
 */
function isEmpty(key) {
  if (key === undefined || key === '' || key === null) {
    return true;
  }
  if (typeof key === 'string') {
    key = key.replace(trimReg, '');
    if (key == '' || key == null || key == 'null' || key == undefined || key == 'undefined') {
      return true;
    } else {
      return false;
    }
  } else if (typeof key === 'undefined') {
    return true;
  } else if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === 'object') {
    for (var i in key) {
      return false;
    }
    return true;
  } else if (typeof key === 'boolean') {
    return false;
  }
}

/**
 * 构造一个deferred对象 相当于一个resolve reject 外置的promise 可以预先生成这个promise 然后等待这个promise被外部resolve
 * @returns {Promise<unknown>}
 */
function getDeferred() {
  var resolve = void 0,
      reject = void 0;
  var promise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });
  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
};
/**
 * 空函数 避免重复构造空函数
 * @constructor
 */
var NOOP = exports.NOOP = function NOOP() {};
var TYPES = exports.TYPES = {
  Number: '[object Number]',
  String: '[object String]',
  Undefined: '[object Undefined]',
  Boolean: '[object Boolean]',
  Object: '[object Object]',
  Array: '[object Array]',
  Function: '[object Function]'
};

/**
 * 获取一个东西的type 请与上面的常量进行比较
 * @param obj
 * @returns {string}
 */
function getType(obj) {
  return Object.prototype.toString.call(obj);
}

/**
 * 判断是否是对象
 * @param target
 * @returns {boolean}
 */
function isObject(target) {
  return getType(target) === TYPES.Object;
}

/**
 * 判断参数是否是JSON字符串
 * */
function isJSON(str) {
  try {
    var obj = JSON.parse(str);
    if (isObject(obj) && obj) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

/**
 * 判断是否是array
 * @param target
 * @returns {boolean}
 */
function isArray(target) {
  return getType(target) === TYPES.Array;
}

/**
 * 判断是否是函数
 * @param target
 * @returns {boolean}
 */
function isFunction(target) {
  return getType(target) === TYPES.Function;
}

/*
 * @Description 从url中获取指定键值
 */
var getQueryString = exports.getQueryString = function getQueryString(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.substring(url.indexOf('?') + 1, url.length).match(reg);
  if (r != null)
    // return decodeURI(unescape(r[2]));
    {
      return decodeURIComponent(decodeURIComponent(r[2]));
    }
  return null;
};

/*
 * @Description 因为爱用全线 https，所以图片资源不可以有 http的，但是广告系统会有，所以需要处理一下~
 */
function removeImgHttp(oriUrl) {
  return oriUrl.replace('http:', '');
};

/*
 * @Description 获取当前页面的page名
 */
function getCurrentPageName() {
  var page = getCurrentPages();
  if (isEmpty(page)) {
    return undefined;
  }
  return page[page.length - 1].route.match(/\/(\S*)\//)[1];
};

// 存在tabtar的页面
var TAB_BAR_PAGES = exports.TAB_BAR_PAGES = ['tradeIndex', 'tradeList', 'my'];

/*
 * @Description 深拷贝对象
 */
function deepCopyObj(obj) {
  if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === 'object') {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return obj;
  }
};

/*
 * @Description 判断是不是ios平台
*/
function isIOS() {
  return (0, _systemInfo.getSystemInfo)().platform === 'iOS';
};

/*
 * @Description 判断是不是android平台
*/
function isAndroid() {
  return (0, _systemInfo.getSystemInfo)().platform === 'Android';
};

/*
 * @Description 刷新插件功能
*/
function refreshPlugin() {
  _index2.default.reLaunch({ url: '/pages/tradeIndex/index' });
};

function safeGet(obj, path) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  path = path.split('.');
  var value = obj;
  if (!value) {
    return defaultValue;
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var pathItem = _step.value;

      if (value[pathItem]) {
        value = value[pathItem];
      } else {
        return defaultValue;
      }
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

  return value;
};

/**
 *
 * @param itemList
 * @param success
 * @param cancel
 */
function showActionSheet(_ref3) {
  var itemList = _ref3.itemList,
      _success = _ref3.success,
      _ref3$cancel = _ref3.cancel,
      cancel = _ref3$cancel === undefined ? NOOP : _ref3$cancel;

  if (itemList.length == 0) {
    return;
  }
  var textList = itemList;
  if (isObject(itemList[0])) {
    textList = itemList.map(function (item) {
      return item.name;
    });
  }
  _index2.default.showActionSheet({
    itemList: textList, success: function success(res) {
      if (!res || res.index == undefined) {
        return;
      }
      if (res.index == -1) {
        isFunction(cancel) && cancel(res);
        return;
      }
      _success(itemList[res.index]);
    }
  });
}

/**
 * 联系淘宝客服（阿里万象）
 */
exports.showActionSheet = showActionSheet;
function contactTaobaoCustomer() {
  my.qn.openPlugin({ appkey: '21661765' });
}
/*
 * @Description 判断是不是pc
*/
var isPC = exports.isPC = function isPC() {
  return (0, _systemInfo.getSystemInfo)().platform === 'pc';
};

/**
 * 显示tabBar
 * @param animation 是否需要动画效果
 * @param success
 * @param fail
 * @param complete
 */
function showTabBar() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$animation = _ref4.animation,
      animation = _ref4$animation === undefined ? true : _ref4$animation,
      _ref4$success = _ref4.success,
      success = _ref4$success === undefined ? NOOP : _ref4$success,
      _ref4$fail = _ref4.fail,
      fail = _ref4$fail === undefined ? NOOP : _ref4$fail,
      _ref4$complete = _ref4.complete,
      complete = _ref4$complete === undefined ? NOOP : _ref4$complete;

  if (!TAB_BAR_PAGES.includes(getCurrentPageName())) {
    return;
  }
  _index2.default.showTabBar({
    animation: animation,
    success: success,
    fail: fail,
    complete: complete
  });
}

/**
 * 隐藏tabBar
 * @param animation 是否需要动画效果
 * @param success
 * @param fail
 * @param complete
 */
function hideTabBar() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref5$animation = _ref5.animation,
      animation = _ref5$animation === undefined ? true : _ref5$animation,
      _ref5$success = _ref5.success,
      success = _ref5$success === undefined ? NOOP : _ref5$success,
      _ref5$fail = _ref5.fail,
      fail = _ref5$fail === undefined ? NOOP : _ref5$fail,
      _ref5$complete = _ref5.complete,
      complete = _ref5$complete === undefined ? NOOP : _ref5$complete;

  if (!TAB_BAR_PAGES.includes(getCurrentPageName())) {
    return;
  }
  _index2.default.hideTabBar({
    animation: animation,
    success: success,
    fail: fail,
    complete: complete
  });
}

// 动画延时
function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function classNames() {
  var classes = [];

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (!arg) continue;

    var argType = typeof arg === "undefined" ? "undefined" : _typeof(arg);

    if (argType === 'string' || argType === 'number') {
      classes.push(this && this[arg] || arg);
    } else if (Array.isArray(arg)) {
      classes.push(classNames.apply(this, arg));
    } else if (argType === 'object') {
      for (var key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(this && this[key] || key);
        }
      }
    }
  }

  return classes.join(' ');
}

/**
 * 是否是ide 最好把这个在上传的时候改成return false 鬼知道千牛的my.qn里有什么 不同人还不一样的
 * @returns {boolean}
 */
function isIDE() {
  if (_env.ENV.device === "pc") {
    return !my.qn.openPlugin;
  }
  if (_env.ENV.device === "mobile") {
    return my.isIDE;
  }
}

/**
 * Object.values的替代品
 * 我真的佛了 ios的浏览器内核由系统决定 有很多新的feature都没有
 * @param object
 * @returns {[]}
 */
function Object_values(object) {
  if (Object.values) {
    return Object.values(object);
  }
  return Object.keys(object).map(function (key) {
    return object[key];
  });
}

/**
 * 跳转到qap页面
 * 这个地方会通过qap首页中转一下
 * @param pageName
 */
function navigateToQAP(pageName) {
  var redirect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  _logger.Logger.log("navigateToQAP", {
    pageName: pageName,
    redirect: redirect
  });
  var query = {
    fromMapp: true,
    extraData: {
      event: 'gotoPage',
      status: pageName
    }
  };
  if (redirect) {
    query.redirect = true; // 这个flag会在qap被判断并在首页加载loading图
  }
  my.qn.navigateToQAP({
    animate: 1,
    animated: 1,
    request: 1,
    url: 'qap:///index',
    title: 'fdafaaf',
    query: query,
    success: function success(res) {
      _logger.Logger.log('success', res);
    },
    fail: function fail(res) {
      _logger.Logger.log('err', res);
    }
  });
}

function formatError(error) {
  return {
    message: error.message,
    stack: error.stack
  };
}

/**
 * 比较两个版本 verA>verB 就是1 verA<verB就是-1 相等就是0
 * @param verA
 * @param verB
 * @returns {number}
 */
function versionCompare(verA, verB) {
  var verAArr = verA.split('.');
  var verBArr = verB.split('.');
  var length = verAArr.length > verBArr.length ? verAArr.length : verBArr.length;
  for (var i = 0; i < length; i++) {
    var a = verAArr[i] || 0;
    var b = verBArr[i] || 0;
    if (+a > +b) {
      return 1;
    }
    if (+a < +b) {
      return -1;
    }
  }
  return 0;
};