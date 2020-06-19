import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text, Image } from '@tarojs/components';

import "./pcStyle.scss";
import { goClick } from "../utils/biz";
import { isEmpty, removeImgHttp } from "../../utils";
import { AD_STATE, AD_TYPE, MARKETING_TYPE } from "tradePublic/marketing/constants";
import { closeAdByPid, triggerAdInfoByPid } from "mapp_common/marketing/action";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { NOOP } from "mapp_common/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";

class AfterActionADpc extends Component {

    constructor (props) {
        super(props);

        this.shouldRenderLongBtn = false;
        this.ad = undefined;
        this.canClose = false;
    }

    componentWillMount () {
        const userInfo = getUserInfo();
        if (userInfo.vipflag == 3) {
            return;
        }
    }

    /*
     * @Description 渲染事后续费的图片
    */
    renderMiddleImg () {
        let { icon1, icon1_title, icon2, icon2_title, icon3, icon3_title } = this.ad.user_define.body;
        icon1 = removeImgHttp(icon1);
        icon2 = removeImgHttp(icon2);
        icon3 = removeImgHttp(icon3);
        const imgArr = [{
            Image: icon1,
            title: icon1_title,
        }, {
            Image: icon2,
            title: icon2_title,
        }, {
            Image: icon3,
            title: icon3_title,
        }];
        return imgArr.map(item => {
            return (
                <View>
                    <Image src={item.Image} className='modalMiddleImg' />
                    <View className='modalMiddleImgText'>{item.title}</View>
                </View>
            );
        });
    }

    /*
     * @Description 渲染事后续费的按钮
    */
    renderModalBtns () {
        let btnArr;
        const { btn1_text, btn1_url, btn2_text, btn2_url, long_btn_text, long_btn_url } = this.ad.user_define.body;
        if (this.shouldRenderLongBtn) {
            btnArr = [{
                text: long_btn_text,
                url: long_btn_url,
            }];
        } else {
            btnArr = [{
                text: btn2_text,
                url: btn2_url,
            }, {
                text: btn1_text,
                url: btn1_url,
            }];
        }
        return btnArr.map(item => {
            return (
                <View className='modalActionBtn' onClick={() => this.goLink(item.url)}>{item.text}</View>
            );
        });
    }

    /*
     * @Description 点击按钮事件
    */
    goLink = (url) => {
        this.closeAD();
        goClick({
            customType: AD_TYPE.FUWU_ORDER,
            adData:this.ad,
            customUrl: url,
        });
    }

    /*
     * @Description 从弹窗广告缩到球球，并且记录状态
    */
    goToBall = () => {
        triggerAdInfoByPid({
            pid:this.props.pid,
            state:AD_STATE.AFTER_ACTION_BALL,
            type:MARKETING_TYPE.afterAction,
        });
    }

    /*
     * @Description 从球球还原成弹窗广告
    */
    backToModal = () => {
        this.canClose = true;
        triggerAdInfoByPid({
            pid:this.props.pid,
            state:AD_STATE.AFTER_ACTION_MODAL,
            type:MARKETING_TYPE.afterAction,
        });
    }

    /*
     * @Description 完全关闭弹窗
    */
    closeAD = () => {
        const { pid, ad, close } = this.props;
        feedbackClosed({ adData:ad.adInfo });
        closeAdByPid({ pid });
        close();
    }

    render () {
        let { ad } = this.props;
        if(isEmpty(ad)) {
            return null;
        }
        let { state } = ad;
        const { adInfo } = ad;
        this.ad = adInfo;
        const adData = adInfo.user_define.body;
        let { caption, close_icon, btn2_url, flag_image, later_text, symbol, title, later_float, long_btn_text } = adData;
        const isModal = state === AD_STATE.AFTER_ACTION_MODAL;
        let suggest = null;
        flag_image = removeImgHttp(flag_image);
        close_icon = removeImgHttp(close_icon);
        symbol = removeImgHttp(symbol);
        if (!isEmpty(flag_image)) {
            suggest = <Image src={flag_image} className='suggestImg' />;
        }
        this.shouldRenderLongBtn = !isEmpty(long_btn_text);
        return (
            isModal ?
                // 事后续费弹窗
                <View className='modal-ad-wrapper pc-after-action-modal'>
                    <View className='dialogContent afterActionModal'>
                        <Image src={symbol} className='modalTopImage' />
                        <View className='modalTitle'>{title}</View>
                        <View className='modalText'>
                            {caption}
                        </View>
                        <View className='modalMiddleImgWrap'>
                            {this.renderMiddleImg()}
                        </View>
                        <View className='modalBtnsWrap'>
                            {this.renderModalBtns()}
                            {
                                !isEmpty(suggest) && !(this.shouldRenderLongBtn) ? suggest : null
                            }
                        </View>
                    </View>
                    {
                        this.canClose ?
                            <Image src={close_icon} className='modalDownBtn modalDownImg' onClick={this.closeAD} />
                            :
                            <View className='modalDownBtn' onClick={this.goToBall}>{later_text}</View>
                    }
                </View>
                :
                // 事后续费收起球球
                <View className='pc-after-action-ball'>
                    <View onClick={this.backToModal} className='commonBallStyle'>
                        <Image src={later_float} alt=''
                            className='afterActionBallImg'
                        />
                    </View>
                </View>
        );
    }
}

AfterActionADpc.defaultProps = {
    pid: 0,
    ad: {},
    close: NOOP,
};

export default AfterActionADpc;
