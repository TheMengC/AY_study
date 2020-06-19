import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input, Image, ScrollView } from '@tarojs/components';
import { getSellerCatsList, getSellerCids, UNCLASSIFIED_CID } from "tradePublic/itemSettings";
import './index.scss';

const SELECT_VALUE_ALL = 'all';

class ItemFilter extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sellerCatSelectValue:SELECT_VALUE_ALL,
            queryInputValue:'',
        };
        this.sellerCatsList = []; // 商品分类
        this.queryArgs = {};
    }

    componentWillMount () {
        getSellerCatsList().then(data => {
            this.sellerCatsList = data;
            this.forceUpdate();
        });
    }

    handleSellerCatSelectOnChange (value) {
        this.setState({ sellerCatSelectValue:value });
        if (value !== SELECT_VALUE_ALL) {
            this.queryArgs.seller_cids = value === UNCLASSIFIED_CID ? UNCLASSIFIED_CID : getSellerCids(this.sellerCatsList[value]);
        }else if (this.queryArgs.seller_cids) {
            delete this.queryArgs.seller_cids;
        }
        this.props.onQueryArgsChange(this.queryArgs);
    }

    handleSearchOnClick () {
        let { queryInputValue } = this.state;
        if (queryInputValue) {
            this.queryArgs.q = queryInputValue;
        }else{
            delete this.queryArgs.q;
        }
        this.props.onQueryArgsChange(this.queryArgs);
    }

    render () {
        let { sellerCatSelectValue, queryInputValue } = this.state;
        return (
            <View className='item-filter'>
                <select className='select' value={sellerCatSelectValue}
                    onChange={event => this.handleSellerCatSelectOnChange(event.detail.value)}
                >
                    <option value={SELECT_VALUE_ALL}>全部宝贝</option>
                    <option value={UNCLASSIFIED_CID}>未分类宝贝</option>
                    {
                        this.sellerCatsList.map((value, index) => <option value={index}>{value.name}</option>)
                    }
                </select>
                <View className='input-filter'>
                    <Input className='input' placeholder='宝贝关键字' value={queryInputValue}
                        onInput={event => this.setState({ queryInputValue: event.detail.value })}
                    />
                    <View className='trade-btn-small-primary'
                        onClick={this.handleSearchOnClick}
                    >搜索</View>
                </View>
            </View>
        );
    }

}

export default ItemFilter;