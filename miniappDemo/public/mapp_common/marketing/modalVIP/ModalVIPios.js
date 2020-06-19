import Taro, { Component } from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import './index.scss';
import { AD_STATE, MARKETING_TYPE } from "tradePublic/marketing/constants";
import { isEmpty } from "mapp_common/utils";
import { ENV } from "@/constants/env";
import { goClick } from "mapp_common/marketing/utils/biz";

@connect((store) => {
    return store.marketingAdInfoReducer;
})

class ModalVIPios extends Component {

    config = { navigationBarTitleText: ' ' }

    constructor (props) {
        super(props);
        this.pid = undefined;
    }

    componentWillMount () {
        const pid = this.$router.params.pid;
        this.pid = pid;
    }

    /*
     * @Description 点击联系客服按钮
    */
    clickBtn = () => {
        goClick({
            customType: 3,
            adData: this.adBody,
            customContent: `我是ios用户，想使用${ENV.appName}-${this.adBody.creative_name.split('-')[1].split('ios')[0]}功能，请帮我处理！`,
        });
    }

    render () {
        const { [MARKETING_TYPE.modalVip]: ad } = this.props;
        if(isEmpty(ad) || ad.state === AD_STATE.NOT_SHOW || isEmpty(ad.adInfo)) {
            return null;
        }
        let adBody = ad.adInfo[0].adData;
        if(isEmpty(this.adBody)) {
            ad.adInfo.map(item => {
                if(item.pid == this.pid) {
                    if(!isEmpty(item.adData)) {
                        adBody = item.adData;
                    }
                }
            });
            this.adBody = adBody;
        } else {
            adBody = this.adBody;
        }
        const adIntroSrc = ENV.app === 'trade' ? '//q.aiyongbao.com/trade/web/images/qap_img/mobile/GuideIosTrade.png' : '//q.aiyongbao.com/item/web/images/qap_img/mobile/GuideIosTrade.png' ;
        return (
            <View className='modal-vip-ios-page'>
                <Image className='ad-img' src={adBody.img_path}></Image>
                <Button className='ad-btn' type='primary' onClick={this.clickBtn}> 联系客服，使用该功能 </Button>
                <Image className='ad-intro' src={adIntroSrc} />
            </View>
        );
    }
}

export default ModalVIPios;
