import Taro, { Component } from '@tarojs/taro';
import { View, Input, Text, Button } from '@tarojs/components';
import { TRADE_ORDER_TYPE } from "tradePublic/consts";
import SelectLogisticsCompany from "pcComponents/selectLogisticsCompany";
import { aiyongGetLogisticsCompanyByCode } from "tradePublic/taobaoLogisticsCompaniesGet";
import { api } from "mapp_common/utils/api";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";
import './index.scss';


class SearchTab extends Component {
    constructor (props) {
        super(props);

        this.state = {
            // 搜索状态
            searchArgs: {
                status: 'all', // 订单来源
                logisticsCompany: '所有快递',   // 快递筛选
                startTime: '',
                endTime: '',
                tidVoice: '',   // 订单编号/运单号
            },
            // select 数据值
            selectData: {
                orderSource: [], // 订单来源
                logisticSource: [], // 快递筛选
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

        let selectData = {};
        selectData.orderSource = orderSource;

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

    doSearch = (type) => {
        let { searchArgs } = this.state;
        let { changeDataSource, headTitle } = this.props;

        let args = {};
        args.orderSource = searchArgs.status;
        args.type = type == 'RECYCLE' ? 'recycle' : 'all';
        args.condition = searchArgs.tidVoice;
        args.start_time = searchArgs.startTime;
        args.end_time = searchArgs.endTime;
        args.company = searchArgs.logisticsCompany == '所有快递' ? '' : searchArgs.logisticsCompany;

        let apiName = type == 'RECYCLE' ? 'aiyong.trade.order.print.elecface.cancelwaybillrecord.get' : 'aiyong.trade.order.print.elecface.applywaybillrecord.get';
        api({
            apiName,
            args,
            callback: (res) => {
                if (res.rsp) {
                    let dataSource = getBodyGrids(res.rsp, headTitle);
                    changeDataSource(dataSource, res.total);
                }
            },
            errCallback:(err) => {
                console.error(err);
            },
        });
    };

    render () {
        const { searchArgs, selectData } = this.state;
        const { type } = this.props;

        return (
            <View className='way-bill-search'>
                <View className='search-row'>
                    <View className='search-item'>
                        <Text className='search-item-text'>订单来源</Text>
                        <select value={searchArgs.status}
                            className='search-item-select'
                            dataSource={selectData.orderSource}
                            onChange={(event) => {
                                this.changeSearchArgs('status', event.target.value);
                                this.doSearch(type);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Text className='search-item-text'>快递筛选</Text>
                        <SelectLogisticsCompany
                            value={searchArgs.logisticsCompany}
                            onChange={(event) => {
                                this.changeSearchArgs('logisticsCompany', aiyongGetLogisticsCompanyByCode(event).name);
                                this.doSearch(type);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        {type == 'ACQUIRED' && <Text className='search-item-text'>获取时间</Text>}
                        {type == 'RECYCLE' && <Text className='search-item-text'>回收时间</Text>}
                        <range-picker className='search-item-date' onChange={(value) => {this.onchangeTime(value);}} />
                    </View>
                    <View className='search-item'>
                        <Input placeholder='订单编号/运单号'
                            value={searchArgs.tidVoice}
                            className='search-item-input'
                            onPressEnter={this.doSearch.bind(this, type)}
                            onInput={(event) => {
                                this.changeSearchArgs('tid', event.target.value);
                            }}
                        />
                    </View>
                    <View className='search-item'>
                        <Button className='search-item-btn' onClick={this.doSearch.bind(this, type)}>筛选</Button>
                    </View>
                </View>
            </View>
        );
    }
}

export default SearchTab;
