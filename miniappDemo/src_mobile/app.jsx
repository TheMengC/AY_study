import '@tarojs/async-await';
import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';
import { aiyongLogisticsCompaniesInit } from "tradePublic/taobaoLogisticsCompaniesGet";
import { marketingReduxInit } from "mapp_common/marketing/action";
import { settingManagerInit } from "mapp_common/utils/settings";
import Index from './reducers';
import configStore from './store';
import './app.scss';
import './assets/fonts/iconfont.css';
import { logisticsAddressAreaInit } from "mapp_common/utils/selectRegion";
import { initUserInfoFromCache, userInfoInit } from "mapp_common/utils/userInfo";
import { LogisticsWebSql } from "tradePublic/logisticsInfo";
import { getEntry, getEntryArgs, setEntry, setEntryArgs } from "mapp_common/utils/entry";
import { Logger } from "mapp_common/utils/logger";
import { storage } from "mapp_common/utils/storage";
import { qnapi } from "mapp_common/utils/qnapi";
import qnRouter from "tradePublic/qnRouter";
import { api } from "mapp_common/utils/api";
import { navigateTo, showConfirmModal, versionCompare } from "mapp_common/utils";
import { tradeBeacon } from "mapp_common/utils/beacon";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
// import { changeTab } from "./pages/tradeList/action";


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {

    //  cloud = cloud
    store = store;
    config = {
        pages: [
            'pages/tradeIndex/index',
            'pages/tradeList/index',
            'pages/my/index',
            'pages/customPrint/index',
            'pages/testQn/index', // 千牛能力测试
            'pages/intercept/index',
            // 'pages/rateManagement/index',
            'public/mapp_common/marketing/modalVIP/ModalVIPios',
            'pages/customPhrases/memoPhrase',
            'pages/customPhrases/memoPhraseEdit',
            'pages/customPhrases/ratePhrase',
            'pages/customPhrases/ratePhraseEdit',
            'pages/customPhrases/wwRushPayPhrase',
            'pages/customPhrases/wwRushPayPhraseEdit',
            'pages/customPhrases/checkAddressPhrase',
            'pages/logisticsSettings/logisticsAddress',
            'pages/logisticsSettings/logisticsAddressEdit',
            'pages/logisticsSettings/commonlyLogistics',
            'pages/orderDetectionSetting/index',
            'pages/autoRate/index',
            'pages/tradeRate/index',
            'pages/changeLogistics/index',
            'pages/batchTradeRate/index',
            'pages/tradeClose/index',
            'pages/changeReceiveAddress/index',
            'pages/batchRate/index',
            'pages/batchSendOrder/index',
            'pages/batchSendOrderToAction/index',
            'pages/changeRefundReason/index',
            'pages/developmentTools/index',
            // 'pages/checkAddress/index',
            // 'pages/intercept/index',
            // 'pages/logisticsManagement/index',
            // 'pages/wwRushPay/index',
            // 'pages/smsInform/index',
            // 'pages/smsCare/index',
            'pages/sendOrder/index',
            'pages/checkRate/index',
            'pages/rateManagement/index',
            'pages/tradePrint/index',
            'pages/pick/index',
            'pages/changeMemo/index',
            'pages/tradeSearch/index',
            'pages/autoRate/blackListManagement',
            'pages/autoRate/ratePhrases',
            'pages/autoRate/ratePhraseEdit',
            'pages/autoRate/rateRecord',
            'pages/rateManagement/ratePage',
            'pages/changeSku/index',
            'pages/intercept/interceptBlackList',
            'pages/intercept/interceptWhiteList',
            'pages/intercept/interceptBabyList',
            'pages/intercept/interceptBabySellList',
            'pages/intercept/interceptRecord',
            'pages/rateManagement/omitRate',
            'pages/rateManagement/improveShopLevel',
            'pages/intercept/interceptReceiverList',
            'pages/intercept/interceptRegionList',
            'pages/intercept/index',
            'pages/rateManagement/index',
            'pages/tradeDetail/index',
            'pages/outLink/index',
            'public/mapp_common/newUserVillage/newUserPage/index',
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: '爱用交易',
            navigationBarTextStyle: '#000000',
        },
        "tabBar": {
            // "custom": true,
            "textColor": "#ADADAD",
            "selectedColor": "#F37845",
            "backgroundColor": "#ffffff",
            // "borderStyle": '#000',
            "items": [
                {
                    "pagePath": "pages/tradeIndex/index",
                    "name": "首页",
                    "icon": "assets/imgs/menuicon/home_uncheck.png",
                    "activeIcon": "assets/imgs/menuicon/home_check.png",
                },
                {
                    "pagePath": "pages/tradeList/index",
                    "name": "订单列表",
                    "icon": "assets/imgs/menuicon/trade_uncheck.png",
                    "activeIcon": "assets/imgs/menuicon/trade_check.png",
                }, {
                    "pagePath": "pages/my/index",
                    "name": "我的",
                    "icon": "assets/imgs/menuicon/my_uncheck.png",
                    "activeIcon": "assets/imgs/menuicon/my_check.png",
                },
            ],
        },
    };
    platform = 'mb'
    Settings = settingManagerInit();
    debugger={
        storage:storage,
        qnapi:qnapi,
        qnRouter:qnRouter,
        api:api,
    }
    componentWillMount () {

        const { query } = this.$router.params;
        /* 交易的列表tab状态
         * 1. 待付款 WAIT_BUYER_PAY
         * 2. 待发货 WAIT_SELLER_SEND_GOODS
         * 3. 待评价 WAIT_BUYER_APPRAISE
        */
        Logger.warn('params:', query);

        if (query && query.event) {
            if (query.event.indexOf('tradeDetail') > -1) {
                setEntry('detail');
                setEntryArgs({ tid: query.tid });

            } else if (query.event == 'refundDetail') {
                setEntry('refundDetail');
                setEntryArgs({ refundId: query.refundId });

            } else if (query.event.indexOf('tradeList') > -1) {
                setEntry('list');
                let status = query.tradeStatus;
                /* 交易的列表tab状态
                 * 1. 待付款 WAIT_BUYER_PAY
                 * 2. 待发货 WAIT_SELLER_SEND_GOODS
                 * 3. 待评价 WAIT_BUYER_APPRAISE,这个要转一下
                 */
                if (status === 'WAIT_BUYER_APPRAISE') {
                    status = 'NEED_RATE';
                }
                store.dispatch({
                    type: "TRADE_LIST_CHANGE_ALL",
                    data: { currentTabKey: status },
                });
                Taro.switchTab({ url: '/pages/tradeList/index' });
            }
        }
        if (getEntry() == 'detail' || getEntry() == 'refundDetail') {

            let params = getEntryArgs();
            navigateTo({
                url: `/pages/tradeDetail/index`,
                params,
                redirect:true,
            });

        }
        if(getEntry() == 'index') {
            // 首页流量
            tradeBeacon({ func: 'traffic' });
        }

        initUserInfoFromCache();


    }

    componentDidMount () {
        this.systemInfo = getSystemInfo();
        let version = this.systemInfo.version;
        if (this.systemInfo.platform == 'Android' && versionCompare(version, '7.9.2') == -1) {
            showConfirmModal({
                title:'温馨提示',
                content: '由于您的千牛不是最新版本，使用爱用交易过程中可能会出现地址异常，请更新千牛后再使用。更新步骤：千牛首页——我的——了解千牛——检查更新，即可更新最新版。',
                showCancel: false,
                onConfirm:() => {
                    my.qn.returnData();
                },
            });
            return;
        }

        userInfoInit();
        aiyongLogisticsCompaniesInit();
        marketingReduxInit();
        logisticsAddressAreaInit();
        LogisticsWebSql.init();
        my.setNavigationBar({ title:`爱用交易` });
    }

    componentDidShow () {
    }

    componentDidHide () {}

    componentDidCatchError (error) {
        Logger.error('页面错误', error);
    }

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render () {
        return (
            <Provider store={store}>
                <Index />
            </Provider>
        );
    }
}

Taro.render(<App />, document.getElementById('app'));
