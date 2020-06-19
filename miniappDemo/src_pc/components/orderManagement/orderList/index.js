import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Text, Input, Switch } from '@tarojs/components';
import OrderCard from "pcComponents/orderManagement/orderCard";
import './index.scss';
import EmptyPage from "pcComponents/emptyPage";

@connect((store) => {
    return {
        activeTabKey: store.orderListReducer.activeTabKey,
        list: store.orderListReducer.list,
        isLoading: store.orderListReducer.isLoading,
    };
})
class OrderList extends Component {
    constructor (props) {
        super(props);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.activeTabKey != nextProps.activeTabKey) {
        }
    }

    render () {
        const { list, activeTabKey, isLoading } = this.props;
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
                        return <OrderCard trade={trade} activeTabKey={activeTabKey} list={list}/>;  
                    })
                }
            </View>
        );
    }
}
export default OrderList;
