import Taro, { Component } from '@tarojs/taro';
import { View, Input, Text, Button } from '@tarojs/components';
import { TRADE_ORDER_TYPE, TRADE_BILL_TYPE, ADDR_SOURCES } from "tradePublic/consts";
import SelectLogisticsCompany from "pcComponents/selectLogisticsCompany";
import { aiyongGetLogisticsCompanyByCode } from "tradePublic/taobaoLogisticsCompaniesGet";
import './index.scss';


class SearchTab extends Component {
    constructor (props) {
        super(props);

        this.state = {
            // 搜索状态
            searchArgs: {
                status: 'all',
                tid: '',
                buyerNick: '',
                buyerMobile: '',
                receiverAddress: '',
                waybillNum: '',
                startTime: '',
                endTime: '',
                receiverArea: '所有地区',
                logisticsCompany: '所有快递',
                billType: '所有类型',
            },
            // select 数据值
            selectData: {
                orderSource: [], // 订单来源
                addrNumSource: [], // 地区筛选
                logisticSource: [], // 快递筛选
                billTypeSource: [], // 类型筛选
            },
        };
    }

    componentWillMount () {
        // 获取搜索栏的默认参数
        this.getDefaultSearchArgs();
    }

    getDefaultSearchArgs = () => {
        // 订单来源
        let orderSource = TRADE_ORDER_TYPE.map(tab => (
            {
                label: tab.name,
                value: tab.key,
            }
        ));

        // 类型筛选
        let billTypeSource = TRADE_BILL_TYPE.map(tab => (
            {
                label: tab.name,
                value: tab.key,
            }
        ));

        let selectData = {};
        selectData.orderSource = orderSource;
        selectData.billTypeSource = billTypeSource;
        selectData.addrNumSource = ADDR_SOURCES;

        this.setState({ selectData });
    }

    changeSearchArgs = (type, value) => {
        let { searchArgs } = this.state;
        searchArgs[type] = value;
        this.setState({ searchArgs });
    };

    onchangeTime = (time) => {
        let { searchArgs } = this.state;
        searchArgs.startTime = time.detail.value[0];
        searchArgs.endTime = time.detail.value[1];

        this.setState({ searchArgs });
    }

    doSearch = () => {
        let { searchArgs } = this.state;
        let { getPrintLogs } = this.props;

        let args = {};
        args.isFree = searchArgs.status;
        args.tidNick = searchArgs.tid;
        args.buyerName = searchArgs.buyerNick;
        args.buyerConct = searchArgs.buyerMobile;
        args.buyerAddr = searchArgs.receiverAddress;
        args.voice = searchArgs.waybillNum;
        args.startTime = searchArgs.startTime;
        args.endTime = searchArgs.endTime;
        args.printAdress = searchArgs.receiverArea;
        args.companyCode = searchArgs.logisticsCompany == 'all' ? '所有快递' : searchArgs.logisticsCompany;
        args.companyType = searchArgs.billType;

        getPrintLogs({ ...args });
    };

    render () {
        const { searchArgs, selectData } = this.state;

        return (
            <View className='print-log-search'>
                <View className='search-row'>
                    <View className='search-item'>
                        <Text className='search-item-text'>订单来源</Text>
                        <select value={searchArgs.status}
                            className='search-item-select'
                            dataSource={selectData.orderSource}
                            onChange={(event) => {
                                this.changeSearchArgs('status', event.target.value);
                                this.doSearch();
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Input placeholder='请输入订单号'
                            value={searchArgs.tid}
                            className='search-item-input'
                            onPressEnter={this.doSearch}
                            onInput={(event) => {
                                this.changeSearchArgs('tid', event.target.value);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Input placeholder='请输入收件人姓名'
                            value={searchArgs.buyerNick}
                            className='search-item-input'
                            onPressEnter={this.doSearch}
                            onInput={(event) => {
                                this.changeSearchArgs('buyerNick', event.target.value);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Input placeholder='请输入收件人手机或电话'
                            value={searchArgs.buyerMobile}
                            className='search-item-input'
                            onPressEnter={this.doSearch}
                            onInput={(event) => {
                                this.changeSearchArgs('buyerMobile', event.target.value);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Input placeholder='请输入收货地址关键字'
                            value={searchArgs.receiverAddress}
                            className='search-item-input'
                            onPressEnter={this.doSearch}
                            onInput={(event) => {
                                this.changeSearchArgs('receiverAddress', event.target.value);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Input placeholder='请输入运单号'
                            value={searchArgs.waybillNum}
                            className='search-item-input'
                            onPressEnter={this.doSearch}
                            onInput={(event) => {
                                this.changeSearchArgs('waybillNum', event.target.value);
                            }}
                        />
                    </View>
                </View>
                <View className='search-row search-row-line-2'>
                    <View className='search-item'>
                        <Text className='search-item-text'>打印时间</Text>
                        <range-picker className='search-item-date' onChange={(value) => {this.onchangeTime(value);}} />
                    </View>
                    <View className='search-item'>
                        <select
                            className='search-item-select'
                            dataSource={selectData.addrNumSource}
                            value={searchArgs.receiverArea}
                            onChange={(event) => {
                                this.changeSearchArgs('receiverArea', event.target.value);
                                this.doSearch();
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <SelectLogisticsCompany
                            value={searchArgs.logisticsCompany}
                            onChange={(event) => {
                                this.changeSearchArgs('logisticsCompany', aiyongGetLogisticsCompanyByCode(event).name);
                                this.doSearch();
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <select
                            className='search-item-select'
                            dataSource={selectData.billTypeSource}
                            value={searchArgs.billType}
                            onChange={(event) => {
                                this.changeSearchArgs('billType', event.target.value);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Button className='search-item-btn' onClick={this.doSearch}>筛选</Button>
                    </View>
                </View>
            </View>
        );
    }
}

export default SearchTab;
