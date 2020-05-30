import React, { Component } from 'react';
import './index.css';
import {setSearchName, getSearchList} from 'store/actionCreators'
import toPageLists from 'pages/userLists/toPageLists'
import {connect} from 'react-redux'

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
	searchName: state.searchName,
	number: state.number,
	userLists: state.userLists
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        /**
		* @description 记录输入框输入的值
		* @author SMC
		* @date 2020-05-26
		* @param {*} event
		*/
		searchNameValue (e) {
		const action = setSearchName(e.target.value)
		dispatch(action)
		},

		/**
		 * @description 搜索功能
		 * @author SMC
		 * @date 2020-05-26
		 * @param {*} userLists 总数组
		 * @param {*} searchName 搜索的名字
		 * @param {*} number 每页要展示的数组数量
		 * @param {*} current 当前页数
		 */
		handleSearchList (userLists, searchName, current, number) {
			const {pageLists, pages, currentPages} = toPageLists({userLists:userLists, searchName:searchName, currentPages:current, number:number})
			const action = getSearchList(pageLists, pages, currentPages)
			dispatch(action)
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps) (Search)