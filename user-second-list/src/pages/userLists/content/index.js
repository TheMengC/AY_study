import React, { Component } from 'react';
import './index.css'

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false  // 弹窗出现和消失
        }
    }

    /**
     * @description 控制弹窗的出现和消失和记录编辑数据的id
     * @author SMC
     * @date 2020-05-26
     * @param {*} id
     */
    handleClick = (id) => {
        const { showWindow, sendId } = this.props
        showWindow(true)
        sendId(id)
    }

    render() {
        const {pageLists} = this.props
        return (
            <div className="content">
                <div className="title">
                    <div className="name">姓名</div>
                    <div className="age">年龄</div>
                </div>
                <div className="user-information">
                    {
                        pageLists.map(item => {
                            return (
                                <div className="information" key={item.id}>
                                    <div className="name">{item.name}</div>
                                    <div className="age">{item.age}</div>
                                    <div className="change" onClick={() => this.handleClick(item.id)}>编辑</div>
                                </div>
                                
                            )
                        })
                    }
                </div>

            </div>
        )
    }
}

export default Content