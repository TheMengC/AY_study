import {
    getCurrentPageName,
    getDeferred,
    isEmpty,
    isIOS,
    NOOP,
    Object_values,
    showConfirmModal
} from "mapp_common/utils";
import { qnapi } from "mapp_common/utils/qnapi";
import { api } from "mapp_common/utils/api";
import { storage } from "mapp_common/utils/storage";
import { getWindow } from "mapp_common/utils/window";
import { loading } from "mapp_common/utils/loading";
import { beacons, tradeBeacon } from "mapp_common/utils/beacon";
import { getCurrentVersionNum } from "mapp_common/utils/version";
import { isPaidVip } from "mapp_common/utils/userInfo";
import { getSettings } from "mapp_common/utils/settings";
import { ENV } from "@/constants/env";
import moment from "mapp_common/utils/moment";
import sqlHelper from "mapp_common/utils/sqlHelper";
import { Logger } from "mapp_common/utils/logger";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { getLastCloseTime } from "mapp_common/marketing/action";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { events } from "mapp_common/utils/eventManager";
import { getEntry } from "mapp_common/utils/entry";
import { checkNewUser } from 'mapp_common/utils/checkNewUser';
import { showErrorDialog } from "tradePublic/utils";
import { resetAuthorize } from "mapp_common/utils/resetAuthorize";

export {
    showConfirmModal,
    sqlHelper,
    moment,
    ENV,
    api,
    beacons,
    isEmpty,
    NOOP,
    isIOS,
    qnapi,
    getCurrentVersionNum,
    getWindow,
    storage,
    getDeferred,
    loading,
    tradeBeacon,
    getUserInfo,
    isPaidVip,
    getSettings,
    getCurrentPageName,
    getSystemInfo,
    getLastCloseTime,
    events,
    getEntry,
    checkNewUser,
    Logger,
    Object_values,
};
// debugger
/**
 * 上面这个神奇的debugger 不要小看了他
 * 有时候在tradePublic中有一些东西从这边export出来会莫名其妙出现undefined的问题
 * 如Logger
 * 这个时候就需要把上面这个debugger激活 然后在进小程序开发工具中进行调试
 * 调试这种错误 要先把devtools里面的sourcemap关掉 因为这个是一个引用错误 需要看到__webpack_require__这个函数的调用堆栈
 * 如 Logger失效了 需要在这边看上面对于mapp_common/utils/logger.js这个module 的__webpack_require__返回值是什么 理论上返回值对象内部的Logger应该是undefined
 * 接下来就查调用堆栈
 * 这种循环引用导致的导出常量失效通常是在`mapp_common/utils/logger.js`module 中 在定义Logger常量前引用了一些东西 导致Logger还没有完成定义的时候就调用到了这个文件
 * 这时候 我们查调用堆栈通常能查到`__webpack_require__('../mapp_common/utils/logger.js')` 就印证了我们上面的猜想 是因为Logger间接引用了这个文件导致的
 * 这个时候就把间接引用的这个地方给断掉 比如mapp_common/utils/logger.js->mapp_common/utils/api.js->tradePolyfill/index.js
 * 这时候就想办法让mapp_common/utils/logger.js不依赖mapp_common/utils/api.js 就可以了
 */


export const Tools = {
    toDoTranslate: resetAuthorize,
    api,
    beacons,
    isEmpty,
    NOOP,
    qnapi,
    getCurrentVersionNum,
    showErrorDialog,
    getWindow,
    storage,
    getDeferred,
    loading,
    tradeBeacon,
    getUserInfo,
    isPaidVip,
    getSettings,
    sqlHelper,
    Logger,
};

