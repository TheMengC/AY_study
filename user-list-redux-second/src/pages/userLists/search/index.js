import React, { Component } from 'react';
import './index.css';
import {searchNameValue, handleSearchList} from 'pages/userLists/store/actionCreators'
import { connect } from 'react-redux'

class Search extends Component {
	

    render() {
      const {searchNameValue, searchName, number, userLists, handleSearchList} = this.props
        return (
            <div className="search">
                <input type="text" placeholder="请输入要搜索的用户名字" onChange = {searchNameValue}/>
                <div className="btn" onClick = {() => handleSearchList(userLists, searchName, 1, number)}>搜索</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
	searchName: state.userLists.searchName,
	number: state.userLists.number,
	userLists: state.userLists.userLists
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
		searchNameValue(e) {
			dispatch(searchNameValue(e))
		},

		handleSearchList(userLists, searchName, current, number) {
			dispatch(handleSearchList(userLists, searchName, current, number))
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps) (Search)