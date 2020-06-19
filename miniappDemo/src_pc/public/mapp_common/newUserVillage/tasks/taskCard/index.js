import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import './index.scss';
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { ENV } from "@/constants/env";
import { isEmpty, navigateTo, NOOP } from "mapp_common/utils";
import { connect } from "@tarojs/redux";
import { updateNewUserTaskInfo } from "mapp_common/newUserVillage/tasks";
import { newUserTasks_dispatch } from  'mapp_common/newUserVillage/action';

const { app } = ENV;
@connect((store) => {
    return { tasksData: store.updateNewUserVillageReducer.tasksData };
})
class TaskCard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            showCard: false,
            cardStatus: 'getReward',
        };
        this.platform = getSystemInfo().platform;
        this.taskId = '';
    }
    componentWillReceiveProps (nextProps) {
        const { tasksData, tasksArr, page } = nextProps;
        console.log('redux里的任务数据进行更新啦！');

        let todoTask = tasksData.todoTask || {};
        this.taskId = todoTask.id || '';
        console.log(page + '页面的任务数组为' + JSON.stringify(tasksArr) + '要进行的任务id为' + todoTask.id);
        if(tasksArr && tasksArr.includes(todoTask.id)) {
            if(todoTask.page == page) {
                this.setState({ showCard: true });
                updateNewUserTaskInfo(todoTask.id, 1);
            } else if(todoTask.id == 14 && todoTask.page == 'tradeSearch') {
                this.setState({ showCard: true });
                updateNewUserTaskInfo(todoTask.id, 1);
            }

        }
    }

    cardBtnClick = (type) => {
        if(type === 'getReward') {
            this.setState({ cardStatus: 'goNewUserPage' });
            updateNewUserTaskInfo(this.taskId, 2);
        }else if(type === 'goNewUserPage') {
            navigateTo({ url: '/public/mapp_common/newUserVillage/newUserPage/index' });
            this.closeCard();
        }
    }
    closeCard = () => {
        const { tasksData } = this.props;
        newUserTasks_dispatch({ ...tasksData, todoTask: {} });
        this.setState({ showCard: false });
    }

    componentWillUnmount () {
        this.closeCard();
    }

    render () {
        const { showCard, cardStatus } = this.state;
        let jsx = null;
        // 根据props传递的内容来展示相关任务的信息
        if(showCard) {
            if(cardStatus === 'getReward') {
                jsx = (
                    <View className='task-card-wrapper'>
                        <View className='task-card'>
                            <Image className='reward-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/tasks-rewardBox.png'}></Image>
                            <View className='reward-content'>
                                <Text className='reward-title'>获得奖励</Text>
                                <Text className='reward-name'>高级版时长*1天</Text>
                            </View>
                            <Text className='reward-tips'>高级版需重进插件进行激活</Text>
                            <View
                                className='reward-btn'
                                onClick={() => {this.cardBtnClick(cardStatus)}}>
                                <Text className='reward-btn-text'>立即领取</Text>
                            </View>
                            <Image
                                className='task-card-close'
                                onClick={() => {this.closeCard();}}
                                src='//q.aiyongbao.com/miniapp/marketing/newuser/card-black-close.png'
                            >
                            </Image>
                        </View>
                    </View>
                );
            }else if(cardStatus === 'goNewUserPage') {
                jsx = (
                    <View className='task-card-wrapper'>
                        <View className='task-card'>
                            <Image className='reward-img' src='//q.aiyongbao.com/miniapp/marketing/newuser/tasks-rewardBoxOpen.png'></Image>
                            <View className='reward-content'>
                                <Text className='reward-title'>领取成功!</Text>
                            </View>
                            <Text className='reward-tips'>新人专区获得更多福利！</Text>
                            <View
                                className='reward-btn'
                                onClick={() => {this.cardBtnClick(cardStatus);}}>
                                <Text className='reward-btn-text'>进入新人专区</Text>
                            </View>
                            <Image
                                className='task-card-close'
                                onClick={() => {this.closeCard();}}
                                src='//q.aiyongbao.com/miniapp/marketing/newuser/card-black-close.png'
                            >
                            </Image>
                        </View>
                    </View>
                );
            }
        }
        return jsx;
    }
}

export default TaskCard;
