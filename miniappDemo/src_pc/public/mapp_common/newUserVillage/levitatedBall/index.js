import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { isEmpty, navigateTo } from "mapp_common/utils";
import { getCheckinStatus } from 'mapp_common/newUserVillage/checkIn/index';
import moment from "mapp_common/utils/moment";

@connect((store) => {
    return { checkInData: store.updateNewUserVillageReducer.checkInData, tasksData: store.updateNewUserVillageReducer.tasksData };
})

class LevitatedBall extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            ballType: '',
        };
        this.checkInDataObj = {};
        this.tasksDataObj = {};
    }

    componentWillReceiveProps (nextProps) {
        const { checkInData, tasksData } = nextProps;
        this.judgeBallType(checkInData, tasksData);
    }

    componentDidMount () {
        const { checkInData, tasksData } = this.props;
        this.judgeBallType(checkInData, tasksData);
    }

    judgeBallType = (checkInData, tasksData) => {
        let self = this;
        let ballType = '';
        // 有签到数据先验证签到情况
        if(!isEmpty(checkInData) && checkInData.data && !isEmpty(tasksData)) {
            self.checkInDataObj = checkInData;
            self.tasksDataObj = tasksData;
            getCheckinStatus(checkInData, (res) => {
                console.log('签到状态判断', res);
                const { countdown, show, notNewUser } = res;
                if(countdown || checkInData.activeEndTime) {
                    ballType = 'redPack';
                    self.countdown = countdown || checkInData.activeEndTime;
                    // 红包倒计时
                    self.formatCountdown(self.countdown);
                }else if(show && (isEmpty(checkInData.checkInDate) || checkInData.checkInDate != moment().format('YYYY-MM-DD'))) {
                    ballType = 'checkIn';
                }else {
                    if(notNewUser) {
                        // 非新用户断签 不显示任何入口
                        ballType = '';
                    }else {
                        const { taskInfo, taskStatus } = tasksData;
                        let tasksArr = taskInfo.map((item) => {
                            let { id, name } = item;
                            return { id, name };
                        });
                        let userTasks = tasksArr.map(item => {
                            let sameIdTask = taskStatus.find(d => {
                                return d.task_id == item.id;
                            });
                            return { ...item, status: sameIdTask.status };
                        })
                        console.log('userTasks', userTasks)
                        // 是否还有未完成或未领取的任务
                        let hasTodoTask = userTasks.some(d => d.status != 2);
                        if(hasTodoTask) {
                            ballType = 'tasks';
                        }
                    }
                }
                self.setState({ ballType });
            });
        }
    }
    formatCountdown = (timestamp) => {
        let self = this;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            let nowtime = new Date().getTime();
            let countdownTime = timestamp - nowtime;
            // 防止出现负数
            if (countdownTime > 1000) {
                let hours = Math.floor((countdownTime / 1000 / 3600) % 24);
                let minutes = Math.floor((countdownTime / 1000 / 60) % 60);
                let seconds = Math.floor(countdownTime / 1000 % 60);

                this.setState({
                    hours: hours < 10 ? "0" + hours : hours,
                    minutes: minutes < 10 ? "0" + minutes : minutes,
                    seconds: seconds < 10 ? "0" + seconds : seconds,
                });
            } else {
                // 倒计时结束刷新入口显示
                self.judgeBallType(self.checkInDataObj, self.tasksDataObj);
                clearInterval(this.timer);
            }
        }, 1000);

    }


    handleCheckIn = () => {
        navigateTo({
            url: '/public/mapp_common/newUserVillage/newUserPage/index',
            params: { },
        });
    }
    /**
     * 渲染悬浮球
     * @returns {*}
     */
    render () {
        const { checkInData } = this.props;
        const { ballType, hours, minutes, seconds } = this.state;
        let jsx = null;
        if(!isEmpty(checkInData) && checkInData.data && ballType) {
            let picUrl = '//q.aiyongbao.com/miniapp/marketing/newuser/check-in-entry.png';
            let ballText = '新人有礼';
            if(ballType === 'redPack') {
                ballText = `${hours}:${minutes}:${seconds}`;
                picUrl = '//q.aiyongbao.com/miniapp/marketing/newuser/checkin-repack.png';
            }else if(ballType === 'checkIn') {
                ballText = '签到有奖';
            }
            jsx = (
                <View className='levitated-container'>
                    <View
                        onClick={this.handleCheckIn}
                    >
                        <Image className='levitated-ball' src={picUrl} />
                        <Text className='ball-text'>{ballText}</Text>
                    </View>
                </View>
            );
        }
        return jsx;
    }
}
export default LevitatedBall;
