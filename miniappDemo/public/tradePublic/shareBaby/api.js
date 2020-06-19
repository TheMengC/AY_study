import {api, NOOP, showConfirmModal, hideLoading} from 'tradePolyfills';
// import { hideLoading } from "mapp_common/utils/loading";
// 存储ump分享宝贝的信息
export  function updateUmpShareDetail ({num_iid, callback = NOOP, errorCallback = NOOP}) {
    api({
        apiName:'aiyong.item.ump.share.detail.update',
        args: {num_iid:num_iid},
        callback: (res) => {
            callback(res);
        },
        errCallback: (err) => {
            errorCallback(err)
        }
    
    })
};

/**
 * 生成分享宝贝的二维码图片 并下载至本地
 * @param {*} params 
 * @param {*} callback 
 * @param {*} errorCallback 
 */
export  function shareBabyimgCon (params, callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.item.shareditem.QRcode.info.get',
        args: params,
        callback: (datas) => {
            console.log('datas',datas)
            if(datas.type == 'success' && datas.url){
                hideLoading();
                my.saveImage({
                    url: datas.url,
                    showActionSheet: true,
                    success: (res) => {
                        callback(res);
                    }
                })
            }else{
                callback();
                showConfirmModal({
                    title: '温馨提示',
                    content: datas.error && datas.error.sub_msg?datas.error.sub_msg:'图片下载失败',
                    showCancel: false,
                });
            }
        },
        errCallback: (err) => {
            errorCallback(err)
            showConfirmModal({
                title: '温馨提示',
                content: '图片下载失败',
                showCancel: false,
            });
        }
    
    })
}