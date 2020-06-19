import Taro, { Component } from '@tarojs/taro';
import { Button, Image, Swiper, SwiperItem, View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AD_STATE, AD_TYPE, MARKETING_TYPE } from "tradePublic/marketing/constants";
import { closeAdByPid } from "mapp_common/marketing/action";
import { getCurrentPageName, hideTabBar, isEmpty, isIOS, showTabBar, TAB_BAR_PAGES } from "mapp_common/utils";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { goClick } from "mapp_common/marketing/utils/biz";
import { api } from "mapp_common/utils/api";
import { ENV } from "@/constants/env";
import { storage } from "mapp_common/utils/storage";

@connect((store) => {
    return store.marketingAdInfoReducer;
})

class ModalVIP extends Component {

    constructor (props) {
        super(props);

        this.state = {
            current:0,
            showAutoPayDialog:false, // 自动续费引导流程弹窗
        };

        this.ad = {}; // 存放点进来的那个广告的广告信息
        this.pendingLink = undefined; // 进入自动续费流程后，把原有link保留一下，以便用户不走自动续费流程后跳转服务市场
    }

    componentWillMount = () => {
        this.updateModalVipState(this.props);
    }

    componentWillReceiveProps (props) {
        this.updateModalVipState(props);

    }

    /*
     * @Description 更新currentpid方法
    */
    updateModalVipState = (props) => {
        const { [MARKETING_TYPE.modalVip]: ad } = props;
        if(!isEmpty(ad) && ad.state !== AD_STATE.NOT_SHOW && !isEmpty(ad.adInfo)) {
            ad.adInfo.map((item, index) => {
                if(item.pid == ad.currentPid && !isEmpty(item.adData)) {
                    // 如果是指定的pid
                    this.state.current = index;
                    this.ad = item.adData;
                }
            });
        }
    }

    /*
     * @Description 支付按钮点击事件
    */
    onClickBtn = (url) => {
        this.closeAD(1);
        const adData = Object.assign({}, this.ad, { pid:MARKETING_TYPE.modalVip, modalVipPid: this.ad.pid });
        goClick({
            customType: AD_TYPE.FUWU_ORDER,
            adData,
            customUrl: url,
        });
    }

    /*
     * @Description 渲染售卖按钮
    */
    renderBtns = (current, ad) => {
        if(isEmpty(ad.adInfo[current]) || isEmpty(ad.adInfo[current].adData)) {
            return;
        }
        const body = ad.adInfo[current].adData.user_define.body;
        return [2, 3, 4].map(item => {
            let extraClass = '';
            let isAutoRenew = false;
            if(item == body['re-button2']) {
                extraClass = {
                    background:`url(${body['button-image2']})`,
                    backgroundSize: '100% 100%',
                };
            }
            // if (!isEmpty(body[`btn-type${item}`]) && body[`btn-type${item}`] === '1') {
            //     isAutoRenew = true;
            // }
            return (
                <Button style={extraClass} onClick={() => {
                    if(isAutoRenew) {
                        // 自动续费引导暂时不做，二期在做
                        // 进入自动续费引导流程
                        this.enterAutoPayIntro(body[`btn${item}-android-url`]);
                    } else {
                        this.onClickBtn(body[`btn${item}-android-url`]);
                    }
                }} size='mini' type='default'
                >
                    {body[`btn${item}-text`]}
                </Button>
            );
        });
    }

    /*
     * @Description 进入自动续费流程
    */
    enterAutoPayIntro = (linkUrl) => {
        api({
            apiName:'aiyong.user.autorenew.status.get',
            domain:ENV.hosts.trade,
            method: '/iytrade2/checkAutoRenewConditions',

            callback: (rsp) => {
                if (rsp.code == 200) {
                    let matchConditions = rsp.data.matchConditions;
                    storage.setItemSync('matchConditions', matchConditions);
                    if (matchConditions) {
                        this.pendingLink = linkUrl;
                        this.setState({ showAutoPayDialog:true });
                    } else {
                        this.onClickBtn(linkUrl);
                    }
                }
            },
        });
    }

    /*
     * @Description 点击自动续费引导按钮
    */
    clickAutoPayBtn = (isAuto) => {
        if(isAuto) {
            this.setState({ showAutoPayDialog: false });
        } else {
            // 点了「不了谢谢」
            this.onClickBtn(this.pendingLink);
        }
    }

    /*
     * @Description 关闭广告
    */
    closeAD = (isBuy) => {
        feedbackClosed({ adData:this.ad });
        closeAdByPid({ pid:MARKETING_TYPE.modalVip, still:true });
        if(isBuy !== 1 && TAB_BAR_PAGES.includes(getCurrentPageName())) {
            showTabBar();
        }
    }

    render () {
        const { [MARKETING_TYPE.modalVip]: ad } = this.props;
        let jsx = null;
        if(isIOS() || isEmpty(ad) || ad.state === AD_STATE.NOT_SHOW || isEmpty(ad.adInfo)) {
        } else {
            hideTabBar();
            const { current, showAutoPayDialog } = this.state;
            if(showAutoPayDialog) {
                jsx = (
                    <View className='modal-ad-wrapper modal-vip-wrapper auto-pay' >
                        <Image src='//q.aiyongbao.com/trade/web/images/qap_img/pc/auto_renew_dialog.png' className='auto-pay-img' />
                        <View className='btn-group'>
                            <View
                                onClick={this.clickAutoPayBtn.bind(this, 0)}
                                className='auto-pay-btn no-auto'
                            >
                                不了谢谢
                            </View>
                            <View
                                onClick={this.clickAutoPayBtn.bind(this, 1)}
                                className='auto-pay-btn learn-more'
                            >
                                点击了解
                            </View>
                        </View>
                    </View>
                );
            } else {
                jsx = (
                    <View className='modal-ad-wrapper modal-vip-wrapper' >
                        <Image src='http://q.aiyongbao.com/yunying/yunying/activeimg/topshuff.png' className='swipper-banner' />
                        <Swiper
                            className='test-h'
                            indicatorColor='rgba(255,255,255,0.6)'
                            indicatorActiveColor='#fff'
                            indicatorDots
                            current={current}
                            previous-margin='60rpx'
                            next-margin='60rpx'
                            onChange={(a) => {
                                this.setState({ current: a.currentTarget.current });
                            }}
                        >
                            {
                                ad.adInfo.map(item => {
                                    return(
                                        <SwiperItem key={item.pid}>
                                            <Image src={item.adData.img_path} className='swiper-image' />
                                        </SwiperItem>
                                    );
                                })
                            }
                        </Swiper>
                        <View className='swipper-btns'>
                            {
                                this.renderBtns(current, ad)
                            }
                        </View>
                        <Image src='' className='closer' onClick={this.closeAD} />
                    </View>
                );
            }
        }
        return jsx;
    }
}

export default ModalVIP;
