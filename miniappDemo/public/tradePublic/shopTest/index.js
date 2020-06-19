import {api, consoleLogger, getUserInfo, isEmpty, NOOP, showConfirmModal} from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { getBadWords } from "tradePublic/badWordDetect/getBadWords";
import { taobaoItemListGet } from "tradePublic/itemTopApi/taobaoItemListGet";
import { taobaoItemsSellerListGet } from "tradePublic/itemTopApi/taobaoItemsSellerListGet";
import { detectbadword, select } from "tradePublic/badWordDetect/detectword";
import { titleDetection } from "tradePublic/titleDetection";
import { listTimeDetection } from "tradePublic/listTimeDeteciton";
import { deleteBadWord } from "tradePublic/badWordDetect/deleteBadWord";
import {openAutoList} from "tradePublic/openAutoList";
import {deviceStatus} from "tradePublic/newDescM";
import {itemBeacon} from "mapp_common/utils/beacon";
import {goToQAP} from "mapp_common/utils/goToQAP";

let titleResult = [0, 0, 0]; // 标题检测结果 优 良 差
let listResult = [0 , 0, 0]; // 上下架检测接口 高峰期 平常期 低谷期
let wirelessBaby = []; // 没有手机详情的宝贝
let allBaby = []; // 所有宝贝信息
let badWordBaby = []; // 含有违规词的宝贝
let badWordId = [];
let totalPage = 0; // 总的宝贝页数
let temPage = 0; // 用来计数的变量
let isOpenAutoList = false; // 是否开启了自动上下架
let babyCount = 0; // 宝贝总数
let babyId = [];
let babyInfo = [];
let badWords = [];
let promWord = [];
let tabContent = [
    {type: '广告法违规检测', isBad: false, badNum: 0, badBtn: '立即删除', url: 'ggfwgjc', title: '广告法违规'},
    {type: '免费搜索流量权重检测', isBad: false, badNum: 0, badBtn: '优化标题', url: 'mfssllqzjc', title: '搜索流量较小'},
    {type: '宝贝上下架时间检测', isBad: false, badNum: 0, badBtn: '开启调整', url: 'bbsxjsjjc', title: '上下架较差'},
    {type: '手淘权重检测', isBad: false, badNum: 0, badBtn: '增加权重', url: 'stqzjc', title: '手淘权重较低'},
    {type: '宝贝点击率检测', isBad: false, badNum: 0, badBtn: '提高点击', url: 'bbdjljc', title: '点击率较低'},
    {type: '营销能力检测', isBad: false, badNum: 0, badBtn: '创建活动', url: 'yxnljc', title: '营销能力较弱'},
];

let callBack; // 用来保存传入的回调r
let triggerEvent; // 保存时间监听的函数

/**
 * 开始店铺体检
 * @param actionCallBack
 */
export const startShopTest = (actionCallBack, triggerShopTest) => {
    // 先获取违规词
    getBadWords((res)=>{
        const shopTestAction = { type: 'GET_BAD_WORD', bacWord: res.split("、") };
        actionCallBack(shopTestAction);
        callBack = actionCallBack;
        triggerEvent = triggerShopTest;
        // 去拿出售中的宝贝iid
        getBabyNumId('出售中', 1);
        getPromWords();
    })
};

/**
 * 获取促销词
 */
export const getPromWords = () => {
    getPromWord({
        callback: res => {
            promWord = res;
        },
    })
};

/**
 * 获取宝贝id
 * @param status 出售中/仓库中
 * @param pageNo 页数
 */
const getBabyNumId = (status, pageNo) => {
    taobaoItemListGet({
        status,
        page_no: pageNo,
        page_size: 200,
        fields: 'total_results,num_iid',
        callback: res => {
            const { items, total_results: num } = res;
            babyCount = num;
            items.item.map((item) => {
                babyId.push(item.num_iid);
            });
            // 发送数据
            let shopTestAction = { type: 'GET_BABY_IID', allBabyId: babyId };
            callBack(shopTestAction);
            if (pageNo * 200 < num) {
                // 查找下一页
                getBabyNumId(status, pageNo + 1);
            } else if (babyId.length === 0) {
                // 出售中和仓库中的宝贝数量加起来为0
                showConfirmModal({
                    title: '温馨提示',
                    content: '您的店铺无宝贝',
                    confirmText: '我知道了',
                    showCancel: false,
                });
            } else {
                getAllBabyDetail();
            }
        },
        errCallback: () => {
            if (pageNo * 200 < babyCount) {
                // 查找下一页
                getBabyNumId(status, pageNo + 1);
            } else if (babyId.length === 0) {
                // 出售中和仓库中的宝贝数量加起来为0
                showConfirmModal({
                    title: '温馨提示',
                    content: '您的店铺无宝贝',
                    confirmText: '我知道了',
                    showCancel: false,
                });
            } else {
                getAllBabyDetail();
            }
        }
    })
};

