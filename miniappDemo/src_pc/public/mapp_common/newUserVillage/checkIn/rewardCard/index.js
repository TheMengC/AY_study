import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { getFinalAward } from 'mapp_common/newUserVillage/checkIn/index';
import { isIOS } from "mapp_common/utils";

class RewardCard extends Component {

    constructor (props) {
        super(props);
        this.state = {};
        this.platform = getSystemInfo().platform;

    }

    // 领取奖励按钮
    getReward = () => {
        const { series, close } = this.props;
        // 当天未第七天签到，点击领取奖励有额外动作
        if(series >= 7) {
            getFinalAward();
        }
        Taro.showToast({ title: '领取成功~' });
        close();
    }

    render () {
        let { showCard, series, dataForRewardCard, close } = this.props;
        let jsx = null;
        let bgPic = series >= 7 ? 'checkinCard-bg-Seven.png' : 'checkinCard-bg.png';

        if(showCard) {
            if(dataForRewardCard.cardStatus == 'First-dayOne' || dataForRewardCard.cardStatus == 'normal') {
                jsx = (
                    <View className='reward-card-wrapper'>
                        <View className='reward-card'>
                            <Image className='bg-img' src={`//q.aiyongbao.com/miniapp/marketing/newuser/${bgPic}`}></Image>
                            <View className='card-content'>
                                <View className='reward-top'>
                                    <Text className='text'>
                                        {dataForRewardCard.headerText}
                                    </Text>
                                    <Text className='tips'>
                                        连续签到7天最高可获得
                                        <Text className='tips-number'>888</Text>
                                        条短信
                                    </Text>
                                </View>
                                {
                                    dataForRewardCard.cardStatus == 'First-dayOne' ?
                                        <View className='reward-mid'>
                                            <Image className='mid-icon' src='//q.aiyongbao.com/miniapp/marketing/newuser/checkinCard-dayOne.png'></Image>
                                            <View className='mid-text'>
                                                {this.platform == 'iOS' ? '解锁插件所有功能' : '获得高级版时长'}
                                                <Text className='vipdays'>3天</Text>
                                            </View>
                                            <View className='mid-tips'>
                                                <Text>明日签到可激活奖励</Text>
                                            </View>
                                        </View>
                                        : <View className='reward-mid'>
                                            <Image className='mid-icon' src='//q.aiyongbao.com/miniapp/marketing/newuser/smspic-big.png'></Image>
                                            <View className='mid-text'>
                                                获得营销短信
                                                <Text className='vipdays'>{dataForRewardCard.rewardContent}</Text>
                                            </View>
                                            <View className='mid-tips'>
                                                <Text>{dataForRewardCard.rewardTips}</Text>
                                            </View>
                                        </View>
                                }

                                <View className='reward-bottom' onClick={() => {this.getReward();}}>
                                    <Image className='btn-img' src='//q.aiyongbao.com/miniapp/marketing/newuser/checkinCard-Btn.png.png'></Image>
                                    <View className='btn-text'>
                                        <Text className='content'>领取奖励</Text>
                                    </View>
                                </View>
                            </View>
                            <Image className='close-img' onClick={() => {close();}} src='//q.aiyongbao.com/miniapp/marketing/newuser/card-white-close.png'></Image>
                        </View>
                    </View>
                );
            }else if(dataForRewardCard.cardStatus == 'First-dayTwo') {
                jsx = (
                    <View className='reward-card-wrapper'>
                        <View className='reward-card'>
                            <Image className='bg-img' src={`//q.aiyongbao.com/miniapp/marketing/newuser/${bgPic}`}></Image>
                            <View className='card-content'>
                                <View className='reward-top'>
                                    <Text className='text'>
                                        {dataForRewardCard.headerText}
                                    </Text>
                                    <Text className='tips'>
                                        连续签到7天最高可获得
                                        <Text className='tips-number'>888</Text>
                                        条短信
                                    </Text>
                                </View>
                                <View className='reward-mid'>
                                    <View className='mid-part'>
                                        <Image className='mid-icon2' src='//q.aiyongbao.com/miniapp/marketing/newuser/smspic-small.png'></Image>
                                        <View className='part-text'>
                                            <View className='mid-text'>
                                                获得营销短信
                                                <Text className='vipdays'> 30条</Text>
                                            </View>
                                            <Text className='part-tips'>满80条即可提取</Text>
                                        </View>
                                    </View>
                                    <View className='mid-part'>
                                        <Image className='mid-icon2' src='//q.aiyongbao.com/miniapp/marketing/newuser/vip-small.png'></Image>
                                        <View className='part-text'>
                                            <View className='mid-text'>
                                                {this.platform == 'iOS' ? '解锁插件所有功能' : '获得高级版时长'}
                                                <Text className='vipdays'>3天</Text>
                                            </View>
                                            <Text className='part-tips'>重新打开插件即可获得</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className='reward-bottom' onClick={() => {this.getReward();}}>
                                    <Image className='btn-img' src='//q.aiyongbao.com/miniapp/marketing/newuser/checkinCard-Btn.png.png'></Image>
                                    <View className='btn-text'>
                                        <Text className='content'>领取奖励</Text>
                                    </View>
                                </View>
                            </View>
                            <Image className='close-img' onClick={() => {close();}} src='//q.aiyongbao.com/miniapp/marketing/newuser/card-white-close.png'></Image>
                        </View>
                    </View>
                );
            }else if(dataForRewardCard.cardStatus == 'endDay') {
                jsx = (
                    <View className='reward-card-wrapper'>
                        <View className='reward-card endDay'>
                            <Image className='bg-img' src={`//q.aiyongbao.com/miniapp/marketing/newuser/${bgPic}`}></Image>
                            <View className='card-content'>
                                <View className='reward-top'>
                                    <Text className='text'>
                                        {dataForRewardCard.headerText}
                                    </Text>
                                </View>
                                <View className='reward-mid'>
                                    <View className='mid-part'>
                                        <Image className='mid-icon2' src='//q.aiyongbao.com/miniapp/marketing/newuser/smspic-small.png'></Image>
                                        <View className='part-text'>
                                            <View className='mid-text'>
                                                获得营销短信
                                                <Text className='vipdays'> 10条</Text>
                                            </View>
                                            <Text className='part-tips'>共{dataForRewardCard.smsTotalNum}条，已提到账户</Text>
                                        </View>
                                    </View>
                                    <View className='mid-part'>
                                        <Image className='mid-icon2' src='//q.aiyongbao.com/miniapp/marketing/newuser/redpack2.png'></Image>
                                        <View className='part-text'>
                                            <View className='mid-text'>
                                                获得红包
                                                <Text className='vipdays'>20元</Text>
                                            </View>
                                            <Text className='part-tips'>{isIOS() ? '仅供解锁插件使用' : '仅供购买高级版使用'}</Text>
                                        </View>
                                    </View>
                                    <View className='endday-tips'>
                                        <Text className='tips-content'>解锁插件所有功能限时福利，</Text>
                                        <Text className='tips-content'>24小时内有效！</Text>
                                    </View>
                                </View>
                                <View className='reward-bottom' onClick={() => {this.getReward();}}>
                                    <Image className='btn-img' src='//q.aiyongbao.com/miniapp/marketing/newuser/checkinCard-Btn.png.png'></Image>
                                    <View className='btn-text'>
                                        <Text className='content'>{isIOS() ? '联系客服解锁插件奖励' : '现在升级高级版，立减20' }</Text>
                                    </View>
                                </View>
                            </View>
                            <Image className='close-img' onClick={() => {close();}} src='//q.aiyongbao.com/miniapp/marketing/newuser/card-white-close.png'></Image>
                        </View>
                    </View>
                );
            }
        }
        return jsx;
    }
}

export default RewardCard;
