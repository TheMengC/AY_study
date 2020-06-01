import React, { Component } from 'react'
import './index.css'
import {connect} from 'react-redux'

import toPageLists from 'pages/userLists/toPageLists'
import { changePagesLists } from 'store/actionCreators'

class Paging extends Component {

    render() {
        const { currentPages, pages, userLists, number, changePageValue, searchName} = this.props
		return (
			<div className="paging">
				<div className="previous-page" onClick={() => changePageValue(searchName,userLists, currentPages - 1, number)}>上一页</div>
				<div className="pages">
					{pages.map(item => {
						return (
							<div className="pages-information" key={item}>
								<div className={(item) === currentPages ? 'select' : 'un-select'} onClick={() => changePageValue(searchName,userLists, item, number)}>{item}</div>
							</div>
						)
					})}
				</div>

				<div className="next-page" onClick={() => changePageValue(searchName, userLists, currentPages + 1, number)}>下一页</div>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
  return {
      currentPages: state.currentPages,
      pages: state.pages,
      userLists: state.userLists,
      number: state.number,
      searchName: state.searchName
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
		/**
         * @description 切换分页展示
         * @author SMC
         * @date 2020-05-26
         * @param {*} userLists 总数组
         * @param {*} item 当前要展示的页数
         * @param {*} number 每页要展示的数组数量
         */
    changePageValue(searchName, userLists, item, number) {
      console.log(searchName)
      let {pageLists, currentPages} = toPageLists({ userLists: userLists, currentPages: item, number: number, searchName:searchName})
      const action = changePagesLists(pageLists, currentPages)
      dispatch(action)
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps) (Paging)