/**
 * 遍历获取宝贝信息
 */
const getAllBabyDetail = () => {
    const totalResults = babyId.length;
    totalPage = Math.ceil(totalResults / 20);
    // 一次20个 获取宝贝的详细信息
    for (let i = 0; i < totalPage; i += 1) {
        const numIidStr = babyId.slice(20 * i, 20 * i + 20).join(',');
        getBabyDetail(numIidStr);
    }
};

/**
 * 获取宝贝的信息
 * @param numIidStr num_iid组成的字符串
 */
const getBabyDetail = (numIidStr) => {
    taobaoItemsSellerListGet({
        num_iids: numIidStr,
        fields: 'num_iid,title,desc,pic_url,cid,approve_status,wireless_desc,props_name,property_alias,props,seller_cids,list_time',
        callback: (result) => {
            const { items } = result;
            if (items) {
                allBaby = allBaby.concat(items.item);
            }
            temPage++;
            if (temPage === totalPage) { // 数据全部获取了
                const shopTestAction = { type: 'CHANGE_STATUS', status: 1, index: 1, allBaby };
                callBack(shopTestAction);
                actionTestBadWord();
            }
        },
        errCallback: () => {
            temPage++;
            if (temPage === totalPage) {// 数据全部获取了
                const shopTestAction = { type: 'CHANGE_STATUS', status: 1, index: 1, allBaby };
                callBack(shopTestAction);
                actionTestBadWord();
            }
        },
    });
};

/**
 * 改变card
 * @param num
 * @param badNum
 * @param isBad
 */
const changeCardInfo = (num, badNum, isBad) => {
    tabContent = tabContent.map((item, index) => {
        if (index === num) {
            return {
                ...item,
                badNum: badNum,
                isBad: isBad !== undefined ? isBad : badNum > 0,
            }
        } else {
            return item;
        }
    });
};

/**
 * 开始违规词检测
 */
const actionTestBadWord = () => {
    let finishFlag = false;
    detectbadword({
        status: '出售中',
        callback: res => {
            // 这里res返回的是总进度
            if (res + 1 < babyId.length) {
                callBack({ type: 'CHANGE_STATUS', status: 1, index: res + 1 })
            } else if (res + 1 === babyId.length){ // 检测完了
                finishFlag = true;
                setTimeout(() => {
                    select("select * from BadWordDetection")
                        .then(res => {
                            // res 是有违规词的数组
                            res.map((item) => {
                                badWordBaby.push({...item, ids: [item.id], badwords: [item.badword]});
                                if (badWordId.findIndex(i => i === item.num_iid) === -1) {
                                    badWordId.push(item.num_iid);
                                }
                            });
                            callBack({ type: 'CHANGE_CARD_INFO', num: 0, badNum: badWordId.length, status: 2, index: 1, });
                            changeCardInfo(0, badWordId.length);
                            calculateScore();
                            actionTestTitle();
                        })
                }, 1000)
            }
        },
        showCallback: res => consoleLogger.log(res, 'showCallback'),
        finishCallBack: sqls => {
            // 第一次检测没有违规词就不会建表,sqls就是空的
            if (isEmpty(sqls) && !finishFlag) {
                callBack({ type: 'CHANGE_CARD_INFO', num: 0, badNum: 0, status: 2, index: 1, });
                changeCardInfo(0, 0);
                calculateScore();
                actionTestTitle();
            }
        }
    })
};

/**
 * 开始标题检测
 */
