import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';
import { connect } from "@tarojs/redux";

@connect((store) => {
    return { tasksData: store.updateNewUserVillageReducer.tasksData };
})
class TaskCard extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        const { closeMask, showMask } = this.props;
        let jsx = null;
        if(showMask) {
            jsx = (
                <View className='reward-mask-wrapper'>
                    <View className='rules-card'>
                        <Text className='rules-title'>规则</Text>
                        <View className='rules-content'>
                            <Text className='rules-text'>每日签到都可获得奖励，连续签到有额外惊喜哦！</Text>
                            <Text className='rules-text'>断签需要重新开始（包括奖励）</Text>
                            <Text className='rules-text'>新用户1—15天可以参与签到，超过15天后断签或未开始则无法继续参与签到</Text>
                        </View>
                        <Image
                            className='task-card-close'
                            onClick={() => {closeMask();}}
                            src={'//q.aiyongbao.com/miniapp/marketing/newuser/card-black-close.png'}
                        >
                        </Image>
                    </View>
                </View>
            );
        }
        return jsx;
    }
}

export default TaskCard;
