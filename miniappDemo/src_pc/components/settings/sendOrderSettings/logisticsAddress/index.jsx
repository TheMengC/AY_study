import Taro, { Component } from '@tarojs/taro';
import { View, Text, Checkbox } from '@tarojs/components';
import './index.scss';
import { CANCEL_ADDRESS_DEFAULT_KEY, logisticsAddressGet,
    logisticsAddressModify,
    logisticsAddressRemove, printSettingGet,
    SEND_ADDRESS_DEFAULT_KEY, USER_PRINT_ADDRESS_CUSTOM, USER_PRINT_ADDRESS_ELEC, userPrintElecAddressSet } from "tradePublic/logisticsSettings";
import { showConfirmModal } from "mapp_common/utils";
import { events } from "mapp_common/utils/eventManager";

class LogisticsAddress extends Component {

    constructor (props) {
        super(props);
        this.state = {
            logisticsAddressList: [],
            printElecAddr:'',
        };
    }

    componentWillMount () {
        printSettingGet({
            callback:data => {
                this.setState({ printElecAddr:data.setdata.print_elec_addr });
            }, 
        });
        logisticsAddressGet({ callback: data => this.setState({ logisticsAddressList: data }) });
    }

    /**
     * 把地址设为默认
     * @param index
     * @param defaultKey
     */
    setAddressAsDefault (index, defaultKey) {
        let { logisticsAddressList } = this.state;
        let address = logisticsAddressList[index];
        address[defaultKey] = true;
        logisticsAddressModify({
            contact_id: address.contact_id,
            address,
            callback: () => {
                logisticsAddressList.map(item => item[defaultKey] = false);
                logisticsAddressList[index][defaultKey] = true;
                this.setState({ logisticsAddressList });
            },
        });
    }

    /**
     * 删除地址
     * @param index
     */
    deleteAddress (index) {
        let { logisticsAddressList } = this.state;
        let address = logisticsAddressList[index];
        if (address.cancel_def || address.get_def) {
            Taro.showToast({ title: '无法删除默认地址' });
            return;
        }
        showConfirmModal({
            content: '确认删除？',
            onConfirm: () => {
                logisticsAddressRemove({
                    contact_id: logisticsAddressList[index].contact_id,
                    callback: () => {
                        logisticsAddressList.splice(index, 1);
                        this.setState({ logisticsAddressList });
                        Taro.showToast({ title: '操作成功' });
                    },
                });
            },
        });
    }

    /**
     * 自定义打印电子面单时使用电子面单取号时的发货地址
     * @param value
     */
    userPrintElecAddressSet (value) {
        let printElecAddr = value ? USER_PRINT_ADDRESS_ELEC : USER_PRINT_ADDRESS_CUSTOM;
        userPrintElecAddressSet({
            value: printElecAddr,
            callback: res => {
                this.setState({ printElecAddr });
            },
        });
    }

    render () {
        let { logisticsAddressList, printElecAddr } = this.state;
        return (
            <View className='logistics-address-page'>
                <View className='header-title'>
                    <View className='title'>发货/退货地址</View>
                    <View className='right'>
                        <Checkbox className='checkbox'
                            onChange={event => this.userPrintElecAddressSet(event.detail.value)}
                            checked={printElecAddr === USER_PRINT_ADDRESS_ELEC}
                        />
                        <Text>自定义打印电子面单时使用电子面单取号时的发货地址</Text>
                    </View>
                </View>
                <View className='my-table'>
                    <View className='head grid-cont'>
                        <View className='title grid-item6'>
                            地址
                        </View>
                        <View className='title grid-item2'>
                            联系人
                        </View>
                        <View className='title grid-item3'>
                            手机
                        </View>
                        <View className='title grid-item3'>
                            座机
                        </View>
                        <View className='title grid-item4'>
                            备注
                        </View>
                        <View className='title grid-item2'>
                            发货地址
                        </View>
                        <View className='title grid-item2'>
                            收货地址
                        </View>
                        <View className='title grid-item2'>
                            操作
                        </View>
                    </View>
                    <View className='body'>
                        {
                            logisticsAddressList.map((item, index) =>
                                <View className='row grid-cont'>
                                    <View className='cell grid-item6'>
                                        <View className='address-cell'>
                                            <Text>{`${item.province} ${item.city} ${item.country}`}</Text>
                                            <Text>{item.addr}</Text>
                                        </View>
                                    </View>
                                    <View className='cell grid-item2'>{item.contact_name}</View>
                                    <View className='cell grid-item3'>{item.mobile_phone}</View>
                                    <View className='cell grid-item3'>{item.phone}</View>
                                    <View className='cell grid-item4'>{item.memo}</View>
                                    <View className='cell grid-item2'>
                                        <Checkbox
                                            onChange={event => this.setAddressAsDefault(index, SEND_ADDRESS_DEFAULT_KEY)}
                                            checked={item.get_def}
                                        />
                                        <Text className='next-checkbox-label'>默认</Text>
                                    </View>
                                    <View className='cell grid-item2'>
                                        <Checkbox
                                            onChange={event => this.setAddressAsDefault(index, CANCEL_ADDRESS_DEFAULT_KEY)}
                                            checked={item.cancel_def}
                                        />
                                        <Text className='next-checkbox-label'>默认</Text>
                                    </View>
                                    <View className='cell grid-item2'>
                                        <View className='edit-btn-cell'>
                                            <View className='edit-btn'
                                                onClick={() => events.showDialog.emit({
                                                    name: 'logisticsAddressEditDialog',
                                                    props: {
                                                        defaultAddress: item,
                                                        addressEditFun: (newAddress) => {
                                                            logisticsAddressList[index] = newAddress;
                                                            this.setState({ logisticsAddressList });
                                                        },
                                                    }
                                                    ,
                                                })}
                                            >编辑</View>
                                            <View className='split-line' />
                                            <View className={`edit-btn ${item.get_def || item.cancel_def ? 'edit-btn-disable' : ''}`}
                                                onClick={() => this.deleteAddress(index)}
                                            >删除</View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
                <View className='bottom-buttons'>
                    <View className='add-btn'
                        onClick={() => events.showDialog.emit({
                            name: 'logisticsAddressEditDialog',
                            props: {
                                addressEditFun: (newAddress) => {
                                    logisticsAddressList.push(newAddress);
                                    this.setState({ logisticsAddressList });
                                },
                            }
                            ,
                        })}
                    >
                        <Text className='iconfont iconfont-zengjia' />
                        新增地址
                    </View>
                </View>
            </View>
        );
    }
}

export default LogisticsAddress;