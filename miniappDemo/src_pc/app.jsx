import '@tarojs/async-await';
import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';
import { settingManagerInit } from "mapp_common/utils/settings";
import Index from './reducers';
import configStore from "./store";
import { setEntry } from "mapp_common/utils/entry";
import { logisticsAddressAreaInit } from "mapp_common/utils/selectRegion";
import './app.scss';
import 'pcAssets/fonts/iconfont.css';
import { authorize, userInfoInit } from "mapp_common/utils/userInfo";
import { initElecfaceTemplateInfo } from "tradePublic/print/elecface/elecfaceData";
import { marketingReduxInit } from "mapp_common/marketing/action";
import EinvoiceWebSql from "tradePublic/einvoiceWebSql";
import { aiyongLogisticsCompaniesInit } from "tradePublic/taobaoLogisticsCompaniesGet";
import { storage } from "mapp_common/utils/storage";
import { qnapi } from "mapp_common/utils/qnapi";
import qnRouter from "tradePublic/qnRouter";
import { api } from "mapp_common/utils/api";
import { cainiaoCloudprintMystdtemplatesGet } from 'tradePublic/cainiaoCloudprintMystdtemplatesGet';
import { LogisticsWebSql } from "tradePublic/logisticsInfo";
import { Logger } from "mapp_common/utils/logger";
import { getCloud } from "mapp_common/utils/cloud";
import { initAddressWarningInfo } from "tradePublic/orderDetectionSetting";
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
            'pages/index/index',
            // 'pages/testQn/index',

        ],
        window: {
            backgroundTextStyle: 'light',
            backgroundColor: '#F2F2F2',
            // navigationBarBackgroundColor: '#f57745',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black',
        },

    };
    platform = 'pc';
    Settings = settingManagerInit();
    debugger={
        storage:storage,
        qnapi:qnapi,
        qnRouter:qnRouter,
        api:api,
        authorize:authorize,
    }
    cloud = getCloud();
    componentWillMount () {
        const { query } = this.$router.params;
        if (query && query.event) {
            if (query.event == 'tradeDetail' || query.event == 'refundDetail') {
                setEntry('detail');
            } else if (query.event == 'tradeList') {
                setEntry('list');
            }
        }
        userInfoInit();

    }

    componentDidMount () {
        marketingReduxInit();
        initElecfaceTemplateInfo();
        EinvoiceWebSql.init();
        logisticsAddressAreaInit();
        aiyongLogisticsCompaniesInit();
        cainiaoCloudprintMystdtemplatesGet();
        LogisticsWebSql.init();
        initAddressWarningInfo({ refresh: true });
        storage.removeItem('taobao.logistics.address.search');
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
