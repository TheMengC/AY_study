import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { isEmpty } from "mapp_common/utils";

import './index.scss';

class OrderCard extends Component {
    constructor (props) {
        super(props);
    }

    goRefundDetail = () => {
    }

    renderDiscountMsg = () => {
        const { order } = this.props;
        if (isEmpty(order)) {
            return;
        }
        let discount_fee = order.discount_fee * 1;
        let adjust_fee = order.adjust_fee * 1;
        return (
            <View className='order-price'>
                <View className='order-price-cont'>
                    <Text>
                        <Text className='order-payment'>¥{order.price}</Text>
                        <Text className='order-num'>x{order.num}</Text>
                    </Text>
                    <View className='order-fee'>
                        {
                            discount_fee != 0 &&
                            <View className='order-discount'>
                                <Text className='iconfont iconfont-hui' />
                                <Text>{discount_fee > 0 ? '-' : '+'}￥{Math.abs(discount_fee)}</Text>
                            </View>
                        }
                        {
                            adjust_fee != 0 &&
                            <View className='order-adjust'>
                                <Text className='iconfont iconfont-gai' />
                                <Text>{adjust_fee > 0 ? '+' : '-'}￥{Math.abs(adjust_fee)}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    }

    render () {
        const { order } = this.props;

        return (
            <View className='refund-order-card'>
                <View className='order-img'>
                    <Image style='width:60px;height:60px;' src={order.pic_path + '_60x60.jpg'} />
                </View>
                <View className='order-content'>
                    <View className='order-title'>
                        <Text>{order.title}</Text>
                    </View>
                    {
                        !isEmpty(order.outer_sku_id) ? (
                            <View className='order-code'>
                                <Text className='code-title'>商家编码</Text>
                                <Text className='code-info'>{order.outer_sku_id}</Text>
                            </View>
                        ) :
                            !isEmpty(order.outer_iid) && (
                                <View className='order-code'>
                                    <Text className='code-title'>商家编码</Text>
                                    <Text className='code-info'>{order.outer_iid}</Text>
                                </View>
                            )
                    }
                    {
                        order.sku_properties_values &&
                        <View className='order-sku'>
                            {
                                order.sku_properties_values.map((item) => {
                                    return <Text className='order-sku-item'>{item}</Text>;
                                })
                            }
                        </View>
                    }
                    {this.renderDiscountMsg()}
                </View>
            </View>
        );
    }
}

OrderCard.defaultProps = {
    className:'',
    order: {},
};
export default OrderCard;
