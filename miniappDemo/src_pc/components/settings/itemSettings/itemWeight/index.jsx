import Taro, { Component } from '@tarojs/taro';
import { Checkbox, Image, Text, View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import {
    batchRemoveItemWeight,
    getItemWeightFormat,
    initItemWeightMap,
    removeItemWeight
} from "pcComponents/settings/itemSettings/action";
import { getItemPriceRangeFormat, getItemsByNumIids } from "tradePublic/itemSettings";
import showDialog from "pcComponents/dialogManager/api";
import { showConfirmModal } from "mapp_common/utils";
import MyPagination from "pcComponents/myPagination";
import './index.scss';
// import '../itemSettings.scss';
import MyGridTableHead from "pcComponents/myGridTableHead";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";

@connect((store) => {
    return store.itemSettingsReducer;
})
class ItemWeight extends Component {
    constructor (props) {
        super(props);
        this.state = {
            itemList:[],
            pageNo:1,
            pageSize:20,
        };

        this.headTitle = [
            {
                title: '选择',
                grid: 2,
            },
            {
                title: '宝贝信息',
                grid: 10,
            },
            {
                title: '在售价',
                grid: 4,
            },
            {
                title: '成本价',
                grid: 4,
            },
            {
                title: '操作',
                grid: 4,
            },
        ];
    }

    componentWillMount () {
        let { pageSize } = this.state;
        initItemWeightMap({ refresh:true }).then(() => this.initItemList(pageSize));
    }

    initItemList = (pageSize) => {
        this.setState({ pageNo:1 });
        this.getItemList(1, pageSize);
    };

    getItemList = (pageNo, pageSize) => {
        let { itemWeightMap } = this.props;
        getItemsByNumIids({
            num_iids:Object.keys(itemWeightMap).slice((pageNo - 1) * pageSize, pageNo * pageSize),
            callback:data => {
                data.map(item => item.checked = false);
                let itemList = getBodyGrids(data, this.headTitle);
                this.setState({ itemList });
            },
        });
    };

    changeCheckAll=(event) => {
        let { itemList } = this.state;
        if (event.detail.value) {
            itemList.map(item => item.checked = true);
        }else{
            itemList.map(item => item.checked = false);
        }
        this.setState({ itemList: itemList });
    };

    handleBatchCancelClick () {
        let { itemList, pageSize } = this.state;
        let num_iids = [];
        itemList.map(item => {
            item.checked && num_iids.push(item.num_iid);
        });
        if (!num_iids.length) {
            Taro.showToast({ title:'请先选择需要取消的商品' });
            return;
        }
        showConfirmModal({
            content:'您确定要取消这些商品的重量设置吗',
            onConfirm:() => {
                batchRemoveItemWeight({
                    num_iids,
                    callback:() => {
                        Taro.showToast({ title:'操作成功' });
                        this.initItemList(pageSize);
                    },
                });
            },
        });
    }


    render () {
        let { itemList, pageNo, pageSize } = this.state;
        let { itemWeightMap } = this.props;
        return (
            <View className='item-weight-page item-cost-price-or-weight-page'>
                <View className='head-button-panel'>
                    <View className='insert-btn'
                        onClick={() => showDialog({
                            name:'itemWeightInsertDialog',
                            props:{ refreshItemList: () => this.initItemList(pageSize) },
                        })}
                    >
                        <Text className='iconfont iconfont-zengjia' />
                        <Text>设置商品重量</Text>
                    </View>
                </View>
                <View className='my-table grid-item24'>
                    <MyGridTableHead gridTableHead={this.headTitle} />
                    <View className='body'>
                        {
                            itemList.map((item, index) =>
                                <View className='row grid-cont'>
                                    <View className={`cell grid-item${item.grids[0]}`}>
                                        <Checkbox checked={item.checked}
                                            onChange={event => {
                                                item.checked = event.detail.value;
                                                itemList[index] = item;
                                                this.setState({ itemList });
                                            }}
                                        />
                                    </View>
                                    <View className={`cell grid-item${item.grids[1]}`}>
                                        <View className='baby-img-panel'>
                                            <Image className='baby-img' src={item.pic_url} />
                                        </View>
                                        <View className='baby-info'>
                                            <Text>{item.title}</Text>
                                            {
                                                item.outer_id && <Text className='order-id'>{`商家编码：${item.outer_id}}`}</Text>
                                            }
                                        </View>
                                    </View>
                                    <View className={`cell grid-item${item.grids[2]}`}>
                                        {getItemPriceRangeFormat(item)}
                                    </View>
                                    <View className={`cell grid-item${item.grids[3]}`}
                                        onClick={() => showDialog({
                                            name:'itemWeightEditDialog',
                                            props:{
                                                item:item,
                                                weightMap: itemWeightMap[item.num_iid],
                                            },
                                        })}
                                    ><View className='setting-cell-item'>{getItemWeightFormat(item)}</View>
                                    </View>
                                    <View className={`cell grid-item${item.grids[4]}`}>
                                        <View className='trade-btn-small-normal'
                                            onClick={() => {
                                                showConfirmModal({
                                                    content:'确认取消重量设置？',
                                                    onConfirm:() => {
                                                        removeItemWeight({
                                                            num_iid: item.num_iid,
                                                            callback: () => {
                                                                Taro.showToast({ title:'操作成功' });
                                                                this.initItemList(pageSize);
                                                            },
                                                        });
                                                    },
                                                });
                                            }}
                                        >取消重量设置</View>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                    <View className='bottom-panel'>
                        <View className='bottom-panel-view'>
                            <View className='select-all-panel'>
                                <Checkbox checked={itemList.every(item => item.checked)}
                                    onChange={this.changeCheckAll}
                                >
                                    <Text>
                                    全选（已选 <Text className='select-count'>{itemList.filter(item => item.checked).length}</Text>)
                                    </Text>
                                </Checkbox>
                                <View className='batch-cancel-btn trade-btn-small-primary'
                                    onClick={this.handleBatchCancelClick}
                                >批量取消</View>
                            </View>
                            <MyPagination total={Object.keys(itemWeightMap).length} pageNo={pageNo} pageSize={pageSize}
                                pageSizeSelector='dropdown'
                                onPageSizeChange={pageSize => {
                                    this.setState({ pageSize });
                                    this.initItemList(pageSize);
                                }}
                                onPageNoChange={pageNo => {
                                    this.setState({ pageNo });
                                    this.getItemList(pageNo, pageSize);
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default ItemWeight;
