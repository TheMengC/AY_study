import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.scss';
import { closeAdByPid } from "mapp_common/marketing/action";
import { goClick } from "mapp_common/marketing/utils/biz";
import { isEmpty, NOOP } from "mapp_common/utils";
import { feedbackClosed } from "mapp_common/marketing/feedback";

class TaskMask extends Component {

    constructor (props) {
        super(props);
    }

    /*
     * @Description 关闭广告
    */
    // closeAD = () => {
    //     const { pid, ad, close } = this.props;
    //     feedbackClosed({ adData:ad.adInfo });
    //     closeAdByPid({ pid });
    //     close();
    // }

    componentWillReceiveProps = (props) => {

    }

    /*
     * @Description banner点击事件
    */
    clickAD = (adData) => {
        goClick({ adData });
    }

    render () {
        // let jsx = (
        //     <View className={`banner-ad-wrapper ${extraClass}`}>
        //         <Image className='banner-ad-pic' src={adData.img_path} onClick={this.clickAD.bind(this, adData)} />
        //         <View className='marketing-closer banner-closer' onClick={this.closeAD} />
        //     </View>
        // )
        let jsx = (
            <View className={`banner-ad-wrapper`}>
                <Image className='modal-ad-main' src={'//q.aiyongbao.com/trade/web/images/activity/guide/liheweikai.png'}  />
                <View className='marketing-closer banner-closer' />
            </View>
        )
        return jsx;
    }
}

TaskMask.defaultProps = {
    pid: 0,
    ad: {},
    close: NOOP,
};

export default TaskMask;
