import {Component} from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text } from '@tarojs/components';
import { processInit} from './action';
import './index.scss';


@connect((store) => {
    return store.titleOptimizeProcessViewReducer;
})
/**
 * 标题检测的初始化数据时显示的页面
 * @export
 * @class ProcessView
 * @extends {Component}2
 */
export default class ProcessView extends Component {

    componentWillMount() {
        processInit('normal').then((res)=>{
            this.props.processViewCallback && this.props.processViewCallback(res);
        })
    }

    render(){
        const { hideProcess,number,process1,process2,process3,process4,process5,process6} = this.props;
        return (
            !hideProcess && <View className='process-body'>
                <View className='process-wrap'>
                    <View className='process-wrap-text'>
                        <Text className='percent'>{number}</Text>
                        <Text className='psymbol'>%</Text>
                    </View>
                </View>
                <View className='process-text'>
                    <View className='text'>{process1}</View>
                    <View className='text'>{process2}</View>
                    <View className='text'>{process3}</View>
                    <View className='text'>{process4}</View>
                    <View className='text'>{process5}</View>
                    <View className='text'>{process6}</View>
                </View>
            </View>
        )
    }
}