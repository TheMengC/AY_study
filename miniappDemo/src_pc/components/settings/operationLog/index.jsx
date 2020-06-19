import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import MyTabs from "mapp_common/components/myTab";
import WwRushPay from './operationTabs/wwRushPay';
import './index.scss';
import PrintLog from "./operationTabs/printLog";

const logType = [
    { key:'PRINTLOG', title:'打印日志' },
    { key:'WWRUSHPAYRECORD', title:'旺旺催付记录' },
];

class OperationLog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: 'PRINTLOG',  // 当前tab
        }
    }

    changeTab = (value) => {
        this.setState({
            currentTab: value
        });
    }

    render() {
        const { currentTab } = this.state;

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
                {/* 旺旺催付记录 */}
                {currentTab == 'WWRUSHPAYRECORD' && <WwRushPay />}
                {currentTab == 'PRINTLOG' && <PrintLog />}
            </View>
        );
    }
}

export default OperationLog;
