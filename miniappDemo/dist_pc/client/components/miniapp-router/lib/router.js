'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*eslint-disable*/
module.exports =
/******/function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, { enumerable: true, get: getter });
      /******/
    }
    /******/
  };
  /******/
  /******/ // define __esModule on exports
  /******/__webpack_require__.r = function (exports) {
    /******/if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      /******/
    }
    /******/Object.defineProperty(exports, '__esModule', { value: true });
    /******/
  };
  /******/
  /******/ // create a fake namespace object
  /******/ // mode & 1: value is a module id, require it
  /******/ // mode & 2: merge all properties of value into the ns
  /******/ // mode & 4: return value when already ns object
  /******/ // mode & 8|1: behave like require
  /******/__webpack_require__.t = function (value, mode) {
    /******/if (mode & 1) value = __webpack_require__(value);
    /******/if (mode & 8) return value;
    /******/if (mode & 4 && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value && value.__esModule) return value;
    /******/var ns = Object.create(null);
    /******/__webpack_require__.r(ns);
    /******/Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    /******/if (mode & 2 && typeof value != 'string') for (var key in value) {
      __webpack_require__.d(ns, key, function (key) {
        return value[key];
      }.bind(null, key));
    } /******/return ns;
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = "";
  /******/
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = "./src/index.ts");
  /******/
}(
/************************************************************************/
/******/{

  /***/"./node_modules/path-to-regexp/index.js":
  /*!**********************************************!*\
    !*** ./node_modules/path-to-regexp/index.jsx ***!
    \**********************************************/
  /*! no static exports found */
  /***/function node_modulesPathToRegexpIndexJs(module, exports) {

    /**
     * Expose `pathToRegexp`.
     */
    module.exports = pathToRegexp;
    module.exports.parse = parse;
    module.exports.compile = compile;
    module.exports.tokensToFunction = tokensToFunction;
    module.exports.tokensToRegExp = tokensToRegExp;

    /**
     * Default configs.
     */
    var DEFAULT_DELIMITER = '/';

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
    // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
    '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {string}  str
     * @param  {Object=} options
     * @return {!Array}
     */
    function parse(str, options) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var defaultDelimiter = options && options.delimiter || DEFAULT_DELIMITER;
      var whitelist = options && options.whitelist || undefined;
      var pathEscaped = false;
      var res;

      while ((res = PATH_REGEXP.exec(str)) !== null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          pathEscaped = true;
          continue;
        }

        var prev = '';
        var name = res[2];
        var capture = res[3];
        var group = res[4];
        var modifier = res[5];

        if (!pathEscaped && path.length) {
          var k = path.length - 1;
          var c = path[k];
          var matches = whitelist ? whitelist.indexOf(c) > -1 : true;

          if (matches) {
            prev = c;
            path = path.slice(0, k);
          }
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
          pathEscaped = false;
        }

        var repeat = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var pattern = capture || group;
        var delimiter = prev || defaultDelimiter;

        tokens.push({
          name: name || key++,
          prefix: prev,
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : delimiter + defaultDelimiter) + ']+?'
        });
      }

      // Push any remaining characters.
      if (path || index < str.length) {
        tokens.push(path + str.substr(index));
      }

      return tokens;
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {string}             str
     * @param  {Object=}            options
     * @return {!function(Object=, Object=)}
     */
    function compile(str, options) {
      return tokensToFunction(parse(str, options));
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction(tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (_typeof(tokens[i]) === 'object') {
          matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
        }
      }

      return function (data, options) {
        var path = '';
        var encode = options && options.encode || encodeURIComponent;

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;
            continue;
          }

          var value = data ? data[token.name] : undefined;
          var segment;

          if (Array.isArray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but got array');
            }

            if (value.length === 0) {
              if (token.optional) continue;

              throw new TypeError('Expected "' + token.name + '" to not be empty');
            }

            for (var j = 0; j < value.length; j++) {
              segment = encode(value[j], token);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"');
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue;
          }

          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            segment = encode(String(value), token);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"');
            }

            path += token.prefix + segment;
            continue;
          }

          if (token.optional) continue;

          throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'));
        }

        return path;
      };
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {string} str
     * @return {string}
     */
    function escapeString(str) {
      return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {string} group
     * @return {string}
     */
    function escapeGroup(group) {
      return group.replace(/([=!:$/()])/g, '\\$1');
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {string}
     */
    function flags(options) {
      return options && options.sensitive ? '' : 'i';
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {!RegExp} path
     * @param  {Array=}  keys
     * @return {!RegExp}
     */
    function regexpToRegexp(path, keys) {
      if (!keys) return path;

      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return path;
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {!Array}  path
     * @param  {Array=}  keys
     * @param  {Object=} options
     * @return {!RegExp}
     */
    function arrayToRegexp(path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      return new RegExp('(?:' + parts.join('|') + ')', flags(options));
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {string}  path
     * @param  {Array=}  keys
     * @param  {Object=} options
     * @return {!RegExp}
     */
    function stringToRegexp(path, keys, options) {
      return tokensToRegExp(parse(path, options), keys, options);
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {!Array}  tokens
     * @param  {Array=}  keys
     * @param  {Object=} options
     * @return {!RegExp}
     */
    function tokensToRegExp(tokens, keys, options) {
      options = options || {};

      var strict = options.strict;
      var start = options.start !== false;
      var end = options.end !== false;
      var delimiter = options.delimiter || DEFAULT_DELIMITER;
      var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
      var route = start ? '^' : '';

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var capture = token.repeat ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*' : token.pattern;

          if (keys) keys.push(token);

          if (token.optional) {
            if (!token.prefix) {
              route += '(' + capture + ')?';
            } else {
              route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
            }
          } else {
            route += escapeString(token.prefix) + '(' + capture + ')';
          }
        }
      }

      if (end) {
        if (!strict) route += '(?:' + escapeString(delimiter) + ')?';

        route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
      } else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === 'string' ? endToken[endToken.length - 1] === delimiter : endToken === undefined;

        if (!strict) route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?';
        if (!isEndDelimited) route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')';
      }

      return new RegExp(route, flags(options));
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(string|RegExp|Array)} path
     * @param  {Array=}                keys
     * @param  {Object=}               options
     * @return {!RegExp}
     */
    function pathToRegexp(path, keys, options) {
      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys);
      }

      if (Array.isArray(path)) {
        return arrayToRegexp( /** @type {!Array} */path, keys, options);
      }

      return stringToRegexp( /** @type {string} */path, keys, options);
    }

    /***/
  },

  /***/"./src/creat-route-map.ts":
  /*!********************************!*\
    !*** ./src/creat-route-map.ts ***!
    \********************************/
  /*! no static exports found */
  /***/function srcCreatRouteMapTs(module, exports, __webpack_require__) {

    "use strict";

    var __values = this && this.__values || function (o) {
      var m = typeof Symbol === "function" && o[Symbol.iterator],
          i = 0;
      if (m) return m.call(o);
      return {
        next: function next() {
          if (o && i >= o.length) o = undefined;
          return { value: o && o[i++], done: !o };
        }
      };
    };
    var __importDefault = this && this.__importDefault || function (mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var path_to_regexp_1 = __importDefault(__webpack_require__( /*! path-to-regexp */"./node_modules/path-to-regexp/index.js"));
    var path_1 = __webpack_require__( /*! ./utils/path */"./src/utils/path.ts");
    function default_1(routes) {
      var e_1, _a;
      var routeMap = new Map();
      try {
        for (var routes_1 = __values(routes), routes_1_1 = routes_1.next(); !routes_1_1.done; routes_1_1 = routes_1.next()) {
          var $route = routes_1_1.value;
          createRouteRecoed($route);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (routes_1_1 && !routes_1_1.done && (_a = routes_1.return)) _a.call(routes_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return routeMap;
      //递归遍历,编写路由定义时确保*在最后一个
      function createRouteRecoed(route, parent) {
        var keys = [];
        var path = path_1.normalizePath(route.path, parent);
        var componentName = route.component;
        var regex = path_to_regexp_1.default(path, keys);
        var record = {
          abstract: !!route.abstract,
          path: path,
          componentName: componentName,
          regex: regex,
          paramsName: keys.filter(function (key) {
            return !key.optional;
          }).map(function (key) {
            return key.name;
          })
        };
        if (parent) record.parentPath = parent.path;
        if (parent) record.parent = parent;
        routeMap.set(path, record);
        if (route.children) {
          record.children = route.children.map(function ($route) {
            return createRouteRecoed($route, record);
          });
        }
        return record;
      }
    }
    exports.default = default_1;

    /***/
  },

  /***/"./src/get-match.ts":
  /*!**************************!*\
    !*** ./src/get-match.ts ***!
    \**************************/
  /*! no static exports found */
  /***/function srcGetMatchTs(module, exports, __webpack_require__) {

    "use strict";

    var __values = this && this.__values || function (o) {
      var m = typeof Symbol === "function" && o[Symbol.iterator],
          i = 0;
      if (m) return m.call(o);
      return {
        next: function next() {
          if (o && i >= o.length) o = undefined;
          return { value: o && o[i++], done: !o };
        }
      };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    function matchRecord(path, routeRecord) {
      var e_1, _a;
      try {
        for (var _b = __values(routeRecord.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var paramPath = path;
          var record = _c.value;
          if (paramPath.split('/').length < record.path.split('/').length) {
            paramPath += '/0';
          }
          var matchVal = record.regex.exec(paramPath);
          if (matchVal) {
            var params = {};
            var componentNameList = getComponentNameList(record);
            for (var i = 0; i < record.paramsName.length; i++) {
              params[record.paramsName[i]] = matchVal[i + 1];
            }
            return { params: params, componentNameList: componentNameList, path: path, record: record };
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }
    exports.matchRecord = matchRecord;
    function getComponentNameList(record) {
      var componentNameList = [];
      recursiveRecord(record);
      return componentNameList;
      function recursiveRecord(record) {
        if (record.componentName) {
          componentNameList.unshift(record.componentName);
        }
        if (record.parent) recursiveRecord(record.parent);
      }
    }

    /***/
  },

  /***/"./src/index.ts":
  /*!**********************!*\
    !*** ./src/index.ts ***!
    \**********************/
  /*! no static exports found */
  /***/function srcIndexTs(module, exports, __webpack_require__) {

    "use strict";

    var __importDefault = this && this.__importDefault || function (mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var warn_1 = __webpack_require__( /*! ./utils/warn */"./src/utils/warn.ts");
    var const_1 = __webpack_require__( /*! ./utils/const */"./src/utils/const.ts");
    var router_1 = __importDefault(__webpack_require__( /*! ./router */"./src/router.ts"));
    function default_1(config) {
      if (!this) warn_1.error('this is not found');
      var __router = new router_1.default(config);
      var namespace = '$router';
      if (config && config.option && config.option.namespace) {
        namespace = config.option.namespace;
      }
      this[namespace] = {
        get currentPath() {
          return __router.currentPath;
        },
        get params() {
          return __router.params;
        },
        //方法
        get push() {
          return __router.push.bind(__router);
        },
        get replace() {
          return __router.replace.bind(__router);
        },
        get setBeforeChange() {
          return __router.setBeforeChange.bind(__router);
        },
        get setAfterChange() {
          return __router.setAfterChange.bind(__router);
        },
        get addParamsListener() {
          return __router.addParamsListener.bind(__router);
        },
        get removeParamsListener() {
          return __router.removeParamsListener.bind(__router);
        }
      };
      this[const_1.mountName] = __router;
    }
    exports.default = default_1;

    /***/
  },

  /***/"./src/router.ts":
  /*!***********************!*\
    !*** ./src/router.ts ***!
    \***********************/
  /*! no static exports found */
  /***/function srcRouterTs(module, exports, __webpack_require__) {

    "use strict";

    var __values = this && this.__values || function (o) {
      var m = typeof Symbol === "function" && o[Symbol.iterator],
          i = 0;
      if (m) return m.call(o);
      return {
        next: function next() {
          if (o && i >= o.length) o = undefined;
          return { value: o && o[i++], done: !o };
        }
      };
    };
    var __read = this && this.__read || function (o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
          r,
          ar = [],
          e;
      try {
        while ((n === undefined || n-- > 0) && !(r = i.next()).done) {
          ar.push(r.value);
        }
      } catch (error) {
        e = { error: error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    };
    var __importDefault = this && this.__importDefault || function (mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var warn_1 = __webpack_require__( /*! ./utils/warn */"./src/utils/warn.ts");
    var creat_route_map_1 = __importDefault(__webpack_require__( /*! ./creat-route-map */"./src/creat-route-map.ts"));
    var get_match_1 = __webpack_require__( /*! ./get-match */"./src/get-match.ts");
    var Router = /** @class */function () {

      function Router(config) {

        if (config === undefined) {
          config = {};
        }
        this.histry = [];
        this.registerComponents = new Map();
        this.routeRecord = new Map();
        this.waitCallComponents = [];
        this.onParamsHooks = new Map();
        this.__beforePathChange = null;
        this.__afterPathChange = null;
        this.currentPath = '';
        this.params = {};
        this.query = {};
        if (!config.routes) warn_1.error('not found routes in config');
        this.routeRecord = creat_route_map_1.default(config.routes);
        //不设置初始initPath的话，默认为 /
        var initPath = '/';
        if (config.option && config.option.initPath) initPath = config.option.initPath;
        this.push(initPath);
      }
      Router.prototype.__matchrouteRecord = function (path) {
        var e_1, _a;
        var result = get_match_1.matchRecord(path, this.routeRecord);
        //没有匹配到路由
        if (!result) {
          this.__clearComponentName();
          return;
        }
        this.waitCallComponents = result.componentNameList;
        try {
          //触发router-view变化
          for (var _b = __values(this.registerComponents.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var com = _c.value;
            var oldName = com.data.name;
            var newName = this.waitCallComponents.shift();
            com.setData({ name: newName });
            if (oldName !== newName) break;
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        this.currentPath = result.path;
        //触发路由参数变化
        this.__setParams(result.params);
      };
      Router.prototype.__clearComponentName = function () {
        var e_2, _a;
        if (this.registerComponents.size > 0) {
          try {
            for (var _b = __values(this.registerComponents.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
              var _com = _c.value;
              _com.setData({ name: null });
              break;
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        this.currentPath = '';
        this.__setParams(Object.create(null));
      };
      Router.prototype.__invokeBeforeHooks = function (nextPath) {
        if (this.__beforePathChange === null) return true;
        return this.__beforePathChange(this.currentPath, nextPath);
      };
      Router.prototype.__invokeAfterHooks = function () {
        if (this.__afterPathChange === null) return true;
        return this.__afterPathChange();
      };
      Router.prototype.__setCurrentPath = function (path) {
        this.currentPath = path;
      };
      Router.prototype.__setParams = function (params) {
        var e_3, _a;
        var oldParams = this.params;
        this.params = params;
        try {
          for (var _b = __values(this.onParamsHooks.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2),
                com = _d[0],
                methodName = _d[1];
            if (com) com[methodName](oldParams, params);
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
      };
      Router.prototype.registerComponent = function (_this) {
        var $id = _this.$id;
        if (this.waitCallComponents.length > 0) _this.setData({ name: this.waitCallComponents.shift() });
        this.registerComponents.set($id, _this);
      };
      Router.prototype.removeComponent = function (_this) {
        var $id = _this.$id;
        var success = this.registerComponents.delete($id);
        if (!success) warn_1.warn('delete router-view fail');
      };
      Router.prototype.go = function (n) {};
      Router.prototype.push = function (path) {
        if (!this.__invokeBeforeHooks(path)) return;
        path = this.getPathForAbstract(path);
        this.__matchrouteRecord(path);
        this.histry.push(path);
        this.__setCurrentPath(path);
        this.__invokeAfterHooks && this.__invokeAfterHooks();
      };

      Router.prototype.replace = function (path) {
        if (!this.__invokeBeforeHooks(path)) return;
        path = this.getPathForAbstract(path);
        this.__matchrouteRecord(path);
        this.histry.pop();
        this.histry.push(path);
        this.__setCurrentPath(path);
        this.__invokeAfterHooks && this.__invokeAfterHooks();
      };
      Router.prototype.getPathForAbstract = function (path) {
        var result = get_match_1.matchRecord(path, this.routeRecord);
        if (!result) {
          debugger;
        }
        var record = result.record;

        if (record.abstract == true && record.children && record.children.length) {
          var defaultChild = record.children.find(function (item) {
            return item.default;
          });
          if (!defaultChild) {
            defaultChild = record.children[0];
          }
          path = path.replace(new RegExp("^" + record.path), defaultChild.path);
          return path;
        }
        return path;
      };
      Router.prototype.setBeforeChange = function (_this, methodName) {
        if (_this === null) {
          this.__beforePathChange = null;
          return;
        }
        if (_this[methodName] instanceof Function) {
          this.__beforePathChange = _this[methodName].bind(_this);
        }
      };
      Router.prototype.setAfterChange = function (_this, methodName) {
        if (_this === null) {
          this.__afterPathChange = null;
          return;
        }
        if (_this[methodName] instanceof Function) {
          this.__afterPathChange = _this[methodName].bind(_this);
        }
      };
      Router.prototype.addParamsListener = function (_this, methodName) {
        if (_this[methodName] instanceof Function) {
          this.onParamsHooks.set(_this, methodName);
          return;
        }
        warn_1.warn(_this.is + ": can't found methor [" + methodName + "]");
      };
      Router.prototype.removeParamsListener = function (_this) {
        this.onParamsHooks.delete(_this);
      };

      return Router;
    }();
    exports.default = Router;

    /***/
  },

  /***/"./src/utils/const.ts":
  /*!****************************!*\
    !*** ./src/utils/const.ts ***!
    \****************************/
  /*! no static exports found */
  /***/function srcUtilsConstTs(module, exports, __webpack_require__) {

    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mountName = '__routerInstance';

    /***/
  },

  /***/"./src/utils/path.ts":
  /*!***************************!*\
    !*** ./src/utils/path.ts ***!
    \***************************/
  /*! no static exports found */
  /***/function srcUtilsPathTs(module, exports, __webpack_require__) {

    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    function cleanPath(path) {
      return path.replace(/\/\//g, '/');
    }
    exports.cleanPath = cleanPath;
    function normalizePath(path, parent) {
      if (!parent) return path;
      return cleanPath(parent.path + "/" + path);
    }
    exports.normalizePath = normalizePath;

    /***/
  },

  /***/"./src/utils/warn.ts":
  /*!***************************!*\
    !*** ./src/utils/warn.ts ***!
    \***************************/
  /*! no static exports found */
  /***/function srcUtilsWarnTs(module, exports, __webpack_require__) {

    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    function error(message) {
      throw new Error("[miniapp-router] " + message);
    }
    exports.error = error;
    function warn(message) {
      console.warn("[miniapp-router] " + message);
    }
    exports.warn = warn;

    /***/
  }

  /******/ });
//# sourceMappingURL=router.js.map