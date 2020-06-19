import Taro, { Component } from '@tarojs/taro';
import { Input, Text, View, Button } from '@tarojs/components';
import './index.scss';
import { api, getSettings } from "tradePolyfills";
import SettingCard from "components/my/settingCard";
import { recordedLogs, uploadRecordLog, Logger } from "mapp_common/utils/logger";
import { proxyClientInit } from "mapp_common/utils/qnProxy";
import { showActionSheet } from "mapp_common/utils";
import { contactCustomerService } from "mapp_common/utils/openChat";

let app = Taro.getApp();

class developmentTools extends Component {
    config = { navigationBarTitleText: '' };

    constructor () {
        super();
    }

    componentWillMount () {
        
    }

    render () {
        let settings = getSettings();
        let proxy = settings.proxy._getValue();
        // let nickMock = settings.nickMock._getValue();
        let displayLogs = recordedLogs.slice(-20);
        return (
            <View className='box'>
                {/* <View> */}
                {/*    <Text>nickMock</Text> */}
                {/*    <View> */}
                {/*        <Switch onChange={(e) => { */}
                {/*            settings.nickMock.enabled = e.detail.value; */}
                {/*            this.forceUpdate(); */}
                {/*        }} */}
                {/*        /> */}
                {/*    </View> */}
                {/*    <View> */}
                {/*        <Text>nick</Text> */}
                {/*        <Input */}
                {/*            controlled */}
                {/*            value={nickMock.nick} */}
                {/*            onInput={(e) => { */}
                {/*                settings.nickMock.nick = e.detail.value; */}
                {/*                this.forceUpdate(); */}
                {/*            }} */}
                {/*        /> */}
                {/*    </View> */}
                {/*    <View> */}
                {/*        <Text>sellerId</Text> */}
                {/*        <Input */}
                {/*            controlled */}
                {/*            value={nickMock.sellerId} */}
                {/*            onInput={(e) => { */}
                {/*                settings.nickMock.sellerId = e.detail.value; */}
                {/*                this.forceUpdate(); */}
                {/*            }} */}
                {/*        /> */}
                {/*    </View> */}

                {/* </View> */}


                <View>
                    <Text>
                        代理设置
                    </Text>
                    <SettingCard mainText='api代理设置' arrow extraText={proxy.apiProxyMode}
                        onClick={() => {
                            showActionSheet({
                                itemList: ['off', 'on'],
                                success: (item) => {
                                    settings.proxy.apiProxyMode = item;
                                    this.forceUpdate();
                                },
                            });
                        }}
                    >
                    </SettingCard>
                    <SettingCard mainText='top代理设置' arrow extraText={proxy.qnProxyMode}
                        onClick={() => {
                            showActionSheet({
                                itemList: ['off', 'on', 'auto'],
                                success: (item) => {
                                    settings.proxy.qnProxyMode = item;
                                    this.forceUpdate();
                                },
                            });
                        }}
                    >
                    </SettingCard>
                    <SettingCard mainText='日志设置' arrow extraText={proxy.logMode}
                        onClick={() => {
                            showActionSheet({
                                itemList: ['off', 'on', 'auto'],
                                success: (item) => {
                                    settings.proxy.logMode = item;
                                    this.forceUpdate();
                                },
                            });
                        }}
                    >
                    </SettingCard>

                    <SettingCard mainText='日志记录等级' arrow extraText={proxy.logRecordLevel}
                        onClick={() => {
                            showActionSheet({
                                itemList: ['error', 'warn', 'log', 'debug'],
                                success: (item) => {
                                    settings.proxy.logRecordLevel = item;
                                    this.forceUpdate();
                                },
                            });
                        }}
                    >
                    </SettingCard>


                    <View className='setting-card select-company'>
                        <View className='setting-card-content'>
                            <View className='main'>
                                <View className='main-text'>代理服务器</View>
                            </View>
                            <View className='right'>
                                <Input className='input' value={proxy.host}
                                    onInput={(e) => {
                                        settings.proxy.host = e.detail.value;
                                        this.forceUpdate();
                                    }}
                                ></Input>
                            </View>
                        </View>
                    </View>

                </View>
                <Button onClick={() => {
                    proxyClientInit();
                }}
                >
                    测试连接
                </Button>
                <View>
                    <Text>
                        其他设置
                    </Text>
                    <SettingCard mainText='虚拟发货' arrow extraText={settings.editApiTest ? 'on' : 'off'}
                        onClick={() => {
                            let options = ['off', 'on'];
                            Taro.showActionSheet({
                                itemList: options,
                                success: ({ index }) => {
                                    if (index === -1) {
                                        return;
                                    }
                                    settings.editApiTest = +(options[index] === 'on');
                                    this.forceUpdate();
                                },
                            });
                        }}
                    >
                    </SettingCard>
                </View>

                <View>
                    <Text>日志:</Text>
                    <Button onClick={() => {
                        uploadRecordLog({
                            type: "upload",
                            callback: (res) => {
                                let path = res.path;
                                contactCustomerService(`我上传了日志 ${path}`, '爱用科技:梧桐');
                                Taro.showToast({ title: "日志上传成功" });
                            },
                            errCallback:(res) => {
                                Taro.showToast({ title: "日志上传失败" + JSON.stringify(res) });
                            },
                        });
                    }}
                    >上传日志</Button>
                    {recordedLogs.map(item => {
                        return <View className={'error-item ' + item.level}>
                            <Text>{JSON.stringify(item.content)}</Text>
                        </View>;
                    })}
                </View>
            </View>
        );
    }
}

export default developmentTools;
