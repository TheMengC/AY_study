'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalStorageAndParse = getLocalStorageAndParse;
exports.saveCacheWithTimeout = saveCacheWithTimeout;
exports.getCacheWithTimeout = getCacheWithTimeout;
exports.getCachedRequest = getCachedRequest;

var _index = require('../../tradePolyfills/index.js');

/**
 * 安全获取一个缓存并解析为string 在不存在或解析不了的时候返回空
 * @param key
 * @param _default
 * @returns {{}|any}
 */
function getLocalStorageAndParse(key) {
  var _default = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var str = _index.storage.getItemSync(key);
  if (!str) {
    return _default;
  }
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    _index.Logger.log(e);
    return _default;
  }
}

/**
 * 带过期时间的保存缓存
 * @param key
 * @param data
 * @param timeout
 * @returns {{data: *, timeout}}
 */
function saveCacheWithTimeout(key, data) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '12h';

  var timeout_num = timeout.match(/\d+/)[0];
  var timeout_unit = timeout.match(/[a-zA-Z]+/)[0];
  var cache = {
    data: data,
    timeout: (0, _index.moment)().add(timeout_num, timeout_unit).format('YYYY-MM-DD HH:mm:ss')
  };
  _index.Logger.debug('保存缓存', { key: key, data: data, timeout: timeout });
  _index.storage.setItem(key, JSON.stringify(cache));
  return cache;
};

/**
 * 带过期时间的取缓存 如果缓存没有或者过期返回null 过期时间为缓存自带的过期时间 不需要传入
 * @param key
 * @param timeout
 */
function getCacheWithTimeout(key) {
  var cache = getLocalStorageAndParse(key);
  if (cache && (0, _index.moment)(cache.timeout).isAfter((0, _index.moment)())) {
    _index.Logger.debug('从缓存取到了' + key, cache);
    return cache.data;
  }
  return null;
}
/**
 *
 * @param query
 * @param key
 * @param requestFun
 * @param timeout
 * @returns {Promise<unknown>}
 */
function getCachedRequest(_ref) {
  var query = _ref.query,
      key = _ref.key,
      requestFun = _ref.requestFun,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === undefined ? '12h' : _ref$timeout,
      _ref$forceUpdate = _ref.forceUpdate,
      forceUpdate = _ref$forceUpdate === undefined ? false : _ref$forceUpdate;

  return new Promise(function (resolve, reject) {
    if (!forceUpdate) {
      var cache = getCacheWithTimeout(key);
      if (cache !== null) {
        resolve(cache);
        return;
      }
    }
    requestFun({
      query: query,
      callback: function callback(data) {
        var cache = saveCacheWithTimeout(key, data, timeout);
        _index.Logger.debug('没有从缓存取到' + key, cache);
        resolve(data);
      },
      errCallback: reject
    });
  });
}