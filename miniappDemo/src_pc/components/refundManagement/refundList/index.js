import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, Input, Switch } from '@tarojs/components';
import RefundCard from "pcComponents/refundManagement/refundCard";
import './index.scss';
import EmptyPage from "pcComponents/emptyPage";

@connect((store) => {
    return {
        activeTabKey: store.refundListReducer.activeTabKey,
        list: store.refundListReducer.list,
        isLoading: store.refundListReducer.isLoading,
    };
})
class RefundList extends Component {
    constructor (props) {
        super(props);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.activeTabKey != nextProps.activeTabKey) {
        }
    }

    componentDidMount () {
    }

    render () {
        const { list, activeTabKey, isLoading} = this.props;
        return (
            <View className='refund-list'>
                {
                    list.length == 0 && !isLoading  && (
                        <View className='refund-empty'>
                            <EmptyPage text='当前没有任何订单' />
                        </View>
                    )
                }
                {
                    list.map((trade) => {
                        return <RefundCard trade={trade} activeTabKey={activeTabKey}/>;
                    })
                }
            </View>
        );
    }
}
export default RefundList;
