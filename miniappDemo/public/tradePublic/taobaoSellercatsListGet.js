import qnRouter from "tradePublic/qnRouter";
import { NOOP} from "tradePolyfills/index";
import { resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 获取商品类目
 * @param query
 * @param callback
 * @param errCallback
 */
function taobaoSellercatsListGet ({ query = {}, callback = NOOP, errCallback = undefined }) {
    qnRouter({
        api:'taobao.sellercats.list.get',
        params:query,
        callback:(rsp) => {
            callback(resolveTopResponse(rsp));
        },
        errCallback:(error) => {
            if (errCallback) {
                errCallback(error);
            } else {
                showErrorDialog('温馨提示', '获取商品类名，请稍候再试！', JSON.stringify(error));
            }
        },
    });
}

export default taobaoSellercatsListGet;
