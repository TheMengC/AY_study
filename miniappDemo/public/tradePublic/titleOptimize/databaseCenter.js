
import { api, NOOP, isEmpty, moment, consoleLogger, localStorage ,sqlHelper } from "tradePolyfills";
import {taobaoItemListGet} from 'tradePublic/itemTopApi/taobaoItemListGet';
import {taobaoItemsSellerListGet} from 'tradePublic/itemTopApi/taobaoItemsSellerListGet';
import {showModal, toast} from 'tradePublic/itemDetail/common';
import { renew_propnam, detailchecktitle } from 'tradePublic/titleDetection/index';

const createSql = 'CREATE TABLE IF NOT EXISTS TitleOptimizeTable(id integer PRIMARY KEY AUTOINCREMENT,num_iid varchar(30),itemTit CHAR(50),imgUri varchar(120),cid int(30),props varchar(100),props_name varchar(100), property_alias varchar(100),titleClass varchar(4),type varchar(16),seller_cids varchar(20))';

//init进度
let initProcessJson = {
    showResult: false, // 是否显示检测结果
    number: '  0 ', // 检测进度
    process1: '正在获取宝贝信息...',
    process2: ' ',
    process3: ' ',
    process4: ' ',
    process5: ' ',
    process6: ' ',
}
//全部的商品信息数组
let allItem=[];
//透出初始化进度
let processJson = {};

let insertNum = 0;

//使用moment获取当前的日期
let nowDate = moment().format('YYYY-MM-DD');

//promise最终的成功返回
let globalResolve = NOOP;
//promise最终的失败返回
let globalReject = NOOP;
//进度的回调(回调多次)
let globalProcessCallback = NOOP;
//最大等待时间 (防止页面一闪而过太快)
let maxWaitTime = 800;

/**
 * 初始化本地数据
 * @param {*} {
 *  type='normal',  [2这种模式一种正常，一种是强制刷新(refresh)]
 *  processCallback=NOOP,   [进度的回调]
 * }
 * @returns
 */
export function initDatabase({type='normal',processCallback=NOOP}){
    return new Promise((resolve, reject)=>{
        globalResolve = resolve;
        globalReject = reject;
        globalProcessCallback = processCallback;
        //检测返回数据初始化
        processJson = Object.assign({},initProcessJson);
        let lastCheckTime = localStorage.getItemSync('lastCheckTime');
        //正常模式初始化 && 上次检测时间存在 && 本次检测日期与上次检测日期相同  ==> 这种情况下直接返回数据
        if('normal' == type && !isEmpty(lastCheckTime) && nowDate == lastCheckTime){
            globalProcessCallback(processJson);
            setTimeout(()=>{
                let lastProcessNumber = localStorage.getItemSync('lastProcessNumber');
                //检测进度到了100
                if(lastProcessNumber == '100'){
                    globalProcessCallback(Object.assign(processJson,{
                        process6: '报告已生成',
                        number:'100',
                    }));
                    setTimeout(()=>{
                        globalProcessCallback(Object.assign(processJson,{
                            showResult:true,
                        }));
                        resolve('不需要检测本地数据可用，直接返回');
                    },maxWaitTime)
                }
                /**
                 *  这里return有2个概念
                 *      1、本地数据可以直接使用，不需要再更新一遍
                 *      2、现在数据正在更新，不需要再跑一遍
                */
            },maxWaitTime)
            return;
        }
        processCallbackFuc(processJson)
        refreshTable().then((res)=>{
            //调用检测的方法
            startTest();
        }).catch((error)=>{
            consoleLogger.error('titleOptimizeWebSql initDatabase catch error', error);
            toast('none','标题检测数据初始化失败！')
            globalProcessCallback(Object.assign(processJson,{
                showResult: true,
                number:'0',
            }));
            reject(error);
        })
    })
}

