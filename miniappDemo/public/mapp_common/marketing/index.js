import Taro, { Component } from '@tarojs/taro';
import ModalAD from "./modalAD";
import BannerAD from "./bannerAD";
import { AD_STATE, MARKETING_TYPE, navigatorConst } from "tradePublic/marketing/constants";
import { ENV } from "@/constants/env";
import { getSystemInfo } from "../utils/systemInfo";
import AfterActionAD from "./afterActionAD";
import { triggerAdInfoByPid } from "mapp_common/marketing/action";
import { isEmpty, isPC } from "mapp_common/utils";
import RenewBox from "mapp_common/marketing/renewBox";
import MidCoupon from "mapp_common/marketing/midCoupon";
import { connect } from '@tarojs/redux';
import Notice from "mapp_common/marketing/notice";
import { getRealPid } from "mapp_common/marketing/utils/biz";
import PayResult from "mapp_common/marketing/payResult";
import ModalVIP from "mapp_common/marketing/modalVIP";
import * as marketingPublic from "tradePublic/marketing/navigator";
import { getKeyName } from "tradePublic/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import ModalADpc from "mapp_common/marketing/modalAD/ModalADpc";
import BannerADpc from "mapp_common/marketing/bannerAD/bannerADpc";
import AfterActionADpc from "mapp_common/marketing/afterActionAD/afterActionPC";
import RenewBoxPC from "mapp_common/marketing/renewBox/renewBoxPC";
import MidCouponPC from "mapp_common/marketing/midCoupon/midCouponPC";
import NoticePC from "mapp_common/marketing/notice/noticePC";
import ModalVIPpc from "mapp_common/marketing/modalVIP/ModalVIPpc";
import PayResultPC from "mapp_common/marketing/payResult/payResultPC";
import MidCard from "mapp_common/marketing/midCard";


@connect((store) => {
    return store.marketingAdInfoReducer;
})

