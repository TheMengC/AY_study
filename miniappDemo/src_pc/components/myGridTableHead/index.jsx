/**
 * grid table head 部分
 * */

import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { GRID_TABLE_HEAD } from './config';
import "./index.scss";

class MyGridTableHead extends Component {
    render () {
        let { gridTableHead } = this.props;

        gridTableHead = gridTableHead || GRID_TABLE_HEAD;

        return(
            <View className='head grid-cont my-grid-table-head'>
                {/* 在渲染表格标题前，首先筛除一下栅格数为0的View */}
                {
                    gridTableHead.map(element => { return <View className={`title grid-item${element.grid} ${element.className ? element.className : ''}`}>{element.title}</View> })
                }
            </View>
        );
    }
}

export default MyGridTableHead;