/**
 *
 * @param {*} {
 *  searchKey='',   [搜索标题的关键字]
 *  status='出售中',  [宝贝状态(出售中|仓库中)]
 *  sellerCids='',    [宝贝分类筛选]
 *  score='差'  [检测出的等级[差|良|优]]
 * }
 */
export function queryData({searchKey='',status='出售中',sellerCids='',score='差'}){
    return new Promise((resolve, reject)=>{
        initDatabase({
            processCallback:(res)=>{
                consoleLogger.warn('queryData-initNormal-then',res);
            }
        }).then((res)=>{
            consoleLogger.warn('initNormal-then',res);
            let dataSql = "select * from TitleOptimizeTable";
            let countSql = "select titleClass,count(1) as total from TitleOptimizeTable";
            //商品状态
            if(status == '出售中'){
                dataSql += " where type = 'onsale' ";
                countSql += " where type = 'onsale' ";
            }else{
                dataSql += " where type = 'instock' ";
                countSql += " where type = 'instock' ";
            }
            //商品检测结果等级
            dataSql += ` and titleClass='${score}' `;
            //搜索标题关键字
            if(!isEmpty(searchKey)){
                dataSql += ` and itemTit like '%${searchKey}%' `;
                countSql += ` and itemTit like '%${searchKey}%' `;
            }
            //分类
            if(!isEmpty(sellerCids)){
                const sellerCid = sellerCids.split(',');
                if(sellerCid.length == 1){
                    dataSql += ` and seller_cids like '%${sellerCids}%' `;
                    countSql += ` and seller_cids like '%${sellerCids}%' `;
                }else{
                    sellerCid.map((cid,index)=>{
                        if(index == 0){
                            dataSql += ` and (seller_cids like '%${cid}%' `;
                            countSql += ` and (seller_cids like '%${cid}%' `;
                        }else if(index == (sellerCid.length - 1)){
                            dataSql += ` or seller_cids like '%${cid}%') `;
                            countSql += ` or seller_cids like '%${cid}%') `;
                        }else{
                            dataSql += ` or seller_cids like '%${cid}%' `;
                            countSql += ` or seller_cids like '%${cid}%' `;
                        }
                    })
                }
            }
            countSql += " group by titleClass ";
            Promise.all([
                sqlHelper.doSqlAsync({
                    sql:dataSql,
                }),
                sqlHelper.doSqlAsync({
                    sql:countSql,
                }),
            ]).then((res)=>{
                let countRes = [
                    {total: 0, titleClass: "差"},
                    {total: 0, titleClass: "良"},
                    {total: 0, titleClass: "优"},
                ]
                for (const iterator of res[1]) {
                    switch(iterator.titleClass){
                        case '差':
                            countRes[0].total = iterator.total;
                            break;
                        case '良':
                            countRes[1].total = iterator.total;
                            break;
                        case '优':
                            countRes[2].total = iterator.total;
                            break;
                        default:
                            break;
                    }
                }
                resolve({
                    dataRes:res[0],
                    countRes:countRes,
                });
                return;
            }).catch((error)=>{
                reject(error)
            })
        }).catch((e)=>{
            consoleLogger.error('initNormal-catch',e);
            queryData({searchKey,status,sellerCids,score});
        })
    })
}

/**
 * 统一调用进度回调和在storage中保存的进度的方法
 * @param {*} process
 */
function processCallbackFuc(process){
    globalProcessCallback(process);
    localStorage.setItemSync('lastProcessNumber',process.number);
}

/**
 * 开始检测
 */
function startTest(){
    processCallbackFuc(Object.assign(processJson,{
        number: ' 27',
        process2: '正在根据规则判定宝贝...',
    }));
    allItem = [];
    getItemData('出售中', 200, 1);
}

