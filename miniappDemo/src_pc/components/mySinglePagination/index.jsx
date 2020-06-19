/**
 * 自定义分页器封装：
 * 按钮：上一页、下一页
 * 参数：
 * @param {Number}      pageNo 当前页数
 * @param {Boolean}     hasNext 是否还有下一页
 * @param {callback}    onPageNoChange 跳转页码函数
 * */

import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import './index.scss';

export class MySinglePagination extends Component {
    state = {
        prevClassName: '',
        nextClassName: '',
    };

    componentWillMount() {
        const { pageNo, hasNext } = this.props;
        let prevClassName = pageNo != 1 ? 'single-page-prev-spec' : '';
        let nextClassName = hasNext ? 'single-page-next-spec' : '';

        this.setState({
            prevClassName,
            nextClassName,
        });
    }

    goToPage(type) {
        const { pageNo, onPageNoChange } = this.props;
        const { prevClassName, nextClassName } = this.state;

        if ((!prevClassName && type == 'prev') || (!nextClassName && type == 'next')) {
            return;
        }

        let page = type == 'prev' ? pageNo - 1 : pageNo + 1;

        onPageNoChange(page);
    }

    render () {
        const { prevClassName, nextClassName } = this.state;

        return (
            <View className='single-pagination'>
                <View className={`single-page-btn single-page-prev ${prevClassName}`} onClick={this.goToPage.bind(this, 'prev')}><View className='arrow arrow-left-prev'></View><Text className='page-text-prev'>上一页</Text></View>
                <View className={`single-page-btn single-page-next ${nextClassName}`} onClick={this.goToPage.bind(this, 'next')}><Text className='page-text-next'>下一页</Text><View className='arrow arrow-right-next'></View></View>
            </View>
        );
    }
}

export default MySinglePagination;
