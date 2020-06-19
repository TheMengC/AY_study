import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { api } from "mapp_common/utils/api";
import MyPagination from "pcComponents/myPagination";
import { fullinfoGet } from "tradePublic/tradeDataCenter/api/fullinfoGet";
import './index.scss';
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { showModalVIP } from 'mapp_common/marketing/utils/biz';
import { contactCustomerService } from "mapp_common/utils/openChat";


class WwRushPay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            total: 0,
            pageNo: 1,
        }

        this.promptResult = [];     // 催付结果
		this.dataSource = [];       // 待付款的dataSource
    }

    componentDidMount() {
        this.getWwRushPays(1);
    }

    getWwRushPays = (page) => {
        api({
            apiName: 'aiyong.trade.order.wwrushpay.log.get',
            mode: 'json',
            args:{
                page: page,
                page_size: 20
            },
            callback: (resp) => {
                this.setState({
                    dataSource: resp.rsp,
                    pageNo: page,
                    total: resp.total
                });
            },
            errCallback: (err) => {
                Taro.showToast({ title: JSON.stringify(err) });
            },
        });
    }

    onPageNoChange(page) {
        this.getWwRushPays(page);
    }

    componentWillUpdate(){
		if (this.promptResult.length){
			this.updatePromptResult();
		}
    }

    /* 更新旺旺催付结果 */
    updatePromptResult=()=>{
        api({
            apiName: 'aiyong.trade.order.wwrushpay.log.save',
            args: {
                data: this.promptResult
            },
            callback:(result)=>{
                this.promptResult=[];
            }
        });
	}

    /* 再次催付 */
    reCfFunc(tid, item, record) {
        fullinfoGet({
            tid,
            callback: (trade)=>{
                if (!trade){
                    Taro.showToast({ title: '操作失败' });
                }else {
                    let dataSource = trade;
                    let result, status = dataSource.status;
                    switch (status) {
                        case 'SELLER_CONSIGNED_PART':
                        case 'WAIT_SELLER_SEND_GOODS':
                        case 'WAIT_BUYER_CONFIRM_GOODS':
                        case 'TRADE_BUYER_SIGNED':
                        case 'TRADE_FINISHED':
                        case 'PAID_FORBID_CONSIGN':
                            result = 1;  // '已付款'
                            break;
                        case 'TRADE_CLOSED':
                        case 'TRADE_CLOSED_BY_TAOBAO':
                            result = -1;  // '已关闭'
                            break;
                        case 'WAIT_BUYER_PAY':
                            this.dataSource.push(dataSource)
                            result = 0;  // '待付款'
                            break;
                    }
                    this.promptResult.push({tid, result});

                    record.find(element => element.tid == tid).result = result;

                    if (result == 0){
                        this.wwRushPayAgainFunc(item);
                    } else if (result == 1) {
                        Taro.showToast({ title: '买家已付款' });
                    } else if (result == -1) {
                        Taro.showToast({ title: '订单已关闭' });
                    }
                    this.setState({
                        dataSource: record
                    })
                }
            },
        })
    }

    wwRushPayAgainFunc = (item) => {
        if (getUserInfo().vipFlag == 0) {
            showModalVIP(783)
        } else {
            let index = this.dataSource.findIndex((element)=>{
                return element.tid == item.tid
            });

            contactCustomerService(item.content, item.buyer_nick);
        }
    }

    render() {
        const { dataSource, pageNo, total } = this.state;
        const cfResult = ['催付失败', '再次催付', '催付成功']; // 催付返回的结果是-1，0，1，给其 +1 得到对应的结果

        return (
            <View>
                <View className='wwRush-records-page'>
                    <View className='wwRush-records-content'>
                        <View className='my-table'>
                            <View className='head grid-cont'>
                                <View className='title grid-item5'>
                                    订单号
                                </View>
                                <View className='title grid-item5'>
                                    操作记录
                                </View>
                                <View className='title grid-item9'>
                                    催付模版
                                </View>
                                <View className='title grid-item5 head-cf-result'>
                                    催付结果
                                </View>
                            </View>
                            <View className='body'>
                                {
                                    dataSource.map((item, index) =>
                                        <View className='row grid-cont'>
                                            {/* 订单号 */}
                                            <View className='cell grid-item5'>{item.tid}</View>
                                            {/* 操作记录 */}
                                            <View className='cell grid-item5'>
                                                <View className='ww-rush-records-content-line'>
                                                    <View>{item.sendTime}</View>
                                                    <View>{item.sendNick}</View>
                                                </View>
                                            </View>
                                            {/* 催付模版 */}
                                            <View className='cell grid-item9'>{item.content}</View>
                                            {/* 催付结果 */}
                                            <View className='cell grid-item5'>
                                                <View className='ww-rush-pay-records-content-cf-result'>
                                                {
                                                    cfResult.filter((val, key) => key == Number(item.result) + 1)[0] == '再次催付'
                                                    ?
                                                    <View className='ww-rush-pay-records-content-cf-result-again' onClick={this.reCfFunc.bind(this, item.tid, item, dataSource)}>再次催付</View>
                                                    :
                                                    <View className='ww-rush-pay-records-content-cf-result-spc'>{cfResult.filter((val, key) => key == Number(item.result) + 1)[0]}</View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                    </View>
                {/* 翻页 */}
                {
                    total ?
                        <View className='ww-rush-records-bottom'>
                            <View className='ww-rush-records-bottom-view'>
                                <MyPagination total={total} pageNo={pageNo} pageSizeSelector='dropdown' pageSize={20} onPageNoChange={this.onPageNoChange.bind(this)} pageSizeList={[20]} />
                            </View>
                        </View> : null
                }
                </View>

            </View>
        );
    }
}

export default WwRushPay;
