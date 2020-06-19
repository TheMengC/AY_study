import { api,
    Logger,
    getCurrentPageName,
    getSettings,
    getSystemInfo,
    getWindow,
    isEmpty,
    Tools, showConfirmModal } from 'tradePolyfills';
// import {addOrderWatcher} from 'components/addOrderWatcher/index';
import { aiyongGetLogisticsCompanyByCode,
    aiyongGetLogisticsCompanyByName, } from "tradePublic/taobaoLogisticsCompaniesGet";

import qnRouter from "tradePublic/qnRouter";

import { addOrderWatcher } from "tradePublic/addOrderWatcher";
import { showErrorDialog } from "tradePublic/utils";

/**
 * 统一发货接口
 * @Author ZW
 * @date   2018-01-09T15:21:35+0800
 * @param  {object}                 options.query       参数
 * @param  {string}                 options.sendType    发货类型  [dummy, online, offline]
 * @param  {func  }                 options.callback    回调
 * @param  {func  }                 options.errCallback 错误回调
 * @param  {Boolean}                options.isCod       是否货到付款订单
 * @param  {string}                 options.type        发货形式  [batchSend, signleSend, autoSend]
 * @param  {string}                 options.webpage     发货的页面，存库用
 */

// 发货API
const sendApi = {
    'dummy': 'taobao.logistics.dummy.send',
    'online': 'taobao.logistics.online.send',
    'offline': 'taobao.logistics.offline.send',
};

/**
 * 单笔发货 带保存发货信息
 * @param query
 * @param sendType
 * @param callback
 * @param errCallback
 * @param isCod
 * @param type
 * @param webpage
 * @param isMerge
 */
function taobaoLogisticsSend ({ query, sendType, callback, errCallback, isCod = false, type, isMerge = false }) {

    /**
	 * 我实在搞不懂这个命名了。。就这样吧。。凑合用
	 */
    if (isEmpty(query.company_name) && !isEmpty(query.companyName)) {
        query.company_name = query.companyName;
    }
    delete query.companyName;
    // 匹配发货API
    let currentApi = sendApi[sendType];
    if (currentApi == undefined) {
        // 不存在的发货api
        if (errCallback) {
            errCallback('无效的发货方式');
        } else {
            showErrorDialog('温馨提示', '发货失败，请稍候再试！', '无效的发货方式');
        }
    } else {
        // 发货了发货了
        let finalSend = (q) => {
            ((newQ) => {
                Logger.log('%c发货参数', "background-color:#e6bb1e;color:#FFF", newQ, 'api:' + currentApi);
	            if (getSettings().editApiTest == 1) {
		            Tools.loading('hide');
                    showConfirmModal({
                        title: '警告',
                        content: '当前处于虚拟发货状态' + JSON.stringify(newQ),
                        showCancel: false,
                        onConfirm: callback,
                    });
		            return ;
	            }

	            qnRouter({
                    api: currentApi,
                    params: newQ,
                    pgSaveDisabled: isMerge,
                    callback: (rsp) => {
                        callback(rsp);

                        // 判断是否是 货到付款 的订单  货到付款由于订单状态不是立即改变，不用记录到爱用已发货
                        if(!isCod) {
                            api({
                                apiName:'aiyong.trade.order.send.log.save',
                                method: '/iytrade2/saveSendInfo',
                                mode: 'jsonp',
                                args: {
                                    tid            : newQ.tid,                                 // 订单号
                                    courier_number : newQ.out_sid,                             // 运单号
                                    is_split       : newQ.is_split,                            // 是否拆单
                                    company_code   : newQ.company_code,                        // 物流公司code
                                    sendcmd        : currentApi,                                // 调用的接口
                                    feature        : newQ.feature ? newQ.feature : '',        // 手机类目号（针对电子产品）
                                    type           : type,                                      // 单发or批量or自动
                                    webpage        : getSystemInfo().platform + getCurrentPageName(),                           // 发货页面
                                },
                            });
                        }
                    },
                    errCallback: (error) => {
                        if (errCallback) {
                            errCallback(error);
                        } else {
                            showErrorDialog('温馨提示', '发货失败，请稍候再试！', JSON.stringify(error));
                        }
                    },
                });
            })(JSON.parse(JSON.stringify(q)));
        };

	    if (sendType == 'dummy') { // 无需物流发货
		    finalSend(query);
		    return;
	    }
	    // 此处搜索了淘宝的code和菜鸟的code
	    let company1 = aiyongGetLogisticsCompanyByCode(query.company_code);
	    let company2 = aiyongGetLogisticsCompanyByName(query.company_name);
	    if (!isEmpty(company1) && !isEmpty(company2) && JSON.stringify(company1) == JSON.stringify(company2)) {
		    // 完全正常 按正常淘宝code发货
		    query.company_code = company1.code;
		    Logger.log("发货校验通过");
		    finalSend(query);
	    } else if (query.company_code == query.company_name) {  // 如果code和name是一样的 说明是其他物流公司
		    if (company2 == undefined && company1 == undefined) {// 如果两个都没有匹配到 就说明真的是其他 而不是在其他里面填中通快递这样的智障用户
			    Logger.log('其他物流发货', query);
			    finalSend(query);
		    }else{// 有一个快递公司匹配到了 就说明是在其他里面填我们表中已存在的快递公司的智障用户
			    let company = company1 == undefined ? company2 : company1;
			    query.company_code = company.code;
			    Logger.log('其他物流匹配到了存在的公司发货', query);
			    finalSend(query);
		    }

	    } else{
		    Tools.loading('hide');
		    showErrorDialog('温馨提示', '发货失败，请稍候再试！', '发货信息比对失败！' + 'query:' + JSON.stringify(query) + '\ncompany1:' + JSON.stringify(company1) + '\ncompany2:' + JSON.stringify(company2));
	    }

    }
}
// 虚拟发货 如果editApiTest是1 就虚拟发货
getWindow().sendTest = (param) => {
    switch (param) {
        case 1:
            Logger.log("进入虚拟发货模式");
            getSettings().editApiTest = 1;
            break;
        case 0:
            Logger.log("进入正常发货模式");
            getSettings().editApiTest = 0;
            break;
        default:Logger.log("输入错误");
    }
};




export default taobaoLogisticsSend;
