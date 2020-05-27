import React, { Component } from 'react'
import './index.css'

class Paging extends Component {
	constructor(props) {
        super(props);
        this.state = {
            current: "", //当前页
        };
    }
    
    /**
     * @description 对总数组进行页码点击跳转处理
     * @author SMC
     * @date 2020-05-26
     * @param {*} searchName 搜索的名字
     * @param {*} currentPages 点击的页数
     */
    handleClick = (searchName, currentPages) => { 
        const { toPageLists } = this.props;
        toPageLists(searchName, currentPages);
        this.setState({
            current: currentPages
        });
    }
    
    /**
     * @description 对总数组进行上一页/下一页处理
     * @author SMC
     * @date 2020-05-26
     * @param {*} searchName 搜索的名字
     * @param {*} currentPages 点击的页数
     */
    HandlePages = (searchName, currentPages) => {
        const { toPageLists, allPages } = this.props;
        let addPages;
        if (currentPages <= 1) {
            addPages = 1;
        } else if(currentPages >= allPages) {
            addPages = allPages;
        } else {
            addPages = currentPages;
        };
        this.setState({
            current: addPages
        });
        toPageLists(searchName, addPages);
    }

    render() {
        const { currentPages, name, pages } = this.props
        const { current} = this.state
		return (
			<div className="paging">
				<div className="previous-page" onClick={() => this.HandlePages(name, current - 1)}>上一页</div>
				<div className="pages">
					{pages.map(item => {
						return (
							<div className="pages-information" key={item}>
								<div className={item == currentPages ? 'select' : 'un-select'} onClick={() =>this.handleClick(name ,item)}>{item}</div>
							</div>
						)
					})}
				</div>

				<div className="next-page" onClick={() => this.HandlePages(name, current + 1)}>下一页</div>
			</div>
		)
	}
}

export default Paging