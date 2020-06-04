import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import * as actionCreators from 'pages/userLists/store/actionCreators'
import {bindActionCreators} from 'redux'

class Paging extends Component {

	render() {
		const { currentPages, pages, userLists, number,changePageValue, searchName } = this.props
		return (
			<div className="paging">
				<div className="previous-page" onClick={() => changePageValue(searchName, userLists, currentPages - 1, number)}>上一页</div>
				<div className="pages">
					{pages.map(item => {
						return (
							<div className="pages-information" key={item}>
								<div className={(item) === currentPages ? 'select' : 'un-select'} onClick={() => changePageValue(searchName, userLists, item, number)}>{item}</div>
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
		currentPages: state.userLists.currentPages,
		pages: state.userLists.pages,
		userLists: state.userLists.userLists,
		number: state.userLists.number,
		searchName: state.userLists.searchName
	}
}

const mapDispatchToProps = (dispatch) => {
	return  bindActionCreators(actionCreators, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Paging)