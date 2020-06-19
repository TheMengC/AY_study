import Taro, { Component } from '@tarojs/taro';
import { Button, Text, View } from '@tarojs/components';
import DialogManager from "pcComponents/dialogManager";
import { events } from "mapp_common/utils/eventManager";
import RefundManagement from "../refundManagement";
import OrderManagement from "../orderManagement";
import Marketing from "mapp_common/marketing";
import { MARKETING_TYPE, PC_COMMON_MARKETING_MASK } from "tradePublic/marketing/constants";
import { showModalVIP } from "mapp_common/marketing/utils/biz";
import { changeRoute, getCurrentPath, initRouter } from "pcComponents/router";
import { routes } from "pcComponents/router/routes";
import NoticeBallon from "mapp_common/marketing/notice/pcNoticeBallon";
import { isEmpty } from "mapp_common/utils";
import showDialog from "pcComponents/dialogManager/api";
import { contactCustomerService } from "mapp_common/utils/openChat";
import { Logger } from "mapp_common/utils/logger";
import './index.scss';
import Test from "pcPages/test";

class Index extends Component {

    constructor (props) {
        super(props);
        this.state = {
            showAD: false,
            sidebarMini: false,
            haveNotice: false,
            showNotice: false,
            hadShownNotice: false,
        };

    }

    config = {
        navigationBarTitleText: '首页',
        usingComponents: { 'router-view': '../../components/miniapp-router/router-view/router-view', // 书写第三方组件的相对路径
        },
    };
    onLoad = () => {
    };

    // componentWillReceiveProps (nextProps) {
    // }

    componentWillMount () {
        initRouter(this.$scope);
        // this.$scope.$router.push('/tradeManagement');
        console.log('999999999999999999');
        events.userInfoCallback.subscribe((userInfo) => {
            let state = { showAD: true };
            if (!isEmpty(userInfo.notice)) {
                state.haveNotice = true;
                state.showNotice = true;
                this.notice = userInfo.notice;
            }
            this.setState(state);
        });
        events.routerChanged.subscribeOnce(() => {
            this.forceUpdate();
        });
    }

    componentDidMount () {
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    showDialog = () => {
        showDialog({
            name: 'testDialog',
            props: { text: '快看啊 有勾吧有勾吧有勾吧有勾吧' },
            isShow: true,
        });

    };
    changeRoute = (route, parent) => {

        if (route.redirect) {
            changeRoute({ path: route.redirect });
            return;
        }
        if (route.abstract) {
            if (!Array.isArray(route.children) || route.children.length == 0) {
                Logger.error("route不合法,虚拟路由必须有子路由", route);
                return;
            }
            let child = route.children.find(item => item.default);
            if (!child) {
                child = route.children[0];
            }
            this.changeRoute(child, route);
            return;
        }
        let path = route.path;
        if (parent) {
            path = parent.path + path;
        }
        path = path.replace(/\/\:.+$/, '');
        changeRoute({ path });

    };

    /*
     * @Description 渲染运营相关组件
     */
    renderMarketing = (type) => {
        const { showAD } = this.state;
        if (!showAD) {
            return null;
        }
        const from = 'index';
        let jsx = null;
        if (type === 'notice') {
            jsx = (
                <Marketing type={MARKETING_TYPE.notice} from={from} />
            );
        } else if (type === 'banner') {
            jsx = (
                <Marketing type={MARKETING_TYPE.banner} from={from} />
            );
        } else {
            jsx = [...PC_COMMON_MARKETING_MASK, MARKETING_TYPE.midCard].map(item => {
                return (
                    <Marketing type={item} from={from} />
                );
            });
        }
        return jsx;
    };

    toggleSideBarMini = () => {
        this.setState({ sidebarMini: !this.state.sidebarMini });
    };

    toggleNoticeBallon = () => {
        const { showNotice } = this.state;
        this.setState({ showNotice: !showNotice });
    };

    render () {
        let currentPath = getCurrentPath();
        let paths = currentPath.split('/').filter(Boolean);
        let currentMain = '/' + paths[0];
        let currentSub = '';
        if (paths[1]) {
            currentSub = '/' + paths[1];
        }
        let currentRoute = routes.find(item => item.path == currentMain);
        let currentChildren = [];
        if (currentRoute && currentRoute.children) {
            currentChildren = currentRoute.children.filter(item => !(item.hide == true));
            currentChildren.map(item => item.path = item.path.replace(/\/\:.+$/, ''));
        }
        let { haveNotice, showNotice, hadShownNotice, sidebarMini } = this.state;


        return (
            <View className='index'>
                <View className='nav'>
                    <View className='navbar'>
                        <View className='logo'>
                            <Text className='text'>
                                爱用交易
                            </Text>
                        </View>
                        {routes.map(main => {
                            return <View className={'item ' + (currentMain == main.path ? 'active' : '')}
                                onClick={this.changeRoute.bind(this, main)}
                            >
                                <Text className='text'>{main.name}</Text>
                            </View>;
                        })}
                        <View className='flex-placeholder' />

                        <View className='nav-right'>
                            {
                                haveNotice ?
                                    <NoticeBallon showNotice={showNotice} notice={this.notice}
                                        close={this.toggleNoticeBallon} hadShownNotice={hadShownNotice}
                                    /> :
                                    null
                            }
                            <View className='vip-flag' onClick={() => {showModalVIP(783);}}>
                                <Text className='vio-role'>高级版</Text>
                                <View className='vip-time-wrapper'>
                                    剩余
                                    <View className='vip-time'>
                                        1234天
                                    </View>
                                </View>
                                <Button className='buy-button'>
                                    立即购买
                                </Button>
                            </View>
                            <View className='contact-staff' onClick={() => contactCustomerService('联系客服')}>
                                <Text className='iconfont iconfont-wangwang' />

                                <Text className='text'>联系客服</Text>
                            </View>
                        </View>

                    </View>
                    {/* {this.renderMarketing('notice')} */}
                    <View className='container'>
                        <View className={`sidebar ${sidebarMini ? "mini" : ""}`}>
                            <View className='item' onClick={this.toggleSideBarMini}>
                                <Text className={'iconfont ' + (sidebarMini ? "iconfont-shouqicebianlan" : "iconfont-zhankaicebianlan")} />
                            </View>
                            {currentChildren.map(item => {
                                return <View className={'item ' + (item.path === currentSub ? 'active' : '')}
                                    onClick={this.changeRoute.bind(this, item, currentRoute)}
                                >
                                    <Text className={"icon iconfont " + item.icon} />
                                    <Text className='text'>
                                        {item.name}
                                    </Text>
                                </View>;
                            })}
                        </View>
                        <View className='content'>
                            <router-view>
                                <View slot='tradeList'>紧张施工中...</View>
                                <View slot='refundManagement'><RefundManagement /></View>
                                <View slot='orderManagement'><OrderManagement /></View>
                                <View slot='test'><Test /></View>
                            </router-view>

                        </View>
                    </View>
                    {this.renderMarketing('banner')}
                </View>
                <DialogManager></DialogManager>
                {this.renderMarketing()}
            </View>
        );
    }

}


export default Index;
