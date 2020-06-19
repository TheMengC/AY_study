import Taro, { Component } from '@tarojs/taro';
import { Image, Text, View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { isEmpty, isIOS } from "../../utils";
import moment from "mapp_common/utils/moment";
import './index.scss';
import { ENV } from "@/constants/env";
import { api } from "mapp_common/utils/api";
import RewardCard from '../checkIn/rewardCard/index';
import TaskItem from "mapp_common/newUserVillage/tasks/taskItem";
import RewardMask from 'mapp_common/newUserVillage/checkIn/rewardMask';
import { getFinalAward } from 'mapp_common/newUserVillage/checkIn/index';
import { checkIn_dispatch } from 'mapp_common/newUserVillage/action';
import { getUserInfo } from "mapp_common/utils/userInfoChanger";

const { app } = ENV; // 交易或者商品
@connect((store) => {
    return { checkInData: store.updateNewUserVillageReducer.checkInData, tasksData: store.updateNewUserVillageReducer.tasksData };
})
class CheckIn extends Component {
    config = { navigationBarTitleText: '新人有礼' };

    constructor (props) {
        super(props);
        this.state = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            showCutdown: false,
            showRewardCard: false, // 签到奖励卡片的展示
            checkRewards: '', // 签到奖励的几种展现形态
            showMask: false,
        };
        // 用户名
        this.userNick = '';
        // 操作人
        this.operator = '';

        // 签到奖励的几种展现形态
        this.checkRewards = '';

        // 当前日期
        this.date = moment().format('YYYY-MM-DD');
        // 是否已经签到过
        this.hasCheckIn = false;
        // 当前已连续签到的天数
        this.currentSeries = 0;
        // 是否断签
        this.checkInBreak = false;

        this.smsNumber = '0';
        // 第几轮签到
        this.checkInRound = 'first';
    }

    componentWillMount = () => {
        const userInfo = getUserInfo();
        this.userNick = userInfo.userNick;
        this.operator = userInfo.subUserNick || userInfo.userNick || '';
        const { checkInData } = this.props;
        this.checkInDataObj = checkInData;
        if(!isEmpty(checkInData) && checkInData.data) {
            this.getCheckInInfo(checkInData.data, checkInData.useDiscount);
        }
    }

    componentDidMount () {}
    // 获取签到数据
    getCheckInInfo = (dataArr, useDiscount) => {
        let self = this;
        // 签到数据及是否使用折扣
        let checkInData = dataArr.sort((a, b) => { return new Date(b.checkintime.replace(/-/g, '/')).getTime() - new Date(a.checkintime.replace(/-/g, '/')).getTime();})
        console.log('签到的数据数组', checkInData);
        let diffDay = 0;
        if(!isEmpty(dataArr)) {
            let time1 = self.date.toString();
            let time2 = moment().format(checkInData[0].checkintime).toString();
            let date1 = moment(time1);
            let date2 = moment(time2);
            diffDay = date1.diff(date2, 'day');
        }
        // 当前日期的准点时间
        if (checkInData && (isEmpty(checkInData) || diffDay >= 1)) {
            console.log('没签到或者断签了！');
            // 没有签到过，首次签到 或者是断签啦
            self.currentSeries = 0;
            if (checkInData.length != 0) {
                self.checkInBreak = true;
            }
        } else {
            // 签到过 最新一条数据中的 series 字段代表最近连续签到天数
            self.currentSeries = checkInData && checkInData[0].series * 1;
            if(self.date == checkInData[0].checkintime.substr(0, 10)) {
                self.hasCheckIn = true;
            }
            console.log('努力签到的一员,目前已经签到' + self.currentSeries + '天');
            if (checkInData && checkInData.length > self.currentSeries) {
                // 总记录数大于连续签到数 一定断签过
                self.checkInBreak = true;
            }
        }
        // 判断用户是否领取过第二天的奖励
        let receiveVipNum = checkInData && checkInData.filter(item => item.series * 1 === 2).length || 0;
        if(!self.hasCheckIn) {
            self.doCheckIn({
                userNick: self.userNick,
                operator: self.userNick,
                app: app,
                series: self.currentSeries,
                checkInData: checkInData,
                callback: (checkInRes, smsCount, checkInTime) => {
                    if (checkInRes == 'success') {
                        console.log('签到成功！');
                        self.hasCheckIn = true;
                        self.currentSeries = self.currentSeries + 1;
                        // 在redux中加入今日已签到的记录

                        // 断签了不一定就是第二轮 连续签到两天及以上后断签，此时已领取了高级版 才启动第二轮
                        if(self.checkInBreak) {
                            // 断签了但有签到两天的记录
                            if(receiveVipNum === 1) {
                                // 而本次签到的连续天数 <= 2 说明为第二轮
                                if(self.currentSeries <= 2) {
                                    self.checkInRound = 'second';
                                }
                            }else if(receiveVipNum >= 2) {
                                // 断签 且不止一个签到两天的记录 肯定为第二轮
                                self.checkInRound = 'second';
                            }
                        }
                        self.checkInDataObj.data.push({
                            "app": 'trade',
                            "checkintime": checkInTime,
                            "nick": self.userNick,
                            "operator": self.operator,
                            "remark": smsCount,
                            "series": self.currentSeries,
                        })
                        checkIn_dispatch({ ...self.checkInDataObj, "checkInDate": self.date });
                        // 展现领取签到奖励的弹窗
                        self.changeRewardCard(self.currentSeries, self.checkInRound);
                        // 改变页面原始展示
                        self.changePageState(self.currentSeries, self.checkInBreak, receiveVipNum, smsCount, checkInTime, false);

                    } else {
                        console.log('失败辽');

                        if(self.checkInBreak) {
                            // 断签了但有签到两天的记录
                            if(receiveVipNum === 1) {
                                // 而本次签到的连续天数 <= 2 说明为第二轮
                                if(self.currentSeries <= 2) {
                                    self.checkInRound = 'second';
                                }
                            }else if(receiveVipNum >= 2) {
                                // 断签 且不止一个签到两天的记录 肯定为第二轮
                                self.checkInRound = 'second';
                            }
                        }
                        // 展现页面初始状态
                        self.changePageState(self.currentSeries, self.checkInBreak, receiveVipNum, (checkInData && checkInData[0] && checkInData[0].remark || 0), (checkInData && checkInData[0] && checkInData[0].checkintime || ''), useDiscount);
                    }
                },
            });
        }else{
            // 今日已签到
            if(self.checkInBreak) {
                // 断签了但有签到两天的记录
                if(receiveVipNum === 1) {
                    // 而本次签到的连续天数 <= 2 说明为第二轮
                    if(self.currentSeries <= 2) {
                        self.checkInRound = 'second';
                    }
                }else if(receiveVipNum >= 2) {
                    // 断签 且不止一个签到两天的记录 肯定为第二轮
                    self.checkInRound = 'second';
                }
            }
            self.changePageState(self.currentSeries, self.checkInBreak, receiveVipNum, (checkInData && checkInData[0] && checkInData[0].remark || 0), (checkInData && checkInData[0] && checkInData[0].checkintime || ''), useDiscount);
        }
    }
    /**
     * 签到
     * @param  {String}                 options.userNick    用户名
     * @param  {String}                 options.operator    操作者
     * @param  {String}                 options.app         平台
     * @param  {Number}                 options.series      当前连续天数
     * @param  {Array}                  options.checkInData 当前签到数据
     * @param  {Function}               options.callback    回调
     * @return {}
     */
    doCheckIn = ({ userNick = '', operator = '', app = '' , series = 0, checkInData = [], callback = () => {} }) => {
        console.log(`${userNick}正在进行${app}签到……，当前已连续签到${series}天，历史签到记录为`, checkInData);
        // 判断是否还需要签到
        if (checkInData.length != 0 && moment(checkInData[0].checkintime).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            console.log('今天已经签到过啦！');
            callback('fail');
        }else {
            if (series >= 7) {
                console.log('签满了还来签？！');
                callback('fail');
            } else {
                console.log('可以签到...');
                // 可以改成 promise 放到checkin里
                api({
                    apiName:'aiyong.marketing.newuser.checkininfo.update',
                    host: ENV.hosts.trade,
                    method: '/activity/updateUserCheckInInfo',
                    isloading: false,
                    dataType:'json',
                    args:{
                        userNick,
                        operator,
                        app,
                    },
                    callback: rsp => {
                        console.log('签到结果：', rsp);
                        if (rsp && rsp.result == 'success') {
                            callback('success', rsp.smsCount, rsp.checkInTime);
                        } else {
                            console.log('签到失败了，原因：', rsp);
                            callback('fail');
                        }
                    },
                    errCallback: err => {
                        console.log('sorry', err);
                    },
                });
            }
        }
    }

    // 加工要传递给奖励卡片的数据
    changeRewardCard = (series = 0, checkInRound) => {
        let self = this;
        let cardData = {
            headerText: `${series}天连续签到成功`,
            headerTips: '连续签到7天可获得888条营销短信',
            getRewardText: '领取奖励',
        };
        if (series === 1) {
            // 第一天
            // 1.没有断签过，也就是第一次签到，正常显示高级版领取
            // 2.断签过，可能是第一天断了，可能是第二天领取之后断了
            if (checkInRound === 'first') {
                // 没断签 或者 断了但是没领过
                cardData.cardStatus = 'First-dayOne';
                if (isIOS()) {
                    cardData.rewardContent = '解锁插件所有功能 3天';
                } else {
                    cardData.rewardContent = '获得高级版时长 3天';
                }
            } else {
                // 断签了，并且是领取过了高级版的 送20条短信
                cardData.cardStatus = 'normal';
                cardData.rewardContent = `营销短信20条`;
            }

        }else if (series > 1 && series < 7) {
            // 2-6天 送短信

            // 第一轮第二天签到要显示其他信息
            if(series == 2 && checkInRound === 'first') {
                cardData.cardStatus = 'First-dayTwo';
            }else{
                cardData.cardStatus = 'normal';
                let smsNumber = checkInRound === 'first' ? [0, 30, 15, 5, 10, 15, 10] : [20, 15, 15, 10, 8, 10, 10];
                cardData.rewardContent = `${smsNumber[series - 1]}条`;
                cardData.rewardTips = '满80条即可提取到账户使用';
            }
        } else if(series === 7) {
            cardData.cardStatus = 'endDay';
            cardData.smsTotalNum = checkInRound === 'first' ? 85 : 88;
            cardData.headerText = '恭喜你完成7天签到';
        }
        self.setState({
            dataForRewardCard: cardData,
            showRewardCard: true,
        });
    }
    // 根据天数改变页面状态
    changePageState = (series = 0, checkInBreak = false, receiveVipNum = 0, smsCount = 0, lastCheckInTime = '', useDiscount = false) => {
        console.log('改变页面状态', '连续签到' + series + '天，是否断签' + checkInBreak + '，有几个签到两天的记录' + receiveVipNum)
        let self = this;
        self.useDiscount = useDiscount;
        if (series == 0) {
            self.rewardText = '加载中...';
        } else if (series == 1) {
            // 是否目前已断签并且领过高级版奖励了
            if (checkInBreak && receiveVipNum >= 1) {
                // 断签后的第二轮第一天与第一轮的 2~6 天形态一样，送短信
                self.smsNumber = smsCount;
                self.checkRewards = 'statusTwo';
                self.setState({ checkRewards: 'statusTwo' });
            } else {
                // 第1天形态
                self.checkRewards = 'statusOne';
                self.setState({ checkRewards: 'statusOne' });
            }
        } else {
            if (series == 7) {
                // 如果已经签到了6天了 这次就是第7天也就是最后一次
                // 已获得营销短信 X 条 提取成功
                self.smsNumber = smsCount;
                self.checkRewards = 'statusThree';
                self.setState({ checkRewards: 'statusThree' });
                // 立即使用倒计时
                if(useDiscount == 0) {
                    // IOS下new Date()短横线分隔符的时间日期不生效
                    let formatTime = isIOS() ? lastCheckInTime.replace(/-/g,"/") : lastCheckInTime;
                    let activeEndTime = new Date(formatTime).getTime() + 24 * 60 * 60 * 1000;
                    this.formatCutdown(activeEndTime);
                    checkIn_dispatch({ ...self.checkInDataObj, "activeEndTime": activeEndTime });
                }
            } else {
                // 这里也就是第2到第6天中的形态
                self.rewardText = `已获得营销短信${smsCount}条`;
                self.checkRewards = 'statusTwo';
                self.smsNumber = smsCount;
                self.setState({ checkRewards: 'statusTwo' });
            }

        }
    }



    formatCutdown = (timestamp) => {
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
                    showCutdown: true,
                });
            } else {
                this.setState({ showCutdown: false });
                clearInterval(this.timer);
            }
        }, 1000);

    }

    // 点击查看签到规则
    showTipsMask = () => {
        this.setState({ showMask: true });
    }
    // 短信提取到账户点击
    takeSms = () => {
        if(this.currentSeries < 7) {
            Taro.showToast({ title: '满80条即可提取到账户~' });
            return;
        }
        Taro.showToast({ title: '已提取成功，可在“爱用交易PC端-短信关怀”中使用' });
    }
    getCoupon = () => {
        const { showCutdown } = this.state;
        if(showCutdown) {
            getFinalAward();
        }
    }
    // 新手村页面头部签到部分
    renderHeadCard = () => {
        let currentSeries = this.currentSeries;
        let smsNumber = this.smsNumber;
        let checkInRound = this.checkInRound;
        let self = this;
        const { hours, minutes, seconds, showCutdown, checkRewards } = this.state;
        let showCutdownBtn = false;
        let couponBtnClass = 'reward-btn';
        let couponBtn = isIOS() ? '连续客服' : '立即使用';
        if(checkRewards == 'statusOne') {
            // 奖励区分ios和Android
            self.rewardText = isIOS() ? '今日获得解锁插件所有功能*3天（待激活）' : '今日获得高级版时长*3天（待激活）';
        }else if(checkRewards == 'statusTwo') {
        }else if(checkRewards == 'statusThree') {
            showCutdownBtn = true;
            // 是否已经使用过
            if (self.useDiscount != 0) {
                couponBtnClass = 'reward-btn-end';
                couponBtn = '已使用';
            } else {
                if (showCutdown) {
                    couponBtn = `立即使用 ${hours}:${minutes}:${seconds}`;
                }else {
                    couponBtnClass = 'reward-btn-end';
                    couponBtn = '已过期';
                }
            }
        }
        return (
            <View className='checkin-card'>
                {/* 签到时长以及奖励显示部分 */}
                <View className='card-top'>
                    <View className='top-text'>
                        已连续签到<Text>{currentSeries}</Text>天
                    </View>
                    <View className='top-rules' onClick={() => {this.showTipsMask.bind(this, 'rules');}}>
                        <Image className='rules-icon' src='//q.aiyongbao.com/miniapp/marketing/newuser/rules.png'></Image>
                        规则
                    </View>
                </View>
                <View className='card-mid'>
                    { /* 每日奖励的内容显示 */ }
                    {
                        checkRewards == 'statusOne' ? <View className='status-one'>
                            <Text>今日获得高级版时长 3天 </Text>
                            <Text className='tips'>明天签到即可激活</Text>
                        </View> : null
                    }
                    {
                        checkRewards == 'statusTwo' ? <View className='status-two'>
                            <View className='reward'>
                                <Text className='reward-name'>营销短信</Text>
                                <Text className='reward-number'>{smsNumber}</Text>
                                <View className='reward-btn'>
                                    <Text className='reward-btn-text' onClick={() => {self.takeSms();}}>提到账户</Text>
                                </View>
                            </View>
                            <View className='reward'>
                                <Text className='reward-name'>高级版抵扣券</Text>
                                <Text className='reward-number'>￥0</Text>
                                <View className='reward-btn-wrapper'>
                                    {showCutdownBtn ? <View className='reward-btn'>
                                        <Text>立即使用</Text>
                                    </View> : null
                                    }
                                </View>
                            </View>
                        </View> : null
                    }
                    {
                        checkRewards == 'statusThree' ? <View className='status-two'>
                            <View className='reward'>
                                <Text className='reward-name'>营销短信</Text>
                                <Text className='reward-number'>{smsNumber}</Text>
                                <View className='reward-btn-end'>
                                    <Text className='reward-btn-text' onClick={() => {self.takeSms();}}>已到账</Text>
                                </View>
                            </View>
                            <View className='reward'>
                                <Text className='reward-name'>高级版抵扣券</Text>
                                <Text className='reward-number'>￥20</Text>
                                <View className='reward-btn-wrapper'>
                                    {showCutdownBtn ? <View className={couponBtnClass} onClick={() => {this.getCoupon();}}>
                                        <Text className='reward-btn-text'>{couponBtn}</Text>
                                    </View> : null
                                    }
                                </View>
                            </View>
                        </View> : null
                    }
                </View>
                {/* 签到进度条 */}
                <View className='card-bottom'>
                    <View className='progress-wrapper'>
                        {
                            checkInRound == 'second' ?
                                <Image className='progress-img' src='//q.aiyongbao.com/miniapp/marketing/newuser/dayMid2.png'></Image>
                                : <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayOne.png'}></Image>
                        }
                        <Text className='progress-text'>1天</Text>
                    </View>
                    <View className='progress-wrapper'>
                        {
                            currentSeries >= 2 ?
                                <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid2.png'}></Image>
                                : <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid.png'}></Image>
                        }
                        <Text className='progress-text'>2天</Text>
                    </View>
                    <View className='progress-wrapper'>
                        {
                            currentSeries >= 3 ?
                                <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid2.png'}></Image>
                                : <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid.png'}></Image>
                        }
                        <Text className='progress-text'>3天</Text>
                    </View>
                    <View className='progress-wrapper'>
                        {
                            currentSeries >= 4 ?
                                <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid2.png'}></Image>
                                : <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid.png'}></Image>
                        }
                        <Text className={'progress-text'}>4天</Text>
                    </View>
                    <View className='progress-wrapper'>
                        {
                            currentSeries >= 5 ?
                                <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid2.png'}></Image>
                                : <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid.png'}></Image>
                        }
                        <Text className={'progress-text'}>5天</Text>
                    </View>
                    <View className='progress-wrapper'>
                        {
                            currentSeries >= 6 ?
                                <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid2.png'}></Image>
                                : <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayMid.png'}></Image>
                        }
                        <Text className={'progress-text'}>6天</Text>
                    </View>
                    <View className='progress-wrapper'>
                        {
                            currentSeries >= 7 ?
                                <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayEnd2.png'}></Image>
                                : <Image className='progress-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/dayEnd.png'}></Image>
                        }
                        <Text className={'progress-text'}>7天</Text>
                    </View>
                </View>
            </View>
        );
    }
    closeCard = () => {
        this.setState({ showRewardCard:false });
    }


    //  渲染新手任务部分
    renderTaskCard = () => {
        const { tasksData } = this.props;
        let taskInfo = tasksData && tasksData.taskInfo;
        let taskStatus = tasksData && tasksData.taskStatus;
        let tasksArr = [];
        if(!isEmpty(taskInfo)) {
            // 加工要展现的任务数据
            tasksArr = taskInfo.map((item) => {
                // 有完成情况的任务项

                let [taskItem] = taskStatus.filter(d => d.task_id == item.id);
                let status = taskItem.status;
                return { ...item, status };
            });
        }
        return tasksArr.map(task => {
            let rewardStr = '';
            let btnText = '';
            if (task.reward == 'vip') {
                rewardStr = ` ${task.reward_value} 天高级版`;
            } else if (task.reward == 'sms') {
                rewardStr = ` ${task.reward_value} 条短信`;
            }
            if(task.status == '0') {
                btnText = '立即前往';
            }else if (task.status == '1') {
                btnText = '领奖';
            }else if (task.status == '2') {
                btnText = '已领取';
            }
            return (
                <TaskItem task={{ ...task, rewardStr, btnText }}></TaskItem>
            );
        });
    }
    closeMask = () => {
        this.setState({ showMask: false });
    }
    render () {
        const { showRewardCard, dataForRewardCard, showMask } = this.state;
        let series = this.currentSeries;
        return (
            <View className='newuser'>
                <View className='header-bg'>
                    <Image className='header-img' src={'//q.aiyongbao.com/miniapp/marketing/newuser/header-bg.png'}></Image>
                </View>
                <View className='newuser-body'>
                    <View className='newuser-checkin'>
                        {
                            this.renderHeadCard()
                        }
                    </View>
                    <View className='newuser-tasks'>
                        <Text className='tasks-title'>新手任务</Text>
                        {
                            this.renderTaskCard()
                        }
                    </View>
                </View>
                <RewardCard dataForRewardCard={dataForRewardCard} showCard={showRewardCard} series={series} close={this.closeCard}></RewardCard>
                <RewardMask closeMask={this.closeMask} showMask={showMask}></RewardMask>
            </View>
        );
    }
}
export default CheckIn;
