import React, { Component } from 'react';
import './index.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    };

    /**
     * @description 记录输入框输入的值
     * @author SMC
     * @date 2020-05-26
     * @param {*} event
     */
    handleChange = (event) => {
        const { toPageLists } = this.props;
        this.setState({
            value: event.target.value
        });
        if (event.target.value == '') {
            toPageLists(" ", 1);
        };
    };

    render() {
        const {toPageLists} = this.props
        const {value} = this.state
        return (
            <div className="search">
                <input type="text" placeholder="请输入要搜索的用户名字" onChange={this.handleChange} />
                <div className="btn" onClick={() => toPageLists(value, 1)}>搜索</div>
            </div>
        )
    }
}

export default Search;