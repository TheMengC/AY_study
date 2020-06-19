import Taro,{ Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {isEmpty} from 'tradePolyfills';
import './index.scss';

const ENV = Taro.getEnv()

/**
 * 该组件与官方的差异:
 *  处理了一下在 taro-tab 使用的情况，使layout可以在当前tabitem下弹出
 */
export default class AtFloatLayout extends Component {
    constructor (props) {
        super(...arguments)
        const { isOpened } = props
        this.state = {
            _isOpened: isOpened
        }
    }

    componentWillReceiveProps (nextProps) {
        const { isOpened } = nextProps
        // if (this.props.isOpened !== isOpened) {
        //     this.handleTouchScroll(isOpened)
        // }
        if (isOpened !== this.state._isOpened) {
            this.setState({
                _isOpened: isOpened
            })
        }
    }

    handleClose = () => {
        if (this.props.onClose) {
            this.props.onClose()
        }
    }

    close = () => {
        this.setState({
            _isOpened: false
        },this.handleClose)
    }

    handleTouchMove = e => {
        e.stopPropagation()
    }

    // handleTouchScroll (flag) {
    //     if (ENV !== Taro.ENV_TYPE.WEB) {
    //         return
    //     }
    //     if (flag) {
    //         scrollTop = document.documentElement.scrollTop

    //         // 使body脱离文档流
    //         document.body.classList.add('at-frozen')

    //         // 把脱离文档流的body拉上去！否则页面会回到顶部！
    //         document.body.style.top = `${-scrollTop}px`
    //     } else {
    //         document.body.style.top = null
    //         document.body.classList.remove('at-frozen')

    //         document.documentElement.scrollTop = scrollTop
    //     }
    // }

    render () {
        
        const { _isOpened } = this.state
        const {
            hasTitle,
            hasButton,
            tabCurrent,
            scrollY,
            scrollX,
            scrollTop,
            scrollLeft,
            upperThreshold,
            lowerThreshold,
            scrollWithAnimation,
        } = this.props
        console.log('AtFloatLayout-render-this.state',this.state);
        console.log('AtFloatLayout-render-this.props',this.props);

        let bodyStyle = Object.assign({},{
            left:(750*tabCurrent)+'rpx'
        });

        const rootClass = classNames(
            'at-float-layout',
            {
            'at-float-layout--active': _isOpened
            },
            this.props.className
        )
        
        return (
            <View className={rootClass} style={bodyStyle} onTouchMove={this.handleTouchMove}>
                <View onClick={this.close} className='at-float-layout__overlay' />
                <View className='at-float-layout__container layout' >
                    {
                        hasTitle && (
                            <View className='ay-float-layout-title-body'>
                                {this.props.renderTitle}
                            </View>
                        )
                    }
                    <View className='ay-float-layout-content-body layout-body'>
                        <ScrollView
                        scrollY={scrollY}
                        scrollX={scrollX}
                        scrollTop={scrollTop}
                        scrollLeft={scrollLeft}
                        upperThreshold={upperThreshold}
                        lowerThreshold={lowerThreshold}
                        scrollWithAnimation={scrollWithAnimation}
                        onScroll={this.props.onScroll}
                        onScrollToLower={this.props.onScrollToLower}
                        onScrollToUpper={this.props.onScrollToUpper}
                        className='layout-body__content'
                        >
                            {this.props.children}
                        </ScrollView>
                    </View>
                    {
                        hasButton && (
                            <View className='ay-float-layout-bottom-body'>
                                {this.props.renderBottom}
                            </View>
                        )
                    }
                </View>
            </View>
        )
    }
}

AtFloatLayout.defaultProps = {
    hasTitle:false,
    hasButton:false,
    tabCurrent:0,
    isOpened: false,
    scrollY: true,
    scrollX: false,
    scrollWithAnimation: false,
    onClose: () => {},
    onScroll: () => {},
    onScrollToLower: () => {},
    onScrollToUpper: () => {}
}

AtFloatLayout.propType = {
    hasTitle: PropTypes.bool,
    hasButton: PropTypes.bool,
    isOpened: PropTypes.bool,
    scrollY: PropTypes.bool,
    scrollX: PropTypes.bool,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    upperThreshold: PropTypes.number,
    lowerThreshold: PropTypes.number,
    scrollWithAnimation: PropTypes.bool,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollToLower: PropTypes.func,
    onScrollToUpper: PropTypes.func
}