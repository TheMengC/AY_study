import React, { Component } from 'react';
import './index.css'
import { connect } from 'react-redux'
import {changeShowValue} from 'store/actionCreators'

class Content extends Component {

    render() {
        const {pageLists, showWindowValue} = this.props
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
                                    <div className="change" onClick={() => showWindowValue(true, item.id, item.age)}>编辑</div>
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
        pageLists: state.pageLists,
        show: state.show
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * @description 对用户信息进行编辑
         * @author SMC
         * @date 2020-05-26
         * @param {*} show 控制弹窗是否展示
         * @param {*} id 编辑数组的id
         * @param {*} age 编辑数组的年龄
         */
        showWindowValue(show, id, age) {
            const action = changeShowValue(show, id, age)
            dispatch(action)
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Content)