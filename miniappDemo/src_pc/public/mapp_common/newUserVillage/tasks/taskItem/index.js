import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';
import { isEmpty } from "mapp_common/utils";
import { updateNewUserTaskInfo } from "mapp_common/newUserVillage/tasks";
import { goToListTab } from "pages/tradeIndex/action";
class TaskItem extends Component {

    constructor (props) {
        super(props);
    }
    /**
     * 任务按钮功能
     * @param  {Number}                 taskId          任务id
     * @param  {String}                 taskBtnType     按钮功能类型
     * @param  {String}                 taskBtnMsg      按钮话术（如果跳转客服）
     * @param  {Number}                 taskStatus      任务状态
     * @param  {String}                 taskPageName    任务跳转页面（如果需要）
     */
    taskBtnFun = (taskId, taskBtnType, taskBtnMsg, taskStatus, taskPageName) => {
        if (taskStatus == 0) {
            // 状态为进行中的话进行页面跳转或者别的提示
            if (taskBtnType == 'page') {
                if (taskPageName) {
                    // 跳转到相应的页面
                    let tab = 'WAIT_SELLER_SEND_GOODS';
                    if(taskId == 10) {
                        tab = 'WAIT_BUYER_PAY';
                    }else if(taskId == 11 || taskId == 15) {
                        tab = 'NEED_RATE';
                    }
                    goToListTab(tab);
                } else {
                    Taro.showToast({ title: '未配置page' });
                }
            } else {
                // 设置默认插件等特殊功能，特殊处理
            }
        }else if (taskStatus == 1) {
            // 任务完成进行领奖
            updateNewUserTaskInfo(taskId, 2).then((res) => {
                console.error(JSON.stringify(res));
                if(res && res.result == 'success') {
                    Taro.showToast({ title: '领取成功' });
                }
                // else {
                //     Taro.showToast({ title: '或者是领取失败！请联系客服！' });
                // }
            });
        }
        // 任务状态为2或者其他则已经完成或者未知状态，不处理
    }
    render = () => {
        let { task } = this.props;
        let jsx = null;
        let taskBtn = 'task-btn-light';
        if(!isEmpty(task)) {
            if(task.status == 2) {
                taskBtn = 'task-btn-dark';
            }
            jsx = (
                <View className='task-item'>
                    <Image src={`//q.aiyongbao.com/miniapp/marketing/newuser/${task.img}`} className='task-img' />
                    <View className='task-text'>
                        <Text className='task-name'>{task.desc}</Text>
                        <View className='task-reward'>
                            <Text>获得</Text>
                            <Text className='reward-content'>{task.rewardStr}</Text>
                        </View>
                    </View>
                    <View className={taskBtn} onClick={() => {this.taskBtnFun(task.id, task.btn_type, task.message, task.status, task.page);}}>
                        {
                            task.status == 1 ? <Image src='//q.aiyongbao.com/miniapp/marketing/newuser/reward-box.png' className='task-btn-img'></Image> : null
                        }
                        <Text className='task-btn-text'>{task.btnText}</Text>
                    </View>
                </View>
            );
        }
        return jsx;
    }
}

export default TaskItem;
