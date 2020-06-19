import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input, Image, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtModal } from 'taro-ui';
import './index.scss';
import '../../itemSettings.scss';
import { generateSkusList, getItemsByNumIids, NO_SKU_KEY } from "tradePublic/itemSettings";
import {  isFunction } from "mapp_common/utils";
import { setItemCostPrice } from "pcComponents/settings/itemSettings/action";
import MyGridTableHead from "pcComponents/myGridTableHead";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";

const UNIFIED_TYPE_PRIMARY = 'primary'; // 统一成本价
const UNIFIED_TYPE_MINUS = 'minus'; // 设置商品原价减
const UNIFIED_TYPE_PERCENT = 'percent'; // 设置商品原价的%
class ItemCostPriceEditDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            skuToPriceMap: {},
            unifiedInputValue: '',
            unifiedTypeSelectValue:UNIFIED_TYPE_PRIMARY,
        };
        this.item = {}; // 编辑的商品

        this.headTitle = [
            {
                title: 'sku',
                grid: 9,
            },
            {
                title: '商家编码',
                grid: 5,
            },
            {
                title: '在售价',
                grid: 5,
            },
            {
                title: '成本价',
                grid: 5,
            },
        ];
    }

    componentWillMount () {
        let { item, priceMap } = this.props;
        if (priceMap) {
            // 编辑
            this.item = item;
            let list = getBodyGrids(generateSkusList(item), this.headTitle);
            this.skusList = list;
            this.setState({ skuToPriceMap:priceMap });
        }else { // 新增
            // 这里需要重新调接口获取sku信息
            getItemsByNumIids({
                num_iids:[item.num_iid],
                callback:res => {
                    this.item = res[0];
                    let list = getBodyGrids(generateSkusList(this.item), this.headTitle);
                    this.skusList = list;
                    // 初始化
                    let priceMap = {};
                    this.skusList.map(item => priceMap[item.name] = '');
                    priceMap[NO_SKU_KEY] = '';
                    this.setState({ skuToPriceMap:priceMap });
                },
            });
        }
    }

    componentWillUnmount () {
        const { showInsertDialog } = this.props;
        if (isFunction(showInsertDialog)) {
            showInsertDialog();
        }
    }

    handleSaveOnClick () {
        let { skuToPriceMap } = this.state;
        setItemCostPrice({
            item:this.item,
            skuToPriceMap,
            callback:() => {
                Taro.showToast({ title:'保存成功' });
                this.onClose();
            },
        });
    }

    setUnifiedPrice = () => {
        let { unifiedTypeSelectValue, skuToPriceMap, unifiedInputValue } = this.state;
        if (!unifiedInputValue) {
            return;
        }
        if(!/^(\-|\+)?\d+(\.\d+)?$/.test(unifiedInputValue)) {
            Taro.showToast({ title: '请填写正确数据' });
            return;
        }
        if (unifiedTypeSelectValue === UNIFIED_TYPE_PRIMARY || unifiedTypeSelectValue === UNIFIED_TYPE_MINUS) {
            if(unifiedInputValue < 0 ||
                (unifiedInputValue.split(".")[1] && unifiedInputValue.split(".")[1].length > 2)) {
                Taro.showToast({ title: '请填写正确数据' });
                return;
            }
        }
        switch (unifiedTypeSelectValue) {
            case UNIFIED_TYPE_PRIMARY:
                this.skusList.map(item => skuToPriceMap[item.name] = unifiedInputValue);
                break;
            case UNIFIED_TYPE_MINUS:
                this.skusList.map(item => skuToPriceMap[item.name] = item.price - unifiedInputValue);
                break;
            case UNIFIED_TYPE_PERCENT:
                if ((unifiedInputValue <= 0 || unifiedInputValue >= 100)) {
                    Taro.showToast({ title:'请添加正确百分比数据' });
                    return;
                }
                this.skusList.map(item => skuToPriceMap[item.name] = parseFloat(item.price * unifiedInputValue / 100.00).toFixed(2));
                break;
        }
        this.setState({ skuToPriceMap });
    };

    onClose = () => {
        this.props.onClose();
    };

    render () {
        let { skuToPriceMap, unifiedInputValue, unifiedTypeSelectValue } = this.state;
        const propsItem = this.item;
        return (
            <AtModal isOpened className='item-settings-page item-settings-dialog item-cost-price-or-weight-edit-dialog item-cost-price-edit-dialog' onClose={this.onClose}>
                <View className='title'>
                    <Text>设置商品简称</Text>
                </View>
                <View className='dialog-body'>
                    <View className='head-panel'>
                        <Text className='label'>一口价</Text>
                        <Text className='price'>￥{propsItem.price}</Text>
                        <select className='select'
                            value={unifiedTypeSelectValue}
                            onChange={event => {
                                this.setState({ unifiedInputValue: '' });
                                this.setState({ unifiedTypeSelectValue:event.detail.value });
                            }}
                        >
                            <option value={UNIFIED_TYPE_PRIMARY}>统一成本价</option>
                            <option value={UNIFIED_TYPE_MINUS}>设置商品原价减</option>
                            <option value={UNIFIED_TYPE_PERCENT}>设置商品原价的</option>
                        </select>
                        <Input className='input' value={unifiedInputValue}
                            onInput={event => this.setState({ unifiedInputValue:event.detail.value })}
                            onBlur={event => this.setUnifiedPrice()}
                        />
                        <Text className='unified-type-label'>
                            {
                                {
                                    [UNIFIED_TYPE_PRIMARY]:'元',
                                    [UNIFIED_TYPE_MINUS]:'元为成本价',
                                    [UNIFIED_TYPE_PERCENT]:'%为成本价',
                                }[unifiedTypeSelectValue]
                            }
                        </Text>
                    </View>
                    <View className='my-table grid-item24'>
                        <MyGridTableHead gridTableHead={this.headTitle} />
                        <ScrollView scrollY style={{ height:'380px' }}>
                            <View className='body'>
                                {
                                    this.skusList.map(item =>
                                        <View className='row grid-cont'>
                                            <View className={`cell grid-item${item.grids[0]}`}>{item.name}</View>
                                            <View className={`cell grid-item${item.grids[1]}`}>{item.outer_id}</View>
                                            <View className={`cell grid-item${item.grids[2]}`}>{item.price}</View>
                                            <View className={`cell grid-item${item.grids[3]}`}>
                                                <Input className='input' size='large' placeholder='请输入成本价'
                                                    value={skuToPriceMap[item.name]}
                                                    onInput={event => {
                                                        skuToPriceMap[item.name] = event.detail.value;
                                                        this.setState({ skuToPriceMap });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        </ScrollView>
                        <View className='bottom-panel'>
                            <View className='bottom-panel-view'>
                                <View className='trade-btn-small-primary' onClick={this.handleSaveOnClick.bind(this)}>保存设置</View>
                            </View>
                        </View>
                    </View>
                </View>
            </AtModal>
        );
    }
}

export default ItemCostPriceEditDialog;
