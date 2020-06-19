import Taro, { Component } from '@tarojs/taro';

import './index.scss';
import { Logger } from "mapp_common/utils/logger";
import { NOOP } from "mapp_common/utils";
import { addressFastFill } from "tradePublic/logisticsSettings";

class MySelect extends Component {

    findSelected = (value) => {
        let dataSource = this.props.dataSource;
        if (!Array.isArray(dataSource)) {
            dataSource = [];
        }
        let target = dataSource.find(item => item.label === value);
        if (!target) {
            let _value = JSON.stringify(value);
            target = dataSource.find(item => JSON.stringify(item.value) === _value);
        }
        if (!target) {
            target = dataSource.find(item => item === value);
        }
        if (!target) {
            return null;
        }
        return target;
    };
    onChange = (event) => {
        if (event.detail.value === undefined) {
            this.props.onChange(null);
            return;
        }
        let value = event.detail.value;

        let target = this.findSelected(value);

        if (!target) {
            Logger.error('select没有找到对应的value', value);
            return;
        }
        if (target.value) {
            this.props.onChange(target.value);
        } else {
            this.props.onChange(target);
        }
    };

    render () {
        const { dataSource, children, className, value, disabled, controlled, hasClear } = this.props;
        let _dataSource = dataSource;
        if (!Array.isArray(_dataSource)) {
            _dataSource = [];
        }
        let showDataSource = _dataSource.map(item => {
            if (item.label) {
                return item.label;
            }
            if (item.value) {
                return item.value;
            }
            return item;
        });
        let _value = this.findSelected(value);

        // eslint-disable-next-line react/forbid-elements
        return <select className={'select ' + className}
            dataSource={showDataSource}
            onChange={this.onChange}
            value={_value}
            disabled={disabled}
            controlled={controlled}
            hasClear={hasClear}
        >
            {children}
        </select>;
    }
}

MySelect.defaultProps = {
    className: '',
    dataSource: [],
    onChange: NOOP,
    disabled: false,
};
export default MySelect;
