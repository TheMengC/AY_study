import Taro, { Component } from '@tarojs/taro';
import { ScrollView, View } from '@tarojs/components';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.scss';


const ENV = Taro.getEnv();
const MIN_DISTANCE = 100;
const MAX_INTERVAL = 10;
const objectToString = style => {
    if (style && typeof style === 'object') {
        let styleStr = '';
        Object.keys(style).forEach(key => {
            const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            styleStr += `${lowerCaseKey}:${style[key]};`;
        });
        return styleStr;
    } else if (style && typeof style === 'string') {
        return style;
    }
    return '';
};

function mergeStyle (style1, style2) {
    if ((style1 && typeof style1 === 'object')
        && (style2 && typeof style2 === 'object')
    ) {
        return Object.assign({}, style1, style2);
    }
    return objectToString(style1) + objectToString(style2);
}

export default class MyTabs extends Component {
    constructor () {
        super(...arguments);
        this.state = {
            //       _scrollLeft: '',
            _scrollTop: '',
            _scrollIntoView: '',
        };
        this._tabId = (Math.random()*100000).toFixed(0);
        // 触摸时的原点
        this._touchDot = 0;
        // 定时器
        this._timer = null;
        // 滑动时间间隔
        this._interval = 0;
        // 是否已经在滑动
        this._isMoving = false;
    }


    updateState = key => {
        if (this.props.scrollFollow) {
            this.setState({ _scrollIntoView: `tab${key}` });
        }
    }

    handleClick () {
        this.props.onClick(...arguments);
    }

    handleTouchStart (e) {
        const { swipeable, tabDirection } = this.props;
        if (!swipeable || tabDirection === 'vertical') return;
        // 获取触摸时的原点
        this._touchDot = e.touches[0].pageX;
        // 使用js计时器记录时间
        this._timer = setInterval(() => {
            this._interval++;
        }, 100);
    }

    handleTouchMove (e) {
        const {
            swipeable,
            tabDirection,
            current,
            tabList,
        } = this.props;
        if (!swipeable || tabDirection === 'vertical') return;

        const touchMove = e.touches[0].pageX;
        const moveDistance = touchMove - this._touchDot;
        const maxIndex = tabList.length;

        if (!this._isMoving && this._interval < MAX_INTERVAL && this._touchDot > 20) {
            // 向左滑动
            if (current + 1 < maxIndex && moveDistance <= -MIN_DISTANCE) {
                this._isMoving = true;
                this.handleClick(current + 1);

                // 向右滑动
            } else if (current - 1 >= 0 && moveDistance >= MIN_DISTANCE) {
                this._isMoving = true;
                this.handleClick(current - 1);
            }
        }
    }

    handleTouchEnd () {
        const { swipeable, tabDirection } = this.props;
        if (!swipeable || tabDirection === 'vertical') return;

        clearInterval(this._timer);
        this._interval = 0;
        this._isMoving = false;
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.scroll !== this.props.scroll) {
            //  this.getTabHeaderRef();
        }
        if (nextProps.current !== this.props.current) {
            this.updateState(nextProps.current);
        }
    }

    componentDidMount () {
    //    this.getTabHeaderRef();
        this.updateState(this.props.current);
    }

    componentWillUnmount () {
        this.tabHeaderRef = null;
    }

    render () {
        const {
            customStyle,
            className,
            height,
            tabDirection,
            animated,
            tabList,
            scroll,
            current,
            dotNum,
        } = this.props;
        const {
            _scrollTop,
            _scrollIntoView,
        } = this.state;

        const heightStyle = { height };
        const underlineStyle = {
            height: tabDirection === 'vertical' ? `${tabList.length * 100}%` : '1PX',
            width: tabDirection === 'horizontal' ? `${tabList.length * 100}%` : '1PX',
        };
        const bodyStyle = { };
        let transformStyle = `translate3d(0px, -${current * 100}%, 0px)`;
        if (tabDirection === 'horizontal') {
            transformStyle = `translate3d(-${current * 100}%, 0px, 0px)`;
        }
        Object.assign(bodyStyle, {
            'transform': transformStyle,
            '-webkit-transform': transformStyle,
        });
        if (!animated) {
            bodyStyle.transition = 'unset';
        }

        const tabItems = tabList.map((item) => {
            const itemCls = classNames({
                'at-tabs__item': true,
                'at-tabs__item--active': current === item.key,
            });

            return <View
                className={itemCls}
                id={`tab${item.key}`}
                key={item.title}
                onClick={this.handleClick.bind(this, item.key)}
            >
                <View className='at-tabs__title' >
                    {
                        dotNum[item.key] > 0 &&
                        <View className='at-tabs__dot'>{ dotNum[item.key] }</View>
                    }
                    {item.title}
                </View>
                <View className='at-tabs__item-underline'></View>
            </View> ;
        });
        const rootCls = classNames({
            'at-tabs': true,
            'at-tabs--scroll': scroll,
            [`at-tabs--${tabDirection}`]: true,
            [`at-tabs--${ENV}`]: true,
            'my-tabs':true,
        }, className);
        const scrollX = tabDirection === 'horizontal';
        const scrollY = tabDirection === 'vertical';

        return (
            <View
                className={rootCls}
                style={mergeStyle(heightStyle, customStyle)}
            >
                {
                    scroll
                        ? <ScrollView
                            id={this._tabId}
                            className='at-tabs__header'
                            style={heightStyle}
                            scrollX={scrollX}
                            scrollY={scrollY}
                            scrollTop={_scrollTop}
                            scrollIntoView={_scrollIntoView}

                        >
                            {tabItems}
                        </ScrollView>
                        : <View
                            id={this._tabId}
                            className='at-tabs__header'
                        >
                            {tabItems}
                        </View>
                }
                <View
                    className='at-tabs__body'
                    onTouchStart={this.handleTouchStart.bind(this)}
                    onTouchEnd={this.handleTouchEnd.bind(this)}
                    onTouchMove={this.handleTouchMove.bind(this)}
                    style={mergeStyle(bodyStyle, heightStyle)}
                >
                    <View className='at-tabs__underline'  style={underlineStyle}></View>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

MyTabs.defaultProps = {
    isTest: false,
    customStyle: '',
    className: '',
    tabDirection: 'horizontal',
    height: '',
    current: 0,
    swipeable: true,
    scroll: false,
    animated: true,
    tabList: [],
    onClick: () => {},
};

MyTabs.propTypes = {
    customStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    className: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]),
    isTest: PropTypes.bool,
    height: PropTypes.string,
    tabDirection: PropTypes.oneOf(['horizontal', 'vertical']),
    current: PropTypes.string,
    swipeable: PropTypes.bool,
    scroll: PropTypes.bool,
    animated: PropTypes.bool,
    tabList: PropTypes.array,
    onClick: PropTypes.func,
};
