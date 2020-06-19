import Taro, { Component, useState, useEffect, useRef } from '@tarojs/taro';
import { View, Switch } from '@tarojs/components';
import { useRefState } from "mapp_common/utils/hooks";
import { orderDetectionSettingStatusGet, setDetectionSetting } from "tradePublic/orderDetectionSetting";

import './index.scss';

/**
 *
 * @returns {*}
 * @constructor
 */
export default function DetectConditions () {
    const switchList = {
        buyerToMeBad: '给过我中差评的买家',
        dangerTrade: '留言中包含有害信息，可能为风险订单',
        addrKeyWord: '收货地址中包含敏感关键字，可能为刷信誉订单',
        moreBad: '曾发出过5次中差评的买家',

    };
    const [switchStatus, changeSwitch, switchStatusRef] = useRefState({
        buyerToMeBad:false,
        dangerTrade:false,
        addrKeyWord:false,
        moreBad:false,
    });

    // let lastSwitch; // 记住上次开关
    useEffect(() => {
        orderDetectionSettingStatusGet({
            callback: (data) => {
                changeSwitch(data);
            },
            errCallback:(msg) => {
                Taro.showToast({ title: '获取订单检测数据失败' + JSON.stringify(msg), icon: 'error', duration: 2000 });
            },
        });
    }, []);

    const switchOnChange = (key, e) => {
        const newSwitchStatus = {
            ...switchStatus,
            [key]: e.detail.value,
        };
        changeSwitch(newSwitchStatus);

        setDetectionSetting({
            data: switchStatusRef.current,
            callback: () => {
                Taro.showToast({ title: '保存成功', icon: 'success' });
            },
            errCallback: (msg) => {
                Taro.showToast({ title: '修改订单检测设置失败' + JSON.stringify(msg), icon: 'error', duration: 2000 });
            },
        });
    };

    return (
        <View className='detect-conditions'>
            {
                Object.keys(switchList).map((key) => {
                    const item = switchList[key];
                    return (
                        <View className='detect-switch'>
                            <View className='detect-switch-text'>{ item }</View>
                            <Switch checked={switchStatus[key]} onChange={switchOnChange.bind(this, key)} />
                        </View>
                    );
                })
            }
        </View>
    );
}
