import React, { Component } from 'react'
import './index.css'

class ShowWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            age: "" // 输入框里更改的年龄值
        }
    }

    /**
     * @description 记录输入框输入的值
     * @author SMC
     * @date 2020-05-26
     * @param {*} event
     */
    handleChangeAge = (event) => {
        this.setState({
            age: event.target.value
        })
        console.log(event.target.value)
    }

    /**
     * @description 更改的年龄(调用父组件的方法)
     * @author SMC
     * @date 2020-05-26
     * @param {*} age 更改的年龄
     */
    clickChangeAge = (age) => {
        const { changeAge, showWindow } = this.props
        changeAge(age)
        showWindow(false)
    }

    render() {
        const { showWindow } = this.props
        const {age} = this.state
        return (
            <div className="show-window">
                <div className="window">
                    <div className="window-title">编辑年龄</div>
                    <div className="window-input">
                    <input type="text" placeholder="输入您要改变的年龄" onChange={this.handleChangeAge} />
                    </div>
                    <div className="btn-click">
                        <div className="unsure">
                            <div className="unsure-btn" onClick={() => showWindow(false)}>取消</div>
                        </div>
                        <div className="sure">
                            <div className="sure-btn" onClick={() => this.clickChangeAge(age)}>确认</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowWindow