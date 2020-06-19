
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { Logger } from "mapp_common/utils/logger";

/**
 * 跳转进入qap的页面
 * @param page
 * @param pageName
 */
export const goToQAP = ({  page, pageName, query }) => {
    if (!my.qn) {
        Logger.log('预览模式才能跳转');
    }
    let userInfo = getUserInfo();
    my.qn.navigateToQAP({
        url: 'qap:///index',
        title: pageName,
        query: {
            event: 'itemList',
            otherPage: page,
            authString: {
                taobao_user_nick: userInfo.nick,
                sub_taobao_user_nick: userInfo.sub_nick,
                taobao_user_id: userInfo.userId,
            },
            ...query
        },
        success(res) {
            Logger.log('跳转成功');
        },
        fail(res) {
            Logger.error('跳转失败', res);
        }
    });
};