import React, { Component } from 'react'
import './index.css'

import {connect} from 'react-redux'
import { changeShowAge, changeShowValue,  changeAgeValue} from 'store/actionCreators'

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
        show: state.show,
        age: state.age,
        userLists: state.userLists,
        id: state.id
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        /**
		 * @description 在输入框输入要更改的年龄
		 * @author SMC
		 * @date 2020-05-26
		 * @param {*} e 
		 */
        setInputAge(e) {
            const action = changeAgeValue(e.target.value)
            dispatch(action)
        },

        /**
		 * @description 关闭弹窗
		 * @author SMC
		 * @date 2020-05-26
		 * @param {*} show 控制弹窗是否展示 boolean
		 */
        closeShowWindow(show) {
            const action = changeShowValue(show)
            dispatch(action)
        },

        /**
		 * @description 确认更改用户年龄
		 * @author SMC
		 * @date 2020-05-26
		 * @param {*} userLists 总数组
		 * @param {*} id 要更改年龄用户的id
		 * @param {*} show 弹窗是否展示
		 * @param {*} age 要更改的年龄的值
		 */
        handleSureClick(userLists, id, show, age) {
            const action = changeShowAge(show, age)
            dispatch(action)
            userLists.map(item => {
                if(item.id == id) {
                    item.age = age
                }
            })
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowWindow)