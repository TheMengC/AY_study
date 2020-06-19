import Taro, { Component } from '@tarojs/taro';
import { Image, ScrollView, Text, View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtModal } from 'taro-ui';
import { getItemsOnsale } from "tradePublic/itemSettings";
import ItemFilter from "pcComponents/settings/itemSettings/itemFilter";
import { getItemCostPriceFormat } from "pcComponents/settings/itemSettings/action";
import MyPagination from "pcComponents/myPagination";
import './index.scss';
import showDialog from "pcComponents/dialogManager/api";
import { isFunction } from "mapp_common/utils";
import MyGridTableHead from "pcComponents/myGridTableHead";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";

@connect((store) => {
    return store.itemSettingsReducer;
})
class ItemCostPriceInsertDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            itemList :[],
            pageNo:1,
            pageSize:20,
            totalSize:0,
            isOpened : true,
        };
        this.queryArgs = {};

        this.headTitle = [
            {
                title: '宝贝信息',
                grid: 12,
            },
            {
                title: '设置成本价',
                grid: 12,
            },
        ];
    }

    componentWillMount () {
        let { pageSize } = this.state;
        this.initItemList(pageSize);
    }

    initItemList = (pageSize) => {
        this.setState({ pageNo:1 });
        this.getItemList(1, pageSize);
    };

    getItemList = (pageNo, pageSize) => {
        getItemsOnsale({
            pageNo,
            pageSize,
            queryArgs:this.queryArgs,
            callback:res => {
                let itemList = getBodyGrids(res.items, this.headTitle);
                this.setState({
                    itemList,
                    totalSize: res.totalResults,
                });
            },
        });
    };

    onClose = () => {
        const { refreshItemList } = this.props;
        if (isFunction(refreshItemList)) {
            refreshItemList();
        }
        this.props.onClose();
    };

    render () {
        let { itemList, pageNo, pageSize, totalSize, isOpened } = this.state;
        let { itemCostPriceMap } = this.props;
        return (
            <AtModal isOpened={isOpened} className='item-settings-page item-settings-dialog item-cost-price-insert-dialog' onClose={this.onClose}>
                <View className='title'>
                    <Text>设置商品成本价</Text>
                </View>
                <View className='dialog-body'>
                    <View className='filter-panel'>
                        <ItemFilter onQueryArgsChange={queryArgs => {
                            this.queryArgs = queryArgs;
                            this.initItemList(pageSize);
                        }}
                        />
                    </View>
                    <View className='my-table grid-item24'>
                        <MyGridTableHead gridTableHead={this.headTitle} />
                        <ScrollView scrollY style={{ height:'380px' }}>
                            <View className='body'>
                                {
                                    itemList.map(item =>
                                        <View className={`row grid-cont ${itemCostPriceMap[item.num_iid] ? 'row-disable' : ''}`}>
                                            <View className={`cell grid-item${item.grids[0]}`}>
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
                                            <View className={`cell grid-item${item.grids[1]}`}>
                                                {
                                                    itemCostPriceMap[item.num_iid] ?
                                                        <Text>{getItemCostPriceFormat(item)}</Text>
                                                        :
                                                        <View className='trade-btn-small-empty'
                                                            onClick={() => {
                                                                this.setState({ isOpened: false });
                                                                showDialog({
                                                                    name:'itemCostPriceEditDialog',
                                                                    props:{
                                                                        item:item,
                                                                        showInsertDialog:() => this.setState({ isOpened: true }),
                                                                    },
                                                                });
                                                            }}
                                                        >设置成本价</View>
                                                }
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        </ScrollView>
                    </View>
                    <View className='bottom-panel'>
                        <View className='bottom-panel-view'>
                            <View className='trade-btn-small-primary' onClick={() => {
                                this.onClose();
                            }}
                            >保存设置</View>
                            <MyPagination total={totalSize} pageNo={pageNo} pageSize={pageSize}
                                pageSizeSelector='dropdown'
                                onPageNoChange={pageNo => {
                                    this.setState({ pageNo });
                                    this.getItemList(pageNo, pageSize);
                                }}
                                onPageSizeChange={pageSize => {
                                    this.setState({ pageSize });
                                    this.initItemList(pageSize);
                                }}
                            />
                        </View>
                    </View>
                </View>
            </AtModal>
        );
    }
}

export default ItemCostPriceInsertDialog;
