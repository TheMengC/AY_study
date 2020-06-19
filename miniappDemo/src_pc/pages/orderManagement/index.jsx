import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { WHAT_I_NEED } from "tradePublic/consts";
import MyTabs from "mapp_common/components/myTab";
import OrderList from "pcComponents/orderManagement/orderList";

import { changeTab } from "./action";

@connect((store) => {
    return {
        searchVal: store.orderListReducer.searchVal,
        activeTabKey: store.orderListReducer.activeTabKey,
        pageNo: store.orderListReducer.pageNo,
        pageSize: store.orderListReducer.pageSize,
        tradeCounts: store.orderListReducer.tradeCounts,
        list: store.orderListReducer.list,
    };
})
class OrderManagement extends Component {
    constructor (props) {
        super(props);
        this.state = { scrollHeight: 0 };
    }
    componentDidMount () {
        const { pageNo, pageSize, searchVal } = this.props;
        this.setState({ scrollHeight: 500 });
        changeTab('WAIT_BUYER_PAY', pageNo, pageSize, searchVal);
    }
    onPageChange = (type, v) => {
        const { activeTabKey, pageNo, pageSize, searchVal } = this.props;
        if(type === 'pageNo') {
            changeTab(activeTabKey, v, pageSize, searchVal);
        }else{
            changeTab(activeTabKey, pageNo, v, searchVal);
        }
    };

    onTabChange = (v) => {
        const { pageSize } = this.props;
        changeTab(v, 1, pageSize, '');
    };
    render () {
        const { activeTabKey, tradeCounts } = this.props;
        const tabList = Object.keys(WHAT_I_NEED).map((key) => {
            return { title: WHAT_I_NEED[key].name, key };
        });
        return (
            <View className="order-management">
                <View className='grid-item24 tab-con' >
                    <MyTabs className='trade-tab custom-tab grid-item24' current={activeTabKey} tabList={tabList} scroll dotNum={tradeCounts} onClick={this.onTabChange} />
                    {/* <View className='tab-blank'></View> */}
                </View>
                <OrderList />
            </View>
        )
    }
}

export default OrderManagement;