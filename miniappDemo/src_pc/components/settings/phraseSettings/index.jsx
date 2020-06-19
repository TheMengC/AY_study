import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import MemoPhrase from "./menoPhrase";
import RatePhrase from "./ratePhrase";
import WwRushPayPhrase from "./wwRushPayPhrase";
import CheckAddressPhrase from "./checkAddressPhrase";
import WwRushRatePhrase from "./wwRushRatePhrase";
import { getRouteParams } from "pcComponents/router";
import './index.scss';
import MyTabs from "mapp_common/components/myTab";

const TABS = {
    MEMO_PHRASE_PAGE: 'MEMO_PHRASE_PAGE',
    RATE_PHRASE_PAGE: 'RATE_PHRASE_PAGE',
    WW_RUSH_PAY_PHRASE_PAGE: 'WW_RUSH_PAY_PHRASE_PAGE',
    CHECK_ADDRESS_PHRASE_PAGE: 'CHECK_ADDRESS_PHRASE_PAGE',
    WW_RUSH_RATE_PHRASE_PAGE: 'WW_RUSH_RATE_PHRASE_PAGE',
};
const TABS_DEFAULT = [
    { key: TABS.MEMO_PHRASE_PAGE, title: '备注短语' },
    { key: TABS.RATE_PHRASE_PAGE, title: '评价短语' },
    { key: TABS.WW_RUSH_PAY_PHRASE_PAGE, title: '旺旺催付短语' },
    { key: TABS.CHECK_ADDRESS_PHRASE_PAGE, title: '核对地址短语' },
    { key: TABS.WW_RUSH_RATE_PHRASE_PAGE, title: '旺旺催评短语' },
];

class PhraseSettings extends Component {
    constructor (props) {
        super(props);
        this.state = { currentTab: TABS.MEMO_PHRASE_PAGE };
    }

    componentDidMount () {
        let params = getRouteParams();
        if (params && params.from) {
            switch (params.from) {
                case 'tradeManagementRateDialog':{
                    this.changeTab(TABS.RATE_PHRASE_PAGE);
                    break;
                }
                case 'WwRushPayDialog':{
                    this.changeTab(TABS.WW_RUSH_PAY_PHRASE_PAGE);
                    break;
                }
            }
        }
    }

    changeTab = (value) => {
        this.setState({ currentTab: value });
    }

    render () {
        let { currentTab } = this.state;
        return (
            <View className='phrase-setting-page'>
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
                        [TABS.MEMO_PHRASE_PAGE]: <MemoPhrase />,
                        [TABS.RATE_PHRASE_PAGE]: <RatePhrase />,
                        [TABS.WW_RUSH_PAY_PHRASE_PAGE]: <WwRushPayPhrase />,
                        [TABS.CHECK_ADDRESS_PHRASE_PAGE]:<CheckAddressPhrase />,
                        [TABS.WW_RUSH_RATE_PHRASE_PAGE]:<WwRushRatePhrase />,
                    }[currentTab]
                }
            </View>
        );
    }
}

export default PhraseSettings;
