import { isEmpty, NOOP, api, showErrorDialog, getUserInfo } from "tradePolyfills";
import { deleteVideo, updateVideo } from 'tradePublic/itemTopApi/taobaoItemUpdate';
import { taobaoItemsSellerListGet } from 'tradePublic/taobaoItemsSellerListGet';
import { handleError } from "tradePublic/tradeDataCenter/common/handleError";
import { VIDEO_TEMPLATE_DATA } from "@/constants/consts";

/**
 * 提交生成视频任务
 * @param {*} num_iid
 */
export function addVideoTask ({num_iid, title, cid, rule, callback = NOOP, errCallback = handleError}) {
    api({
        apiName:'aiyong.item.video.task.add',
        args:{
            seller_id: getUserInfo().user_id,
            seller_type: getUserInfo().type,
            num_iid,
            title,
            cid,
            rule,
        },
        callback: callback,
        errCallback: errCallback,
    })
}

/**
 * 更新视频任务
 */
export function updateTmailVideoTask ({ numIid, cid, option = 1, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.video.task.tmail.update',
        args:{
            numIid,
            cid,
            option,
        },
        callback: callback,
        errCallback: errCallback,
    })
}

/**
 * 更新视频任务
 */
export function updateFinishVideoTask ({ activityId }) {
    return new Promise((resolve, reject)=>{
        api({
            apiName:'aiyong.item.video.task.finish.update',
            args:{
                activityId
            },
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        })
    });
}

/**
 * 获取视频当前进程
 */
export function getVideoTaskProcess ({ callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.video.task.process.get',
        args:{},
        callback: callback,
        errCallback: errCallback,
    })
}

/**
 * 获取视频任务
 */
export function getVideoTask ({ numIid, callback = NOOP, errCallback = handleError }) {
    api({
        apiName:'aiyong.item.video.task.get',
        args:{ numIid },
        callback: callback,
        errCallback: errCallback,
    })
}

/**
 * 淘宝视频查询
 * @param video_id
 * @param user_id
 * @param callback
 */
export const queryTaoBaoVideo = ({ video_id, isv = '21085832' }) => {
    return new Promise((resolve, reject)=>{
        api({
            apiName:'aiyong.item.router.rest',
            args:{
                method: 'taobao.isv.video.query',
                param: {
                    user_id: getUserInfo().user_id,
                    video_id,
                    isv,
                },
            },
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
}

/**
 * 同步状态
 * @param video_id
 * @param num_iid
 * @param activityId
 * @param callback
 */
export const synchVideoState = ({video_id, num_iid, num_iids, activityId, callback = NOOP, errCallback = handleError}) => {
    Promise.all([
        queryTaoBaoVideo({ video_id }),
        updateVideo({ num_iid, video_id, seller_type: '' }),
        taobaoItemsSellerListGet({ num_iids, fields: 'pic_url,title,num_iid,outer_id,mpic_video,approve_status,videos,item_img.url,item_img.position,item_img.id'}),
        updateFinishVideoTask({ activityId })
    ]).then((res)=>{
        callback(res);
    }).catch((error)=>{
        const msg = error.sub_msg ? error.sub_msg : '获取视频url失败';
        showErrorDialog('提示', JSON.stringify(error), msg);
        errCallback(error);
    });
}

/**
 * 生成主图视频
 * @param dataArr  选中的宝贝的数据
 * @param tid      模板的id
 * @param callback
 */
export const createMasterVideo = (dataArr, tid, callback) => {
    let failtotal = 0;
    let successtotal = 0;
    let template = [...VIDEO_TEMPLATE_DATA];
    dataArr.forEach((item)=>{
        //给每个宝贝添加模板和用户信息的数据
        let data = item;
        data.musicUrl = template[tid-1].musicUrl;
        data.nodes = template[tid-1].nodes;
        if(isEmpty(data.imgData)){
            data.imgData = item.item_imgs.item_img;
            if(isEmpty(item.item_imgs.item_img)){
                data.imgData = item.item_imgs;
            }
        }
        let videoData = {};
        let nodes = []
        let index = 0;
        for(let i in data.imgData){
            if(data.imgData[i].url && data.nodes[index]){
                nodes.push(data.nodes[index]);
                nodes[index].pic_url = data.imgData[i].url;
                //模版中不添加文字 去掉文字选项
                delete nodes[index]['textStyle'];
                delete nodes[index]['textStyleTime'];
                index++;
            }
        }
        videoData.nodes = nodes;
        //获得音乐名称
        let musicUrlArr = data.musicUrl.split("/");
        let musicUrl = musicUrlArr[musicUrlArr.length - 1];
        videoData.musicUrl = musicUrl;
        addVideoTask({
            num_iid: data.num_iid,
            title: data.title,
            cid: data.cid,
            rule: JSON.stringify(videoData),
            callback: ()=>{
                ++ successtotal;
                if(successtotal + failtotal == dataArr.length){
                    callback();
                }
            },
            errCallback: (err)=>{
                ++ failtotal;
                showErrorDialog('温馨提示', err, '提交生成视频任务失败');
            }
        });
    });
}

/**
 * 删除主图视频
 */
export const deleteMasterVideo = (dataArr, callback) => {
    let failtotal = 0;
    let successtatal = 0;
    dataArr.forEach((item)=>{
        item.sellerType = getUserInfo().type;
        item.imgData = item.item_imgs.item_img;
        if(isEmpty(item.item_imgs.item_img)){
            item.imgData = item.item_imgs;
        }
        if(item.sellerType == "c" || item.sellerType == "C"){
            deleteVideo({
                seller_type: item.sellerType,
                num_iid: item.num_iid,
                callback:(res)=>{
                    if(res.item){
                        ++ successtatal;
                    }else{
                        ++ failtotal;
                    }
                    if(successtatal + failtotal == dataArr.length){
                        callback(failtotal)
                    }
                },
                errCallback:()=>{
                    ++ failtotal;
                    if(successtatal + failtotal == dataArr.length){
                        callback(failtotal)
                    }
                }
            })
        }else{
            updateTmailVideoTask({
                numIid: item.num_iid,
                cid: item.cid,
                callback: ()=>{
                    ++ successtatal;
                    if(successtatal + failtotal == dataArr.length){
                        callback(failtotal)
                    }
                },
                errCallback: ()=>{
                    ++ failtotal;
                    if(successtatal + failtotal == dataArr.length){
                        callback(failtotal)
                    }
                }
            });
        }
    });
}
