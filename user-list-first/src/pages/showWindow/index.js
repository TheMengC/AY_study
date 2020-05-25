import React, { Component } from 'react'
import './index.css'

class ShowWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            age: ""
        }

        this.handleShow = this.handleShow.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAge = this.handleAge.bind(this)
    }

    handleChange(event) {
        this.setState({ age: event.target.value })
        // console.log(this.state.age)
    }

    handleAge(age) {
        this.props.data(false)
        this.props.ChangeAge(age)
    }

    handleShow() {
        this.props.data(false)
    }

    render() {
        return (
            <div className="show-window">
                <div className="window">
                    <div className="window-title">编辑年龄</div>
                    <div className="window-input">
                        <input type="text" placeholder="输入您要改变的年龄" onChange={this.handleChange}/>
                    </div>
                    <div className="btn-click">
                        <div className="unsure">
                            <div className="unsure-btn" onClick={this.handleShow}>取消</div>
                        </div>
                        <div className="sure">
                            <div className="sure-btn" onClick={() =>this.handleAge(this.state.age)}>确认</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowWindow