import { getSettings, isEmpty, NOOP, Tools } from "tradePolyfills";
import { pgApiHost } from "tradePublic/tradeDataCenter/consts";

import { apiDied, apiRespawned, changeNeedSyncStatus } from "tradePublic/tradeDataCenter/action";

import { TdcLogger } from "tradePublic/tradeDataCenter/common/tdcLogger";
import { showErrorDialog } from "tradePublic/utils";

export function pgApi (
    {
        api,
        args = {},
        callback = NOOP,
        errCallback = NOOP,
    }) {
    let host = pgApiHost;
    if (getSettings().tradeListErrorMock === 1) {
        host += 1;
    }
    if (getSettings().nickMock.enabled) {
        host = '//java.aiyongbao.com';
        args.corpId = getSettings().nickMock.sellerId;
        args.sellerId = getSettings().nickMock.sellerId;
        args.userId = getSettings().nickMock.sellerId;
        args.listId = getSettings().nickMock.sellerId % 1000;
        args.nick = getSettings().nickMock.nick;
        args.isVip = 1;
    }

    Tools.api({
        host: host,
        apiName:api.apiName,
        method: api.url,
        timeout: api.requestTimeout * 1000,
        mode: 'json',
        isloading: false,
        args: args,
        callback: (res) => {
            if (res.code > 200) {
                handleError(res);
                return;
            }
            TdcLogger.info(api.url, args, res);
            if (api.trying == true) { // 试了一下 api居然复活了！ 通知下redux
                apiRespawned(api.key);
                api.trying = false;
            }
            callback(res);
        },
        errCallback: (err) => {
            handleError(err);
        },
    });

    function handleError (err) {
        TdcLogger.error(api.url, args, err);
        if (!err || err.code == 500 || isEmpty(err.code)) {
            !err && (err = {});
            err.code = 500;
            api.enabled = false;
            api.trying = false;
            // 在10秒后重试
            switch (err.sub_code) {
                case 10004:// 用户拉单未完成 显示进度条
                    changeNeedSyncStatus(true);
                    break;
                case 20003: // 用户登录过期 提示重新登录
                    showErrorDialog('温馨提示', '当前登录失效，合单、高级搜索等功能无法使用，请重新登录');
                    break;
                case 20004:// 去授权
                    Tools.toDoTranslate();
                    break;
                default:
                    apiDied(api.key);
                    api.timeoutTimer = setTimeout(() => {
                    // 打开调用开关 并将trying置true 在调通了以后 如果当时trying为true 则会向redux发送api复活的消息
                        api.enabled = true;
                        api.trying = true;
                    }, api.fallbackTimeout * 1000);
                    break;
            }
        }
        errCallback(err);
    }

}
