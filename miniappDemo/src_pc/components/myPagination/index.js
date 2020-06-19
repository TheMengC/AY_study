import Taro, { Component } from '@tarojs/taro';
import './index.scss';

class MyPagination extends Component {

    render () {
        return (
            <pagination
                total={this.props.total}
                current={this.props.pageNo}
                pageSize={this.props.pageSize}
                shape='normal'
                showJump={false}
                pageSizeSelector={this.props.onPageSizeChange ? this.props.pageSizeSelector : false}
                pageSizePosition='end'
                pageSizeList={this.props.pageSizeList}
                onPageSizeChange={(e) => {
                    this.props.onPageSizeChange(e.target.value);
                }}
                onChange={(e) => {
                    this.props.onPageNoChange(e.target.value);
                }}
            />
        );
    }
}
export default MyPagination;
