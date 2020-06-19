import { NOOP } from "tradePublic/consts";
import { api, ENV, getUserInfo } from "tradePolyfills";
import { qnRouter } from "tradePublic/qnRouter";
import { getArrayByKey, resolveTopResponse } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { INTERCEPT_SWITCH_DATASOURCE } from "tradePublic/intercept/consts";

// 获取差评拦截中的旺旺黑名单
export function getInterceptBlackList (page_no, callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.blacklist.get',
        host: ENV.hosts.trade,
        method: '/iytrade2/getaddBlack',
        args: { page_no },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

let isWwBlackListInterceptOn = false; // 旺旺黑名单拦截是否开启
let isGetInterceptStatus = false; // 是否获取过拦截状态

/**
 * 获取旺旺黑名单拦截的开启状态
 * @return {Promise<unknown>}
 */
export function getWwblackListInterceptStatus () {
    return new Promise((resolve, reject) => {
        if (!isGetInterceptStatus) {
            getInterceptStatus((res) => {
                isGetInterceptStatus = true;
                if (res.denfenon && res.switchArr.handon.checked) {
                    isWwBlackListInterceptOn = true;
                }
                resolve(isWwBlackListInterceptOn);
            });
        }else{
            resolve(isWwBlackListInterceptOn);
        }
    });
}

// 差评拦截中的添加旺旺黑名单
export function addInterceptBlackOrWhiteList (nicks, reason, type, callback = NOOP, errorCallback = NOOP) {
    let reasonLog = type == 'black' ? '旺旺黑名单：' + reason : '旺旺白名单' + reason;
    api({
        apiName:'aiyong.trade.order.defence.blacklist.add',
        host: ENV.hosts.trade,
        method: '/iytrade2/saveblaNick',
        args: {
            nicks,
            reason,
            type,
            reasonLog,
            operator: getUserInfo().subUserNick || getUserInfo().userNick,
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取差评拦截中的旺旺白名单
export function getInterceptWhiteList (page_no, callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.whitelist.add',
        method: '/iytrade2/getaddWhil',
        args: { page_no },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 删除差评拦截中的旺旺白名单或者黑名单
export function delInterceptBlackOrWhiteList (buyernick, type, callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.blacklist.remove',
        host: ENV.hosts.trade,
        method: '/iytrade2/delblackbynick',
        args: {
            nicks: buyernick,
            type,
            reasonLog: (type == 'white' ? '旺旺白名单：' : '旺旺黑名单：') + '删除【' + buyernick + '】',
            operator: getUserInfo().subUserNick || getUserInfo().userNick,
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}
/**
 * 批量移除黑名单
 * @Author ZW
 * @date   2020-03-31T16:09:49+0800
 * @param  {Array}                  options.nickList    黑名单nick数组
 * @param  {Function}               options.callback    成功回调
 * @param  {Function}               options.errCallback 失败回调
 */
export function batchDelBlackListApi ({ nickList = [], callback = NOOP, errCallback = NOOP }) {
    api({
        apiName:'aiyong.trade.order.defence.blacklist.batchdelete',
        host: ENV.hosts.trade,
        method: '/iytrade2/batchDelBlackList',
        args: {
            nicks: nickList,
            operator: getUserInfo().subUserNick || getUserInfo().userNick,
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// 获取宝贝白名单
export function getInteceptBabyList (callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.itemwhitelist.get',
        method: '/Iytrade2/getbabylist',
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 移除宝贝白名单
export function delInterBabyList (item, callback = NOOP, errorCallback = NOOP) {
    let operator = getUserInfo().subUserNick || getUserInfo().userNick;
    api({
        apiName:'aiyong.trade.order.defence.itemwhitelist.delete',
        method: '/iyprint2/delwhite',
        args: {
            num_id:item.num_id,
            reasonLog:'宝贝白名单：移除【' + item.title + '】',
            operator,
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 添加出售中的宝贝
export function addBabylist (item, callback = NOOP, errorCallback = NOOP) {
    let remark = getUserInfo().subUserNick || getUserInfo().userNick;
    api({
        apiName:'aiyong.trade.order.defence.itemwhitelist.add',
        host: ENV.hosts.trade,
        method: '/defence/addBabylist',
        args: {
            title: item.title,
            imgurl: item.pic_url,
            num_id: item.num_iid,
            remark : '赵东浩的测试店铺',  // 操作人
            reasonLog:'宝贝白名单：添加【' + item.title + '】',
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取差评拦截中的拦截记录
export function getInterceptRecord (page_no, callback = NOOP, errorCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.log.get',
        method: '/Iytrade2/getblacklist',
        args: { page_no },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errorCallback(err);
        },
    });
}

// 获取检测订单状态的数据
export function getallstartcondition (callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.scandata.get',
        method: '/defence/suspected',
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

/**
 * 获取收件人拦截列表
 * @param pageno 页码
 * @param callback
 * @param errCallback
 */
export function interceptReceiversGet ({ pageno = 1, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.trade.order.defence.settings.bytype.get',
        method: '/iytrade2/gettype',
        args: {
            pageno,
            type: 'con',
        },
        callback: (res) => {
            callback(res);
        },
        errCallback: errCallback,
    });
}

/**
 * 添加需要拦截的收件人
 * @param name
 * @param phone
 * @param tel
 * @param addr
 * @param reason
 */
export function interceptReceiversAdd ({ name = '', phone = '', tel = '', addr = '', reason = '', callback = NOOP, errCallback = NOOP }) {
    let operator = getUserInfo().subUserNick || getUserInfo().userNick;
    api({
        apiName:'aiyong.trade.order.defence.receiveinfointercept.add',
        method: '/iytrade2/savetype',
        args: {
            name,
            phone,
            tel,
            addr,
            reason,
            operator,
            reasonLog: `收件人拦截：添加【${name}，${phone}，${tel}，${addr}】拉黑原因：${reason}`,
            type: 'con',
        },
        callback: (res) => {
            if (res === 1) {
                callback(res);
            } else{
                errCallback(res);
            }
        },
        errCallback: errCallback,
    });
}

/**
 * 删除收件人拦截信息
 * @param data interceptReceiversGet接口返回的res的item
 * @param callback
 * @param errCallback
 */
export function interceptReceiverRemove ({ data, callback = NOOP, errCallback = NOOP }) {
    let operator = getUserInfo().subUserNick || getUserInfo().userNick;
    api({
        apiName:'aiyong.trade.order.defence.blacklist.remove',
        method: '/iytrade2/delblackbynick',
        args: {
            nicks: data.id,
            type: 'con',
            operator,
            reasonLog: `收件人拦截：删除【${data.bname}，${data.phone}，${data.tel}，${data.addr}】`,
        },
        callback: (res) => {
            if (res === 1) {
                callback(res);
            } else{
                errCallback(res);
            }
        },
        errCallback: errCallback,
    });
}

/**
 * 获取区域拦截列表
 * @param pageno 页码
 * @param callback
 * @param errCallback
 */
export function interceptRegionsGet ({ pageno = 1, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.trade.order.defence.settings.bytype.get',
        method: '/iytrade2/gettype',
        args: {
            pageno,
            type: 'area',
        },
        callback: (res) => {
            callback(res);
        },
        errCallback: errCallback,
    });
}

/**
 * 删除区域拦截信息
 * @param data interceptReceiversGet接口返回的res的item
 * @param callback
 * @param errCallback
 */
export function interceptRegionRemove ({ data, callback = NOOP, errCallback = NOOP }) {
    let operator = getUserInfo().subUserNick || getUserInfo().userNick;
    api({
        apiName:'aiyong.trade.order.defence.blacklist.remove',
        method: '/iytrade2/delblackbynick',
        args: {
            nicks: data.id,
            type: 'area',
            operator,
            reasonLog: `收件人拦截：删除【${data.shen}，${data.shi}，${data.qu}】`,
        },
        callback: (res) => {
            if (res === 1) {
                callback(res);
            } else{
                errCallback(res);
            }
        },
        errCallback: errCallback,
    });
}

/**
 * 添加需要拦截的区域
 * @param name
 * @param phone
 * @param tel
 * @param addr
 * @param reason
 */
export function interceptRegionsAdd ({ province = '', city = '', country = '', reason = '', zip = '', callback = NOOP, errCallback = NOOP }) {
    let operator = getUserInfo().subUserNick || getUserInfo().userNick;
    api({
        apiName:'aiyong.trade.order.defence.receiveinfointercept.add',
        method: '/iytrade2/savetype',
        args: {
            shen: province,
            shi: city,
            qu: country,
            reason,
            operator,
            zip,
            reasonLog: `区域拦截：添加【${province}，${city}，${country}】拉黑原因：${reason}`,
            type: 'area_set',
        },
        callback: (res) => {
            if (res === '1添加成功') {
                callback(res);
            } else{
                errCallback(res);
            }
        },
        errCallback: errCallback,
    });
}

// PC获取差评拦截的开关状态
export function getInterceptStatus (callback = NOOP, errCallback = NOOP) {
    let obj = JSON.parse(JSON.stringify(INTERCEPT_SWITCH_DATASOURCE));
    api({
        apiName:'aiyong.trade.order.defence.summary.get',
        method: '/defence/getsummary',
        callback: rsp => {
            // callback(rsp);
            if (rsp) {
                let switchArr = obj.switchArr;
                // 订单件数小于(开关和数据) || 一个订单中同一个宝贝购数小于(开关和数据)
                if (!rsp.carnumless || !rsp.babynumless) {
                    rsp.carnumless = "off;5";
                }
                Object.keys(switchArr).forEach((item, index) => {
                    // 关键字返回的数据与其他返回值不同，所以要做特殊处理
                    if (item != 'conditions') {
                        if (rsp[item].indexOf('on') > -1) {
                            switchArr[item].type != 'no' && obj.modeNum[switchArr[item].type]++;
                            switchArr[item].checked = true;
                        } else {
                            switchArr[item].checked = false;
                        }
                    } else {
                        let conditionsArr = rsp.conditions.split('|Y|');
                        if(conditionsArr[0] == "on") {
                            obj.modeNum.relaxNum++;
                            switchArr[item].checked = true;
                        }else{
                            switchArr[item].checked = false;
                        }
                    }

                });

                let bigmoneyArr = rsp.bigmoney.split(';');       // 订单金额大于(开关和数据)
                let bigmoney = bigmoneyArr[1] || '1000';     // 订单金额大于数据
                let isHasPostfeeMore = bigmoneyArr[2] || true;  // 订单金额大于(含运费不含运费的标志)
                let carnumlessArr = rsp.carnumless ? rsp.carnumless.split(';') : "off;5".split(';');   // 订单件数小于(开关和数据)
                let carnumless = carnumlessArr[1] || '5';            // 订单件数小于数据
                let carnumArr = rsp.carnum.split(';');                   // 订单件数大于(开关和数据)
                let carnum = carnumArr[1] || '10';                   // 订单件数大于数据
                let smallmoneyArr = rsp.smallmoney.split(';');           // 订单金额小于(开关和数据)
                let smallmoney = smallmoneyArr[1] || '10';           // 订单金额小于数据
                let isHasPostfeeLess = smallmoneyArr[2] || true;         // 订单金额小于(含运费不含运费的标志)
                let babynumlessArr = rsp.babynumless ? rsp.babynumless.split(';') : "off;5".split(';');  // 一个订单中同一个宝贝购数小于(开关和数据)
                let babynumless = babynumlessArr[1] || '5';           // 一个订单中同一个宝贝购数小于数据
                let babynumArr = rsp.babynum.split(';');                  // 一个订单中同一个宝贝购数大于(开关和数据)
                let babynum = babynumArr[1] || '15';                  // 一个订单中同一个宝贝购数大于数据
                let conditionsArr = rsp.conditions.split('|Y|');          // 关键字开关和内容
                let conditions = conditionsArr[1];                    // 关键字内容
                let sellernote = Number(rsp.sellernote);                  // 交易时卖家解释当前选择
                let receivePhone = rsp.phone;                             // 接受手机号
                let goodrate = rsp.goodrate.split(';');                  // 好评率
                let goodrateTit = goodrate[1];                      // 好评率开关
                let credit = rsp.credit.split(';');                   // 信用分
                let creditData = credit[1];                          // 信用分数据
                let regdays = rsp.regdays.split(';');               // 注册天数
                let regdaysData = regdays[1];                      // 注册天数数据

                // 组装数据
                obj.denfenon = rsp.denfenon == 'on';          // 差评拦截总开关
                obj.switchArr.bigmoney.value = bigmoney;      // 订单金额大于数据
                obj.switchArr.bigmoney.isHasPostfeeMore = isHasPostfeeMore;  // 订单金额大于(含运费不含运费的标志)
                obj.switchArr.carnumless.value = carnumless;  // 订单件数小于数据
                obj.switchArr.carnum.value = carnum;          // 订单件数大于数据
                obj.switchArr.smallmoney.value = smallmoney;  // 订单金额小于数据
                obj.switchArr.smallmoney.isHasPostfeeLess = isHasPostfeeLess;   // 订单金额小于(含运费不含运费的标志)
                obj.switchArr.babynumless.value = babynumless;   // 一个订单中同一个宝贝购数小于数据
                obj.switchArr.babynum.value = babynum;       // 一个订单中同一个宝贝购数大于数据
                obj.switchArr.conditions.value = conditions;  // 关键字内容
                obj.sellernote = sellernote;                // 交易时卖家解释当前选择
                obj.receivePhone = receivePhone;            // 接受手机号
                obj.switchArr.goodrate.value =  goodrateTit; // 好评率
                obj.switchArr.credit.value = creditData;     // 信用分
                obj.switchArr.regdays.value = regdaysData;      // 注册天数

                callback(obj);
            }
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// PC差评拦截修改单个开关状态
export function changeInterceptStauts (obj, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.settings.save',
        method: '/defence/saveDefenSetting',
        args:{
            "key":obj.keyArr,
            "value":obj.valueArr,
            operator:getUserInfo().subUserNick || getUserInfo().userNick,
            isHasPostfeeMoreFlag:obj.isHasPostfeeMoreFlag,
            isHasPostfeeLessFlag:obj.isHasPostfeeLessFlag,
        },
        callback: res => {
            isGetInterceptStatus = false;      // 每次修改之后把改值修改为false
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// 获取差评拦截的操作日志
export function getInterceptOperationLog (page_no, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.opreation.log.get',
        method: '/Iytrade2/showNegativeLogs',
        args: { page_no },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// 搜索拦截日志
export function serachInterceptRecord (pageno = 1, nickid, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.interceptlog.get',
        method: '/Iytrade2/getblaRecByList',
        args: { pageno, nickid },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// 搜索旺旺白名单或者黑名单
export function serachInterceptWhiteList (nick, type, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.settings.bytype.get',
        method: '/iytrade2/gettype',
        args: { nick, type },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// 搜索黑名单
export function serachInterceptBLackList (nickid, type, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.blacklist.search',
        method: '/iytrade2/getblackOne',
        args: {
            nickid,
            type : (type == 'autorate' ? 'zdpj' : 'cplj'),
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// 导入记录
export function getImportRecord (page, type, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.blacklist.importrecord.get',
        method: '/iytrade2/getImportLog',
        args: {
            page,
            type: type === 'autorate' ? 'zdpj' : 'cplj',
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

// 搜索收件人拦截
export function searchInterceptReceiver (parmas, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.receiveinfointercept.search',
        method: '/iytrade2/searchArea',
        args: {
            name: parmas.bname || '',
            phone: parmas.phone || '',
            tel: parmas.tel || '',
            addr: parmas.addr || '',
            pageNo: parmas.pageNo,
            type: "con",   // 收件人拦截查询
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

export function searchRegionList (skey, pageNo, callback = NOOP, errCallback = NOOP) {
    api({
        apiName:'aiyong.trade.order.defence.receiveinfointercept.search',
        method: '/iytrade2/searchArea',
        args: {
            skey,      // 省市区模糊查询
            pageNo,
            type: "area",         // 区域拦截的搜索
        },
        callback: res => {
            callback(res);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}

export function getInterceptBabySelectDataSource (callback = NOOP, errCallback = NOOP) {
    let nick = getUserInfo().userNick;
    qnRouter({
        api: 'taobao.sellercats.list.get',
        params: { nick:nick },
        callback: res => {
            let dataSource = [{ label:"全部宝贝", value:"all" }, { label:"未分类宝贝", value:"-1" }];
            let data = {};
            res = resolveTopResponse(res);
            res = getArrayByKey('seller_cat', res);
            // 配置每一个父类下面有多少个子类的分类
            res.map(item => {
                if (item.parent_cid == 0) {
                    data[item.cid] = [{ label:item.name, value:item.cid }];
                } else {
                    data[item.parent_cid].push({ label: '┗ ' + item.name, value: item.cid });
                }
            });
            Object.keys(data).map((item) => {
                dataSource = dataSource.concat(data[item]);
            });
            callback(dataSource);
        },
        errCallback: error => {
            errCallback(error);
        },
    });
}

export function getOnSaleBabyList (params, callback = NOOP, errCallback = NOOP) {
    qnRouter({
        api:"taobao.items.onsale.get",
        params,
        callback:res => {
            let data = {};
            res = resolveTopResponse(res);
            data.sum = res.total_results;
            data.data = getArrayByKey('item', res);
            callback(data);
        },
        errCallback: error => {
            errCallback(error);
        },
    });
}

// 批量导入黑名单
export function batchImportBlackList (type, callback = NOOP, errCallback = NOOP) {
    let operator = getUserInfo().subUserNick || getUserInfo().userNick;
    api({
        apiName:'aiyong.trade.order.defence.blacklist.badrate.import',
        method: '/iytrade2/batchImport',
        args: {
            type,
            operator:operator,
        },
        callback: res => {
            let title = '';
            let result = res.result;
            if (result == 'lose_session') {
                title = '授权失效';
            }
            if (result == 'api_fail') {
                title = '接口调用失败';
            }
            if (result == 'every_good') {
                title = '恭喜亲，近六个月并没有收到任何中差评，无需导入。';
            }
            if (result == 'noNeedSave') {
                title = '已经导入过了，无需导入。';
            }
            callback(title);
        },
        errCallback: err => {
            errCallback(err);
        },
    });
}
