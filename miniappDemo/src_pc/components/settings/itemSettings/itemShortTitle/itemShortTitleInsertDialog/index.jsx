import Taro, { Component } from '@tarojs/taro';
import { Image, Input, ScrollView, Text, View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtModal } from 'taro-ui';
import { isEmpty, isFunction } from "mapp_common/utils";
import './index.scss';
import '../../itemSettings.scss';
import { setItemShortTitle } from "pcComponents/settings/itemSettings/action";
import MyPagination from "pcComponents/myPagination";
import { getItemsOnsale } from "tradePublic/itemSettings";
import ItemFilter from "pcComponents/settings/itemSettings/itemFilter";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";
import MyGridTableHead from "pcComponents/myGridTableHead";

@connect((store) => {
    return store.itemSettingsReducer;
})
class ItemShortTitleInsertDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            itemList : [],
            editItem: {}, // 正在编辑的商品
            pageNo:1,
            pageSize:20,
            totalSize:0,
        };
        this.queryArgs = {};
        this.headTitle = [
            {
                title: '宝贝信息',
                grid: 12,
            },
            {
                title: '设置商品简称',
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

    saveItemShortTitle = (editItem) => {
        setItemShortTitle({
            title:editItem.title,
            num_iid:editItem.num_iid,
            shortTitle:editItem.shortTitle,
            callback:() => {
                this.setState({ editItem:{} });
                Taro.showToast({ title:'保存成功' });
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
        let { itemList, editItem, pageNo, pageSize, totalSize } = this.state;
        let { itemShortTitleMap } = this.props;
        return (
            <AtModal isOpened className='item-settings-page item-settings-dialog item-short-title-insert-dialog' onClose={this.onClose}>
                <View className='title'>
                    <Text>设置商品简称</Text>
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
                                        <View className={`row grid-cont ${itemShortTitleMap[item.num_iid] ? 'row-disable' : ''}`}>
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
                                            <View className={`cell grid-item${item.grids[0]}`}>
                                                {
                                                    itemShortTitleMap[item.num_iid] ?
                                                        <Text>{itemShortTitleMap[item.num_iid]}</Text>
                                                        :
                                                        <Input hasClear size='large' className='input' placeholder='请输入商品简称'
                                                            value={editItem.num_iid === item.num_iid ? editItem.shortTitle : itemShortTitleMap[item.num_iid]}
                                                            onBlur={event => {
                                                                if (!isEmpty(editItem) && editItem.shortTitle !== itemShortTitleMap[item.num_iid]) {
                                                                    this.saveItemShortTitle(editItem);
                                                                }else{
                                                                    this.setState({ editItem: {} });
                                                                }
                                                            }}
                                                            onPressEnter={event => {
                                                                this.saveItemShortTitle(editItem);
                                                            }}
                                                            onInput={event => {
                                                                if (isEmpty(editItem)) {
                                                                    editItem = item;
                                                                    item.shortTitle = itemShortTitleMap[item.num_iid] ? itemShortTitleMap[item.num_iid] : '';
                                                                }
                                                                editItem.shortTitle = event.detail.value;
                                                                this.setState({ editItem: editItem });
                                                            }}
                                                        />
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

export default ItemShortTitleInsertDialog;
