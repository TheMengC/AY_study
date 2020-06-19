import Taro, { Component } from '@tarojs/taro';
import { Button, Text, View } from '@tarojs/components';
import { AtModal } from 'taro-ui';
import { isFunction, NOOP } from "mapp_common/utils";
import MyDialog from "pcComponents/myDialog/index";

import './index.scss';

class ConfirmDialog extends Component {
    constructor (props) {
        super(props);
    }

    onCancel = () => {
        isFunction(this.props.onCancel) && this.props.onCancel();
        this.props.onClose();

    };
    onOk = () => {
        isFunction(this.props.onOk) && this.props.onOk();
        this.props.onClose();
    };

    render () {
        const { content, cancelText, confirmText, className, title, onClose, showCancel } = this.props;
        return <MyDialog
            closeable={false}
            content={content}
            hasCancel={showCancel}
            cancelText={cancelText}
            confirmText={confirmText}
            className={'confirm-dialog ' + className}
            title={title}
            onClose={onClose}
            onCancel={this.onCancel}
            onOk={this.onOk}
            hasFooter
        >

        </MyDialog>;
    }
}

ConfirmDialog.defaultProps = {
    content: '',
    cancelText: '取消',
    confirmText: '确认',
    className: '',
    title: null,
    onClose: NOOP,
    onCancel: NOOP,
    onOk: NOOP,
};


export default ConfirmDialog;

