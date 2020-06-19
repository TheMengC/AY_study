import Taro, { Component } from '@tarojs/taro';
import { Button, Text, View } from '@tarojs/components';
import { classNames, isFunction, NOOP } from "mapp_common/utils";

import './index.scss';

class MyDialog extends Component {
    constructor (props) {
        super(props);
    }

    onCloseClick = () => {
        this.props.onClose();
    };
    onCancel = () => {
        isFunction(this.props.onCancel) && this.props.onCancel();
        if (this.props.onCancelClose) {
            this.onClose();
        }
    };
    onOk = () => {
        isFunction(this.props.onOk) && this.props.onOk();
        if (this.props.onOkClose) {
            this.onClose();
        }
    };

    onClose = () => {
        this.props.onClose();
    };
    handleClickOverlay = () => {
        if (this.props.closeOnClickOverlay) {
            this.onClose();
        }
    };

    render () {
        const { wrapperClassName, hasFooter, className, title, children, content, closeable, cancelText, confirmText, hasCancel, wrapperStyle } = this.props;
        return <View className={classNames('at-modal--active my-dialog-wrapper', wrapperClassName)} style={wrapperStyle}>
            <View className='at-modal__overlay' onClick={this.handleClickOverlay} />
            <View className={classNames('at-modal__container', className, { hidden:!this.props.visible })}>
                {title && (
                    <View className='dialog-title'>
                        <Text className='dialog-title-text'>{title}</Text>
                        {closeable && <Text className='iconfont iconfont-guanbi' onClick={this.onCloseClick} />}
                    </View>
                )}

                <View className='my-dialog-content'>
                    {content && <View className='content-simple'>
                        {content}
                    </View>}
                    {children}
                </View>
                {hasFooter && <View className='dialog-bottom'>

                    {cancelText && hasCancel && (
                        <Button className='btn-cancel' onClick={this.onCancel}>{cancelText}</Button>
                    )}
                    {confirmText && (
                        <Button className='btn-ok' type='primary' onClick={this.onOk}>{confirmText}</Button>
                    )}
                </View>
                }

            </View>
        </View>;

        // return (
        //
        //     <AtModal isOpened className={'my-dialog ' + wrapperClassName} onClose={onClose} closeOnClickOverlay={closeOnClickOverlay}>
        //         <View className={className}>
        //             {
        //                 title &&
        //                 <View className='dialog-title'><Text className='dialog-title-text'>{ title }</Text></View>
        //             }
        //             <View className='dialog-content'>
        //                 { children }
        //             </View>
        //             {
        //                 hasFooter &&
        //                 <View className='dialog-bottom'>
        //                     {locale.ok && <Button className='btn-cancel' onClick={this.onOk}>{locale.ok}</Button>}
        //                     {locale.cancel && <Button type='primary' onClick={this.onCancel}>{locale.cancel}</Button>}
        //                 </View>
        //             }
        //         </View>
        //     </AtModal>
        // );
    }
}

MyDialog.defaultProps = {
    visible: true,
    wrapperClassName: '',
    content: null,
    closeOnClickOverlay: false,
    cancelText: '取消',
    confirmText: '确认',
    className: '',
    title: null,
    children: null,
    hasFooter: false,
    onClose: NOOP,
    onCancel: NOOP,
    onOk: NOOP,
    hasCancel: true,
    closeable: true,
    onCancelClose: true,
    onOkClose: true,


};


export default MyDialog;
