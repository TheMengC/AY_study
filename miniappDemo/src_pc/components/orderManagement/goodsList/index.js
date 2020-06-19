import Taro, { Component } from '@tarojs/taro';
import { Checkbox, Text, View, Image } from '@tarojs/components';
import './index.scss';

class GoodsList extends Component { 
    constructor(props) {
        super(props);
    }

    render () {
        const { order } = this.props;
        return (
            <View className='goods-list'>
                <View className='goods-image'>
                    <Image className='image' src={order.pic_path} />
                </View>
                <View className='goods-name'>
                    <View className='goods-text'>
                        <View className='goods-title'>{order.title}</View>
                        <View className='goods-shot'>设置简称</View>
                    </View>
                    <View className='goods-price'>
                        ￥{order.price}
                        <View className='goods-num'>X{order.num}</View>
                    </View>
                    
                </View>
            </View>
        )
    }
}

export default GoodsList;