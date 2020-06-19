import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import CommonlyLogistics from "./commonlyLogistics";
import LogisticsAddress from "./logisticsAddress";
import MyTabs from "mapp_common/components/myTab";
import './index.scss';

const TABS = {
    LOGISTICS_ADDRESS_PAGE: 'LOGISTICS_ADDRESS_PAGE',
    COMMONLY_LOGISTICS_PAGE: 'COMMONLY_LOGISTICS_PAGE',
    SERVICE_AGREEMENT_PAGE: 'SERVICE_AGREEMENT_PAGE',
};
const TABS_DEFAULT = [
    { key: TABS.LOGISTICS_ADDRESS_PAGE, title: '卖家地址库' },
    { key: TABS.COMMONLY_LOGISTICS_PAGE, title: '默认物流' },
    { key: TABS.SERVICE_AGREEMENT_PAGE, title: '服务约定(家装类目)' },
];

class SendOrderSettings extends Component {
    constructor (props) {
        super(props);
        this.state = { currentTab: TABS.LOGISTICS_ADDRESS_PAGE };
    }

    changeTab = (value) => {
        this.setState({ currentTab: value });
    }

    render () {
        let { currentTab } = this.state;
        return (
            <View className='send-order-settings-page'>
                <View className='grid-item24 tab-con'>
                    <MyTabs className='trade-tab grid-item24' current={currentTab} tabList={TABS_DEFAULT} scroll
                        onClick={(value) => {
                            this.changeTab(value);
                        }}
                    />
                    <View className='tab-blank'></View>
                </View>
                {
                    {
                        [TABS.LOGISTICS_ADDRESS_PAGE]: <LogisticsAddress />,
                        [TABS.COMMONLY_LOGISTICS_PAGE]: <CommonlyLogistics />,
                        [TABS.SERVICE_AGREEMENT_PAGE]: <View />,
                    }[currentTab]
                }
            </View>
        );
    }
}

export default SendOrderSettings;
