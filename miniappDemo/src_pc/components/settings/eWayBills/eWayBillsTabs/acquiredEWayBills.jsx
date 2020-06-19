/**
 * 面单获取记录
 */
import Taro, { Component } from '@tarojs/taro';
import { Button, View, Text } from '@tarojs/components';
import SearchTab from "pcComponents/settings/eWayBills/eWayBillsTabs/searchTab";
import MyGridTableHead from "pcComponents/myGridTableHead";
import './index.scss';
import { api, isEmpty } from "tradePolyfills/index";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";
import { cancelWaybillCode } from "pcComponents/print/utils";
import { aiyongGetLogisticsCompanyByName } from "tradePublic/taobaoLogisticsCompaniesGet";
import MySinglePagination from "pcComponents/mySinglePagination";
import EmptyPage from "pcComponents/emptyPage";

class AcquiredEWayBills extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: '',
            pageNo: 1,
            hasNext: false,
        }

        this.headTitle = [
            {
                title: '订单来源',
                grid: 3,
            },
            {
                title: '订单号',
                grid: 4,
            },
            {
                title: '快递信息',
                grid: 3,
            },
            {
                title: '快递单号',
                grid: 3,
            },
            {
                title: '获取时间',
                grid: 4,
            },
            {
                title: '操作人',
                grid: 4,
            },
            {
                title: '操作',
                className: 'head-title-spec',
                grid: 3,
            },
        ];
    }

    componentWillMount() {
        this.getAcquiredWayBills({ pageNo: 1 });
    }

    getAcquiredWayBills = ({ pageNo = 1 }) => {
        api({
            args: { pageNo },
            apiName:'aiyong.trade.order.print.elecface.applywaybillrecord.get',
            callback: (res) => {
                if (res.rsp) {
                    let dataSource = getBodyGrids(res.rsp, this.headTitle);
                    this.setState({ dataSource, hasNext: res.total });
                }
            },
            errCallback:(err) => {
                console.error(err);
            },
        });
    }

    onPageNoChange(pageNo) {
        this.getAcquiredWayBills({ pageNo });
    }

    /* 取消单号 */
    cancelWayBillNums(bill) {
        let { dataSource } = this.state;
        let company = aiyongGetLogisticsCompanyByName(bill.Delivercompany);
        let code = company.code_cainiao || company.code;

        cancelWaybillCode({
            cpCode: code,
            voice: bill.voice,
            nick: bill.remark,
            callback: (result) => {
                if (result.result == 'success') {
                    // 修改页面显示
                    api({
                        apiName: 'aiyong.trade.order.print.elecface.waybill.close',
                        method: '/print/Waybillnumberclose',
                        args: {
                            'tid': bill.tid,
                            'wcode': bill.voice,
                        },
                        mode: 'json',
                        callback: (res) => {
                            Taro.showToast({ title: '取消单号成功！'  });
                            // 更改一下状态
                            let newDataSource = dataSource.find(element => element.tid == bill.tid).map(item => {
                                item.remark = '面单已回收';
                                return item;
                            });
                            this.setState({ dataSource: newDataSource });
                            console.log('取消单号成功！', res);
                        },
                        errCallback: (err) => {
                            Taro.showToast({ title: '取消单号失败！' });
                            console.log('取消单号失败！', err);
                        },
                    });
                } else {
                    Taro.showToast({ title: '回收失败！' });
                    console.log('回收失败', result);
                }
            },
        });
    }

    changeDataSource = (dataSource, total) => {
        this.setState({ dataSource, hasNext: total });
    }

    render() {
        const { dataSource, pageNo, hasNext } = this.state;
        const { type } = this.props;

        return (
            <View className='acquired-way-bill-page way-bill-public'>
                <SearchTab type={type} changeDataSource={this.changeDataSource} headTitle={this.headTitle} />
                <View className='acquired-way-bill-content my-table grid-item24'>
                    <MyGridTableHead gridTableHead={this.headTitle}></MyGridTableHead>
                    <View className='body'>
                        { isEmpty(dataSource) && <EmptyPage text={'暂无电子面单获取记录'} /> }
                        {
                            dataSource.map(bills => {
                                return (
                                    <View className='row grid-cont acquired-way-bill-content-row'>
                                        {/*  订单来源  */}
                                        <View className={`cell grid-item${bills.grids[0]} acquired-way-bill-content-col`}>
                                            {bills.isFree == '0' && <Text>淘宝订单</Text>}
                                            {bills.isFree == '1' && <Text>自由打印订单</Text>}
                                            {bills.isFree == '2' && <Text>拼多多订单</Text>}
                                        </View>
                                        {/* 订单号 */}
                                        <View
                                            className={`cell grid-item${bills.grids[1]} acquired-way-bill-content-col`}>
                                            <Text>{bills.tid}</Text>
                                        </View>
                                        {/* 快递信息 */}
                                        <View
                                            className={`cell grid-item${bills.grids[2]} acquired-way-bill-content-col acquired-way-bill-content-col-logistic-info`}>
                                            <Text className='acquired-way-bill-content-col-text'>{bills.Delivercompany}</Text>
                                        </View>
                                        {/* 快递单号 */}
                                        <View
                                            className={`cell grid-item${bills.grids[3]} acquired-way-bill-content-col acquired-way-bill-content-col-logistic-info`}>
                                            <Text className='acquired-way-bill-content-col-text'>{bills.voice}</Text>
                                        </View>
                                        {/* 获取时间 */}
                                        <View
                                            className={`cell grid-item${bills.grids[4]} acquired-way-bill-content-col acquired-way-bill-content-col-receiver-info`}>
                                            <Text>{bills.Operatetime}</Text>
                                        </View>
                                        {/* 操作人 */}
                                        <View
                                            className={`cell grid-item${bills.grids[5]} acquired-way-bill-content-col acquired-way-bill-content-col-receiver-info`}>
                                            <Text>{bills.printerUser}</Text>
                                        </View>
                                        {/* 操作 */}
                                        <View className={`cell grid-item${bills.grids[6]} acquired-way-bill-content-col acquired-way-bill-content-col-opt`}>
                                            {
                                                bills.remark == '面单已回收' ? <Text className='acquired-way-bill-content-col-opt-res'>面单已回收</Text> : <Button className='acquired-way-bill-content-col-opt-btn' onClick={this.cancelWayBillNums.bind(this, bills)}>取消单号</Button>
                                            }
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
                <View className='recycled-way-bill-bottom'>
                    <View className='recycled-way-bill-bottom-view'>
                        <MySinglePagination pageNo={pageNo} hasNext={hasNext} onPageNoChange={this.onPageNoChange.bind(this)} />
                    </View>
                </View>
            </View>
        );
    }
}

export default AcquiredEWayBills;
