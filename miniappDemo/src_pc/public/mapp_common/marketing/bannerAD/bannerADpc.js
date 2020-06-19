import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.scss';
import { closeAdByPid } from "mapp_common/marketing/action";
import { goClick } from "mapp_common/marketing/utils/biz";
import { isEmpty, NOOP } from "mapp_common/utils";
import { feedbackClosed } from "mapp_common/marketing/feedback";

class BannerADpc extends Component {

    constructor (props) {
        super(props);
    }

    /*
     * @Description 关闭广告
    */
    closeAD = () => {
        const { pid, ad, close } = this.props;
        feedbackClosed({ adData:ad.adInfo });
        closeAdByPid({ pid });
        close();
    }

    componentWillReceiveProps = (props) => {

    }

    /*
     * @Description banner点击事件
    */
    clickAD = (adData) => {
        goClick({ adData });
    }

    render () {
        let { ad, from } = this.props;
        let jsx = null;
        if(isEmpty(ad)) {
        } else {
            const adData = ad.adInfo;
            let extraClass = '';
            jsx = (
                <View className={`pc banner-ad-wrapper ${extraClass}`}>
                    <View className='banner-ad-pic' style={{ backgroundImage:`url(${adData.img_path})` }} onClick={this.clickAD.bind(this, adData)} />
                    <View className='marketing-closer banner-closer' onClick={this.closeAD} />
                </View>
            );
        }
        return jsx;
    }
}

BannerADpc.defaultProps = {
    pid: 0,
    ad: {},
    close: NOOP,
};

export default BannerADpc;
