import Taro, { Component } from '@tarojs/taro';
import { Text, View } from '@tarojs/components';
import MyTabs from "mapp_common/components/myTab";
import AppliedEWayBills from './eWayBillsTabs/appliedEWayBills';
import SharedEWayBills from './eWayBillsTabs/sharedEWayBills';
import AcquiredEWayBills from "./eWayBillsTabs/acquiredEWayBills";
import RecycledEWayBills from "./eWayBillsTabs/recycledEWayBills";
import './index.scss';

const invoiceType = [
    { key: 'APPLY', title: '申请的面单' },
    { key: 'SHARE', title: '分享的面单' },
    { key: 'ACQUIRED', title: '面单获取记录' },
    { key: 'RECYCLE', title: '面单回收记录' },
];

class EWayBills extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: 'APPLY',  // 当前tab
        }
    }

    clickToSetting(type) {
        let url = '';
        if (type == 'remind') {
            url = 'https://waybill.wuliu.taobao.com/accountInfo.htm?spm=a1z3x.7846499.0.0.13e34adJOcoUj';
        } else if (type == 'apply') {
            url = 'https://waybill.wuliu.taobao.com/firstPage.htm?spm=a1z0f.7.0.0.7329f0aewFM94m';
        }

        url && my.qn.navigateToWebPage({ url });
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
                        tabList={invoiceType}
                        scroll
                        onClick={(value) => {
                            this.changeTab(value);
                        }}
                    />
                    <View className='tab-blank'></View>
                </View>
                <View className='e-invoice-page-hints'>
                    <Text className='iconfont iconfont-hintNotice' style={{ color: 'rgba(24,144,255,1)' }} />
                    <Text className='e-invoice-page-hints-text'>如果需要面单余额提醒功能，请戳这里进行设置<Text className='text-point' onClick={this.clickToSetting.bind(this, 'remind')}>面单余额提醒</Text>，如果需开通更多电子面单服务商，请点击<Text className='text-point' onClick={this.clickToSetting.bind(this, 'apply')}>立即申请</Text></Text>
                </View>
                {/* 申请的面单 */}
                {currentTab == 'APPLY' && <AppliedEWayBills changeTab={this.changeTab} />}
                {/* 分享的面单 */}
                {currentTab == 'SHARE' && <SharedEWayBills applyEInvoices={this.clickToSetting.bind(this, 'apply')} />}
                {/* 面单获取记录 */}
                {currentTab == 'ACQUIRED' && <AcquiredEWayBills type={currentTab} />}
                {/* 面单回收记录 */}
                {currentTab == 'RECYCLE' && <RecycledEWayBills type={currentTab} />}
            </View>
        );
    }
}

export default EWayBills;
