import Taro, { Component, useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import DetectConditions from "pcComponents/settings/detectSettings/detectConditions";
import AddressWarning from "pcComponents/settings/detectSettings/addressWarning";
import './index.scss';
import MyTabs from "mapp_common/components/myTab";

const TABS = {
    DETECTION_CONDITIONS: 'DETECTION_CONDITIONS',
    ADDRESS_WARNING: 'ADDRESS_WARNING',
};
const TABS_DEFAULT = [
    { key: TABS.DETECTION_CONDITIONS, title: '订单检测条件' },
    { key: TABS.ADDRESS_WARNING, title: '地址预警' },
];

/**
 * 订单检测页面
 * @returns {*}
 * @constructor
 */
function DetectSettings () {
    const [currentTab, setCurrentTab] = useState(TABS.DETECTION_CONDITIONS);

    return (
        <View className='detect-settings'>
            <View className='grid-item24 tab-con'>
                <MyTabs className='trade-tab grid-item24' current={currentTab} tabList={TABS_DEFAULT} scroll
                    onClick={setCurrentTab}
                />
                <View className='tab-blank'></View>
            </View>
            {
                {
                    [TABS.DETECTION_CONDITIONS]:<DetectConditions />,
                    [TABS.ADDRESS_WARNING]:<AddressWarning />,
                }[currentTab]
            }
        </View>
    );
}

export default DetectSettings;
