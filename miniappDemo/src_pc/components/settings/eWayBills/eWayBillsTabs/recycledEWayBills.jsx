/**
 * 面单回收记录
 */
import Taro, { Component } from '@tarojs/taro';
import { Button, View, Text } from '@tarojs/components';
import SearchTab from "pcComponents/settings/eWayBills/eWayBillsTabs/searchTab";
import MyGridTableHead from "pcComponents/myGridTableHead";
import './index.scss';
import { api } from "mapp_common/utils/api";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";
import { isEmpty } from "mapp_common/utils";
import MySinglePagination from "pcComponents/mySinglePagination";
import MyPagination from "pcComponents/myPagination";
import EmptyPage from "pcComponents/emptyPage";

class RecycledEWayBills  extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: '',
            pageNo: 1,
            total: 0,
        };

        this.headTitle = [
            {
                title: '订单来源',
                grid: 4,
            },
            {
                title: '订单号',
                grid: 5,
            },
            {
                title: '快递信息',
                grid: 3,
            },
            {
                title: '快递单号',
                grid: 4,
            },
            {
                title: '回收时间',
                grid: 4,
            },
            {
                title: '操作人',
                className: 'head-title-spec',
                grid: 4,
            },
        ];
    }

    onPageNoChange = (pageNo) => {
        this.getRecycledWayBills({ pageNo });
    }

    getRecycledWayBills = ({ pageNo = 1 }) => {
        api({
            args: { pageNo },
            apiName:'aiyong.trade.order.print.elecface.cancelwaybillrecord.get',
            callback: (res) => {
                if (res.rsp) {
                    let dataSource = getBodyGrids(res.rsp, this.headTitle);
                    this.setState({ dataSource, total: res.total });
                }
            },
            errCallback:(err) => {
                console.error(err);
            },
        });
    }

    changeDataSource = (dataSource, total) => {
        this.setState({ dataSource, total });
    }

    componentWillMount() {
        this.getRecycledWayBills({ pageNo: 1 });
    }

    render() {
        const { dataSource, total, pageNo } = this.state;
        const { type } = this.props;

        return (
            <View className='recycled-way-bill-page way-bill-public'>
                <SearchTab type={type} changeDataSource={this.changeDataSource} headTitle={this.headTitle} />
                <View className='recycled-way-bill-content my-table grid-item24'>
                    <MyGridTableHead gridTableHead={this.headTitle}></MyGridTableHead>
                    <View className='body'>
                        { isEmpty(dataSource) && <EmptyPage text={'暂无电子面单回收记录'} /> }
                        {
                            !isEmpty(dataSource) && dataSource.filter(item => item.remark == '面单已回收').map(bills => {
                                return (
                                    <View className='row grid-cont recycled-way-bill-content-row'>
                                        {/*  订单来源  */}
                                        <View className={`cell grid-item${bills.grids[0]} recycled-way-bill-content-col`}>
                                            {bills.isFree == '0' && <Text>淘宝订单</Text>}
                                            {bills.isFree == '1' && <Text>自由打印订单</Text>}
                                            {bills.isFree == '2' && <Text>拼多多订单</Text>}
                                        </View>
                                        {/* 订单号 */}
                                        <View className={`cell grid-item${bills.grids[1]} recycled-way-bill-content-col`}>
                                            <Text>{bills.tid}</Text>
                                        </View>
                                        {/* 快递信息 */}
                                        <View className={`cell grid-item${bills.grids[2]} recycled-way-bill-content-col recycled-way-bill-content-col-logistic-info`}>
                                            <Text className='recycled-way-bill-content-col-text'>{bills.Delivercompany}</Text>
                                        </View>
                                        {/* 快递单号 */}
                                        <View className={`cell grid-item${bills.grids[3]} recycled-way-bill-content-col recycled-way-bill-content-col-receiver-info`}>
                                            <Text className='recycled-way-bill-content-col-text'>{bills.voice}</Text>
                                        </View>
                                        {/* 回收时间 */}
                                        <View className={`cell grid-item${bills.grids[4]} recycled-way-bill-content-col recycled-way-bill-content-col-opt-record`}>
                                            <Text>{bills.cancelTime}</Text>
                                        </View>
                                        {/* 操作人 */}
                                        <View className={`cell grid-item${bills.grids[5]} recycled-way-bill-content-col recycled-way-bill-content-col-opt`}>
                                            <Text>{bills.cancelUser}</Text>
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
                <View className='recycled-way-bill-bottom'>
                    <View className='recycled-way-bill-bottom-view'>
                        <MyPagination total={total} pageNo={pageNo} onPageNoChange={this.onPageNoChange.bind(this)} />
                    </View>
                </View>
            </View>
        );
    }
}

export default RecycledEWayBills;
