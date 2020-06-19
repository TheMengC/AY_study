import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import { AtModal } from 'taro-ui';
import './index.scss';
import '../../itemSettings.scss';
import { generateSkusList, getItemsByNumIids, NO_SKU_KEY } from "tradePublic/itemSettings";
import { isFunction } from "mapp_common/utils";
import { setItemWeight } from "pcComponents/settings/itemSettings/action";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";
import MyGridTableHead from "pcComponents/myGridTableHead";

class ItemWeightEditDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            skuToWeightMap:{},
            unifiedInputValue: '',
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
        let { item, weightMap } = this.props;
        if (weightMap) {
            // 编辑
            this.item = item;
            let list = getBodyGrids(generateSkusList(item), this.headTitle);
            this.skusList = list;
            this.setState({ skuToWeightMap:weightMap });
        }else { // 新增
            // 这里需要重新调接口获取sku信息
            getItemsByNumIids({
                num_iids:[item.num_iid],
                callback:res => {
                    this.item = res[0];
                    let list = getBodyGrids(generateSkusList(this.item), this.headTitle);
                    this.skusList = list;
                    // 初始化
                    let weightMap = {};
                    this.skusList.map(item => weightMap[item.name] = '');
                    weightMap[NO_SKU_KEY] = '';
                    this.setState({ skuToWeightMap:weightMap });
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
        let { skuToWeightMap } = this.state;
        setItemWeight({
            item:this.item,
            skuToWeightMap,
            callback:() => {
                Taro.showToast({ title:'保存成功' });
                this.onClose();
            },
        });
    }

    setUnifiedPrice = () => {
        let { skuToWeightMap, unifiedInputValue } = this.state;
        if (!unifiedInputValue) {
            return;
        }
        if(!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(unifiedInputValue)) {
            Taro.showToast({ title: '请填写正确数据' });
            return;
        }
        this.skusList.map(item => skuToWeightMap[item.name] = unifiedInputValue);
        this.setState({ skuToWeightMap });
    };

    onClose = () => {
        this.props.onClose();
    };

    render () {
        let { skuToWeightMap, unifiedInputValue } = this.state;
        const propsItem = this.item;
        return (
            <AtModal isOpened className='item-settings-page item-settings-dialog item-cost-price-or-weight-edit-dialog item-weight-edit-dialog' onClose={this.onClose}>
                <View className='title'>
                    <Text>设置商品重量</Text>
                </View>
                <View className='dialog-body'>
                    <View className='head-panel'>
                        <Text className='label'>一口价</Text>
                        <Text className='price'>￥{propsItem.price}</Text>
                        <Text> 统一重量：</Text>
                        <Input className='input' value={unifiedInputValue}
                            onInput={event => this.setState({ unifiedInputValue:event.detail.value })}
                            onBlur={event => this.setUnifiedPrice()}
                        />
                        <Text className='unified-type-label'>KG</Text>
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
                                                <Input className='input' size='large' placeholder='请输入重量'
                                                    value={skuToWeightMap[item.name]}
                                                    onInput={event => {
                                                        skuToWeightMap[item.name] = event.detail.value;
                                                        this.setState({ skuToWeightMap });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        </ScrollView>
                        <View className='bottom-panel'>
                            <View className='trade-btn-small-primary' onClick={this.handleSaveOnClick.bind(this)}>保存设置</View>
                        </View>
                    </View>
                </View>
            </AtModal>
        );
    }

}

export default ItemWeightEditDialog;
