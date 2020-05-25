import React, { Component } from 'react'
import './index.css'

class Paging extends Component {
	constructor(props) {
		super(props)
		this.state = {
			pages: 0
		}

		this.PagesChange = this.PagesChange.bind(this)
		this.AddPages = this.AddPages.bind(this)
		this.ReducePages = this.ReducePages.bind(this)
	}

	PagesChange(pages, list, totalPages) {
		this.setState({
			pages: pages
		})
		console.log(pages)
		this.props.handlePages(pages, list, totalPages)
	}

	AddPages(pages, list, totalPages) {
		if (pages >= this.props.pages - 1) {
			this.setState({
				pages: this.props.pages - 1
			})
		} else {
			this.setState({
				pages: pages + 1
			})
			this.props.handlePages(pages + 1, list, totalPages)
		}
		// console.log(pages)
	}

	ReducePages(pages, list, totalPages) {
		if (pages <= 0) {
			this.setState({
				pages: 0
			})
		} else {
			this.setState({
				pages: pages - 1
			})
			this.props.handlePages(pages - 1, list, totalPages)
		}
		// console.log(pages)
	}

	render() {
		return (
			<div className="paging">
				<div className="previous-page" onClick={() => this.ReducePages(this.state.pages, this.props.userLists, this.props.pages)}>上一页</div>
				<div className="pages">
					{this.props.totalPages.map(item => {
						return (
							<div className="pages-information" key={item}>
								<div className={item == this.state.pages ? 'select' : 'un-select'} onClick={() => this.PagesChange(item, this.props.userLists, this.props.pages)}>{item + 1}</div>
							</div>
						)
					})}
				</div>

				<div className="next-page" onClick={() => this.AddPages(this.state.pages, this.props.userLists, this.props.pages)}>下一页</div>
			</div>
		)
	}
}

export default Paging