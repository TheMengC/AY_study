import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { goClick } from "../utils/biz";
import { hideTabBar, isEmpty, isIOS, NOOP, showTabBar } from "../../utils";
import { closeAdByPid, } from "mapp_common/marketing/action";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { AD_TYPE, CONST_PIDS, MARKET_BEACON_CONST, MARKETING_TYPE } from "tradePublic/marketing/constants";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { ENV } from "@/constants/env";
import { marketingBeacon } from "mapp_common/utils/beacon";

class ModalAD extends Component {

    constructor (props) {
        super(props);
        this.state = { countdown: -1 };
        this.hadBeacon = 0;
    }

    /*
     * @Description 关闭弹窗
    */
    closeModal = (isClick) => {
        const { pid, ad, close } = this.props;
        feedbackClosed({ adData:ad.adInfo });
        closeAdByPid({ pid });
        close();
        if(isClick !== 1 || isIOS()) {
            showTabBar();
        }
    }

    /*
     * @Description 渲染关闭按钮
    */
    renderCloseBox = (countdown) => {
        if (countdown) {
            setTimeout(() => {
                this.setState({ countdown: --countdown });
            }, 1000);
        }
        return (
            countdown ?
                <View>{countdown}秒后可关闭</View> :
                <Image src='' className='closer' onClick={this.closeModal} />
        );
    }

    /*
     * @Description 强提示埋点
    */
    highAdBeacon = (type) => {
        const { pid, from } = this.props;
        const { app } = ENV;
        const { platform } = getSystemInfo();
        const level = 'high';
        if(CONST_PIDS[app][platform]['high'][from] == pid) {
            if(type === MARKET_BEACON_CONST.show && this.hadBeacon === 0) {
                this.hadBeacon = 1;
                marketingBeacon(type, pid, level);
                // 顺便把tabbar藏起来~
                hideTabBar();
            } else if (type === MARKET_BEACON_CONST.click) {
                marketingBeacon(type, pid, level);
            }
        }
    }

    /*
     * @Description 中提示二次弹窗的埋点
    */
    midAdBeacon = () => {
        const { pid } = this.props;
        marketingBeacon(MARKET_BEACON_CONST.second, pid, 'midModal');
    }

    /*
     * @Description 点击广告事件
    */
    handleClickAD = () => {
        if (this.ad && this.ad.user_define && this.ad.user_define.body.hotspace) { // 有hotspace时就是热区广告来了，图片就点击不了
            return;
        }
        const { type } = this.props;
        let goClickArgs = {
            adData: this.ad,
            callback: () => {
                // 如果是ios用户，不要显示付款提示框哦
                this.closeModal(!isIOS());
            },
        };
        if(type === MARKETING_TYPE.commonModal && isIOS()) {
            goClickArgs.customType = AD_TYPE.CONTACT_KEFU;
            goClickArgs.customContent = this.ad.user_define.body.talk_content;
            this.midAdBeacon();
        }
        this.highAdBeacon(MARKET_BEACON_CONST.click);
        goClick(goClickArgs);
    }

    /*
     * @Description 根据request渲染按钮
    */
    renderButs () {
        if (isEmpty(this.ad)) {
            return null;
        }
        const bodyData = this.ad.user_define.body;
        const hotSpace = bodyData.hotspace ? bodyData.hotspace : 0;
        if (!hotSpace) {
            return null;
        }
        const hotSpaceNumArr = [];
        for (let i = 1; i <= hotSpace; i++) {
            hotSpaceNumArr.push(i);
        }
        return hotSpaceNumArr.map(item => {
            if (bodyData[`hotspace${item}`]) {
                const coordata = bodyData[`hotspace${item}`].split(','); // 坐标和按钮的尺寸数据
                return <View onClick={() => {
                    this.highAdBeacon(MARKET_BEACON_CONST.click);
                    goClick({
                        customUrl:bodyData[`hotspace${item}-url`],
                        adData:this.ad,
                        callback: () => {
                            this.closeModal();
                        },
                    });
                }} style={{
                    position: 'absolute',
                    left: `${coordata[0]}rpx`,
                    top: `${coordata[1]}rpx`,
                    width: `${coordata[2]}rpx`,
                    height: `${coordata[3]}rpx`,
                }}
                />;
            }
        });
    }

    render () {
        let { width, height, ad } = this.props;
        let jsx = null;
        let adInfo = {};
        if(isEmpty(ad)) {
        } else {
            this.highAdBeacon(MARKET_BEACON_CONST.show);
            adInfo = ad.adInfo;
            const { countdown } = adInfo.user_define.body;
            const { countdown: currentCount } = this.state;
            let showCount;
            if (countdown == 0 || currentCount === -1) {
                // 此时还没开始倒计时/不需要倒计时，使用广告信息中的倒计时
                showCount = countdown;
            } else {
                // 证明倒计时结束啦
                showCount = currentCount;
            }
            this.ad = adInfo;
            jsx =  (
                <View className='modal-ad-wrapper'>
                    <View className='modal-ad-main'>
                        <Image src={adInfo.img_path} style={{ width: `${width}rpx`, height: `${height}rpx` }}
                            onClick={this.handleClickAD}
                        />
                        {this.renderButs()}
                        <View className='modal-ad-closer'>
                            {this.renderCloseBox(showCount)}
                        </View>
                    </View>
                </View>
            );
        }
        return jsx;
    }
}

ModalAD.defaultProps = {
    pid: 0,
    width: 600,
    height: 720,
    close: NOOP,
};

export default ModalAD;
