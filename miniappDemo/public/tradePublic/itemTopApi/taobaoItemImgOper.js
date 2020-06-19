import { NOOP } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { qnRouter } from "tradePublic/qnRouter";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";

let defaultImgDeleteQuery = 'taobao.item.img.delete';
let defaultImgUpdateQuery = 'taobao.item.img.upload';
let defaultImgJointQuery = 'taobao.item.joint.img';

/**
 * 对商品主图(子图)操作类
 * 如删除主图,更新主图,添加主图
 * @param numIid
 * @param id
 * @param isSixthPic
 * @param status delete/update/join
 * @param image
 * @param isMajor 主图
 * @param picPath 
 * @param callback
 * @param errCallback
 */
export function taobaoItemImgOper ({numIid, id = undefined, isSixthPic = 'false', status, image = undefined, isMajor = 'false', picPath = undefined,callback = NOOP, errCallback = handleError }) {
    let queryTmp = {};
    let method = defaultImgUpdateQuery;
    queryTmp.num_iid = numIid;
    switch (status) {
        //删除
        case 'delete': {
            method = defaultImgDeleteQuery;
            if (id != 99) {
                queryTmp.id = id;
            }
            queryTmp.is_sixth_pic = isSixthPic;
            break;
        }
        //替换
        case 'update': {
            method = defaultImgUpdateQuery;
            if (id) {
                queryTmp.id = id;
            }
            queryTmp.image = image;
            queryTmp.is_major = isMajor;
            break;
        }
        //添加
        case 'join': {
            method = defaultImgJointQuery;
            if (id) {
                queryTmp.id = id;
            } else {
                delete queryTmp.id;
            }
            queryTmp.pic_path = picPath;
            queryTmp.is_major = isMajor;
            break;
        }
        default:
            break;
    }
    qnRouter({
        api: method,
        params: queryTmp,
        callback: res => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback,
    });
}

export function taobaoItemImgCustomOper({params, callback = NOOP, errCallback = handleError}){
    if(params.status == 'delete'){
        params.method = defaultImgDeleteQuery;
    }else{
        params.method = defaultImgJointQuery;
    }
    qnRouter({
        api: params.method,
        params: params,
        callback: (res) => {
            callback(resolveTopResponse(res));
        },
        errCallback: errCallback
    });
}