import Taro, { Component } from '@tarojs/taro';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss'

/**
 * 爱用遮罩层
 *      支持属性
 *          isOpened    控制蒙层的展现
 *          onClose     蒙层关闭时执行的回调
 *          className   蒙层容器的className
 *          style       蒙层容器的style
 * @class AyModal
 * @extends {Component}
 */
class AyModal extends Component {
    constructor(props) {
        super(...arguments);

        const { isOpened } = props;
        this.state = {
            _isOpened: isOpened
        };
    }

    componentWillReceiveProps(nextProps) {
        const { isOpened } = nextProps;
        if (isOpened !== this.state._isOpened) {
            this.setState({
                _isOpened: isOpened
            });
        }
    }

    /**
     * 点击到了蒙层，准备关闭
     * @memberof AyModal
     */
    handleClickOverlay = () => {
        this.setState({
            _isOpened: false
        }, this.handleClose);
    };

    /**
     * 执行 onClose 回调
     * @memberof AyModal
     */
    handleClose = () => {
        this.props.onClose();
    };

    render(){
        const { _isOpened } = this.state;
        const rootClass = classNames('at-modal', {
            'at-modal--active': _isOpened
        }, this.props.className);
        return (
            <View className={rootClass} style={this.props.style}>
                <View onClick={this.handleClickOverlay} className="at-modal__overlay" />
                <View className="ay-modal__container">
                    {this.props.children}
                </View>
            </View>
        )

    }
}

AyModal.defaultProps = {
    isOpened: false,
    style:"",
    className:"",
    onClose:()=>{}
}

AyModal.propTypes = {
    isOpened: PropTypes.bool,
    style:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    className:PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    onClose:PropTypes.func,
}


export default AyModal;
