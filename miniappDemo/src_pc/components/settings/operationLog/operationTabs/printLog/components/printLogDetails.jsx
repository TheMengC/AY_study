import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './index.scss';
import MyTabs from "mapp_common/components/myTab";
import TradeDetail from "pcPages/tradeDetail";
import WayBill from "./wayBill";
import { getRouteParams } from "pcComponents/router";

const logType = [
    { key:'WAYBILL_DETAILS', title:'快递单信息' },
    { key:'ORDER_DETAILS', title:'订单信息' },
];

class PrintLogDetails extends Component {
    state = {
        currentTab: 'WAYBILL_DETAILS',  // 当前tab
    };

    componentWillMount() {
        let args = getRouteParams();
    }

    changeTab = (value) => {
        this.setState({ currentTab: value });
    }

    render () {
        const { currentTab } = this.state;
        const { logInfo } = this.props;

        return (
            <View className='e-invoice-page'>
                <View className='grid-item24 tab-con'>
                    <MyTabs
                        className='trade-tab grid-item24'
                        current={currentTab}
                        tabList={logType}
                        scroll
                        onClick={(value) => {
                            this.changeTab(value);
                        }}
                    />
                    <View className='tab-blank'></View>
                </View>
                {currentTab == 'WAYBILL_DETAILS' && <WayBill />}
                {currentTab == 'ORDER_DETAILS' && <TradeDetail detailParams={logInfo} />}
            </View>
        );
    }
}

export default PrintLogDetails;