/**
* [getItemData description] 获取出售中或是仓库中的数据
* @param  {Number} pageSize [description]
* @return {[type]}          [description]
* @author  ryq
*/
function getItemData(status, pageSize = 200, pageNo = 1) {
    let pageNom = pageNo;
    taobaoItemListGet({
        page_size: pageSize,
        status,
        page_no: pageNom,
        fields: 'total_results,num_iid',
        callback: (result) => {
            let totalResults = 0;
            let itemDatas;
            if (status === '出售中') {
                itemDatas = result.items;
                totalResults = result.total_results;
            } else {
                itemDatas = result.items;
                totalResults = result.total_results;
            }
            if (!isEmpty(itemDatas)) {
             allItem = allItem.concat(itemDatas.item);
            }
            if (pageNom * 200 < totalResults) {
                getItemData(status, 200, pageNom += 1);
            } else if (status === '出售中') {
                getItemData('仓库中', 200, 1);
            } else if (allItem.length === 0) {
                processCallbackFuc(Object.assign(processJson,{
                    number: '100',
                    process2: '正在根据规则判定宝贝...',
                    process3: '正在分析宝贝历史流量...',
                    process4: '正在命中分析宝贝关键词...',
                    process5: '正在生成分析报告...',
                    process6: '获取信息完成',
                }));
                setTimeout(() => {
                    processCallbackFuc(Object.assign(processJson,{
                        showResult: true,
                    }))
                    globalResolve();
                }, maxWaitTime);
            } else {
                processCallbackFuc(Object.assign(processJson,{
                    number: ' 42',
                    process3: '正在分析宝贝历史流量...',
                }))
                testResultAndSaveDb(allItem, allItem.length);
            }
        },
        errCallback: (error) => {
            //失败提示
            showModal({
                content: `获取出售中或是仓库中的数据失败！`+JSON.stringify(error),
                showCancel: false
            })
            globalReject(error)
        },
    });
}

/**
 * 获取商品基本信息开始检测，并且把检测结果保存到websql中
 * @param {*} allItem 全部的商品num_iid的数组
 * @param {*} totalResults 全部商品的数量
 */
function testResultAndSaveDb(allItem, totalResults) {
    api({
        apiName:'aiyong.item.user.settings.promotion.get',
        callback: (data) => {
            if (isEmpty(data)) {
                showModal({
                    content: `获取促销词失败，请重新检测！`,
                    showCancel: false
                })
                processCallbackFuc(Object.assign(processJson,{showResult: true}));
                return;
            }
            if (data.result) {
                let sales = data.result;
                let numIidStr = '';
                const insertStr = 'INSERT INTO TitleOptimizeTable (num_iid, itemTit, imgUri, cid, props, props_name, property_alias, titleClass, type, seller_cids) VALUES (?,?,?,?,?,?,?,?,?,?)'; //
                processCallbackFuc(Object.assign(processJson,{
                    number: ' 60',
                    process4: '正在命中分析宝贝关键词...',
                }));
                insertNum = 0;
                for (let i = 0; i < totalResults; i += 1) {
                    numIidStr += `${allItem[i].num_iid},`;
                    if (Number((i + 1) % 20) === 0 || i === (totalResults - 1)) {
                        taobaoItemsSellerListGet({
                            num_iids: numIidStr,
                            fields: 'num_iid,title,pic_url,cid,approve_status,props_name,property_alias,props,seller_cids',
                            callback: (result) => {
                                const resultArr = [];
                                const dataItem = result.items.item;
                                dataItem.map((item) => {
                                    const single = item;
                                    const propnam = renew_propnam(single.props_name.split(';'), single.property_alias.split(';'));
                                    const titleResult = detailchecktitle(single.title, single.num_iid, propnam, single.props.split(';'), sales);
                                    const title = single.title.replace(/[\r\n]/g, '');
                                    const arr = [`${single.num_iid}`, title, single.pic_url, single.cid, single.props, single.props_name, single.property_alias, titleResult.score, single.approve_status, single.seller_cids]; // single,seller_cids
                                    resultArr.push([insertStr, arr]);
                                    return null;
                                });
                                try {
                                    insertBatchData(resultArr, totalResults);
                                } catch (error) {
                                    consoleLogger.error('批量插入失败!',error);
                                    showModal({
                                        content: `批量插入失败`,
                                        showCancel: false
                                    })
                                    processCallbackFuc(Object.assign(processJson,{ showResult: true }));
                                    globalReject('批量插入失败')
                                }
                            },
                            errCallback: () => {
                                insertNum += 20;
                                let newPercent = Number(processJson.number) + Math.ceil(20 / totalResults * 40);
                                if (newPercent < 100) {
                                    newPercent = ` ${newPercent}`;
                                    processCallbackFuc(Object.assign(processJson,{
                                        process5: '正在生成分析报告...',
                                        number: newPercent,
                                    }));
                                } else {
                                    insertNum = 0;
                                    processCallbackFuc(Object.assign(processJson,{
                                        process6: '报告已生成',
                                        number:'100',
                                        showResult:true,
                                    }));
                                }
                            },
                        });
                        numIidStr = '';
                    }
                }
            } else {
                showModal({
                    content: `获取关键字失败，请重试`,
                    showCancel: false
                })
                processCallbackFuc(Object.assign(processJson,{ showResult: true }));
                globalReject('获取关键字失败，请重试');
            }
        },
        errCallback: err => {
            showModal({
                content: `获取关键字失败，请重试`,
                showCancel: false
            })
            processCallbackFuc(Object.assign(processJson,{ showResult: true }));
            globalReject(err);
        },
    });
}

