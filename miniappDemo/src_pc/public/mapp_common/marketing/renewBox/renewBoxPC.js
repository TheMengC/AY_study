import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { ENV } from "@/constants/env";
import './index.scss';
import { renewData } from "mapp_common/utils/userInfo";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { closeAdByPid, setLastCloseTime } from "mapp_common/marketing/action";
import { isEmpty, NOOP } from "mapp_common/utils";
import Marketing from "mapp_common/marketing";
import { MARKETING_TYPE } from "tradePublic/marketing/constants";
import { feedbackClosed, feedbackShowed } from "mapp_common/marketing/feedback";

class RenewBoxPC extends Component {

    constructor (props) {
        super(props);
        this.state = {
            midModalState:'box',
            closeNow:false,
        };
    }

    /*
     * @Description 处理中提示滑块内容
    */
    dealBoxContent = (adInfo) => {
        if(!isEmpty(this.bocContentInfo)) {
            return this.bocContentInfo;
        }
        let contentSource = {};
        let bocContentInfo = {};
        if (getSystemInfo()['platform'] === 'iOS') {
            // ios话术
            contentSource = adInfo.user_define.body;
            bocContentInfo = {
                box_content: contentSource.box_content,
                box_span: contentSource.box_span,
                talk_content: contentSource.talk_content,
            };
        } else {
            contentSource = renewData.userdata.renewDatas;
            if(!isEmpty(contentSource)) {
                let box_content = contentSource.message.replace(/\|/g, '');
                const box_span = contentSource.span ? contentSource.span : '立即续费';
                bocContentInfo = {
                    box_content,
                    box_span,
                };
            }
        }
        this.bocContentInfo = bocContentInfo;
        return bocContentInfo;
    }

    /*
     * @Description 关闭弹窗
    */
    closeModal = () => {
        this.setState({ closeNow:true }, () => {
            setTimeout(() => {
                const { pid, ad, close } = this.props;
                feedbackClosed({ adData:ad.adInfo });
                closeAdByPid({ pid });
                close();
            }, 1000);
        });
    }

    /*
     * @Description 点击中提示事件，把滑动的弹窗变成弹窗广告~
    */
    clickBox = () => {
        this.setState({ midModalState: 'modal' }, () => {
            clearTimeout(this.timer);
            const { pid, ad } = this.props;
            feedbackShowed({ adData:ad.adInfo });
            // 理论上来说，只要对中提示进行了操作，今天就不要展示了，但是呢如果这时候直接使用关闭中提示的广告，
            // 弹窗也就出不来啦，所以这里等广告弹出之后，我们把lastClosedTime设置了，下次就没有惹
            setLastCloseTime(pid);
        });
    }

    /*
     * @Description 开始关闭的计时器
    */
    startTimer = () => {
        if(isEmpty(this.timer)) {
            this.timer = setTimeout(() => {
                // 在中提示动画结束之后关闭弹窗
                this.closeModal();
            }, 30000);
        }
    }

    render () {
        const { pid, ad } = this.props;
        if(isEmpty(ad)) {
            return null;
        }
        const { midModalState, closeNow } = this.state;
        const { adInfo } = ad;
        const { box_content, box_span, talk_content } = this.dealBoxContent(adInfo);
        const clickBoxEvent = () => {
            this.clickBox(talk_content);
        };
        this.startTimer();
        return (
            <View className={`renew-box-wrapper ${closeNow ? 'close-now' : ''}`}>
                {
                    midModalState === 'box' ?
                        <View className='renew-box' >
                            <View className='content'>
                                <View className={'renew-img-'+ENV.app} />
                                <View className='renew-text' >
                                    {box_content}
                                </View>
                            </View>
                            <View className='btns'>
                                <Text className={'dismiss-'+ENV.app} onClick={this.closeModal}>我知道了</Text>
                                <View type='secondary' size='small' className={`${ENV.app}btn ${ENV.app}btn-normal2 ${ENV.app}btn-solid`} onClick={clickBoxEvent}>{box_span}</View>
                            </View>
                        </View>
                        :
                        <Marketing type={MARKETING_TYPE.commonModal} pid={pid} close={this.closeModal} />
                }
            </View>
        );
    }
}

RenewBoxPC.defaultProps = {
    pid: 0,
    close: NOOP,
};

export default RenewBoxPC;
