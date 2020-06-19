/**
  * 申请的电子面单
 */
import Taro, { Component } from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import { showInputDialogAsync } from "pcComponents/myDialog/api";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { isEmpty } from "mapp_common/utils";
import { api } from "mapp_common/utils/api";
import { getElecfaceData } from "tradePublic/print/elecface/elecfaceData";
import './index.scss';
import EmptyPage from "pcComponents/emptyPage";

class AppliedEWayBills extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: '',
        }
    }

    componentDidMount() {
        /* 获取所有的菜鸟标准电子面单模板 */
        getElecfaceData().then((res) => {
            this.setState({ dataSource: res.elecfaceShareAddresses });
        });
    }

    async shareEWayBills() {
        const { dataSource } = this.state;

        /* 首先判断下是否有自己的电子面单 */
        let hasOwnEWayBill = false;
        for(let key in dataSource) {
            if (dataSource[key].address_arr.find(item => item.sharename == getUserInfo().userNick)) {
                hasOwnEWayBill = true;
                break;
            }
        }

        let value = await showInputDialogAsync({
            labelName: '请输入对方店铺旺旺',
            placeholder: '请输入旺旺昵称',
            title: '授权其他店铺共享我的面单',
            confirmText: '确定共享',
            cancelText: '取消',
            width: 350,
        });

        if (hasOwnEWayBill && !isEmpty(value)) {
            this.confirmShareEWayBills(value);
        } else {
            !hasOwnEWayBill && Taro.showToast({
                title: '您当前只有他人分享给您的电子面单，暂时不能分享。',
                duration: 1500,
            });

        }


    }

    /* 设置默认 */
    changeDefaultAddress = (cp_code, items) => {
        const { dataSource } = this.state;

        let newData = [];
        newData.push(dataSource[cp_code]);
        let addressStr = ['province', 'city', 'district', 'detail'].map(key => items.address[key]).join(' '); // 处理当前设置默认的地址

        let newDataSource = newData.filter(element => element.cp_code == cp_code).map(item => {
            item.address_arr.map(addrInfo => {
                addrInfo.default = 0;

                let itemAdd = ['province', 'city', 'district', 'detail'].map(key => addrInfo.address[key]).join(' '); // 找到与设置默认地址一致的地址，更改其状态为默认
                if(itemAdd == addressStr && addrInfo.sharename == items.sharename){
                    addrInfo.default = 1;
                }
            });
            return item;
        });

        api({
            apiName: 'aiyong.trade.order.print.elecface.defaultaddress.set',
            args: {
                cp_code: cp_code,
                face_name: items.sharename,
                address_dto: addressStr,
            },
            callback: (res) => {
                if (res.result == 'success') {
                    Taro.showToast({ title: '设置默认成功' });
                    this.setState({ dataSource: newDataSource });
                }
            }
        });
    }

    /* 查看我的分享 */
    checkMyShare = () => {
        this.props.changeTab('SHARE');
    }

    /* 确定共享 */
    confirmShareEWayBills = (val) => {
        if (isEmpty(val)) {
            Taro.showToast({ title: '请输入对方旺旺店铺名称' });
        } else {
            api({
                apiName: 'aiyong.trade.order.print.elecface.share',
                mode: 'json',
                args: {
                    'usernick': val
                },
                callback: (rsp) => {
                    if (rsp.result == 'success') {
                        Taro.showToast({ title: '共享成功！' });
                    } else {
                        Taro.showToast({ title: '共享失败！' });
                    }
                },
                errCallback: (err) => {
                    Taro.showToast({ title: JSON.stringify(err) });
                }
            });
        }
    }

    render() {
        const { dataSource } = this.state;

        let newDataSource = [];
        for (let i in dataSource) {
            newDataSource.push(dataSource[i]);
        }

        return (
            <View className='applied-invoice-page'>
                <View className='applied-invoice-page-btns'>
                    <Button onClick={this.shareEWayBills}>分享电子面单</Button>
                    <Button onClick={this.checkMyShare}>查看我的分享</Button>
                </View>
                <View className='logistics-address-page'>
                    <View className='my-table'>
                        <View className='head grid-cont'>
                            <View className='title grid-item5'>
                                快递公司
                            </View>
                            <View className='title grid-item9'>
                                面单地址
                            </View>
                            <View className='title grid-item5'>
                                剩余面单数
                            </View>
                            <View className='title grid-item4'>
                                操作
                            </View>
                        </View>
                        <View className='body'>
                            { isEmpty(newDataSource) && <EmptyPage text={'暂无申请的电子面单'} /> }
                            {
                                newDataSource.map((item, index) =>
                                    <View className='row grid-cont'>
                                        {/* 快递公司 */}
                                        <View className='cell grid-item5'>{item.cp_name}</View>
                                        {/* 面单地址 */}
                                        <View className='cell grid-item9'>
                                            <View className='cell-inoices-addresses'>
                                                {
                                                    item.address_arr.map(items => {
                                                        return (
                                                            <View className='cell-inoices-addresses-line'>
                                                                <View className='cell-inoices-addresses-line-specific'>{items.address.province} {items.address.city} {items.address.district} {items.address.detail}</View>
                                                                {
                                                                    items.sharename != getUserInfo().userNick ? <View className='cell-inoices-addresses-line-sharename'>{items.sharename}分享</View> : null
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                        {/* 剩余面单数 */}
                                        <View className='cell grid-item5'>
                                            <View className='cell-inoices-addresses'>
                                                {
                                                    item.address_arr.map(items => {
                                                        return (
                                                            <View className='cell-inoices-addresses-line cell-inoices-addresses-line-col'>
                                                                <View className='cell-inoices-addresses-line-row cell-inoices-addresses-set-quantity'>{items.quantity}</View>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                        {/* 操作 */}
                                        <View className='cell grid-item5'>
                                            <View className='cell-inoices-addresses'>
                                                {
                                                    item.address_arr.map(items => {
                                                        return (
                                                            <View className='cell-inoices-addresses-line cell-inoices-addresses-line-col'>
                                                                {
                                                                    items.default ? <View className='cell-inoices-addresses-line-row cell-inoices-addresses-set-defaulted'>已默认</View> : <View onClick={this.changeDefaultAddress.bind(this, item.cp_code, items)} className='cell-inoices-addresses-line-row cell-inoices-addresses-set-default'>设置默认</View>
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default AppliedEWayBills;
