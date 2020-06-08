import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from 'pages/todoLists/store/actionCreators'

class ShowWindow extends Component {

    render() {
        const {closeShowWindow, setInputItem, handleSureItem, todoLists, allLists, item, id} = this.props
        return (
            <div className="show-window">
                <div className="window">
                    <div className="window-title">编辑</div>
                    <div className="window-input">
                    <input type="text" placeholder="编辑这条信息" onChange={setInputItem} />
                    </div>
                    <div className="btn-click">
                        <div className="unsure">
                            <div className="unsure-btn" onClick={() => closeShowWindow(false)}>取消</div>
                        </div>
                        <div className="sure">
                            <div className="sure-btn" onClick={() => handleSureItem(todoLists, allLists,item, id, false)}>确认</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        item:state.todoLists.item,
        id: state.todoLists.id,
        todoLists: state.todoLists.todoLists,
        allLists: state.todoLists.allLists
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowWindow)