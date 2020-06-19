/*
 * 设置-分享的电子面单
 */
import Taro, { Component } from '@tarojs/taro';
import { Button, Text, View } from '@tarojs/components';
import { api } from "mapp_common/utils/api";
import { isEmpty } from 'mapp_common/utils';
import { dealEWayBills } from 'tradePublic/eWayBills';
import './index.scss';
import { Object_values } from "tradePolyfills/index";

class SharedEWayBills extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: '',
            shareWangwangs: '',
            isLoading: true,
        }
    }

    componentWillMount() {
        api({
            apiName: 'aiyong.trade.order.print.elecface.shareaddresses.get',
            mode: 'json',
            callback: (resp) => {
                if (resp) {
                    let dataSource = dealEWayBills(resp.result, 'self');
                    this.setState({ dataSource: Object_values(dataSource), isLoading: false });
                } else {
                    Taro.showToast({ title: '未获取到用户的共享面单信息' });
                }
            },
            errCallback: (err) => {
                Taro.showToast({ title: JSON.stringify(err) });
            },
        });
    }

    componentDidMount() {
        api({
            apiName: 'aiyong.trade.order.print.elecface.shareto.get',
            mode: 'json',
            callback: (resp) => {
                if (resp) {
                    this.setState({ shareWangWangs: resp.result })
                }
            },
            errCallback: (err) => {
                Taro.showToast({ title: JSON.stringify(err) });
            },
        });
    }

    /* 立即申请面单服务 */
    applyForEInvoice = () => {
        this.props.applyEInvoices();
    }

    /* 取消分享 */
    cancelSharedInvoice(id, index, usernick, type) {
        const { shareWangWangs } = this.state;

        api({
            apiName: 'aiyong.trade.order.print.elecface.share.cancel',
            args: {
                Did: id,
                type: type
            },
            callback: (rsp) => {
                let shareWangWangsIndex = shareWangWangs[index];
                if (type == "delete") {
                    shareWangWangs[index].status = "0";
                    shareWangWangs.splice(index, 1);
                    shareWangWangs.push(shareWangWangsIndex);
                } else {
                    shareWangWangs[index].status = '2';
                    shareWangWangs.splice(index, 1);
                    shareWangWangs.unshift(shareWangWangsIndex);
                    Taro.showToast({ title: `分享成功, ${usernick} 铺可以使用您店铺的所有的电子面单` });
                }
                this.setState({ shareWangWangs });
            },
            errCallback: (error) => {
                Taro.showToast({ title: JSON.stringify(error) });
            }
        })
    }

    render() {
        const { dataSource, shareWangWangs, isLoading } = this.state;

        return (
            <View className='shared-invoice-page'>
                {
                    isEmpty(dataSource) && !isLoading ? (
                        <View className='no-shared-invoice'>
                            <Text>亲，您尚未开通电子面单服务，需要在卖家中心开通后在使用，</Text>
                            <Text className='no-shared-invoice-text' onClick={this.applyForEInvoice}>立即申请</Text>
                            <Text>。</Text>
                        </View>
                    ) : (
                            <View>
                                <View className='my-table grid-item24'>
                                    <View className='head grid-cont'>
                                        <View className='title grid-item4'>
                                            旺旺名称
                                    </View>
                                        <View className='title grid-item4'>
                                            快递公司
                                    </View>
                                        <View className='title grid-item8'>
                                            面单地址
                                    </View>
                                        <View className='title grid-item4'>
                                            已使用的面单数
                                    </View>
                                        <View className='title grid-item4 head-option'>
                                            操作
                                    </View>
                                    </View>
                                    <View className='body'>
                                        {
                                            shareWangWangs.map((item, index) =>
                                                <View className='row grid-cont'>
                                                    {/* 旺旺名称 */}
                                                    <View className='cell grid-item4'>{item.usernick}</View>
                                                    {/* 快递公司 */}
                                                    <View className='cell grid-item4'>
                                                        {
                                                            dataSource.map(eleitem => <View>{eleitem.cp_name}</View>)
                                                        }
                                                    </View>
                                                    {/* 面单地址 */}
                                                    <View className='cell grid-item8'>
                                                        {
                                                            dataSource.map(items =>
                                                                <View>
                                                                    {items.address_arr.map(eleitem => <View>{eleitem.addressStr}</View>)}
                                                                </View>
                                                            )
                                                        }
                                                    </View>
                                                    {/* 已使用的面单数 */}
                                                    <View className='cell grid-item4'>
                                                        {
                                                            dataSource.map(items =>
                                                                <View>
                                                                    {items.address_arr.map(eleitem => <View>{eleitem.quantity}</View>)}
                                                                </View>
                                                            )
                                                        }
                                                    </View>
                                                    {/* 操作 */}
                                                    <View className='cell grid-item4 shared-invoice-page-opt'>
                                                        {
                                                            item.status != 2 ?
                                                                (
                                                                    <Button onClick={this.cancelSharedInvoice.bind(this, item.id, index, item.usernick, 'share')}>重新分享</Button>
                                                                ) : (
                                                                    <Button onClick={this.cancelSharedInvoice.bind(this, item.id, index, item.usernick, 'delete')}>取消分享</Button>
                                                                )
                                                        }
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        )
                }
            </View>
        );
    }
}

export default SharedEWayBills;
