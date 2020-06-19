import Taro, { Component } from '@tarojs/taro';
import { Button, Input, Text, View } from '@tarojs/components';
import { NOOP } from "mapp_common/utils";
import MyDialog from "pcComponents/myDialog";

class InputDialog extends Component {

    state = {
        value: '',
    }

    onchangeInput = (e) => {
        this.setState({ value: e.detail.value });
    }

    onCancel = () => {
        this.props.onClose();
    }

    onOK = () => {
        let { value } = this.state;
        this.props.onOk(value);
        this.props.onClose();
    }

    render () {
        let { value } = this.state;
        let { title, labelName, placeholder, cancelText, confirmText, width } = this.props;
        return(
            <MyDialog className='input-dialog' title={title}  onClose={this.props.onClose}>
                <View className='input-dialog-up'>
                    <Text className='input-dialog-up-text'>{labelName}</Text>
                    <Input className='input-dialog-input' placeholder={placeholder} value={value} onInput={this.onchangeInput.bind(this)} style={{ width: width + 'px' }}></Input>
                </View>
                <View className='input-dialog-bottom'>
                    <Button onClick={this.onCancel.bind(this)}>{cancelText}</Button>
                    <Button onClick={this.onOK.bind(this)}>{confirmText}</Button>
                </View>
            </MyDialog>
        );
    }
}

InputDialog.defaultProps = {
    title: null,
    labelName: '输入',
    placeholder: '',
    width: 100,
    onClose: NOOP,
    onCancel: NOOP,
    onOk: NOOP,
    cancelText: '取消',
    confirmText: '确认',
};

export default InputDialog;
