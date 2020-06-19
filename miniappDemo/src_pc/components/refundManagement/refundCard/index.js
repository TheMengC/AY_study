import Taro, { Component } from '@tarojs/taro';
import { Checkbox, Text, View } from '@tarojs/components';
import { TRADE_COUNT_DOWN_MAP } from "pcPages/tradeManagement/tradeManagementConsts";
import { getDiffFormatTime } from "tradePublic/tradeDataCenter/common/utils";
import OrderCard from "../orderCard";
import './index.scss';
import { getTradeAddress } from "tradePublic/tradeDataCenter/biz/resolveTrade";
import { getOrders } from "tradePublic/tradeDataCenter/common/resolveTopResponse";
import moment from "mapp_common/utils/moment";
import { REFUND_TABS } from "tradePublic/consts";

class RefundCard extends Component {
    constructor (props) {
        super(props);
    }

    componentWillMount () {
    }

    goRefundDetail = (refund) => {
    };
    rendercountDown = (endTime) => {
        let timeStr = '';
        if (endTime) {
            let diffTime = getDiffFormatTime(moment(), endTime);
            timeStr = diffTime.diffDay != 0 ? `${diffTime.diffDay}天` : '';
            timeStr += diffTime.diffHour != 0 ? `${diffTime.diffHour}时` : '';
            timeStr += diffTime.diffMinute != 0 ? `${diffTime.diffMinute}分` : '';
            timeStr += diffTime.diffSecond > 0 ? `${diffTime.diffSecond}秒` : '';
        }

        return <Text className='timeinfo'>{timeStr}</Text>
    };


    render () {
        const { trade } = this.props;
        const { activeTabKey } = this.props;
        return (
            <View className='refund-detail-card'>
                <View className='hd'>
                    <View className='frac'>
                        <Checkbox className='check-box' />
                        <View className='card-item2-row'>
                            <Text className='iconfont iconfont-wangwang' />
                            { trade.buyer_nick }
                        </View>
                        <Text className='iconfont iconfont-fuzhi' onClick={this.copyText.bind(this, { text:trade.buyer_nick, msg:'复制成功' })}
                        />
                        <Text className='hd-tid'>退款编号:{ trade.refund.refund_id }</Text>
                        <Text className='iconfont iconfont-fuzhi' onClick={this.copyText.bind(this, { text:trade.refund.refund_id, msg:'复制成功' })}
                        />
                        <Text className='hd-tid'>申请退款时间:{ trade.refund.created }</Text>
                    </View>
                    <View className='frac'>
                        {
                            trade.refund.refund_remind_timeout && <Text className='hd-time'>
                                您还有{this.rendercountDown(trade.refund.refund_remind_timeout.timeout)}来处理本次退款!
                            </Text>
                        }
                        <View className={`label ${REFUND_TABS[trade.refund.status].class}`}>
                            <Text>
                                {
                                    REFUND_TABS[trade.refund.status].label
                                }
                            </Text>
                        </View>
                    </View>
                </View>
                <View className='card grid-cont'>
                    <View className='card-item1 grid-item12'>
                        {
                            getOrders(trade).map((order) => {
                                return (
                                    <OrderCard trade={trade} order={order} />
                                );
                            })
                        }
                    </View>

                    <View className='card-item3 grid-item7'>
                        <View className='card-item-row'>
                            <Text className='titles'>实付</Text>
                            <View className='payment-content'>
                                <Text className='content1'>￥{ Number(trade.payment).toFixed(2) }
                                    {
                                        trade.post_fee > 0 && <Text>(含运费￥{trade.post_fee})</Text>
                                    }
                                </Text>
                            </View>
                        </View>

                        <View className='card-item-row'>
                            <Text className='titles'>退款金额</Text>
                            <Text className='num'>￥{trade.refund.refund_fee}</Text>
                        </View>

                    </View>
                    <View className='card-item4 grid-item5'>
                        <View className='card-item4-option'>
                            <View className='card-btn'>处理退款</View>
                            <View className='card-btn'
                                  onClick={this.goRefundDetail.bind(this, trade.refund)}
                            >退款信息</View>
                        </View>
                    </View>
                </View>
                <View className='bd-add'>
                    <Text className='add-title'>收货地址</Text>
                    <Text className='add-content'>
                        <Text>{ getTradeAddress(trade, { needContact: true }) }</Text>
                        <Text className='iconfont iconfont-fuzhi' />
                        {
                            // 核对地址
                            (activeTabKey != 'TRADE_FINISHED' && activeTabKey != 'ALL_CLOSED') &&
                            <Text className='add-check'
                                  onClick={this.checkAddress.bind(this, trade)}
                            >核对地址</Text>
                        }
                        {
                            // 修改地址
                            activeTabKey == 'WAIT_SELLER_SEND_GOODS' &&
                            <Text className='iconfont iconfont-bianji'  />
                        }
                    </Text>
                </View>
            </View>
        );
    }
}
export default RefundCard;
