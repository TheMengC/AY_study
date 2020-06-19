import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { events } from "mapp_common/utils/eventManager";
import TestDialog from "../testDialog";
import { Logger } from "mapp_common/utils/logger";
import { isFunction } from "mapp_common/utils";
import ConfirmDialog from "pcComponents/myDialog/confirmDialog";
import InputDialog from "pcComponents/myDialog/InputDialog";

import './index.scss';

const dialogs = {
    testDialog: {},
    ConfirmDialog:{},
    InputDialog:{},
};

// eslint-disable-next-line import/no-mutable-exports
class DialogManager extends Component {

    constructor (props) {
        super(props);
        this.state = {};
        Object.keys(dialogs).map(key => {
            this.state[key] = { _isShow: false };
        });
        events.showDialog.subscribeOnce(({ name, props, isShow = true }) => {
            const dialog = dialogs[name];
            if (!dialog) {
                console.error('没有找到该对话框的定义', name);
            }
            const show = () => {
                this.setState({
                    [name]: {
                        ...props,
                        _isShow: isShow,
                    },
                });
            };
            // 防止被干 在有相同对话框的时候先把之前的对话框搞死
            // 不然就会出现之前pc上地址错乱的问题 是因为相同对话框渲染到一起导致的
            if (this.state[name]._isShow) {
                this.setState({ [name]: { _isShow: false } }, show);

            } else {
                show();
            }

        });
    }


    componentWillReceiveProps (nextProps) {
        Logger.log(this.props, nextProps);

    }


    getDialogProps = (key) => {
        return {
            ...this.state[key],
            onClose: () => {
                let props = { ...this.state[key] };
                props._isShow = false;
                if (isFunction(props.onClose)) {
                    if (props.onClose()) {
                        return;
                    }
                }
                this.setState({ [key]: props });
            },
        };
    }
    getDialogIsShow = (key) => {
        return this.getDialogProps(key)._isShow;
    };

    render () {
        let openDialog = Object.keys(dialogs).filter(key => this.state[key]._isShow);
        if (openDialog.length == 0) {
            this.grade = 0;
        }
        openDialog.sort((itemA, itemB) => {return this.state[itemA]._grade - this.state[itemB]._grade; });
        return <View className={'dialog-manager ' + openDialog.length == 0 ? 'opened' : ''}>
            {
                openDialog.map(key => {
                    return (
                        {
                            'testDialog': <TestDialog {...this.getDialogProps('testDialog')} />,
                            'ConfirmDialog':<ConfirmDialog {...this.getDialogProps('ConfirmDialog')} />,
                            'InputDialog':<InputDialog {...this.getDialogProps('InputDialog')} />,
                        }[key]
                    );
                })
            }
        </View>;
    }
}

export default DialogManager;
