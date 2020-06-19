import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import ItemShortTitle from "./itemShortTitle";
import './index.scss';
import ItemCostPrice from "pcComponents/settings/itemSettings/itemCostPrice";
import ItemWeight from "pcComponents/settings/itemSettings/itemWeight";
import MyTabs from "mapp_common/components/myTab";

const TABS = {
    ITEM_SHORT_TITLE_PAGE: 'ITEM_SHORT_TITLE_PAGE',
    ITEM_COST_PRICE_PAGE: 'ITEM_COST_PRICE_PAGE',
    ITEM_WEIGHT_PAGE: 'ITEM_WEIGHT_PAGE',
};
const TABS_DEFAULT = [
    { key: TABS.ITEM_SHORT_TITLE_PAGE, title: '商品简称' },
    { key: TABS.ITEM_COST_PRICE_PAGE, title: '商品成本价' },
    { key: TABS.ITEM_WEIGHT_PAGE, title: '商品重量' },
];

class ItemSettings extends Component {
    constructor (props) {
        super(props);
        this.state = { currentTab: TABS.ITEM_SHORT_TITLE_PAGE };
    }

    render () {
        let { currentTab } = this.state;
        return (
            <View className='item-settings-page'>
                <View className='grid-item24 tab-con'>
                    <MyTabs className='trade-tab grid-item24' current={currentTab} tabList={TABS_DEFAULT} scroll
                        onClick={value => this.setState({ currentTab: value })}
                    />
                    <View className='tab-blank'></View>
                </View>
                {
                    {
                        [TABS.ITEM_SHORT_TITLE_PAGE]:<ItemShortTitle />,
                        [TABS.ITEM_COST_PRICE_PAGE]:<ItemCostPrice />,
                        [TABS.ITEM_WEIGHT_PAGE]:<ItemWeight />,
                    }[currentTab]
                }
            </View>
        );
    }
}

export default ItemSettings;
