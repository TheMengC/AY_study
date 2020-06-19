"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkMystdtemplatesOver = undefined;

/**
 * 确保用户所有快递的自定义区模板信息获取完成，缓存可用
 * @returns {Promise<void>}
 */
var checkMystdtemplatesOver = exports.checkMystdtemplatesOver = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return mystdtemplatesGetPromise;

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function checkMystdtemplatesOver() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * 根据物流公司编码和标准模板的url获取对应自定义区模板信息
 * @param cp_code
 * @param template_id
 * @returns {[*]|*[]|string|string}
 */


exports.getTemplateIdByUrl = getTemplateIdByUrl;
exports.cainiaoCloudprintMystdtemplatesGet = cainiaoCloudprintMystdtemplatesGet;
exports.getMystdtemplateByUrl = getMystdtemplateByUrl;

var _cache = require("./utils/cache.js");

var _qnRouter = require("./qnRouter.js");

var _qnRouter2 = _interopRequireDefault(_qnRouter);

var _resolveTopResponse = require("./tradeDataCenter/common/resolveTopResponse.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mystdtemplatesGetPromise = void 0;

function getTemplateIdByUrl(url) {
  return url.match(/[0-9]+/)[0];
}

/**
 * 获取用户所有快递的自定义区模板信息
 */
function cainiaoCloudprintMystdtemplatesGet() {
  mystdtemplatesGetPromise = new Promise(function (resolve, reject) {
    (0, _qnRouter2.default)({
      api: 'cainiao.cloudprint.mystdtemplates.get',
      callback: function callback(rsp) {
        rsp = (0, _resolveTopResponse.resolveTopResponse)(rsp);
        var userTemplatesIndexedByCpCode = {};
        if (rsp.result.success) {
          // let mystdtemplates =
          (0, _resolveTopResponse.getArrayInWrapper)(rsp.result.datas).map(function (cpValue) {
            var cp_templates = {};
            (0, _resolveTopResponse.getArrayInWrapper)(cpValue.user_std_templates).forEach(function (templateValue) {
              var std_template_id = getTemplateIdByUrl(templateValue.user_std_template_url);
              if (!cp_templates[std_template_id]) {
                cp_templates[std_template_id] = {
                  std_template_id: std_template_id,
                  std_template_url: templateValue.user_std_template_url,
                  user_templates: []
                };
              }
              delete templateValue.keys;
              delete templateValue.user_std_template_url;
              cp_templates[std_template_id].user_templates.push(templateValue);
            });
            userTemplatesIndexedByCpCode[cpValue.cp_code] = cp_templates;
          });
          console.log(userTemplatesIndexedByCpCode);

          resolve(userTemplatesIndexedByCpCode);

          // let mystdtemplates_promise_arr = [];
          //
          // mystdtemplates.forEach((cpValue) => {
          //     cpValue.cp_templates.forEach((templateValue) => {
          //         templateValue.template_content.forEach((contentValue) => {
          //             mystdtemplates_promise_arr.push(new Promise((resolve, reject) => {
          //                 qnRouter({
          //                     api: 'cainiao.cloudprint.customares.get',
          //                     params: { template_id:contentValue.user_std_template_id },
          //                     callback: (rsp) => {
          //                         resolveTopResponse(rsp);
          //                         if(rsp.result.success) {
          //                             contentValue.custom_area_result = rsp.result.datas.custom_area_result;
          //                             resolve('ok');
          //                         } else {
          //                             reject('error');
          //                         }
          //                     },
          //                     errCallback: () => {
          //                         reject('error');
          //                     },
          //                 });
          //             }));
          //
          //         });
          //     });
          // });
          //
          // Promise.all(mystdtemplates_promise_arr).then(() => {
          //     storage.setItem('cainiaoCloudprintMystdtemplates', JSON.stringify(mystdtemplates));
          //     resolve('ok');
          // });
        }
      },
      errCallback: function errCallback() {
        reject('error');
      }
    });
  });
  return mystdtemplatesGetPromise;
}function getMystdtemplateByUrl(cp_code, template_id) {
  var mystdtemplates = (0, _cache.getLocalStorageAndParse)('cainiaoCloudprintMystdtemplates', {});
  var mystdtemplates_cp_code = mystdtemplates.find(function (value) {
    return value.cp_code == cp_code;
  });

  if (mystdtemplates_cp_code) {
    var mystdtemplates_template_url = mystdtemplates_cp_code.cp_templates.find(function (value) {
      return value.template_id == template_id;
    });

    if (mystdtemplates_template_url) {
      return mystdtemplates_template_url.template_content;
    } else {
      return [];
    }
  } else {
    return [];
  }
}