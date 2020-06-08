import React, { Component } from 'react'
import './index.css'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from 'pages/todoLists/store/actionCreators'

class AddMsg extends Component {
    render() {
        const {setValueOne, setValueTwo, setValueThree,handleThreeMsg, todoLists, valueOne, valueTwo, valueThree} = this.props
        return (
            <div className="add-msg">
                <input type="text" placeholder="请输入要添加的信息" value={valueOne} onChange = {setValueOne} />
                <input type="text" placeholder="请输入要添加的信息" value={valueTwo} onChange = {setValueTwo}/>
                <input type="text" placeholder="请输入要添加的信息" value={valueThree} onChange = {setValueThree}/>
                <div className="input-btn" onClick={() => handleThreeMsg(valueOne,valueTwo, valueThree,todoLists, false)}>添加</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        valueOne: state.todoLists.valueOne,
        valueTwo: state.todoLists.valueTwo,
        valueThree: state.todoLists.valueThree,
        todoLists: state.todoLists.todoLists
	}
}

const mapDispatchToProps = (dispatch) => {
	return  bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMsg)