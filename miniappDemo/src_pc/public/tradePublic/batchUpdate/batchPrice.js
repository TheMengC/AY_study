import { NOOP, api, isEmpty, getUserInfo } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
//  批量修改价格  
//  beforeId 这个参数 表示还原的时候传过去的
export  function  batchPrice({checkvalue=["123"],priceL,priceR,selectCid=[123],chooseType,status,uncheckvalue=["123"],choose_type,token,allcheck,Callback=NOOP,errCallback=handleError,beforeId}){
	const userinfo=getUserInfo();

    //  这个是正常进行批量修改时传入的参数
	const batchPriceParams = {
		userNick: userinfo.nick,// 卖家用户名
		userId: userinfo.user_id,// 卖家的userID
		sellerType: userinfo.type,//卖家的类型  c  C
		batchType: 'price', // 批量操作的类型 
		selectType: chooseType, // 选择宝贝的类型 选择宝贝baby/选择分类cid
		status:status, // onsale/instock
		pricePercent: priceL, // 修改价格的百分比
		priceAdd: priceR, // 修改价格的数量
		checkRound: "true", //是否保留小数
		sessionKey: token, 
		choose_type: choose_type,// 宝贝的类型 baby 还是cid  
	};
    if (chooseType === 'baby') {
		batchPriceParams.selectCids = selectCid.join(","); // 选择的分类cid  组成的数组
		batchPriceParams.allCheck = allcheck; // 是否是全选状态
		batchPriceParams.checkValue = checkvalue.join(','); // 勾选的宝贝数组 形如554663880153|26,556438287842|4987
		batchPriceParams.unCheckValue = uncheckvalue? uncheckvalue.join(',') : []; // 反选的宝贝数组
	} else {
		batchPriceParams.selectCids = selectCid.join(","); // 选择的分类id
    }
    //  还原的时候传递的参数
    let  restorePrice={
        userNick: userinfo.nick,// 卖家用户名
		userId: userinfo.user_id,// 卖家的userID
		sellerType: userinfo.type,//卖家的类型  c  C
        batchType: 'price', // 批量操作的类型 price
        status: 'onsale', // onsale/instock
        selectType: 'baby', // 选择宝贝的类型 选择宝贝baby/选择分类cid
        pricePercent: 100, // 修改价格的百分比
        priceAdd: 0, // 修改价格的数量
        checkRound: 0,
        sessionKey: token,
        allCheck: false,
        checkValue: 'return',
        beforeId
    }
    api({
		apiName:'aiyong.item.batchoper.task.add',
		args:  isEmpty(beforeId)?batchPriceParams:restorePrice,
		callback: (res) => {
            Callback(res)
        },
		errCallback: (err) => {
            errCallback(err)
			// 任务失败  进度条组件隐藏
       }
	})
 }