const actionTestTitle = () => {
    let badTitleCount = 0; // 用来保存差标题个数
    allBaby.map((item, index) => {
        titleDetection({
            item,
            promWord: promWord,
            callback: (result) => {
                if (result.result === '差') {
                    badTitleCount ++;
                    titleResult[2] ++
                } else if (result.result === '良') {
                    titleResult[1] ++;
                } else {
                    titleResult[0] ++;
                }
                if (index === allBaby.length - 1) {
                    // 查完了全部出售中宝贝
                    callBack({ type: 'CHANGE_CARD_INFO', num: 1, badNum: badTitleCount, status: 3, index: 1 });
                    changeCardInfo(1, badTitleCount);
                    // 计算分数
                    calculateScore();
                    actionTestListTime();
                } else {
                    callBack({ type: 'CHANGE_STATUS', status: 2, index });
                }
            }
        });
    });
};

/**
 * 开始检测上下架时间
 */
const actionTestListTime = () => {
    listTimeDetection({
        onSaleBabyData: allBaby,
        callback: res => {
            callBack({ type: 'CHANGE_CARD_INFO', status: 3, index: res.index });
        },
        finishCallback: res => {
            // 检测完毕
            listResult = res.result;
            isOpenAutoList = res.adjust !== 'off'; // 不是 off 那就是开启了自动上下架
            callBack({
                type: 'CHANGE_CARD_INFO',
                num: 2,
                badNum: res.result[2],
                isBad: res.adjust === 'off',
                status: 4,
                index: 1
            });
            changeCardInfo(2, res.result[2], res.adjust === 'off');
            calculateScore();
            testWireless(0);
        }
    })
};

/**
 * 检测手机详情
 * index  下标
 */
const testWireless = (index) => {
    if (index % 10 === 1) {
        callBack({ type: 'CHANGE_CARD_INFO', status: 4, index });
    }
    if (isEmpty(allBaby[index].wireless_desc)) {
        // 将没有手机详情的宝贝保存一下
        wirelessBaby.push(allBaby[index]);
    }
    if (index === allBaby.length - 1) {
        // 检测完了
        callBack({
            type: 'CHANGE_CARD_INFO',
            num: 3,
            badNum: wirelessBaby.length,
            status: 5,
            index: 1,
            wirelessBaby,
        });
        changeCardInfo(3, wirelessBaby.length);
        calculateScore();
        testWaterMark();
    } else {
        testWireless(++index);
    }
};

/**
 * 检测水印
 */
const testWaterMark = () => {
    let hasWaterMark = 0;
    getWaterMarkBaby({
        // 查找打了水印的宝贝id
        callBack: res => {
            res.map((item) => {
                if (babyId.includes(item.num_iid) ||
                    babyId.includes(String(item.num_iid)) ||
                    babyId.includes(Number(item.num_iid))) {
                    hasWaterMark++;
                }
            });
            callBack({
                type: 'CHANGE_CARD_INFO',
                num: 4,
                badNum: babyId.length - hasWaterMark,
                status: 6,
                index: 1,
            });
            changeCardInfo(4, babyId.length - hasWaterMark);
            calculateScore();
            testUmp();
        },
        errCallBack: () => {
            showConfirmModal({
                title: '温馨提示',
                content: '获取水印数据失败',
                confirmText: '我知道了',
                showCancel: false,
            });
        }
    })
};

/**
 * 检测促销活动
 */
const testUmp = () => {
    getUmpBaby({
        // 查找促销打折的宝贝
        callBack: data => {
            let badNum;
            if(data.result == 'all'){ // 有全店的打折活动
                badNum = 0;
            } else if (data.result == ''){ // 没有打折活动
                badNum = babyId.length;
            } else { // 部分宝贝有打折活动
                let hasUmpActive = 0;
                data.result.map((val) => {
                    // 找出出售中参见ump活动宝贝数量
                    if (babyId.includes(val) ||
                        babyId.includes(String(val)) ||
                        babyId.includes(Number(val))) {
                        ++ hasUmpActive;
                    }
                });
                badNum = babyId.length - hasUmpActive;
            }
            callBack({
                type: 'CHANGE_CARD_INFO',
                num: 5,
                badNum,
                status: 10, // 检测完成
                index: 1,
            });
            changeCardInfo(5, badNum);
            saveShopTestScore(calculateScore());
        }
    })
};

/**
 * 检测完成 保存分数
 * @param score 体检的分数
 */
