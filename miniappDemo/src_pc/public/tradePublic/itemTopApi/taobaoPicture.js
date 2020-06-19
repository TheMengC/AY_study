import { NOOP, isEmpty, consoleLogger,getUserInfo } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse, integrationDate } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import {showModal} from "tradePublic/itemDetail/common.js";

let defaultPicturecategoryMethod = 'taobao.picture.category.get';
let defaultPicturegetMethod = 'taobao.picture.get';
let defaultPictureuserinfoMethod = 'taobao.picture.userinfo.get';
let defaultTaobaoPictureUpload = 'taobao.picture.upload';

/**
 * 图片空间 获取图片一级or二级分类信息
 * @param parent_id 取二级分类时设置为对应父分类id 取一级分类时父分类id设为0 取全部分类的时候不设或设为-1
 * @param extraArgs
 * @param callback
 * @param errCallback
 */
export function taobaoPictureCategoryGet ({parent_id = 0, extraArgs = {}, callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: defaultPicturecategoryMethod,
        params: {
            parent_id,
            ...extraArgs
        },
        callback: res => {
            res = resolveTopResponse(res);
            if(!isEmpty(res.picture_categories) && isEmpty(res.picture_categories.picture_categorie)){
                let newPictureCategorie = integrationDate(res,'picture_categorie',false);
                res.picture_categories = newPictureCategorie.picture_categories;
            }
            callback(res);
        },
        errCallback: errCallback,
    });
}


/**
 * 图片空间 获取该类目下图片信息
 * @param picture_category_id 图片分类ID
 * @param page_no
 * @param page_size
 * @param extraArgs
 * @param callback
 * @param errCallback
 */
export function taobaoPictureGet ({picture_category_id, page_no = 1, page_size = 20, extraArgs = {}, callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: defaultPicturegetMethod,
        params: {
            picture_category_id,
            page_no,
            page_size,
            ...extraArgs
        },
        callback: res => {
            res = resolveTopResponse(res);
            if(!isEmpty(res.pictures) && isEmpty(res.pictures.picture)){
                let newPicture = integrationDate(res,'picture',false);
                res.pictures = newPicture.pictures;
            }
            callback(res);
        },
        errCallback: errCallback,
    });
}

/**
 * 图片空间 查询图片空间用户的信息
 * @param callback
 * @param errCallback
 */
export function taobaoPictureUserInfoGet ({callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: defaultPictureuserinfoMethod,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * qap之前使用的上传图片空间淘宝接口
 * @export
 * @param {*} {params={}, callback = NOOP, errCallback = handleError }
 */
export function taobaoPictureUpload ({params={}, callback = NOOP, errCallback = handleError }){
    qnRouter({
        api: defaultTaobaoPictureUpload,
        params: params,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

/**
 * 手机小程序使用的上传图片空间接口
 * @export
 * @param {*} {params={}, callback = NOOP, errCallback = handleError }
 */
export function taobaoPictureUploadByMiniMobile ({params={}, callback = NOOP, errCallback = handleError }){
    let date = new Date();
    let getTime = date.getTime() + Math.round(Math.random() * 10000);
    let requestParam = {
        accessToken: getUserInfo().accessToken,
        pictureCategoryId: 0,
        imageInputTitle: `${getTime}.png`,
    };
    Object.assign(requestParam,params);
    my.qn.uploadToPicSpace({
        ...requestParam,
        success: (res) => {
            callback(resolveTopResponse(res));
        },
        fail: (errorInfo) => {
            consoleLogger.error(`taobaoPictureUploadByMiniMobile-fail:requestParam ${JSON.stringify(requestParam)} ,errorInfo:`,errorInfo);
            showModal({
                showCancel:false,
                content:'上传到图片空间失败！'+JSON.stringify(errorInfo),
            })
            errCallback(errorInfo);
        }
    })
}
