import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { goClick } from "../utils/biz";
import { hideTabBar, isEmpty, NOOP, showTabBar } from "../../utils";
import { closeAdByPid, } from "mapp_common/marketing/action";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { MARKET_BEACON_CONST } from "tradePublic/marketing/constants";
import { marketingBeacon } from "mapp_common/utils/beacon";

class ModalADpc extends Component {

    constructor (props) {
        super(props);
        this.state = {
            countdown: -1,
            width: -1,
            height: -1.,
        };
        this.hadBeacon = 0;
    }

    /*
     * @Description 关闭弹窗
    */
    closeModal = () => {
        const { pid, ad, close } = this.props;
        feedbackClosed({ adData:ad.adInfo });
        closeAdByPid({ pid });
        close();
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
                <View className='counting pcCloser'>{countdown}秒后可关闭</View> :
                <Image src='' className='closer pcCloser' onClick={this.closeModal} />
        );
    }

    /*
     * @Description 点击广告事件
    */
    handleClickAD = () => {
        if (this.ad && this.ad.user_define && this.ad.user_define.body.hotspace) { // 有hotspace时就是热区广告来了，图片就点击不了
            return;
        }
        goClick({
            adData: this.ad,
            callback: () => {
                this.closeModal();
            },
        });
    }

    DoBeacons = (type, level = 'midCoupn') => {
        const { pid } = this.props;
        if(type === MARKET_BEACON_CONST.show && this.hadBeacon === 0) {
            this.hadBeacon = 1;
        }
        marketingBeacon(type, pid, level);
    }

    /*
     * @Description 根据request渲染按钮
    */
    renderButs = () => {
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
        this.DoBeacons(MARKET_BEACON_CONST.show);
        return hotSpaceNumArr.map(item => {
            if (bodyData[`hotspace${item}`]) {
                const coordata = bodyData[`hotspace${item}`].split(','); // 坐标和按钮的尺寸数据
                return <View onClick={() => {
                    this.DoBeacons(MARKET_BEACON_CONST.click, `midCoupn${item}`);
                    goClick({
                        customUrl:bodyData[`hotspace${item}-url`],
                        adData:this.ad,
                        callback: () => {
                            this.closeModal();
                        },
                    });
                }} style={{
                    position: 'absolute',
                    left: `${coordata[0]}px`,
                    top: `${coordata[1]}px`,
                    width: `${coordata[2]}px`,
                    height: `${coordata[3]}px`,
                }}
                />;
            }
        });
    }

    render () {
        let { ad } = this.props;
        let jsx = null;
        let adInfo = {};
        if(isEmpty(ad)) {
        } else {
            adInfo = ad.adInfo;
            const { countdown } = adInfo.user_define.body;
            const { countdown: currentCount, width, height } = this.state;
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
                        <Image src={adInfo.img_path}
                            style={{ width: `${width}px`, height: `${height}px` }}
                            onClick={this.handleClickAD}
                            onLoad={(res) => { this.setState({ width:res.detail.width, height:res.detail.height }); }}
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

ModalADpc.defaultProps = {
    pid: 0,
    width: 700,
    height: 400,
    close: NOOP,
};

export default ModalADpc;