class Marketing extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showAD: false,
            currentPid: undefined,  // 因为部分运营类的组件可能出现「同一页面切换pid广告」的情况（如事后续费），所以pid需要可控
        };

        this.from = this.props.from;
        this.app = ENV.app;
        this.platform = getSystemInfo().platform;
        this.vipFlag = getUserInfo().vipFlag;
    }

    componentWillMount = () => {
        const { type } = this.props;
        switch (type) {
            case MARKETING_TYPE.modal:
            case MARKETING_TYPE.midModal:
            case MARKETING_TYPE.midCoupon:
            case MARKETING_TYPE.notice:
            case MARKETING_TYPE.banner:
            case MARKETING_TYPE.midCard: {
                this.navigatorCommonRule();
                break;
            }
            case MARKETING_TYPE.afterAction: {
                this.navigatorAfterAction();
                break;
            }
            case MARKETING_TYPE.commonModal : {
                this.navigatorCommonModal();
                break;
            }
        }
    }

    componentWillReceiveProps = (props) => {
        const { type } = props;
        if (type === MARKETING_TYPE.modalVip) {
            this.navigatorModalVip(props);
        } else if (type === MARKETING_TYPE.afterAction) {
            this.showAfterAction(props);
        }
    };

    /*
     * @Description 克制一下渲染~
     */
    shouldComponentUpdate = (newProps, newState) => {
        if (this.state.showAD === false && newState.showAD === false && newState.showPayResult === false) {
            // 如果压根就没有渲染出来，就别凑热闹啦
            return false;
        } else if (isEmpty(newState.currentPid)) {
            if (isEmpty(this.state.currentPid)) {
                // 如果新的旧的pid都没有，那就不渲染了
                return false;
            }
        } else if (this.props.type !== MARKETING_TYPE.modalVip) {
            // 对于非modalvip的情况，只要没动我，我就不更改
            const { currentPid: oldPid } = this.state;
            const { currentPid: newPid } = newState;
            const { [getKeyName(oldPid)]: oldAd } = this.props;
            const { [getKeyName(newPid)]: newAd } = newProps;
            if (oldAd == newAd) {
                // 如果俺的redux并没有变，那就别更新啦
                return false;
            }
        }
    };

    /*
     * @Description 统一的marketing的willmount逻辑
     */
    navigatorCommonRule = () => {
        const adRenderRule = navigatorConst[this.props.type];
        if (isEmpty(adRenderRule)) {
            return;
        }
        const pid = marketingPublic[adRenderRule.pidFunc](this.from);
        if (!isEmpty(pid)) {
            // 如果有pid的话，冲冲冲
            this.openAd({
                pid,
                state: adRenderRule.state,
                type: adRenderRule.type,
            });
        }
    };

    /*
     * @Description 判断事后续费的逻辑
     */
    navigatorAfterAction = () => {
        const pid = marketingPublic.shouldAfterAction(this.props);
        if (!isEmpty(pid)) {
            this.openAd({
                pid,
                state: AD_STATE.AFTER_ACTION_BALL,
                type: MARKETING_TYPE.afterAction,
            });
        }
    };

    /*
     * @Description 常规广告渲染
     */
    navigatorCommonModal = () => {
        const { pid } = this.props;
        this.openAd({
            pid,
            state: AD_STATE.SHOULD_SHOW,
            type: MARKETING_TYPE.modal,
        });
    };

    /*
     * @Description 展现事后续费弹窗
     */
    showAfterAction = (props) => {
        const adReturn = marketingPublic.triggerShowAfterAction(props, this.state);
        if (!isEmpty(adReturn)) {
            const pid = getRealPid(adReturn.pid);
            this.openAd({
                pid,
                state: adReturn.state,
                type: MARKETING_TYPE.afterAction,
            });
        }
    };

    /*
     * @Description 渲染modalVIP逻辑
     */
    navigatorModalVip = (props) => {
        const { [MARKETING_TYPE.modalVip]: ad } = props;
        const { showAD, currentPid } = this.state;
        if (!isEmpty(ad) && !isEmpty(ad.adInfo) && !showAD && isEmpty(currentPid)) {
            this.setState({
                showAD: true,
                currentPid: MARKETING_TYPE.modalVip,
            });
        }
    };

    /*
     * @Description 打开相应广告
     */
    openAd = ({ pid, state, type }) => {
        triggerAdInfoByPid({
            pid,
            state,
            type,
            callback: (show) => {
                if (show) {
                    this.setState({
                        showAD: true,
                        currentPid: pid,
                    });
                }
            },
        });
    };

    /*
     * @Description 广告的关闭事件
     */
    close = () => {
        this.setState({ showAD: false });
    };

    /*
     * @Description 广告的外部展现事件
     */
    show = () => {
        this.setState({ showAD: true });
    };

    getProps = (ad) => {
        const { width, height, from } = this.props;
        const { close } = this;
        const { currentPid } = this.state;
        return {
            pid: currentPid,
            width,
            height,
            close,
            ad,
            from,
        };
    };

    /*
     * @Description 把广告展现出来~
     */
    renderMarktingModal = (ad) => {
        const { type } = this.props;
        let jsx = null;
        const flag = isPC();
        if (type === MARKETING_TYPE.modal || type === MARKETING_TYPE.commonModal) {
            if (flag) {
                jsx = <ModalADpc type={type} {...this.getProps(ad)} />;
            } else {
                jsx = <ModalAD type={type} {...this.getProps(ad)} />;
            }
        } else if (type === MARKETING_TYPE.banner) {
            if (flag) {
                jsx = <BannerADpc {...this.getProps(ad)} />;
            } else {
                jsx = <BannerAD {...this.getProps(ad)} />;
            }
        } else if (type === MARKETING_TYPE.afterAction) {
            if (flag) {
                jsx = <AfterActionADpc {...this.getProps(ad)} />;
            } else {
                jsx = <AfterActionAD {...this.getProps(ad)} />;
            }
        } else if (type === MARKETING_TYPE.midModal) {
            if (flag) {
                jsx = <RenewBoxPC {...this.getProps(ad)} />;
            } else {
                jsx = <RenewBox {...this.getProps(ad)} />;
            }
        } else if (type === MARKETING_TYPE.midCoupon) {
            if (flag) {
                jsx = <MidCouponPC {...this.getProps(ad)} />;
            } else {
                jsx = <MidCoupon {...this.getProps(ad)} />;
            }
        } else if (type === MARKETING_TYPE.notice) {
            if (flag) {
                jsx = <NoticePC {...this.getProps(ad)} />;
            } else {
                jsx = <Notice {...this.getProps(ad)} />;
            }
        } else if (type === MARKETING_TYPE.modalVip) {
            if (flag) {
                jsx = <ModalVIPpc {...this.getProps(ad)} />;
            } else {
                jsx = <ModalVIP {...this.getProps(ad)} />;
            }
        } else if (type === MARKETING_TYPE.midCard) {
            // 仅PC有
            if (flag) {
                jsx = <MidCard {...this.getProps(ad)} />;
            }
        }
        return jsx;
    };

    /*
     * @Description 渲染付款后二次确认提示窗
     */
    renderPayResult = (payResultInfo) => {
        const { currentPid } = this.state;
        let jsx = null;
        if (isPC()) {
            jsx = <PayResultPC payResultInfo={payResultInfo} pid={currentPid} />;
        } else {
            jsx = <PayResult payResultInfo={payResultInfo} pid={currentPid} />;
        }
        return jsx;
    };

    render = () => {

        const { showAD, currentPid } = this.state;
        const { type } = this.props;
        const hasPid = !isEmpty(currentPid);
        let jsx = null;
        if (!hasPid) {
            return null;
        }
        // 获取当前marketing中间件所在page
        const location = this.$scope.$page.$component.$router.path.match((/\/(\S*)\/(\S*)\//))[2];
        const key = type === MARKETING_TYPE.modalVip ? MARKETING_TYPE.modalVip : `${location}_${currentPid}`;
        let { [key]: ad } = this.props;
        if (isEmpty(ad) || isEmpty(ad.adInfo)) {
            return null;
        }
        const showPayResult = !!(ad.showPayResult && ad.showPayResult.state !== AD_STATE.NOT_SHOW);
        if (!showPayResult && ad.state === AD_STATE.NOT_SHOW) {
            // 如果没有付款确认弹窗，并且广告状态是关闭的，那就不渲染啦
            jsx = null;
        }
        if (showAD) {
            jsx = (
                <View>
                    {this.renderMarktingModal(ad)}
                    {
                        showPayResult ? this.renderPayResult(ad.showPayResult) : null
                    }
                </View>
            );
        } else if (showPayResult) {
            jsx = this.renderPayResult(ad.showPayResult);
        }
        return jsx;
    };
}

export default Marketing;