const saveShopTestScore = (score) => {
    let data = {};
    data.score = score;
    data.result = tabContent;
    triggerEvent(data);
};

/**
 * 计算分数
 */
const calculateScore = () => {
    if (babyId.length === 0) {
        callBack({ type: 'GET_SCORE', score: 100 });
        return;
    }
    let score = 0;
    // 违规词
    if (badWordId.length === 0) {
        // 没有含有违规词的宝贝
        score += 20;
    }
    // 标题优化
    if (titleResult[2] === 0) {
        score += 16;
    } else { // 16*标题为优的宝贝个数/宝贝数（出售中）
        score += Math.floor((16 * titleResult[0] / babyId.length))
    }
    // 上下架
    if (listResult[1] + listResult[2] === 0) {
        score += 16;
    } else { // 16*高峰期下架的宝贝/宝贝个数（出售中）
        score += Math.floor((16 * listResult[0] / babyId.length))
    }
    // 手机详情
    if (wirelessBaby.length === 0) {
        score += 16;
    } else { // 16*有手机详情的宝贝个数/宝贝数（出售中）
        score += Math.floor((16 * (babyId.length - wirelessBaby.length) / babyId.length))
    }
    // 水印
    if (tabContent[4].badNum === 0) {
        score += 16;
    } else {
        let waterMarkScore = Math.floor((16 * (babyId.length - tabContent[4].badNum) / babyId.length));
        // 超过16分按16分计算
        score += (waterMarkScore > 16 ? 16 : waterMarkScore);
    }
    // 促销
    if (tabContent[5].badNum === 0) {
        score += 16;
    } else {
        let umpScore = Math.floor((16 * (babyId.length - tabContent[5].badNum) / babyId.length));
        // 超过16分按16分计算
        score += (umpScore > 16 ? 16 : umpScore);
    }
    callBack({ type: 'GET_SCORE', score });
    return score;
};

/**
 * 重新检测
 * @param flag
 */
export const testAgain = (flag = true) => {
    // 清空检测相关数据
    titleResult = [0, 0, 0];
    listResult = [0 , 0, 0];
    wirelessBaby = [];
    allBaby = [];
    badWordBaby = [];
    badWordId = [];
    temPage = 0;
    babyCount = 0;
    babyId = [];
    tabContent = [
        {type: '广告法违规检测', isBad: false, badNum: 0, badBtn: '立即删除', url: 'ggfwgjc', title: '广告法违规'},
        {type: '免费搜索流量权重检测', isBad: false, badNum: 0, badBtn: '优化标题', url: 'mfssllqzjc', title: '搜索流量较小'},
        {type: '宝贝上下架时间检测', isBad: false, badNum: 0, badBtn: '开启调整', url: 'bbsxjsjjc', title: '上下架较差'},
        {type: '手淘权重检测', isBad: false, badNum: 0, badBtn: '增加权重', url: 'stqzjc', title: '手淘权重较低'},
        {type: '宝贝点击率检测', isBad: false, badNum: 0, badBtn: '提高点击', url: 'bbdjljc', title: '点击率较低'},
        {type: '营销能力检测', isBad: false, badNum: 0, badBtn: '创建活动', url: 'yxnljc', title: '营销能力较弱'},
    ];
    callBack({
        type: 'TEST_AGAIN',
        tabContent: [
            {type: '广告法违规检测', isBad: false, badNum: 0, badBtn: '立即删除', url: 'ggfwgjc', title: '广告法检测'},
            {type: '免费搜索流量权重检测', isBad: false, badNum: 0, badBtn: '优化标题', url: 'mfssllqzjc', title: '搜索流量检测'},
            {type: '宝贝上下架时间检测', isBad: false, badNum: 0, badBtn: '开启调整', url: 'bbsxjsjjc', title: '上下架检测'},
            {type: '手淘权重检测', isBad: false, badNum: 0, badBtn: '增加权重', url: 'stqzjc', title: '手淘权重检测'},
            {type: '宝贝点击率检测', isBad: false, badNum: 0, badBtn: '提高点击', url: 'bbdjljc', title: '点击率检测'},
            {type: '营销能力检测', isBad: false, badNum: 0, badBtn: '创建活动', url: 'yxnljc', title: '营销能力检测'},
        ],
        allBabyId: [],
        status: 0,
        allBaby: [],
        index: 1,
        score: 100,
        isDetected: false,
        wirelessBaby: [],
        badWord: [],
    });
    // 重新获取宝贝信息
    if (flag) {
        getBabyNumId('出售中', 1);
    }
};

