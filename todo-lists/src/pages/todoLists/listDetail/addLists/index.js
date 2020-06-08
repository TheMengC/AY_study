import React, { Component } from 'react';
import './index.css';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from 'pages/todoLists/store/actionCreators'

class AddLists extends Component {
    render() {
        const { setListValue, handleAddValue, addValue, todoLists } = this.props
        return (
            <div className="add-lists">
                <input type="text" placeholder="请输入要添加的信息" value={addValue} onChange={setListValue} />
                <div className="btn" onClick={() => {handleAddValue(addValue, todoLists, false)}}>添加</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
        addValue: state.todoLists.addValue,
        todoLists: state.todoLists.todoLists
	}
}

const mapDispatchToProps = (dispatch) => {
	return  bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLists)