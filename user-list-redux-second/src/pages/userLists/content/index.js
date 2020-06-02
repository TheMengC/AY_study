import React, { Component } from 'react';
import './index.css'
import { connect } from 'react-redux'
import {showWindowValue} from 'pages/userLists/store/actionCreators'

class Content extends Component {

    render() {
        const { pageLists, handleShowWindow } = this.props
        return (
            <div className="content">
                <div className="title">
                    <div className="name">姓名</div>
                    <div className="age">年龄</div>
                </div>
                <div className="user-information">
                    {
                        pageLists.map(item => {
                            return (
                                <div className="information" key={item.id}>
                                    <div className="name">{item.name}</div>
                                    <div className="age">{item.age}</div>
                                    <div className="change" onClick={() => handleShowWindow(true, item.id, item.age)}>编辑</div>
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
        // userLists: state.userLists,
        pageLists: state.userLists.pageLists,
        show: state.userLists.show
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleShowWindow (show, id, age) {
            dispatch(showWindowValue(show, id, age))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Content)