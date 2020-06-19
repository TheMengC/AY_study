import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './pcNotice.scss';
import { closeAdByPid } from "mapp_common/marketing/action";
import { isEmpty, isIOS } from "mapp_common/utils";
import { goClick } from "mapp_common/marketing/utils/biz";
import { AD_TYPE, MARKETING_TYPE, NOTICE_TYPE } from "tradePublic/marketing/constants";
import { feedbackClosed } from "mapp_common/marketing/feedback";

class NoticePC extends Component {

    constructor (props) {
        super(props);

        this.state = {};
    }

    /*
     * @Description 关闭公告
    */
    closeNotice = () => {
        const { pid, ad, close } = this.props;
        feedbackClosed({ adData:ad.adInfo });
        closeAdByPid({ pid });
        close();
    }

    /*
     * @Description 点击弱提示跳转
    */
    clickNotie = () => {
        const adData = this.adData;
        adData.payUrl = adData.link;
        adData.cid = adData.cid ? adData.cid.split('|')[0] : '';
        adData.pid = MARKETING_TYPE.notice;
        adData.type = NOTICE_TYPE.LOW;
        goClick({
            customType: AD_TYPE.FUWU_ORDER,
            customUrl: adData.link,
            adData,
            needFeedback:false,
        });
    }

    /*
     * @Description 拼接需要展示的数据
    */
    returnShowMessage = (adInfo) => {
        const { lowData } = adInfo;
        let renderContent = {};
        if(!isEmpty(lowData)) {
            const { content, ios_content, link, span, talk_content } = lowData;
            const notice_info = isIOS() ? ios_content : content + span;
            if(isEmpty(notice_info)) {
                return null;
            }
            renderContent = {
                type:NOTICE_TYPE.LOW,
                content:notice_info,
                link,
                talk_content,
            };
            this.adData = lowData;
        }
        return renderContent;
    }

    render () {
        const { ad } = this.props;
        if(isEmpty(ad)) {
            return null;
        }
        const textList = this.returnShowMessage(ad.adInfo);
        if(isEmpty(textList)) {
        } else  {
            return (
                <View className='pc-notice'>
                    <View className='notice-text' onClick={this.clickNotie}>{textList.content}</View>
                    <View className='marketing-closer notice-closer' onClick={this.closeNotice} />
                </View>
            );
        }
    }
}

export default NoticePC;
