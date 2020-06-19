import Taro, { Component } from '@tarojs/taro';
import { Checkbox, Text, View } from '@tarojs/components';
import { WHAT_I_NEED } from "tradePublic/consts";
import GoodsList from "pcComponents/orderManagement/goodsList";
import './index.scss';

class OrderCard extends Component {
    constructor (props) {
        super(props);

    }

    render () {
        const { activeTabKey, trade, list } = this.props;
        const tab = Object.keys(WHAT_I_NEED).map((key) => {
            if (activeTabKey && key == activeTabKey) {
                return WHAT_I_NEED[key].name;
            }
        });

        return (
            <View className='order-list'>
                <View className='order-title'>
                    <Checkbox className='check-box'></Checkbox>
                    <View className='order-tab'>{tab}</View>
                    <View className='order-id'>编号：{trade.tid} </View>
                    <Text className='order-icon iconfont iconfont-fuzhi'></Text>
                    <View className='order-time'>下单时间：{trade.created}</View>
                    <Text className='order-icon iconfont iconfont-beizhuqi'></Text>
                    <Text className='order-icon iconfont iconfont-shuaxin'></Text>
                </View>
                <View className='order-content'>
                    <View className='order-goods'>
                        {
                            trade.orders.map((item) => {
                                return <GoodsList order={item} />
                            })
                        }
                    </View>
                    <View className='user-icon'>
                        <View>
                            <Text className='order-wang iconfont iconfont-wangwang'></Text>
                            <View className='order-time'>{trade.buyer_nick}</View>
                            <Text className='order-last iconfont iconfont-fuzhi'></Text>
                        </View>
                        <View className='order-item'>
                            <Text className='order-icon iconfont iconfont-wangwang'></Text>
                            <View className='order-time'>旺旺催付</View>
                        </View>
                        <View className='order-item'>
                            <Text className='order-icon iconfont iconfont-duanxincuifu'></Text>
                            <View className='order-time'>短信催付</View>
                        </View>
                        <View className='order-item'>
                            <Text className='order-icon iconfont iconfont-zuzhiTApaidan'></Text>
                            <View className='order-time'>阻止此买家拍单</View>
                        </View>
                        <View className='order-item'>
                            <Text className='order-icon iconfont iconfont-heduidingdan'></Text>
                            <View className='order-time'>核对订单</View>
                        </View>
                    </View>
                    <View className='order-price'>
                        <View className='price-box'>
                            <View className='result-title'>实付：</View>
                            <View className='result-price'>￥{trade.payment}</View>
                            <View className='result-post'>(含运费￥{trade.post_fee})</View>
                        </View>
                        
                        <View className='order-num'>数量：{trade.num}</View>
                    </View>
                    <View className='order-result'>
                        <Text className='order-icon iconfont iconfont-dingdanxiangqing'></Text>
                        <View className='order-detail'>订单详情</View>
                    </View>
                    <View className='order-change'>
                        <View>
                            <Text className='order-icon iconfont iconfont-shangpinshezhi'></Text>
                            <View className='order-detail'>修改价格</View>
                        </View>
                        <View>
                            <Text className='order-icon iconfont iconfont-guanbi'></Text>
                            <View className='order-detail'>关闭订单</View>
                        </View>
                    </View>
                </View>
                <View className='order-footer'>
                    <View className='order-address'>
                        收货地址：{trade.receiver_name},{trade.receiver_mobile},{trade.receiver_state} {trade.receiver_city} {trade.receiver_district} {trade.receiver_address},{trade.receiver_zip}
                        <Text className='order-icon iconfont iconfont-fuzhi'></Text>
                        <View className='order-sure'>核对地址</View>
                    </View>
                    
                </View>
            </View>
        )
    }
}

export default OrderCard;