import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import './index.scss';
import { isEmpty, isIOS, NOOP } from "mapp_common/utils";
import Marketing from "mapp_common/marketing";
import { AD_TYPE, MARKETING_TYPE } from "tradePublic/marketing/constants";
import { closeAdByPid, couponStartCount, setLastCloseTime } from "mapp_common/marketing/action";
import moment from "mapp_common/utils/moment";
import { goClick } from "mapp_common/marketing/utils/biz";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { getToday } from "tradePublic/utils";

class MidCoupon extends Component {

    constructor (props) {
        super(props);
        this.state = { adState:'coupon' };

        this.endTime = undefined; // 根据这个变量判断优惠券的结束时间
        this.timer = undefined; // 优惠券倒计时的定时器
        this.leftSeconds = undefined; // 倒计时剩余秒数
    }

    /*
     * @Description 点击优惠券事件
    */
    clickCoupon = (content) => {
        const afterFunc = () => {
            // 关闭定时器
            clearInterval(this.timer);
            // 记录时间，后面再进插件就不显示这个广告啦
            setLastCloseTime(this.props.pid);
        };
        if(isIOS()) {
            const { ad } = this.props;
            goClick({
                customType: AD_TYPE.CONTACT_KEFU,
                customContent: content,
                adData: ad.adInfo,
            });
            afterFunc();
            this.closeModal();
        } else {
            this.setState({ adState:'modal' }, afterFunc);
        }
    }

    /*
     * @Description 关闭广告
    */
    closeModal = () => {
        const { pid, ad, close } = this.props;
        feedbackClosed({ adData:ad.adInfo });
        closeAdByPid({ pid });
        close();
    }

    /*
     * @Description 开始倒计时惹
    */
    startCount = () => {
        if(isEmpty(this.timer)) {
            this.timer = setInterval(() => {
                if(this.leftSeconds <= 0) {
                    clearInterval(this.timer);
                    this.closeModal();
                } else {
                    this.setState({});
                }
            }, 1000);
        }
    }

    /*
     * @Description 获取需要展示的倒计时数字
    */
    getCountTime = (fullTime) => {
        let endTime;
        const nowTime = moment();
        if(isEmpty(this.endTime)) {
            // 如果没有得到结束时间，证明还没有算过，那就来算一次吧
            const { pid, ad } = this.props;
            let startTime;
            if(isEmpty(ad.startTime) || ad.startTime.split(' ')[0] !== getToday()) {
                startTime = couponStartCount(pid);
            } else {
                startTime = ad.startTime;
            }
            endTime = moment(startTime).add(fullTime, 'm');
            this.endTime = endTime;
        } else {
            endTime = this.endTime;
        }
        if(endTime > nowTime) {
            // 证明倒计时还没结束，倒计时走起~
            const seconds = endTime.diff(nowTime, 'seconds');
            const min = parseInt(seconds / 60, 10).toString().padStart(2, '0');
            const s = parseInt(seconds % 60, 10).toString().padStart(2, '0');
            this.leftSeconds = seconds;
            return `${min}:${s}`;
        }else{
            return 0;
        }
    }

    render () {
        const { adState } = this.state;
        const { ad, pid } = this.props;
        if(isEmpty(ad)) {
            return null;
        }
        this.ad = ad;
        const body = ad.adInfo.user_define.body;
        const { count_down, ios_service, tip_image } = body;
        const num = this.getCountTime(count_down);
        if(!num) {
            return null;
        }
        this.startCount();
        return (
            adState === 'coupon' ?
                <View className='mid-coupon-wrapper'>
                    <View className='mid-coupon' onClick={() => {
                        this.clickCoupon(ios_service);
                    }}
                    >
                        <View className='timer'>
                            <Text>{num}</Text><Text>后失效</Text>
                        </View>
                        <Image className='img' src={tip_image} />
                    </View>
                </View>
                :
                <Marketing type={MARKETING_TYPE.commonModal} pid={pid} />
        );
    }
}

MidCoupon.defaultProps = {
    pid: 0,
    ad: {},
    close: NOOP,
};

export default MidCoupon;