/**
 * 开始一键优化
 */
export const actionOptimize = () => {
    callBack({
        type: 'CHANGE_STATUS',
        status: 11, // 一键优化
        index: 1,
    });
    if (badWordBaby.length !== 0) {
        delBadWord();
    } else {
        autoList()
    }
};

/**
 * 删除违规词
 */
const delBadWord = () => {
    callBack({
        type: 'CHANGE_STATUS',
        status: 12, // 优化违规词
        index: 1,
    });
    select("SELECT badword,type,count(1) as count from BadWordDetection group by badword ,type").then(res=>{
        let  result=[];
        //  把数据处理成符合列表的样子
        res.forEach(elem=>{
            if (elem.type==1) {
                elem.titleCount=elem.count
            }
            if (elem.type==3) {
                elem.descCount=elem.count
            }
            elem.descChecked = true;
            elem.titleChecked = true;
            let isFind = false;
            for(let j =0 ; j< result.length; j++){
                if(elem.badword === result[j].badword){
                    result[j] = Object.assign(result[j],elem);
                    isFind = true;
                    break;
                }
            }
            if(!isFind){
                result.push(elem);
            }
        });
        let sum = 0;
        deleteBadWord({
            data: result,
            sellerType: getUserInfo().type,
            callback:({totalNum})=>{
                sum ++;
                badWordId = [];
                if (sum === totalNum) {
                    callBack({
                        type: 'CHANGE_CARD_INFO',
                        num: 0,
                        badNum: 0,
                        status: 14, // 上下架
                        index: 1,
                    });
                    changeCardInfo(0, 0);
                    autoList();
                }
            },
            errCallback:({items,error,totalNum})=>{
                sum ++;
                if (sum === totalNum) {
                    badWordId = [];
                    callBack({
                        type: 'CHANGE_CARD_INFO',
                        num: 0,
                        badNum: 0,
                        status: 14, // 上下架
                        index: 1,
                    });
                    changeCardInfo(0, 0);
                    autoList();
                }
            }
        })
    })
};

/**
 * 优化上下架
 */
const autoList = () => {
    if (listResult[2] === 0 && isOpenAutoList) { // 没有低谷期的宝贝且开启了自动上下架就直接走手机详情
        subMobileDesc();
        return;
    }
    openAutoList({
        callBack: res => {
            listResult = [0, 0, 0];
            callBack({
                type: 'CHANGE_CARD_INFO',
                num: 2,
                badNum: 0,
                status: 15, // 去 手机详情
                index: 1,
            });
            changeCardInfo(2, 0);
            subMobileDesc();
        },
        errCallBack: err => {
            callBack({
                type: 'CHANGE_CARD_INFO',
                num: 2,
                badNum: 0,
                status: 15, // 去 手机详情
                index: 1,
            });
            changeCardInfo(2, 0);
            subMobileDesc();
        }
    })
};

/**
 * 提交手机详情任务
 */
const subMobileDesc = () => {
    let iidCidStr = '';
    if (wirelessBaby.length === 0) {
        callBack({
            type: 'CHANGE_CARD_INFO',
            num: 3,
            badNum: 0,
            status: 10,
            index: 1,
            isDetected: true,
        });
        changeCardInfo(3, 0);
        const score = calculateScore();
        saveShopTestScore(score);
        // 根据标题 水印 促销活动 弹弹窗
        showModal();
        return
    }
    // 将没有手机详情的宝贝的num_iid和cid拼接一下 num_iid|cid
    wirelessBaby.map((item, index, array) => {
        if (index + 1 === array.length) {
            iidCidStr += `${item.num_iid}|${item.cid}`
        } else {
            iidCidStr += `${item.num_iid}|${item.cid},`
        }
    });
    // 提交手机详情任务
    deviceStatus({
        numIid: iidCidStr,
        sid: getUserInfo().userId,
        sellerType: getUserInfo().type,
        nick: getUserInfo().userNick,
        callback: res => {
            if (res.result.length >= wirelessBaby.length) {
                // 返回的长度和没有手机详情的宝贝数一致就是全部提交了
                wirelessBaby = [];
                callBack({
                    type: 'CHANGE_CARD_INFO',
                    num: 3,
                    badNum: 0,
                    status: 10,
                    index: 1,
                    isDetected: true,
                });
                changeCardInfo(3, 0);
                // 提交了手机详情一键优化就结束了，计算分数
                const score = calculateScore();
                saveShopTestScore(score);
                // 根据标题 水印 促销活动 弹弹窗
                showModal();
            }
        },
    });
};

