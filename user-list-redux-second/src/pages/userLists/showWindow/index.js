import React, { Component } from 'react'
import './index.css'

import {connect} from 'react-redux'
import { setInputAge, closeShowWindow, handleSureClick} from 'pages/userLists/store/actionCreators'

class ShowWindow extends Component {

    render() {
        const {setInputAge,handleSureClick, closeShowWindow, age, id, userLists} = this.props
        return (
            <div className="show-window">
                <div className="window">
                    <div className="window-title">编辑年龄</div>
                    <div className="window-input">
                    <input type="text" placeholder="输入您要改变的年龄" value={age} onChange={setInputAge} />
                    </div>
                    <div className="btn-click">
                        <div className="unsure">
                            <div className="unsure-btn" onClick={() => closeShowWindow(false)}>取消</div>
                        </div>
                        <div className="sure">
                            <div className="sure-btn" onClick = {() => handleSureClick(userLists, id, false, age)}>确认</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        show: state.userLists.show,
        age: state.userLists.age,
        userLists: state.userLists.userLists,
        id: state.userLists.id
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setInputAge(e) {
            dispatch(setInputAge(e))
        },

        closeShowWindow(show) {
            dispatch(closeShowWindow(show))
        },

        handleSureClick(userLists, id, show, age) {
            dispatch(handleSureClick(userLists, id, show, age))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowWindow)