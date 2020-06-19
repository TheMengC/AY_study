import Taro, { Component } from '@tarojs/taro';
import { Text } from '@tarojs/components';

import './index.scss';

class MyBalloon extends Component {
    render () {
        const { text, className } = this.props;
        return (
            <balloon closable={false} align='b' className='my-balloon'>
                <button slot='trigger' className={'balloon-btn ' + className}>
                    { this.props.children }
                </button>
                { text && <Text className='balloon-text'>{text}</Text> }
                { this.props.renderBalloon() }
            </balloon>
        );
    }
}

export default MyBalloon;

