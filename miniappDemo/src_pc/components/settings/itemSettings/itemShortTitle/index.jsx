import Taro, { Component } from '@tarojs/taro';
import { Checkbox, Image, Input, Text, View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { getItemsByNumIids } from "tradePublic/itemSettings";
import { isEmpty } from "mapp_common/utils";
import './index.scss';
import '../itemSettings.scss';
import MyPagination from "pcComponents/myPagination";
import showDialog from "pcComponents/dialogManager/api";
import { initItemShortTitleMap, setItemShortTitle } from "pcComponents/settings/itemSettings/action";
import MyGridTableHead from "pcComponents/myGridTableHead";
import { getBodyGrids } from "pcComponents/myGridTableHead/getBodyGrids";

@connect((store) => {
    return store.itemSettingsReducer;
})

class ItemShortTitle extends Component {
    constructor (props) {
        super(props);
        this.state = {
            itemList: [],
            editItem: {}, // 正在编辑的宝贝
            pageNo:1,
            pageSize:20,
        };

        this.headTitle = [
            {
                title: '宝贝信息',
                grid: 12,
            },
            {
                title: '商品简称',
                grid: 12,
            },
        ];
    }

    componentWillMount () {
        let { pageSize } = this.state;
        initItemShortTitleMap({ refresh : true }).then(() => this.initItemList(pageSize));
    }

    initItemList = (pageSize) => {
        this.setState({ pageNo:1 });
        this.getItemList(1, pageSize);
    };

    getItemList = (pageNo, pageSize) => {
        let { itemShortTitleMap } = this.props;
        getItemsByNumIids({
            num_iids:Object.keys(itemShortTitleMap).slice((pageNo - 1) * pageSize, pageNo * pageSize),
            callback:data => {
                let itemList = getBodyGrids(dat, this.headTitle);
                this.setState({ itemList });
            },
        });
    };

    saveItemShortTitle = (editItem) => {
        let { itemList } = this.state;
        setItemShortTitle({
            title:editItem.title,
            num_iid:editItem.num_iid,
            shortTitle:editItem.shortTitle,
            callback:() => {
                if (!editItem.shortTitle) {
                    // 删除
                    this.setState({ itemList: itemList.filter(item => item.num_iid !== editItem.num_iid) });
                }
                this.setState({ editItem:{} });
                Taro.showToast({ title:'操作成功' });
            },
        });
    };

    render () {
        let { itemList, editItem, pageNo, pageSize } = this.state;
        let { itemShortTitleMap } = this.props;
        return (
            <View className='item-short-title-page'>
                <View className='switch-panel'>
                    <Text className='title'>使用商品简称</Text>
                    <Checkbox className='check-box' label='物流单' />
                    <Checkbox className='check-box' label='发货单' />
                </View>
                <View className='head-button-panel'>
                    <View className='insert-btn'
                        onClick={() => showDialog({
                            name:'itemShortTitleInsertDialog',
                            props:{ refreshItemList: () => this.initItemList(pageSize) },
                        })}
                    >
                        <Text className='iconfont iconfont-zengjia' />
                        <Text>添加商品简称</Text>
                    </View>
                </View>
                <View className='my-table grid-item24'>
                    <MyGridTableHead gridTableHead={this.headTitle} />
                    <View className='body'>
                        {
                            itemList.map(item =>
                                <View className='row grid-cont'>
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
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
                {
                    Object.keys(itemShortTitleMap).length && (
                        <View className='bottom-panel'>
                            <View className='bottom-panel-view'>
                                <MyPagination total={Object.keys(itemShortTitleMap).length} pageNo={pageNo} pageSize={pageSize}
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
                    )
                }
            </View>
        );
    }

}

export default ItemShortTitle;
