import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './index.scss';
import SearchTab from "./searchTab";
import MyGridTableHead from "pcComponents/myGridTableHead";
import { api } from "mapp_common/utils/api";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";
import { changeRoute } from "pcComponents/router";
import MySinglePagination from "pcComponents/mySinglePagination";

class PrintLog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            dataSource: [],
            pageNo: 1,
            hasNext: false,
        };

        // 表头
        this.headTitle = [
            {
                title: '订单来源',
                grid: 2,
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
                title: '收件人信息',
                grid: 6,
            },
            {
                title: '操作记录',
                grid: 5,
            },
            {
                title: '操作',
                className: 'head-title-spec',
                grid: 4,
            },
        ];
    }

    componentWillMount () {
        this.getPrintLogs({ pageNo: 1 });
    }

    getPrintLogs = ({
        pageNo = 1,
        pageSize = 20,
        isFree = 'all', // 订单来源
        tidNick = null, // 订单编号
        buyerName = null,   // 收件人姓名
        buyerConct = null,  // 收件人手机或电话
        buyerAddr = null,   // 收件人地址关键字
        voice = null,   // 运单号
        startTime = null,   // 开始时间
        endTime = null,     // 结束时间
        printAdress = null, // 地区筛选
        companyCode = null, // 快递公司筛选
        companyType = null, // 类型筛选
    }) => {
        api({
            apiName: 'aiyong.trade.order.print.record.search',
            args: {
                pageNo,
                pageSize,
                isFree,
                tidNick,
                buyerName,
                buyerConct,
                buyerAddr,
                voice,
                startTime,
                endTime,
                printAdress,
                companyCode,
                companyType,
            },
            callback: (res) => {
                if (res.result) {
                    /* 计算一下表格 body 部分的栅格大小 */
                    let dataSource = getBodyGrids(res.result, this.headTitle);
                    this.setState({ dataSource, hasNext: res.total });
                }
            },
            errCallback: (err) => {
                console.error(err);
            },
        });
    };

    onPageNoChange(pageNo) {
        this.getPrintLogs({ pageNo });
    }

    goToLoDetails(logInfo) {
        let args = {};
        if (logInfo.mergeTid) {
            args.mergeTid = logInfo.mergeTid;
        }
        if (logInfo.tid) {
            args.tid = logInfo.tid;
        }

        changeRoute({
            path: '/settings/printLogDetails',
            param: { ...args },
        });
    }

    render () {
        const { dataSource, pageNo, hasNext } = this.state;

        return (
            <View className='print-log-page'>
                <SearchTab getPrintLogs={this.getPrintLogs} />
                <View className='print-log-content my-table grid-item24'>
                    <MyGridTableHead gridTableHead={this.headTitle}></MyGridTableHead>
                    <View className='body'>
                        {
                            dataSource.map(logInfo => {
                                return (
                                    <View className='row grid-cont print-log-content-row'>
                                        {/*  订单来源  */}
                                        <View className={`cell grid-item${logInfo.grids[0]} print-log-content-col`}>
                                            {logInfo.isFree == '0' && <Text>淘宝订单</Text>}
                                            {logInfo.isFree == '1' && <Text>自由打印订单</Text>}
                                            {logInfo.isFree == '2' && <Text>拼多多订单</Text>}
                                        </View>
                                        {/* 订单号 */}
                                        <View
                                            className={`cell grid-item${logInfo.grids[1]} print-log-content-col`}>
                                            <Text>{logInfo.tid}</Text>
                                        </View>
                                        {/* 快递信息 */}
                                        <View
                                            className={`cell grid-item${logInfo.grids[2]} print-log-content-col print-log-content-col-logistic-info`}>
                                            <Text className='print-log-content-col-text'>{logInfo.Delivercompany}</Text>
                                            <Text className='print-log-content-col-text'>{logInfo.voice}</Text>
                                        </View>
                                        {/* 收件人信息——姓名,电话,地址,邮编 */}
                                        <View
                                            className={`cell grid-item${logInfo.grids[3]} print-log-content-col print-log-content-col-receiver-info`}>
                                            {`${logInfo.buyerName},${logInfo.buyerMobile},${logInfo.buyerProvince},${logInfo.buyerCity},${logInfo.buyerAddress},${logInfo.zipCode}`}
                                        </View>
                                        {/* 操作记录 */}
                                        <View
                                            className={`cell grid-item${logInfo.grids[4]} print-log-content-col print-log-content-col-opt-record`}>
                                            <Text className='print-log-content-col-text'>{logInfo.Operatetime}</Text>
                                            {logInfo.printerUser && <Text className='print-log-content-col-text'>操作人：${logInfo.printerUser}</Text>}
                                            {logInfo.printer && <Text className='print-log-content-col-text'>打印机：${logInfo.printer}</Text>}
                                        </View>
                                        {/* 操作 */}
                                        <View className={`cell grid-item${logInfo.grids[5]} print-log-content-col print-log-content-col-opt`}>
                                            <Button className='print-log-content-col-opt-btn' onClick={this.goToLoDetails.bind(this, logInfo)}>查看详情</Button>
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
                <View className='print-log-bottom'>
                    <View className='print-log-bottom-view'>
                        <MySinglePagination pageNo={pageNo} hasNext={hasNext} onPageNoChange={this.onPageNoChange.bind(this)} />
                    </View>
                </View>
            </View>
        );
    }
}

export default PrintLog;
