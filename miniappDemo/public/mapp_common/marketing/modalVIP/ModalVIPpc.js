import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, SwiperItem, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './pcModalVip.scss';
import { AD_STATE, AD_TYPE, MARKETING_TYPE, tradePcVipList } from "tradePublic/marketing/constants";
import { closeAdByPid } from "mapp_common/marketing/action";
import { isEmpty, isIOS } from "mapp_common/utils";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { goClick, showModalVIP } from "mapp_common/marketing/utils/biz";
import { ENV } from "@/constants/env";

const titleContent = {
    trade: '*升级高级版可享受爱用交易所有高级功能，无需二次付费（短信除外)',
    item: '*升级高级版可享受爱用商品所有高级功能，无需二次付费',
};

@connect((store) => {
    return store.marketingAdInfoReducer;
})


class ModalVIPpc extends Component {

    constructor (props) {
        super(props);

        this.ad = {}; // 存放点进来的那个广告的广告信息
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
            ad.adInfo.map(item => {
                if(item.pid == ad.currentPid && !isEmpty(item.adData)) {
                    // 如果是指定的pid
                    this.ad = item.adData;
                }
            });
        }
    }

    /*
     * @Description 支付按钮点击事件
    */
    onClickBtn = (url) => {
        this.closeAD();
        const adData = Object.assign({}, this.ad, { pid:MARKETING_TYPE.modalVip });
        goClick({
            customType: AD_TYPE.FUWU_ORDER,
            adData,
            customUrl: url,
        });
    }

    /*
     * @Description 渲染售卖按钮
    */
    renderBtns = (adInfo) => {
        const body = adInfo.adData.user_define.body;
        return [2, 3, 4].map(item => {
            let extraClass = '';
            if(item - 1 == body['re-button']) {
                extraClass = {
                    background:`url(${body['button-image']})`,
                    backgroundSize: '100% 100%',
                    backgroundColor: 'unset',
                };
            }

            return isEmpty(body[`btn${item}-text`]) ? null : (
                <View className='ad-buy-btn' style={extraClass} onClick={() => {
                    this.onClickBtn(body[`btn${item}-url`]);
                }} size='mini' type='default'
                >
                    {body[`btn${item}-text`]}
                </View>)
            ;
        });
    }

    /*
     * @Description 关闭广告
    */
    closeAD = () => {
        feedbackClosed({ adData:this.ad });
        closeAdByPid({ pid:MARKETING_TYPE.modalVip, still:true });
    }

    renderAdImg = (adInfo) => {
        if(isEmpty(adInfo.adData)) {
            // 兜底广告上！
            const userDefine = '{"body":{"service":"我要订购，52元/季度 https://tb.cn/4P2hmbw \\r\\n  138元/年 https://tb.cn/Wdwgmbw\\r\\n","re-button":"0","btn2-text":"52元/季度","btn2-url":"https://tb.cn/4P2hmbw","btn3-text":"138元/年","btn3-url":"https://tb.cn/Wdwgmbw","ad-text":"升级高级版","button-image":""}}';
            adInfo.adData = {
                'img_path':'http://q.aiyongbao.com/trade/web/images/Intelligence.png',
                'creative_name':'兜底创意',
                'img_size':'500*400',
                'user_define':JSON.parse(userDefine),
                pid: '10101',
                creative_id: '0000',
                open_id: '000000', // 埋点要用的
            };
        }
        const { img_size, img_path } = adInfo.adData;
        const width = !isEmpty(img_size) ? img_size.split('*')[0] + 'px' : 500 ;
        const height = !isEmpty(img_size) ? img_size.split('*')[1] + 'px' : 400;
        return (
            <View className='ad-img'>
                <Image src={img_path} style={{ width, height }} />
            </View>
        );
    }

    changeAd = (index, pid) => {
        if(pid == this.ad.pid) {
            return;
        }
        showModalVIP(pid);
    }

    render () {
        const { [MARKETING_TYPE.modalVip]: ad } = this.props;
        let jsx = null;
        if(isEmpty(ad) || ad.state === AD_STATE.NOT_SHOW || isEmpty(ad.adInfo)) {
        } else {
            const adInfo = ad.adInfo[0];
            jsx = (
                <View className='modal-ad-wrapper pc-modal-vip-wrapper' >
                    <View className='pc-modal-vip'>
                        <View className='title-bar'>
                            <View>{titleContent[ENV.app]}</View>
                            <View onClick={this.closeAD}>x</View>
                        </View>
                        <View className='content'>
                            <View className='menu'>
                                {
                                    tradePcVipList.map((item, index) => {
                                        return (
                                            <View className='menu-btn' onClick={this.changeAd.bind(this, index, item.pid)}>
                                                <Image className='menu-icon' src={item.pid == ad.currentPid ? item.imgPath_high : item.imgPath} />
                                                <Text className='menu-text' style={{ color: item.pid == ad.currentPid ? 'rgb(74, 144, 226)' : 'black' }}>{item.title}</Text>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                            <View className='ad-area'>
                                {
                                    this.renderAdImg(adInfo)
                                }
                                <View className='ad-btns'>
                                    {
                                        this.renderBtns(adInfo)
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
        return jsx;
    }
}

export default ModalVIPpc;
