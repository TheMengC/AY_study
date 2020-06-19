import Taro, { Component } from '@tarojs/taro';
import { View, Button, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";

import './index.scss';
import { togglePayResult } from "mapp_common/marketing/action";
import {hideTabBar, isEmpty, refreshPlugin, showTabBar} from "mapp_common/utils";
import { AD_STATE } from "tradePublic/marketing/constants";
import { contactCustomerService } from "mapp_common/utils/openChat";
import { ENV } from "@/constants/env";
import { fetchUserInfoFromTcUser } from "mapp_common/utils/userInfo";
import { goLink } from "mapp_common/marketing/utils/biz";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import {showLoading} from "mapp_common/utils/loading";

const payResultContent = {
    payDefault: {
        header: '温馨提示',
        content: ['完成付款后，请根据您的支付情况点击下面的按钮。'],
        leftBtn: '付款遇到问题',
        leftFunc: 'problemClick',
        rightFunc: 'afterPay',
        rightBtn: '已完成付款',
        talkContent: `【${ENV.appName}】我想订购高级版，但是payName失败，我该怎么办？`,
    },
    renewDefault: {
        header: '温馨提示',
        content: ['todotodotodotodo'],
        onlyBtn: '已完成续订',
        onlyFunc: 'afterPay',
    },
    payFail: {
        header: `payName失败`,
        content: [
            '尊敬的用户，您可能在支付过程中遇到以下问题',
            '1.您的支付宝余额不足，建议您先对您的支付宝账户进行充值，完成后再重新支付。',
            '2.您的手机或电脑与支付宝的网络通讯暂时不通，遇到此情况，建议您检查网络后再重新支付。',
            '3.如遇到支付宝已扣款，但订单状态仍显示“待付款”？这可能是银行网络传输发生故障或延时造成的，淘宝会在2个工作日内恢复金额，请耐心等待。',
            '4.如遇“校验错误”，可能是您有“待付款”的订单，请先完成付款，或关闭订单后重新订购。',
            '5.如果问题仍不能解决，请联系客服。',
        ],
        leftBtn: '重新支付',
        rightBtn: '联系客服',
        leftFunc: 'rePay',
        rightFunc: 'problemClick',
        talkContent: '我付款但是没有成功变成高级版怎么办',
    },
    paySuccess: {
        header: `payName成功`,
        content: ['尊敬的高级版用户，您可在手机端及pc端使用以下专属功能'],
        introImg: ENV.payResultImgSource,
        onlyBtn: '立即体验',
        onlyFunc: 'reloadPlugin',
    },
    renewFail: {
        header: '续签失败',
        content: ['尊敬的用户，您可能在续签过程中出现不当操作，导致0元延期失败'],
        leftBtn: '重新操作',
        rightBtn: '联系客服',
        leftFunc: 'rePay',
        rightFunc: 'problemClick',
        talkContent: `【${ENV.appName}】我想0元续订初级版，但是续订失败，我该怎么办？`,
    },
    renewSuccess: {
        header: `续签成功`,
        content: ['尊敬的用户，恭喜您的初级版续签已订购成功。'],
        onlyBtn: '已知晓',
        onlyFunc: 'reloadPlugin',
    },
};

class PayResult extends Component {

    constructor (props) {
        super(props);
        this.state = { contentType: 'payDefault' };
    }

    /*
     * @Description 关闭二次确认弹窗
    */
    onClose = () => {
        const { pid } = this.props;
        showTabBar();
        togglePayResult({ pid, state: AD_STATE.NOT_SHOW });
        this.state.contentType = 'payDefault';
    }

    /*
     * @Description 点击遇到问题按钮
    */
    problemClick = () => {
        const { contentType } = this.state;
        const { talkContent } = payResultContent[contentType];
        contactCustomerService(this.filterText(talkContent));
        // this.onClose();
    }

    /*
     * @Description 点击已完成付款按钮
    */
    afterPay = () => {
        const oldUserInfo = JSON.parse(JSON.stringify(getUserInfo()));
        showLoading();
        fetchUserInfoFromTcUser({
            callback: newUserInfo => {
                Taro.hideLoading();
                let contentType;
                // 如果redux中的信息里包含了续签，那就根据续签的逻辑走
                const { payResultInfo } = this.props;
                if(payResultInfo.isRenew) {
                    // 如果和原来的时间相同，证明续签失败
                    if(oldUserInfo.vipTime == newUserInfo.vipTime) {
                        contentType = 'renewFail';
                    } else {
                        // 如果和原来的时间不同，证明续签成功
                        contentType = 'renewSuccess';
                    }
                } else {
                    if(oldUserInfo.vipFlag == newUserInfo.vipFlag && oldUserInfo.vipTime == newUserInfo.vipTime) {
                        // 如果原有用户信息和现在的保持一致，那证明续费/升级失败了
                        contentType = 'payFail';
                    } else {
                        // 如果和原来的时间不同/vipflag不同，证明升级/续费成功啦
                        if(oldUserInfo.vipTime != newUserInfo.vipTime) {
                            contentType = 'paySuccess';
                        }
                    }
                }
                this.setState({ contentType });
            },
        });
    }

    /*
     * @Description 把模板话术里的部分话术根据用户信息转成相应文字
    */
    filterText = (text) => {
        return text.replace(/payName/g, getUserInfo().showPayBtn);
    }

    /*
     * @Description 重新支付
    */
    rePay = () => {
        const { payResultInfo } = this.props;
        goLink(payResultInfo.url);
        this.setState({ contentType: 'payDefault' });
    }

    /*
     * @Description 立即体验功能
    */
    reloadPlugin = () => {
        console.error('这个时候应该刷新整个插件嗷~');
        this.onClose();
        refreshPlugin();
    }

    render () {
        const { payResultInfo } = this.props;
        let jsx = null;
        if (!isEmpty(payResultInfo) && payResultInfo.state !== AD_STATE.NOT_SHOW) {
            let { contentType } = this.state;
            if (contentType === 'payDefault' && payResultInfo.isRenew) {
                // 这里需要根据是不是续签判断一下默认弹窗的内容
                contentType = 'renewDefault';
            }
            hideTabBar();
            const content = payResultContent[contentType];
            let btns = [];
            let btnText = [];
            const successType = !isEmpty(content.onlyBtn); // 只有成功的时候仅有一个按钮，所以根据这个判断是成功的弹窗
            if (successType) {
                btnText = ['only'];
            } else {
                btnText = ['left', 'right'];
            }
            btnText.map(item => {
                btns.push({
                    name: `${item}Btn`,
                    action: this[content[`${item}Func`]],
                });
            });
            jsx = (
                <AtModal
                    isOpened
                    closeOnClickOverlay={false}
                    className='pay-result-wrapper'
                >
                    <AtModalHeader className={`${contentType}-header`}>
                        <View className='header-title'>{this.filterText(content.header)}</View>
                        {
                            !successType ?
                                <View className='closer' onClick={this.onClose}>X</View>
                                :
                                null
                        }
                    </AtModalHeader>
                    <AtModalContent>
                        {
                            content.content.map(item => {
                                return (
                                    <View className='text-row'>{item}</View>
                                );
                            })
                        }
                        {
                            contentType === 'paySuccess' ?
                                <Image className='paySuccess-img' src={content.introImg} />
                                :
                                null
                        }
                    </AtModalContent>
                    <AtModalAction>
                        {
                            btns.map(item => {
                                return <Button className={`${item.name}`}
                                    onClick={item.action}
                                >{content[item.name]}</Button>;
                            })
                        }
                    </AtModalAction>
                </AtModal>
            );
        }
        return jsx;
    }
}

export default PayResult;
