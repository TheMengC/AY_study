/**
 * 面单获取记录
 */
import Taro, { Component } from '@tarojs/taro';
import { Button, View, Text } from '@tarojs/components';
import './index.scss';

class WayBill extends Component {
    render() {
        return (
            <View className='way-bill-page'>
                <Text className='way-bill-text'>正在加载快递单信息……</Text>
            </View>
        );
    }
}

export default WayBill;
