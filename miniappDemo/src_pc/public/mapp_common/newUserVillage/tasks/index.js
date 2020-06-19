import { api } from "mapp_common/utils/api";
import { ENV } from "@/constants/env";
import { checkIn_getState, newUserTasks_dispatch, newUserTasks_getState } from 'mapp_common/newUserVillage/action';
import moment from "mapp_common/utils/moment";
import { getDeferred, isEmpty } from "mapp_common/utils";
import { getCheckinStatus } from 'mapp_common/newUserVillage/checkIn/index';


export const isToDoNewUserTask = (taskId) => {
    let deferred = getDeferred(); // 生成一个promise
    let newUserTasks = newUserTasks_getState() || {};
    let checkInData = checkIn_getState() || {};
    const { taskInfo, taskStatus } = newUserTasks;
    if(!isEmpty(checkInData) && !isEmpty(taskInfo) && !isEmpty(taskStatus)) {
        getCheckinStatus(checkInData, res => {
            // 断签的非新用户 不会展现任务弹窗
            if(isEmpty(res.notNewUser)) {
                let hasTheTask = taskInfo.some(item => item.id == taskId);
                let taskHadEnd = taskStatus.some(item => item.task_id == taskId && item.status != 0);
                // 用户有未完成的任务
                if(hasTheTask && !taskHadEnd) {
                    // promise返回true
                    deferred.resolve(true);
                    return;
                }
            }
            deferred.resolve(false);
        });
    }else{
        deferred.resolve(false);
    }
    return deferred;
}

export const updateToDoNewUserTask = (taskId, status, page) => {
    let tasksData = newUserTasks_getState();
    // 更新任务信息
    updateNewUserTaskInfo(taskId, status).then((res) => {
        if(res && res.result == 'success') {
            newUserTasks_dispatch({ ...tasksData, todoTask: { id: taskId, page } });
        }
    });
}

/**
 * 更新任务完成情况
 * @param {Number} taskId 待更新任务的id
 * @param {Number} status 要更新的任务状态 1 已完成 2 已领取奖品
 * @returns {Promise<unknown>}
 */
export const updateNewUserTaskInfo = (taskId, status) => {
    console.error('ID: ' + taskId + 'Status: ' + status + 'App:' + ENV.app);
    let newUserTasks = newUserTasks_getState();
    let oldTaskStatus = newUserTasks && newUserTasks.taskStatus;

    // 判断是否不需要再进行更新
    let notUpdate = false;
    if(!isEmpty(oldTaskStatus)) {
        notUpdate = oldTaskStatus.some((item) => {
            return item.task_id == taskId && Number(item.status) >= status;
        });
    }


    return new Promise((resolve, reject) => {
        if(notUpdate) {
            resolve({ 'result': 'fail',"msg": "此任务不能再进行该状态的更新了" });
            console.log('不需要更新了');
        }else {
            api({
                apiName:'aiyong.marketing.newuser.taskinfo.update',
                host: ENV.hosts.trade,
                method: '/activity/updateNewUserTaskInfo',
                isloading: false,
                // dataType:'json',
                args: {
                    taskId,
                    status,
                    app: ENV.app,
                },
                callback: res => {
                    if(res.result === 'success') {
                        let newtasksStatus = oldTaskStatus.map(item => {
                            if(item.task_id == taskId) {
                                if(status == 1) {
                                    return Object.assign({}, item,{ status: 1, endtime: moment().format('YYYY-MM-DD HH:mm:ss') });
                                }else if(status == 2) {
                                    return Object.assign({}, item,{ status: 2, awardtime: moment().format('YYYY-MM-DD HH:mm:ss') });
                                }
                            }
                            return item;
                        })
                        newUserTasks_dispatch({ ...newUserTasks, "taskStatus": newtasksStatus });
                        console.error(JSON.stringify({ ...newUserTasks, "taskStatus": newtasksStatus }) + '组装后的数据');
                    }
                    resolve(res);
                },
                errCallback: err => {
                    reject(err);
                },
            });
        }
    });
};