/**
 * 弹窗逻辑顺序：标题＞水印＞ump
 */
const showModal = () => {
    if (tabContent[1].isBad) {
        // 存在标题为差的宝贝
        itemBeacon({ func: 'optimizeTitleModalShow', flag: false });
        showConfirmModal({
            title: '温馨提示',
            content: '由于标题没有参加一键优化，需要手动优化标题，是否立即去优化？',
            onConfirm: () => {
                itemBeacon({ func: 'optimizeTitleModalClick', flag: false });
                goToQAP({page:'NewTitleOptimize', pageName: '标题优化'});
            }
        });
    } else if (tabContent[4].isBad) {
        // 存在没有水印的宝贝
        itemBeacon({ func: 'waterMarkModalShow', flag: false });
        showConfirmModal({
            title: '温馨提示',
            content: '由于促销水印没有参加一键优化，需要手动优化标题，是否立即去优化？',
            onConfirm: () => {
                itemBeacon({ func: 'waterMarkModalClick', flag: false });
                goToQAP({page:'WaterMark', pageName: '促销水印'});
            }
        });
    } else if (tabContent[5].isBad) {
        // 存在没有参加促销活动的宝贝
        itemBeacon({ func: 'promotionDiscountModalShow', flag: false });
        showConfirmModal({
            title: '温馨提示',
            content: '由于促销打折没有参加一键优化，需要手动优化标题，是否立即去优化？',
            onConfirm: () => {
                itemBeacon({ func: 'promotionDiscountModalClick', flag: false });
                goToQAP({page:'PromotionalPage', pageName: '促销打折', query:{promotiontype: 'PromotionalPage'}});
            }
        });
    }
};

/**
 * 获取添加过水印的宝贝num_iid
 * @param callBack
 * @param errorCallBack
 */
export const getWaterMarkBaby = ({callBack = NOOP, errorCallBack = handleError}) => {
    api({
        apiName: 'aiyong.item.watermark.success.get',
        callback: callBack,
        errCallback: errorCallBack,
    })
};

/**
 * 获取参加的促销打折活动的宝贝num_iid
 * @param callBack
 * @param errorCallBack
 */
export const getUmpBaby = ({callBack = NOOP, errorCallBack = handleError}) => {
    api({
        apiName: 'aiyong.item.ump.user.items.list.get',
        callback: callBack,
        errCallback: errorCallBack,
    })
};

/**
 * 获取促销词
 * @param callback
 * @param errCallback
 */
export const getPromWord = ({callback = NOOP, errCallback = handleError}) => {
    api({
        apiName: 'aiyong.item.user.settings.promotion.redis.get',
        callback: resultData => {
            const promWord = resultData.result.split(';').map(val => ({ wordname: val }));
            callback(promWord);
        },
        errCallback: errCallback,
    })
};

/**
 * 获取一个随机的分数,和随机为差的结果
 * @param shopTestShowBad 用于首页体检展示的数组
 * @param callback 回调
 */
export const getRandomScore = (shopTestShowBad, callback) => {
    setTimeout(() => {
        // const { shopTestShowBad } = this.state;
        let tem = Math.floor(Math.random() * 3) + 1; // 取1到3的随机数,展示差的项目
        // 打乱一下数组
        for (let i = 0; i < shopTestShowBad.length; i++) {
            let iRand = parseInt(shopTestShowBad.length * Math.random());
            [shopTestShowBad[i], shopTestShowBad[iRand]] = [shopTestShowBad[iRand], shopTestShowBad[i]]
        }
        // 获取随机为差的显示项
        const newArr = shopTestShowBad.map((item, index) => {
            if (index + 1 <= tem) {
                return { ...item, isShow: true}
            }
            return item;
        });
        callback(newArr);
    }, 1500);
};
