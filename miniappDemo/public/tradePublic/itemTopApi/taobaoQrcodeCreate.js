import { NOOP, api } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { qnRouter } from "tradePublic/qnRouter";


/**
 * 创建码平台常用二维码 
 * @param type 要制作的二维码业务类型：page:无线页面类型item:宝贝ID类型url:普通的URL连接类型shop:店铺ID类型
 * @param content 二维码的内容之一，由type决定：type=page时，content传入无线页面的URL连接内容；type=item时，content传入宝贝数字ID；type=url时，content传入普通的URL连接内容；type=shop时，content传入店铺ID
 * ... https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.fff7669aS3IsDI&source=search&docId=23660&docType=2
 * @param callback
 * @param errCallback
 */
export function taobaoQrcodeCreate ({ type = 'item',content, name = 'aiyongbao', style = '000000', size = '125', channel_name = '爱用商品', callback = NOOP, errCallback = handleError }) {
    qnRouter({
        api: 'taobao.ma.qrcode.common.create',
        params: {
            type: type,
            content: content,
            name: name,
            style: style,
            size: size,
            channel_name: channel_name
        },
        callback: res => {
            res = resolveTopResponse(res);
            if(res.modules.qrcode_d_o){
                res.modules = res.modules.qrcode_d_o;
            }
            callback(res);
        },
        errCallback: errCallback,
    });
}