/**
 * 将检测好的信息保存到Db中的方法
 * @param {*} dataArray
 * @param {*} totalResults
 */
function insertBatchData(dataArray, totalResults) {
    let batchSql = [];
    dataArray.map((item)=>{
        let singleSqlItem = [];
        singleSqlItem.push(item[0]);
        singleSqlItem.push(item[1]);
        batchSql.push(singleSqlItem);
    })
    my.qn.database({
        method: 'batchSql',
        sql: dataArray,
        success: (res) => {
            insertNum += 20;
            let newPercent = Number(processJson.number) + Math.ceil(dataArray.length / totalResults * 40);
            if (newPercent < 100) {
                newPercent = ` ${newPercent}`;
                processCallbackFuc(Object.assign(processJson,{
                    process5: '正在生成分析报告...',
                    number: newPercent,
                }));
            }
            if (insertNum >= totalResults) {
                insertNum = 0;
                localStorage.setItemSync('lastCheckTime',nowDate);
                processCallbackFuc(Object.assign(processJson,{ process6: '报告已生成',number:'100' }));
                setTimeout(() => {
                    processCallbackFuc(Object.assign(processJson,{
                        showResult: true,
                    }))
                    globalResolve();
                }, maxWaitTime);
            }
        },
    });
}

/**
 * 预留的查询任意sql的方法
 * @export
 * @param {*} sql
 * @returns
 */
export function executeAnySql(sql){
    return sqlHelper.doSqlAsync({
        sql: sql,
    });
}

/**
 * 创建 TitleOptimizeTable表 的方法
 * @returns
 */
function createTable(){
    return sqlHelper.doSqlAsync({
        sql: createSql,
    });
}

/**
 * 强制刷新 TitleOptimizeTable表 的方法
 * @returns
 */
function refreshTable(){
   return new Promise((resolve, reject)=>{
        sqlHelper.doSqlAsync({
            sql: `DROP TABLE IF EXISTS TitleOptimizeTable`,
        }).then((dropRes)=>{
            createTable().then((createRes)=>{
                resolve(createRes);
            }).catch((e)=>{
                consoleLogger.error('refreshTable-catch',e);
                reject(e);
            });
        }).catch((e)=>{
            consoleLogger.error('refreshTable-catch',e);
            reject(e);
        });
    })
}

