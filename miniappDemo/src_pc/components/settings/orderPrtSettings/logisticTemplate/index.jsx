import Taro, { Component } from '@tarojs/taro';
import { Button, View } from "@tarojs/components";
import MyBaseTable from '../../../myBaseTable';
import './index.scss';

class LogisticTemplate extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        let tableHead = [
            {
                key:'index',
                name:'序号',
                width:'100px',
            },
            {
                key:'mouldType',
                name:'模板类型',
                width:'200px',
            },
            {
                key:'mouldname',
                name:'模板名称',
            },
            {
                key:'size',
                name:'模板尺寸',
                width:'200px',
            },
            {
                key:'companie',
                name:'快递公司',
                width:'200px',
            },
            {
                key:'operation',
                name:'操作',
                width:'250px',
            },
        ];

        let dataSource = [
            {
                index:1,
                mouldType:'快递单',
                mouldname:'中通速递标准模版',
                size:'230*127',
                companie:'中通快递',
                operation:'操作',
            },
            {
                index:2,
                mouldType:'电子面单',
                mouldname:'圆通速递标准模版',
                size:'230*127',
                companie:'圆通快递',
                operation:'操作',
            },
            {
                index:3,
                mouldType:'快递单',
                mouldname:'申通速递标准模版',
                size:'230*127',
                companie:'申通快递',
                operation:'操作',
            },
            {
                index:4,
                mouldType:'电子面单',
                mouldname:'韵达速递标准模版',
                size:'230*127',
                companie:'韵达快递',
                operation:'操作',
            },

        ];

        return (
            <View>
                <View>
                    <Button className='button-margin-right' type='primary'>电子面单模板</Button>
                    <Button>快递单模板</Button>
                    <MyBaseTable tableHead={tableHead} dataSource={dataSource} />
                </View>
            </View>
        );
    }
}

export default LogisticTemplate;
