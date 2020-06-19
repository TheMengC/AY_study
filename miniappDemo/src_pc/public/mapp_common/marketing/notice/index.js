import Taro, { Component } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Text } from '@tarojs/components';
import { ENV } from "@/constants/env";
import './index.scss';
import { closeAdByPid } from "mapp_common/marketing/action";
import { hideTabBar, isEmpty, isIOS } from "mapp_common/utils";
import { goClick } from "mapp_common/marketing/utils/biz";
import { AD_TYPE, MARKET_BEACON_CONST, MARKETING_TYPE, NOTICE_TYPE } from "tradePublic/marketing/constants";
import { feedbackClosed } from "mapp_common/marketing/feedback";
import { marketingBeacon } from "mapp_common/utils/beacon";

class Notice extends Component {

    constructor (props) {
        super(props);

        this.state = {
            noticeExpanded:false,
            currentNotice:undefined,
            current:0,
        };

        this.hadBeacon = 0;
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
     * @Description 点击公共/弱提示跳转
    */
    clickNotie = (adData) => {
        if(isEmpty(adData)) {
            return;
        }
        adData.pid = MARKETING_TYPE.notice;
        if(adData.type === NOTICE_TYPE.LOW) {
            this.weakAdBeacon(MARKET_BEACON_CONST.click);
        }
        if(adData.type === NOTICE_TYPE.LOW && adData.showType == 3) {
            // 安卓和iOS用户直接跳转旺旺
            goClick({
                customType: AD_TYPE.CONTACT_KEFU,
                customContent: adData.talk_content,
                needFeedback:false,
                adData,
            });
        } else if(adData.type === NOTICE_TYPE.LOW && isIOS()) {
            // 如果是弱提示，ios，那联系客服
            goClick({
                customType: AD_TYPE.CONTACT_KEFU,
                customContent: adData.talk_content,
                needFeedback:false,
                adData,
            });
        } else {
            if(!isEmpty(adData.link)){
                goClick({
                    customType: AD_TYPE.FUWU_ORDER,
                    customUrl: adData.link,
                    adData,
                    needFeedback:false,
                });
            }
        }
    }

    /*
     * @Description 点击公告展开
    */
    clickToExpand = (currentNotice, current) => {
        this.setState({
            noticeExpanded:true,
            currentNotice,
            current,
        });
    }

    /*
     * @Description 点击收起公告
    */
    clickToCollapse = () => {
        this.setState({ noticeExpanded:false });
    }

    /*
     * @Description 拼接需要展示的数据
    */
    returnShowMessage = (adInfo) => {
        const { notice, lowData } = adInfo;
        let renderContent = [];
        if(!isEmpty(notice)) {
            renderContent.push({
                type:NOTICE_TYPE.NOTICE,
                content:notice.content,
                link:notice.adlink,
            });
        }
        if(!isEmpty(lowData)) {
            const { content, ios_content, link, span, talk_content, type } = lowData;
            const notice_info = isIOS() ? ios_content : content + span;
            if(!isEmpty(notice_info)) {
                renderContent.push({
                    type:NOTICE_TYPE.LOW,
                    showType: type,
                    content:notice_info,
                    link,
                    talk_content,
                });
            }
        }
        return renderContent;
    }

    renderSeeMore = (currentNotice) => {
        // 当且仅当有链接的时候才渲染查看详情
        let jsx = null;
        if(!isEmpty(currentNotice) && !isEmpty(currentNotice.link)) {
            jsx = (
                <View className='notice-more' onClick={this.clickNotie.bind(this, currentNotice)}>查看详情</View>
            );
        }
        return jsx;
    }

    /*
     * @Description 弱提示埋点
    */
    weakAdBeacon = (type) => {
        const { pid, ad } = this.props;
        let level = 'weak';
        if(!isEmpty(ad.adInfo) && !isEmpty(ad.adInfo.lowData)) {
            // 到期三天的弱提示文案修改的埋点
            if (ad.adInfo.lowData.type == 3) {
                level = 'weakXiaoshou';
            }

            if(type === MARKET_BEACON_CONST.show && this.hadBeacon === 0) {
                this.hadBeacon = 1;
                marketingBeacon(type, pid, level);
            } else if (type === MARKET_BEACON_CONST.click) {
                marketingBeacon(type, pid, level);
            }
        }
    }

    render () {
        const { ad, from } = this.props;
        if(isEmpty(ad)) {
            return null;
        }
        const { noticeExpanded, currentNotice, current } = this.state;
        const textList = this.returnShowMessage(ad.adInfo);
        console.log('Notice-render',this);
        if(isEmpty(textList)) {
        } else  {
            this.weakAdBeacon(MARKET_BEACON_CONST.show);
            return (
                <View className={`notice ${from === 'index'&&ENV.app==='trade' ? '' : 'full'} ${noticeExpanded ? 'expanded' : ''}`}>
                    <View className='notice-title'><Text className='iconfont iconfont-yunying_announcement'></Text><View>公告</View></View>
                    {
                        noticeExpanded ?
                            <View>
                                <View className='notice-text' onClick={this.clickNotie.bind(this, currentNotice)}>{currentNotice.content}</View>
                                <View className='notice-collapse' onClick={this.clickToCollapse}>收起</View>
                                {
                                    this.renderSeeMore(currentNotice)
                                }
                            </View>
                            :
                            <Swiper
                                autoplay={!noticeExpanded}
                                interval={3000}
                                duration={500}
                                circular
                                vertical
                                current={current}
                                disable-touch
                            >
                                {
                                    textList.map((item, index) => {
                                        return (
                                            <SwiperItem>
                                                <View onClick={this.clickToExpand.bind(this, item, index)} className='notice-text'>{item.content}</View>
                                            </SwiperItem>
                                        );
                                    })
                                }
                            </Swiper>
                    }
                    <View className='marketing-closer notice-closer' onClick={this.closeNotice} />
                </View>
            );
        }
    }
}

export default Notice;
