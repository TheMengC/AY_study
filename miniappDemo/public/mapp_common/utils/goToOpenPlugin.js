import { Logger } from "mapp_common/utils/logger";
/** 
 * 打开小程序插件的方法
 * appkey 默认商品
 * category 
 * param {}
 * appParam {}
 * directPage {}
*/
export const goToOpenPlugin = ({appkey='21085832',category,param,appParam,directPage}) => {
    if (!my.qn) {
        Logger.log('预览模式才能跳转');
    }
    my.qn.openPlugin({
        appkey,
        category,
        param:JSON.stringify(param),
        appParam:JSON.stringify(appParam),
        directPage:JSON.stringify(directPage),
        // 
        success:(res)=>{
            Logger.log('跳转插件成功！跳转参数:',...arguments);
        },
        fail:(err)=>{   
            Logger.error('跳转插件失败！跳转参数:',...arguments);
        }
    })
}