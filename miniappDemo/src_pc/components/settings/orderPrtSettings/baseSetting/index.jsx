import Taro, { Component } from '@tarojs/taro';
import { View } from "@tarojs/components";
import './index.scss';

class BaseSetting extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <View>
                BaseSetting
            </View>
        );
    }
}

export default BaseSetting;
