import Taro, { Component } from '@tarojs/taro';
import { View } from "@tarojs/components";
import BaseSetting from "./baseSetting";
import LogisticTemplate from "./logisticTemplate";
import InvoiceTemplate from "./invoiceTemplate";
import './index.scss';
import MyTabs from "mapp_common/components/myTab";

const TABS = {
    BASE_SETTING_PAGE: 'BASE_SETTING_PAGE',
    LOGISTIC_TEMPLATE_PAGE: 'LOGISTIC_TEMPLATE_PAGE',
    INVOICE_TEMPLATE_PAGE: 'INVOICE_TEMPLATE_PAGE',
};
const TABS_DEFAULT = [
    { key: TABS.BASE_SETTING_PAGE, title: '基础设置' },
    { key: TABS.LOGISTIC_TEMPLATE_PAGE, title: '物流单模板' },
    { key: TABS.INVOICE_TEMPLATE_PAGE, title: '发货单模板' },
];

class OrderPrtSettings extends Component {
    constructor (props) {
        super(props);
        this.state = { currentTab: TABS.BASE_SETTING_PAGE };
    }

    render () {
        const { currentTab } = this.state;

        return (
            <View className='order-prt-settings-content'>
                <View className='grid-item24 tab-con'>
                    <MyTabs className='trade-tab grid-item24' current={currentTab} tabList={TABS_DEFAULT} scroll
                        onClick={value => this.setState({ currentTab: value })}
                    />
                    <View className='tab-blank'></View>
                </View>
                <View className='order-prt-settings-content-pane'>
                    {
                        {
                            [TABS.BASE_SETTING_PAGE]:<BaseSetting />,
                            [TABS.LOGISTIC_TEMPLATE_PAGE]:<LogisticTemplate />,
                            [TABS.INVOICE_TEMPLATE_PAGE]:<InvoiceTemplate />,
                        }[currentTab]
                    }
                </View>
            </View>
        );
    }
}

export default OrderPrtSettings;
