import Taro, { Component } from '@tarojs/taro';
import { View, Input, Text, Textarea } from '@tarojs/components';
import { AtModal } from 'taro-ui';
import './index.scss';
import RegionSelect from "../../../../regionSelect";
import { isEmpty, isFunction, showConfirmModal } from "mapp_common/utils";
import { addressFastFill,
    logisticsAddressAdd,
    logisticsAddressModify,
    REQUIRED_FIELDS } from "tradePublic/logisticsSettings";

class LogisticsAddressEditDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            address: {},
            addressString:'',
        };
    }

    componentWillMount () {
        if (this.props.defaultAddress) {
            this.setState({ address:this.props.defaultAddress });
        }
    }

    onClose = () => {
        this.props.onClose();
    }

    handleSaveOnClick = () => {
        let { address } = this.state;
        const { defaultAddress, addressEditFun } = this.props;
        for (let key of Object.keys(REQUIRED_FIELDS)) {
            if (isEmpty(address[key])) {
                Taro.showToast({ title:`${REQUIRED_FIELDS[key]}为必填项` });
                return;
            }
        }
        const errorCallback = (error) => {
            showConfirmModal({ content:JSON.stringify(error), showCancel:false });
        };
        const callback = () => {
            if (isFunction(addressEditFun)) {
                addressEditFun(address);
            }
            Taro.showToast({ title:'保存成功！' });
            this.onClose();
        };
        if (defaultAddress) {
            logisticsAddressModify({
                contact_id: address.contact_id,
                address,
                callback,
                errorCallback,
            });
        }else {
            logisticsAddressAdd({
                address,
                callback,
                errorCallback,
            });
        }
    }

    addressFastFill = async (addressString) => {
        let data = await addressFastFill(addressString);
        let address = {};
        data.province.value && (address.province = data.province.value);
        data.city.value && (address.city = data.city.value);
        data.area.value && (address.country = data.area.value);
        data.detail && (address.addr = data.detail);
        data.zipCode && (address.zip_code = data.zipCode);
        data.receiver && (address.contact_name = data.receiver);
        data.contact.mobile && (address.mobile_phone = data.contact.mobile);
        data.contact.phone && (address.phone = data.contact.phone);
        this.setState({ address });
    }

    render () {
        let { address, addressString } = this.state;
        return (
            <AtModal className='logistics-address-edit-dialog' isOpened onClose={this.onClose}>
                <View>
                    <View className='title'>
                    新增地址
                    </View>
                    <View className='body'>
                        <View className='form-item grid-cont'>
                            <View className='label grid-item3'>
                                <Text className='no-required-icon' />
                                <Text className='label-text'>智能填写地址</Text>
                            </View>
                            <Textarea className='textarea grid-item21' placeholder='请输入例如 张三，北京朝阳区xxx街道xxx号'
                                value={addressString}
                                onInput={event => this.setState({ addressString: event.detail.value })}
                            />
                            <View className='grid-item3' />
                            <View className='grid-item21'>
                                <View className='bottom-btns'>
                                    <View className='help'>
                                        <Text className='iconfont iconfont-bangzhu' />
                                        使用帮助
                                    </View>
                                    <View className='trade-btn-small-empty'
                                        onClick={() => this.addressFastFill(addressString)}
                                    >一键识别</View>
                                </View>
                            </View>
                        </View>
                        <View className='form-item grid-cont'>
                            <View className='label grid-item3'>
                                <Text className='required-icon'>*</Text>
                                <Text className='label-text'>选择所在地</Text>
                            </View>
                            <RegionSelect className='grid-item21'
                                defaultValues={
                                    !isEmpty(address) ?
                                        {
                                            province:address.province,
                                            city:address.city,
                                            country:address.country,
                                        } : {}
                                }
                                onChange={(values) => {
                                    address.province = values.province.address;
                                    address.city = values.city.address;
                                    address.country = values.country.address;
                                    this.setState({ address });
                                }}
                            />
                        </View>
                        <View className='form-item grid-cont'>
                            <View className='label grid-item3'>
                                <Text className='required-icon'>*</Text>
                                <Text className='label-text'>详细地址</Text>
                            </View>
                            <Textarea className='textarea grid-item21' placeholder='请输入街道详细地址 例如：'
                                value={address.addr}
                                onInput={event => {
                                    address.addr = event.detail.value;
                                    this.setState({ address });
                                }}
                            />
                        </View>
                        <View className='form-item grid-cont'>
                            <View className='label grid-item3'>
                                <Text className='required-icon'>*</Text>
                                <Text className='label-text'>邮政编码</Text>
                            </View>
                            <Input className='input grid-item5' size='large'
                                value={address.zip_code}
                                onInput={(event => {
                                    address.zip_code = event.detail.value;
                                    this.setState({ address });
                                })}
                            />
                        </View>
                        <View className='form-item grid-cont'>
                            <View className='label grid-item3'>
                                <Text className='required-icon'>*</Text>
                                <Text className='label-text'>发件人姓名</Text>
                            </View>
                            <Input className='input grid-item5' size='large'
                                value={address.contact_name}
                                onInput={(event => {
                                    address.contact_name = event.detail.value;
                                    this.setState({ address });
                                })}
                            />
                            <View className='label label-right extra-label grid-item3'>
                                <Text className='required-icon'>*</Text>
                                <Text className='label-text'>手机</Text>
                            </View>
                            <Input className='input grid-item5' size='large'
                                value={address.mobile_phone}
                                onInput={(event => {
                                    address.mobile_phone = event.detail.value;
                                    this.setState({ address });
                                })}
                            />
                            <View className='label label-right extra-label grid-item3'>
                                <Text className='no-required-icon' />
                                <Text className='label-text'>电话</Text>
                            </View>
                            <Input className='input grid-item5' size='large'
                                value={address.phone}
                                onInput={(event => {
                                    address.phone = event.detail.value;
                                    this.setState({ address });
                                })}
                            />
                        </View>
                        <View className='form-item grid-cont'>
                            <View className='label grid-item3'>
                                <Text className='no-required-icon' />
                                <Text className='label-text'>公司</Text>
                            </View>
                            <Input className='input grid-item8' size='large'
                                value={address.seller_company}
                                onInput={(event => {
                                    address.seller_company = event.detail.value;
                                    this.setState({ address });
                                })}
                            />
                        </View>
                        <View className='form-item grid-cont'>
                            <View className='label grid-item3'>
                                <Text className='no-required-icon' />
                                <Text className='label-text'>备注</Text>
                            </View>
                            <Input className='input grid-item21' size='large'
                                value={address.memo}
                                onInput={(event => {
                                    address.memo = event.detail.value;
                                    this.setState({ address });
                                })}
                            />
                        </View>
                        <View className='bottom-buttons'>
                            <View className='trade-btn-small-normal trade-btn-left'
                                onClick={this.onClose}
                            >取消</View>
                            <View className='trade-btn-small-primary' onClick={this.handleSaveOnClick}>确定</View>
                        </View>
                    </View>
                </View>
            </AtModal>
        );
    }
}

export default LogisticsAddressEditDialog;
