import React, { Component } from 'react'
import './index.css'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ""
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({ 
            value: event.target.value
        })
        if(event.target.value == '') {
            this.props.get()
        }
        // console.log(this.state.value)
    }

    render() {
        return (
            <div className="search">
                <input type="text" placeholder="请输入要搜索的用户名字" onChange={this.handleChange} />
                <div className="btn" onClick={() => this.props.SearchName(this.state.value)}>搜索</div>
            </div>
        )
    }
}

export default Search;