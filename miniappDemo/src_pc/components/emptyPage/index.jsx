import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.scss';

class EmptyPage extends Component {

    render () {
        const { text } = this.props;
        return (
            <View className='trade-empty'>
                <Image className='trade-empty-img' src='http://q.aiyongbao.com/miniapp/trade/img/mobile/trade_list_empty.webp' />
                {
                    text && <View className='trade-empty-text'>{text}</View>
                }
            </View>

        );
    }
}
export default EmptyPage;
