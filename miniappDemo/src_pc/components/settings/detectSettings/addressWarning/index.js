import Taro, { Component, useState, useEffect, useRef, useCallback } from '@tarojs/taro';
import { View, Switch, Textarea, Text, Button } from '@tarojs/components';
import { useRefState } from "mapp_common/utils/hooks";
import { getAddressWarningContent,
    getAddressWarningSwitchStatus, modifyAddressWarningContent,
    modifyAddressWarningSwitchStatus } from "tradePublic/orderDetectionSetting";
import './index.scss';

/**
 *
 * @returns {*}
 * @constructor
 */
export default function AddressWarning () {
    const [switchStatus, changeSwitch] = useRefState(true);
    const [addrContent, changeAddr, addrContentRef] = useRefState('');
    let originalAddrContent = useRef('');

    useEffect(async () => {
        let switchStatus = await getAddressWarningSwitchStatus(true);
        let content = await getAddressWarningContent();
        originalAddrContent.current = content;
        changeSwitch(switchStatus);
        changeAddr(content ? content : '村,镇,乡,旗,屯,自治区,自治州,邮电,邮局,政府,监狱,军区,部队,寺,庙,香港,澳门,台湾,海外');
    }, []);


    const switchOnChange = (e) => {
        changeSwitch(e.target.value);
        modifyAddressWarningSwitchStatus({
            switchStatus: e.target.value,
            callback: () => {
                if (e.target.value) Taro.showToast({ icon:'success', title: '开启特殊地址成功' });
            },
            errCallback:(err) => {
                Taro.showToast({ icon:'error', title: '保存失败' + JSON.stringify(err) });
            },
        });
    };

    const saveSetting = () => {
        modifyAddressWarningContent({
            content: addrContentRef.current,
            callback: () => {
                Taro.showToast({ icon:'success', title: '保存成功' });
            },
            errCallback:(err) => {
                Taro.showToast({ icon:'error', title: '保存失败' + JSON.stringify(err) });
            },
        });
    };

    const onCancel = () => {
        changeAddr(originalAddrContent.current);
    };

    return (
        <View className='address-warning'>
            <View className='hd'>
                <Text className='hd-text'>特殊地址预警</Text>
                <Switch checked={switchStatus}
                    onChange={switchOnChange}
                />
            </View>
            <View className='guide'>请输入需要预警的关键词，填写后，关键词将会在收货地址中标红，关键词之间请用逗号隔开。</View>
            {
                switchStatus &&
                <View className='cont'>
                    <Textarea className='text-area' maxlength={500} value={addrContent} onInput={(e) => {
                        changeAddr(e.target.value);
                    }}
                    />
                    <View className='bt'>
                        <Button type='normal' className='left' onClick={onCancel}>取消</Button>
                        <Button type='primary' onClick={saveSetting}>确定</Button>
                    </View>
                </View>
            }
        </View>
    );
}
