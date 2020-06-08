import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from 'pages/todoLists/store/actionCreators'

import Search from './search'
import AddLists from './addLists'
import Content from './content'
import ShowWindow from './showWindow'

class ListDetail extends Component {


    render() {
        const {show} = this.props
        return (
            <div className="list-detail">
                <Search />
                <AddLists />
                <Content />
                {show ? <ShowWindow /> : ""}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        show: state.todoLists.show
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ListDetail)