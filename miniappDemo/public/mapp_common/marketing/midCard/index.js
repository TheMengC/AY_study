import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import './index.scss';
import { isEmpty } from "mapp_common/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { ENV } from "@/constants/env";
import { goClick } from "mapp_common/marketing/utils/biz";
import { AD_TYPE } from "tradePublic/marketing/constants";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { closeAdByPid } from "mapp_common/marketing/action";

class MidCard extends Component {

    constructor (props) {
        super(props);
    }

    /*
     * @Description 获取处理后的坐标
    */
    getHotSpace = (ad) => {
        let hotData = [];
        if (!isEmpty(ad) && !isEmpty(ad.adInfo) && !isEmpty(ad.adInfo.user_define) && !isEmpty(ad.adInfo.user_define.body)) {
            const body = ad.adInfo.user_define.body;
            const { hotspace } = body;
            for (let i = 1; i <= hotspace; i++) {
                const space = body[`hotspace${i}`];
                if (!isEmpty(space)) {
                    hotData.push({
                        left: space.split(',')[0] *= 0.72,
                        top: space.split(',')[1] *= 0.72,
                        width: space.split(',')[2] *= 0.72,
                        height: space.split(',')[3] *= 0.72,
                        url: body[`hotspace${i}-url`],
                    });
                }
            }
        }
        return hotData;
    }

    /*
     * @Description 点击热区
    */
    onClickHotSpace = (customUrl) => {
        const { ad } = this.props;
        goClick({
            customType: AD_TYPE.FUWU_ORDER,
            customUrl,
            adData: ad.adInfo,
        });
        this.closeAD();
    }

    /*
     * @Description 关闭广告
    */
    closeAD = () => {
        const { pid, ad, close } = this.props;
        feedbackClosed({ adData: ad.adInfo });
        closeAdByPid({ pid });
        close();
    }

    /*
     * @Description 开启一个倒计时，30秒之后自动关闭
    */
    startTimer = () => {
        if (isEmpty(this.timer)) {
            this.timer = setTimeout(() => {
                this.closeAD();
            }, 30000);
        }
    }

    render () {
        let { ad } = this.props;
        if (isEmpty(ad)) {
        } else {
            const hotSpace = this.getHotSpace(ad);
            const { img_path } = ad.adInfo;
            this.startTimer();
            return (
                <View className='xufei-container' style={{ backgroundImage: `url(${img_path})` }}>
                    {/* 中提示-头部信息 */}
                    <View className='xufei-head'>
                        {/* 店铺头像 */}
                        <Image src={getUserInfo().avatar} className='head-pro-img' />
                        {/* 用户信息 */}
                        <View className='xufei-head-info head-userInfo'>
                            <Text className='userInfo-txt'>
                                <View className='userInfo-nick'>{getUserInfo().userNick}</View>
                                <Image className='crown' src='https://q.aiyongbao.com/item/web/images/crown-VIP.png' />
                            </Text>
                            <Text
                                className='userInfo-txt userInfo-desc'
                            >{`${ENV.appName}高级版 剩余${getUserInfo().vipRemain}天到期，购买后有效期顺延`}</Text>
                        </View>
                        <View className='xufei-next-link' onClick={this.closeAD}>下次再说</View>
                    </View>
                    {/* 设置热区 */}
                    {
                        !isEmpty(hotSpace) && hotSpace.map(hotItem => {
                            return (
                                <View
                                    style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: hotItem.top,
                                        left: hotItem.left,
                                        height: hotItem.height,
                                        width: hotItem.width,
                                    }}
                                    onClick={() => {
                                        this.onClickHotSpace(hotItem.url);
                                    }}
                                >
                                </View>
                            );
                        })
                    }
                </View>
            );
        }
    }
}

export default MidCard;
