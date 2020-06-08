import React, { Component } from 'react';
import './index.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from 'pages/todoLists/store/actionCreators'

class Content extends Component {

    render() {
        const { todoLists, allLists, show, handleChangeItem,handleClickOver, handleDeleteItem} = this.props
        return (
            <div className="content">
                <div className="user-information">
                    {
                        todoLists.map((item, index) => {
                            return (
                                <div className="information" key={index}>
                                    <div className={ item.over ? "name-over" : "name"}>{item.title}</div>
                                    <div className={ item.over ? "overed" : "over"}  onClick={() => handleClickOver(true, index,todoLists, allLists)}>完成</div>
                                    <div className={ item.over ? "un-change" : "change"} onClick={() => handleChangeItem(index, show, todoLists)}>编辑</div>
                                    <div className="detele" onClick={() => handleDeleteItem(index,todoLists, allLists)}>删除</div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        todoLists: state.todoLists.todoLists,
        allLists: state.todoLists.allLists,
        show: state.todoLists.show
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Content)