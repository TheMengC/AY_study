import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox } from '@tarojs/components';
import './index.scss';
import { aiyongLogisticsCompaniesSortByPinyin } from "tradePublic/taobaoLogisticsCompaniesGet";
import { commonlyLogisticsSet, getCommonlyLogistics,
    modifyCommonlyLogistics, OFFLINE_KEY,
    ONLINE_KEY } from "tradePublic/logisticsSettings";

/**
 * 常用物流管理
 */
const OFFLINE_LOGISTICS_TAB = 0;
const ONLINE_LOGISTICS_TAB = 1;
class CommonlyLogistics extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentTab:OFFLINE_LOGISTICS_TAB,
            groupedLogisticsCompanies : [],
            onlineSelectedList: [],
            offlineSelectedList: [],
        };
    }

    async componentWillMount () {
        let logisticsCompanies = await aiyongLogisticsCompaniesSortByPinyin();
        let groupedLogisticsCompanies = {};
        logisticsCompanies.map(item => {
            let char = item.pinyin.charAt(0);
            if (groupedLogisticsCompanies[char] === undefined) {
                groupedLogisticsCompanies[char] = [];
            }
            groupedLogisticsCompanies[char].push(item);
        });
        let commonlyLogistics = await getCommonlyLogistics({ refresh:true });
        this.setState({
            groupedLogisticsCompanies,
            onlineSelectedList: commonlyLogistics.online,
            offlineSelectedList: commonlyLogistics.offline,
        });
    }

    /**
     * 处理CheckBox勾选状态变更
     * @param checkState 变更后的状态
     * @param logisticsCompany 选中的物流公司
     */
    handleCheckBoxChange = (checkState, logisticsCompany) => {
        let { onlineSelectedList, offlineSelectedList, currentTab } = this.state;
        let selectedList = {
            [ONLINE_LOGISTICS_TAB]:onlineSelectedList,
            [OFFLINE_LOGISTICS_TAB]:offlineSelectedList,
        }[currentTab];
        if (checkState) {
            // 勾选
            if (selectedList.length > 4) {
                Taro.showToast({ title:'最多设置5个常用物流' });
                return;
            }
            selectedList.push(logisticsCompany);
        }else {
            // 取消勾选
            selectedList = selectedList.filter(item => item.code !== logisticsCompany.code);
        }
        commonlyLogisticsSet({
            mode: {
                [ONLINE_LOGISTICS_TAB]: 'online',
                [OFFLINE_LOGISTICS_TAB]: 'offline',
            }[currentTab],
            data: selectedList,
            callback: (res) => {
                if (currentTab === ONLINE_LOGISTICS_TAB) {
                    modifyCommonlyLogistics(ONLINE_KEY, selectedList);
                    this.setState({ onlineSelectedList: selectedList });
                } else if (currentTab === OFFLINE_LOGISTICS_TAB) {
                    modifyCommonlyLogistics(OFFLINE_KEY, selectedList);
                    this.setState({ offlineSelectedList: selectedList });
                }
                Taro.showToast({
                    title: '保存成功',
                    icon: 'success',
                });
            },
        });
    }

    render () {
        let { groupedLogisticsCompanies, onlineSelectedList, offlineSelectedList, currentTab } = this.state;
        const selectedCodeList = {
            [ONLINE_LOGISTICS_TAB]:onlineSelectedList.map(item => item.code),
            [OFFLINE_LOGISTICS_TAB]:offlineSelectedList.map(item => item.code),
        }[currentTab];
        return (
            <View className='commonly-logistics-page'>
                <View className='head-tabs'>
                    <View className={`tab ${currentTab === OFFLINE_LOGISTICS_TAB ? 'tab-selected' : ''}`}
                        onClick={() => this.setState({ currentTab:OFFLINE_LOGISTICS_TAB })}
                    >自己联系</View>
                    <View className={`tab ${currentTab === ONLINE_LOGISTICS_TAB ? 'tab-selected' : ''}`}
                        onClick={() => this.setState({ currentTab:ONLINE_LOGISTICS_TAB })}
                    >在线下单</View>
                </View>
                <View className='main-content'>
                    <View className='selected-spans'>
                        {
                            {
                                [ONLINE_LOGISTICS_TAB]:onlineSelectedList,
                                [OFFLINE_LOGISTICS_TAB]:offlineSelectedList,
                            }[currentTab].map(item =>
                                <View className='span'>{item.name}</View>
                            )
                        }
                    </View>
                    <View className='logistics-list'>
                        {
                            Object.keys(groupedLogisticsCompanies).map(key =>
                                <View className='logistics-pinyin-item'>
                                    <View className='title'>{key.toUpperCase()}</View>
                                    <View className='content'>
                                        {
                                            groupedLogisticsCompanies[key].map(item =>
                                                <View className='span'>
                                                    <Checkbox className='checkbox' checked={selectedCodeList.includes(item.code)}
                                                        onChange={(event) => this.handleCheckBoxChange(event.detail.value, item)}
                                                        label={item.name}
                                                    />
                                                </View>)
                                        }
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export default CommonlyLogistics;
