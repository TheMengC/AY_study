import { NOOP } from "tradePolyfills";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
//  跳小程序其他插件
//  appid  插件id
export  const navigateToMiniProgram=({ appId="7704034",extraData={},callback=NOOP,errorcallback=handleError})=>{
    my.navigateToMiniProgram({
        appId,
        extraData,
        success: (res) => {
			callback(res)
        },
        fail: (res) => {
			errorcallback(res)
        }
    });
}
