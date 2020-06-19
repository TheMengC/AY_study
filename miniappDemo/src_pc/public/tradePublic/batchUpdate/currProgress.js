import { NOOP, api, isEmpty } from "tradePolyfills/index";
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";

//  查询任务进度
//  接受的参数  任务id  成功的回调   失败的回调
export  function  currProgress({taskId,Callback=NOOP,errCallback=handleError}) {
	api({
		apiName:'aiyong.item.batchoper.updatetilte.task.get',
		args: {taskId},
		callback:(res)=>{
            Callback(res)
        },
		errCallback: (err)=>{
            errCallback(err)
        }
	})
} 