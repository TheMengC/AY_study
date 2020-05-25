import React, { Component } from 'react';
import './index.css'

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(id) {
        this.props.data(true);
        this.props.sendId(id)
    }

    render() {
        return (
            <div className="content">
                <div className="title">
                    <div className="name">姓名</div>
                    <div className="age">年龄</div>
                </div>
                <div className="user-information">
                    {
                        this.props.pageLists.map(item => {
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