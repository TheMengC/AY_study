import React, { Component } from 'react';
import './index.css';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from 'pages/todoLists/store/actionCreators'

class Search extends Component {
    render() {
        const {searchNameValue, handleSearchValue, searchValue, allLists} = this.props
        return (
            <div className="search">
                <input type="text" placeholder="请输入要搜索的信息" value={searchValue} onChange={searchNameValue} />
                <div className="btn" onClick={() => handleSearchValue(searchValue, allLists)}>搜索</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
        searchValue: state.todoLists.searchValue,
        allLists: state.todoLists.allLists
	}
}

const mapDispatchToProps = (dispatch) => {
	return  bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)